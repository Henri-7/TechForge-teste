import { BadgeCheck,
  ArrowRight,
  BarChart3,
  Code2,
  ExternalLink,
  Globe2,
  Mail,
  PlugZap,
  Send,
  Settings2,
  Sparkles,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import {
  useState,
  type FormEvent,
  type PointerEvent,
} from 'react'
import { useSequentialTyping } from '../../hooks/useSequentialTyping'
import { projects } from '../../data/projects'
import { services, type Service } from '../../data/services'
import { team } from '../../data/team'
import { Button } from '../ui/Button'
import { PixelFill } from '../ui/PixelFill'
import { SectionTitle } from '../ui/SectionTitle'
import { Toast } from '../ui/Toast'
import { TypedText } from '../ui/TypedText'

const serviceIcons: Record<Service['icon'], LucideIcon> = {
  globe: Globe2,
  settings: Settings2,
  workflow: Workflow,
  chart: BarChart3,
  plug: PlugZap,
  spark: Sparkles,
}

const processSteps = [
  ['Entender', 'Contexto, objetivo e prioridade.'],
  ['Planejar', 'Estrutura, escopo e próximos passos.'],
  ['Construir', 'Produto funcional e responsivo.'],
  ['Validar', 'Fluxos, performance e consistência.'],
  ['Evoluir', 'Base pronta para crescer.'],
]

const differentials = [
  {
    title: 'Soluções sob medida',
    text: 'Projetos nascem da necessidade real.',
  },
  {
    title: 'Tecnologia com propósito',
    text: 'A técnica simplifica e sustenta.',
  },
  {
    title: 'Arquitetura escalável',
    text: 'Base pronta para evoluir.',
  },
  {
    title: 'Processo estruturado',
    text: 'Clareza do início à validação.',
  },
]

// blocos digitados na ordem; os arrays são constantes porque o hook depende deles
const HERO_BLOCKS = [
  'TechForge',
  'COLOQUE SUA',
  'NECESSIDADE EM PRÁTICA',
  'Software para transformar processos em soluções digitais claras, estáveis e prontas para evoluir.',
]
const HERO_SPEEDS = [14, 18, 18, 5]

function HeroCopy() {
  const { slices, caretIndex, done } = useSequentialTyping(HERO_BLOCKS, HERO_SPEEDS, true)

  return (
    <div className="container hero-copy">
      <p className="eyebrow">
        <TypedText text={HERO_BLOCKS[0]} visible={slices[0]} caret={caretIndex === 0} />
      </p>
      <h1>
        <span>
          <TypedText text={HERO_BLOCKS[1]} visible={slices[1]} caret={caretIndex === 1} />
        </span>
        <span>
          <TypedText text={HERO_BLOCKS[2]} visible={slices[2]} caret={caretIndex === 2} />
        </span>
      </h1>
      <p>
        <TypedText text={HERO_BLOCKS[3]} visible={slices[3]} caret={caretIndex === 3} />
      </p>
      <div className={`hero-actions ${done ? 'is-typed' : ''}`}>
        <Button href="#contato">Iniciar</Button>
        <Button href="#solucoes" variant="ghost">
          Ver soluções
        </Button>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="hero-section" id="inicio">
      <div className="hero-stage">
        <div className="hero-background" aria-hidden="true" />
        <div className="hero-brand-mark" aria-hidden="true">
          <span className="hero-brand-mark__meta hero-brand-mark__meta--top">TF / 01</span>
          <span className="hero-brand-mark__line hero-brand-mark__line--top" />
          <span className="hero-brand-mark__line hero-brand-mark__line--diagonal" />
          <span className="hero-brand-mark__node hero-brand-mark__node--first" />
          <span className="hero-brand-mark__node hero-brand-mark__node--second" />
          <span className="hero-brand-mark__logo">
            <img src="/assets/techforge-horizontal.png" alt="" decoding="async" />
          </span>
          <span className="hero-brand-mark__meta hero-brand-mark__meta--bottom">
            TECHFORGE SYSTEM
          </span>
        </div>
        <HeroCopy />
      </div>
    </section>
  )
}

export function Positioning() {
  return (
    <section className="positioning">
      <div className="container positioning__grid">
        <span className="section-index">01</span>
        <h2 className="reveal">Coloque sua necessidade em prática</h2>
        <p className="reveal">
          Transformamos necessidades reais em soluções digitais com planejamento, design e
          desenvolvimento.
        </p>
      </div>
    </section>
  )
}

/**
 * Marca na própria linha onde o cursor entrou (ou saiu): o círculo azul nasce
 * e some nesse ponto. Escreve direto no style do elemento em vez de passar por
 * state — são seis linhas reagindo a cada movimento do mouse e nada disso
 * precisa re-renderizar o React.
 *
 * O raio é a diagonal cheia da linha, não a distância até o canto mais longe:
 * assim o círculo cobre a linha a partir de qualquer ponto, e mover o centro na
 * saída não abre fresta antes de ele encolher.
 */
const markPointer = (event: PointerEvent<HTMLElement>) => {
  const row = event.currentTarget
  const rect = row.getBoundingClientRect()

  row.style.setProperty('--fx', `${event.clientX - rect.left}px`)
  row.style.setProperty('--fy', `${event.clientY - rect.top}px`)
  row.style.setProperty('--fr', `${Math.hypot(rect.width, rect.height)}px`)
}

export function Services() {
  return (
    <section className="section section--light" id="solucoes">
      <div className="container">
        <SectionTitle
          eyebrow="02 - Soluções"
          title="Tecnologia para o que precisa funcionar."
          accent="funcionar"
          description="Desenvolvemos, conectamos e automatizamos partes essenciais da operação."
        />

        <div className="services-list">
          {services.map((service, index) => {
            const Icon = serviceIcons[service.icon]
            return (
              <article
                className="service-row reveal"
                key={service.title}
                onPointerEnter={markPointer}
                onPointerLeave={markPointer}
              >
                <span className="service-row__fill" aria-hidden="true" />
                <span className="row-number">{String(index + 1).padStart(2, '0')}</span>
                <Icon aria-hidden="true" />
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <a href="#contato" aria-label={`Falar sobre ${service.title}`}>
                  <ArrowRight aria-hidden="true" size={18} />
                </a>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function Differentials() {
  return (
    <section className="section section--dark">
      <div className="container">
        <SectionTitle
          eyebrow="03 - Diferenciais"
          title="Menos improviso. Mais estrutura."
          accent="estrutura"
          description="Escopo claro, escolhas conscientes e entrega pronta para evoluir."
        />
        <div className="differential-grid">
          {differentials.map((item, index) => (
            <article className="differential-item reveal" key={item.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Projects() {
  return (
    <section className="section section--projects" id="projetos">
      <div className="container">
        <SectionTitle
          eyebrow="04 - Projetos"
          title="Portfólio com cases reais."
          accent="cases"
          description="Projetos reais validados pela TechForge."
        />

        <div className="projects-grid">
          {projects.map((project, index) => (
            <article className="project-card reveal" key={`${project.title}-${index}`}>
              <div
                className={`project-preview ${project.image ? 'project-preview--site' : ''}`}
                aria-label={project.image ? `Pré-visualização de ${project.title}` : 'Placeholder de projeto TechForge'}
                role="img"
              >
                {project.image ? (
                  <img src={project.image} alt="" loading="lazy" />
                ) : (
                  <span>{String(index + 1).padStart(2, '0')}</span>
                )}
              </div>
              <div className="project-card__content">
                <span>{project.category}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <a
                  href={project.link || '#contato'}
                  target={project.link ? '_blank' : undefined}
                  rel={project.link ? 'noopener noreferrer' : undefined}
                >
                  {project.link ? 'Ver site' : 'Inserir dados reais'}
                  <ExternalLink aria-hidden="true" size={16} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Process() {
  return (
    <section className="section section--light">
      <div className="container">
        <SectionTitle
          eyebrow="05 - Processo"
          title="Da ideia à solução."
          accent="solução"
          description="Do problema à entrega validada, em etapas claras."
        />

        <div className="process-list">
          {processSteps.map(([title, text], index) => (
            <article className="process-step reveal" key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function About() {
  return (
    <section className="section section--about" id="sobre">
      <div className="container about-grid">
        <div className="about-media reveal">
          <img src="/assets/techforge-lockup.png" alt="Logo TechForge com slogan Forjando o futuro digital" loading="lazy" />
        </div>
        <div className="about-copy reveal">
          <p className="eyebrow">06 - Sobre</p>
          <h2>Tecnologia é estrutura para novas ideias.</h2>
          <p>
            Criamos web, sistemas e automações para resolver desafios digitais com clareza e
            consistência.
          </p>
        </div>
      </div>
    </section>
  )
}

export function Team() {
  return (
    <section className="section section--dark" id="equipe">
      <div className="container">
        <SectionTitle
          eyebrow="07 - Equipe"
          title="Três pessoas. Uma base técnica."
          accent="base"
          description="Perfis, canais e projetos de cada integrante."
        />

        <div className="team-grid">
          {team.map((member, index) => (
            <article className="team-member reveal" key={index}>
              <div
                className={`team-member__portrait ${member.image ? 'team-member__portrait--image' : ''}`}
                aria-label={member.image ? `Foto de ${member.name}` : `Integrante ${index + 1} pendente`}
              >
                {member.image ? (
                  <img src={member.image} alt="" loading="lazy" />
                ) : (
                  <span>{String(index + 1).padStart(2, '0')}</span>
                )}
              </div>
              <div className="team-member__info">
                <span>TechForge</span>
                <h3>{member.name || 'Nome pendente'}</h3>
                <p>{member.bio || member.role || 'Função a definir.'}</p>
                <div>
                  <a
                    href={member.linkedin || undefined}
                    target={member.linkedin ? '_blank' : undefined}
                    rel={member.linkedin ? 'noopener noreferrer' : undefined}
                    aria-disabled={member.linkedin ? undefined : 'true'}
                  >
                    <ExternalLink aria-hidden="true" size={16} />
                    LinkedIn
                  </a>
                  <a
                    href={member.github || undefined}
                    target={member.github ? '_blank' : undefined}
                    rel={member.github ? 'noopener noreferrer' : undefined}
                    aria-disabled={member.github ? undefined : 'true'}
                  >
                    <Code2 aria-hidden="true" size={16} />
                    GitHub
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ContactCta() {
  return (
    <section className="contact-cta">
      <div className="container contact-cta__inner reveal">
        <div>
          <p className="eyebrow">08 - Próximo passo</p>
          <h2>Vamos construir algo útil?</h2>
        </div>
        <Button href="#contato" variant="light">
          Falar de projeto
        </Button>
      </div>
    </section>
  )
}

type FormState = {
  name: string
  email: string
  phone: string
  company: string
  projectType: string
  message: string
}

const initialForm: FormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  projectType: '',
  message: '',
}

const CONTACT_EMAIL = 'techforge.contato@gmail.com'
const FORM_ENDPOINT = '/api/contact'

export function Contact() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [submittedName, setSubmittedName] = useState('')

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setStatus('idle')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Partial<Record<keyof FormState, string>> = {}

    if (!form.name.trim()) nextErrors.name = 'Informe seu nome.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Informe um email válido.'
    if (!form.projectType) nextErrors.projectType = 'Selecione o tipo de projeto.'
    if (form.message.trim().length < 20) nextErrors.message = 'Descreva em pelo menos 20 caracteres.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setStatus('idle')
      return
    }

    setStatus('sending')

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || 'Nao informado',
          company: form.company.trim() || 'Nao informada',
          projectType: form.projectType,
          message: form.message.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Falha no envio do formulario.')
      }

      setSubmittedName(form.name.trim())
      setForm(initialForm)
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="section contact-section" id="contato">
      <div className="container contact-grid">
        <div className="contact-copy reveal">
          <p className="eyebrow">09 - Contato</p>
          <h2>Conte seu projeto.</h2>
          <p>
            Envie pelo formulário. A TechForge responde por email.
          </p>
          <div className="contact-note">
            <Mail aria-hidden="true" />
            <span>{CONTACT_EMAIL}</span>
          </div>
        </div>

        <form className="contact-form reveal" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <label>
              Nome
              <input
                name="name"
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                aria-invalid={Boolean(errors.name)}
                placeholder="Seu nome"
              />
              {errors.name ? <span className="field-error">{errors.name}</span> : null}
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                aria-invalid={Boolean(errors.email)}
                placeholder="voce@email.com"
              />
              {errors.email ? <span className="field-error">{errors.email}</span> : null}
            </label>
          </div>
          <div className="form-row">
            <label>
              Telefone
              <input
                name="phone"
                value={form.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                placeholder="Opcional"
              />
            </label>
            <label>
              Empresa
              <input
                name="company"
                value={form.company}
                onChange={(event) => updateField('company', event.target.value)}
                placeholder="Opcional"
              />
            </label>
          </div>
          <label>
            Tipo de projeto
            <select
              name="projectType"
              value={form.projectType}
              onChange={(event) => updateField('projectType', event.target.value)}
              aria-invalid={Boolean(errors.projectType)}
            >
              <option value="">Selecione</option>
              <option>Website</option>
              <option>Sistema</option>
              <option>Automação</option>
              <option>Dashboard</option>
              <option>Integração</option>
              <option>Outro</option>
            </select>
            {errors.projectType ? <span className="field-error">{errors.projectType}</span> : null}
          </label>
          <label>
            Mensagem
            <textarea
              name="message"
              value={form.message}
              onChange={(event) => updateField('message', event.target.value)}
              aria-invalid={Boolean(errors.message)}
              placeholder="Contexto, objetivo e o que precisa ser construído."
            />
            {errors.message ? <span className="field-error">{errors.message}</span> : null}
          </label>

          <button type="submit" className="submit-button" disabled={status === 'sending'}>
            <PixelFill />
            <Send aria-hidden="true" size={18} />
            <span>{status === 'sending' ? 'Enviando...' : 'Enviar'}</span>
          </button>

          {status === 'sent' ? (
            <p className="form-status" role="status">
              <BadgeCheck aria-hidden="true" size={18} />
              Mensagem enviada. Responderemos por email.
            </p>
          ) : null}

          {status === 'error' ? (
            <p className="form-status form-status--error" role="alert">
              Não foi possível enviar. Tente novamente.
            </p>
          ) : null}
        </form>

        <Toast
          open={status === 'sent'}
          name={submittedName}
          onClose={() => setStatus('idle')}
        />
      </div>
    </section>
  )
}
