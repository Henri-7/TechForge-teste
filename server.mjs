import { createReadStream, existsSync, readFileSync } from 'node:fs'
import { readFile, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import nodemailer from 'nodemailer'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const distDir = resolve(__dirname, 'dist')

loadEnv('.env', false)
loadEnv('.env.local', true)

const port = Number(process.env.PORT || 3001)
const contactEmail = process.env.CONTACT_EMAIL || 'techforge.contato@gmail.com'

function loadEnv(fileName, override) {
  const filePath = resolve(__dirname, fileName)
  if (!existsSync(filePath)) return

  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const separator = trimmed.indexOf('=')
    if (separator === -1) continue

    const key = trimmed.slice(0, separator).trim()
    const value = trimmed.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '')
    if (override || !process.env[key]) process.env[key] = value
  }
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  })
  response.end(JSON.stringify(payload))
}

function readJson(request) {
  return new Promise((resolveRequest, rejectRequest) => {
    let body = ''

    request.on('data', (chunk) => {
      body += chunk
      if (body.length > 100_000) {
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

function validateContactForm(data) {
  const errors = {}
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!String(data.name || '').trim()) errors.name = 'Informe seu nome.'
  if (!emailPattern.test(String(data.email || '').trim())) errors.email = 'Informe um email valido.'
  if (!String(data.projectType || '').trim()) errors.projectType = 'Selecione o tipo de projeto.'
  if (!String(data.message || '').trim()) {
    errors.message = 'Conte o que você quer criar.'
  }

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
  const user = process.env.SMTP_USER || contactEmail
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

async function handleContact(request, response) {
  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {})
    return
  }

  if (request.method !== 'POST') {
    sendJson(response, 405, { message: 'Metodo nao permitido.' })
    return
  }

  try {
    const data = await readJson(request)
    const errors = validateContactForm(data)

    if (Object.keys(errors).length > 0) {
      sendJson(response, 400, { message: 'Dados invalidos.', errors })
      return
    }

    const name = String(data.name).trim()
    const email = String(data.email).trim()
    const phone = String(data.phone || 'Nao informado').trim() || 'Nao informado'
    const company = String(data.company || 'Nao informada').trim() || 'Nao informada'
    const projectType = String(data.projectType).trim()
    const message = String(data.message).trim()

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
      from: `"Site TechForge" <${process.env.SMTP_USER || contactEmail}>`,
      to: contactEmail,
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

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
}

function getEncodedAsset(filePath, acceptEncoding) {
  if (acceptEncoding.includes('br') && existsSync(`${filePath}.br`)) {
    return { path: `${filePath}.br`, encoding: 'br' }
  }

  if (acceptEncoding.includes('gzip') && existsSync(`${filePath}.gz`)) {
    return { path: `${filePath}.gz`, encoding: 'gzip' }
  }

  return { path: filePath, encoding: '' }
}

function getCacheControl(filePath) {
  return filePath.includes(`${distDir}\\assets\\`) || filePath.includes(`${distDir}/assets/`)
    ? 'public, max-age=31536000, immutable'
    : 'public, max-age=0, must-revalidate'
}

async function serveStatic(request, response) {
  const url = new URL(request.url || '/', `http://${request.headers.host}`)
  const pathname = decodeURIComponent(url.pathname)
  const requestedPath = pathname === '/' ? '/index.html' : pathname
  const filePath = resolve(distDir, `.${requestedPath}`)

  if (!filePath.startsWith(distDir)) {
    response.writeHead(403)
    response.end('Forbidden')
    return
  }

  try {
    const fileStat = await stat(filePath)
    if (!fileStat.isFile()) throw new Error('Not a file')

    const encoded = getEncodedAsset(filePath, request.headers['accept-encoding'] || '')
    const headers = {
      'Content-Type': mimeTypes[extname(filePath)] || 'application/octet-stream',
      'Cache-Control': getCacheControl(filePath),
      Vary: 'Accept-Encoding',
    }

    if (encoded.encoding) {
      headers['Content-Encoding'] = encoded.encoding
    }

    response.writeHead(200, headers)
    createReadStream(encoded.path).pipe(response)
  } catch {
    const indexPath = join(distDir, 'index.html')
    try {
      const indexHtml = await readFile(indexPath)
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      response.end(indexHtml)
    } catch {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end('Build nao encontrado. Rode npm run build antes de npm run server.')
    }
  }
}

createServer((request, response) => {
  if (request.url?.startsWith('/api/contact')) {
    void handleContact(request, response)
    return
  }

  void serveStatic(request, response)
}).listen(port, () => {
  console.log(`TechForge server running on http://127.0.0.1:${port}`)
})
