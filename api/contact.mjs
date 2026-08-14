import nodemailer from 'nodemailer'

const MAX_BODY_SIZE = 100_000
const MAX_FIELD_LENGTH = 2_000
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'techforge.contato@gmail.com'

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Allow', 'POST')
  response.end(JSON.stringify(payload))
}

function readJson(request) {
  if (request.body && typeof request.body === 'object') {
    return Promise.resolve(request.body)
  }

  if (typeof request.body === 'string' || Buffer.isBuffer(request.body)) {
    try {
      return Promise.resolve(JSON.parse(String(request.body || '{}')))
    } catch {
      return Promise.reject(new Error('JSON invalido.'))
    }
  }

  return new Promise((resolveRequest, rejectRequest) => {
    let body = ''

    request.on('data', (chunk) => {
      body += chunk
      if (body.length > MAX_BODY_SIZE) {
        rejectRequest(new Error('Payload muito grande.'))
        request.destroy()
      }
    })

    request.on('end', () => {
      try {
        resolveRequest(JSON.parse(body || '{}'))
      } catch {
        rejectRequest(new Error('JSON invalido.'))
      }
    })

    request.on('error', rejectRequest)
  })
}

function clean(value) {
  return String(value || '').replace(/[\r\n]+/g, ' ').trim()
}

function cleanMultiline(value) {
  return String(value || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim()
}

function isTooLong(value, max = MAX_FIELD_LENGTH) {
  return String(value || '').length > max
}

function validateContactForm(data) {
  const errors = {}
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const name = clean(data.name)
  const email = clean(data.email)
  const phone = clean(data.phone)
  const company = clean(data.company)
  const projectType = clean(data.projectType)
  const message = cleanMultiline(data.message)

  if (!name) errors.name = 'Informe seu nome.'
  if (!emailPattern.test(email)) errors.email = 'Informe um email valido.'
  if (!projectType) errors.projectType = 'Selecione o tipo de projeto.'
  if (message.length < 20) errors.message = 'Descreva o projeto com pelo menos 20 caracteres.'

  if (isTooLong(name, 160)) errors.name = 'Nome muito longo.'
  if (isTooLong(email, 254)) errors.email = 'Email muito longo.'
  if (isTooLong(phone, 80)) errors.phone = 'Telefone muito longo.'
  if (isTooLong(company, 160)) errors.company = 'Empresa muito longa.'
  if (isTooLong(projectType, 120)) errors.projectType = 'Tipo de projeto muito longo.'
  if (isTooLong(message, 5_000)) errors.message = 'Mensagem muito longa.'

  return errors
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function createTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = Number(process.env.SMTP_PORT || 465)
  const secure = String(process.env.SMTP_SECURE || 'true') === 'true'
  const user = process.env.SMTP_USER || CONTACT_EMAIL
  const pass = process.env.SMTP_PASS

  if (!pass) {
    throw new Error('SMTP_PASS nao configurado.')
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    sendJson(response, 405, { message: 'Metodo nao permitido.' })
    return
  }

  const contentType = request.headers['content-type'] || ''
  if (!contentType.includes('application/json')) {
    sendJson(response, 415, { message: 'Content-Type nao suportado.' })
    return
  }

  try {
    const data = await readJson(request)
    const errors = validateContactForm(data)

    if (Object.keys(errors).length > 0) {
      sendJson(response, 400, { message: 'Dados invalidos.', errors })
      return
    }

    const name = clean(data.name)
    const email = clean(data.email)
    const phone = clean(data.phone) || 'Nao informado'
    const company = clean(data.company) || 'Nao informada'
    const projectType = clean(data.projectType)
    const message = cleanMultiline(data.message)

    const html = `
      <h2>Nova mensagem pelo site da TechForge</h2>
      <table cellpadding="8" cellspacing="0" border="0">
        <tr><td><strong>Nome</strong></td><td>${escapeHtml(name)}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
        <tr><td><strong>Telefone</strong></td><td>${escapeHtml(phone)}</td></tr>
        <tr><td><strong>Empresa</strong></td><td>${escapeHtml(company)}</td></tr>
        <tr><td><strong>Tipo de projeto</strong></td><td>${escapeHtml(projectType)}</td></tr>
        <tr><td><strong>Mensagem</strong></td><td>${escapeHtml(message).replace(/\n/g, '<br>')}</td></tr>
      </table>
    `

    const transporter = createTransporter()
    await transporter.sendMail({
      from: `"Site TechForge" <${process.env.SMTP_USER || CONTACT_EMAIL}>`,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: 'Nova mensagem pelo site da TechForge',
      text: [
        'Nova mensagem pelo site da TechForge',
        '',
        `Nome: ${name}`,
        `Email: ${email}`,
        `Telefone: ${phone}`,
        `Empresa: ${company}`,
        `Tipo de projeto: ${projectType}`,
        '',
        message,
      ].join('\n'),
      html,
    })

    sendJson(response, 200, { message: 'Mensagem enviada.' })
  } catch (error) {
    console.error(error)
    sendJson(response, 500, { message: 'Nao foi possivel enviar a mensagem.' })
  }
}
