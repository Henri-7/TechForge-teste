import {
  ArrowRight,
  BadgeCheck,
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
import { useState, type FormEvent } from 'react'
import { projects } from '../../data/projects'
import { services, type Service } from '../../data/services'
import { team } from '../../data/team'
import { Button } from '../ui/Button'
import { SectionTitle } from '../ui/SectionTitle'

const serviceIcons: Record<Service['icon'], LucideIcon> = {
  globe: Globe2,
  settings: Settings2,
  workflow: Workflow,
  chart: BarChart3,
  plug: PlugZap,
  spark: Sparkles,
}

const processSteps = [
  ['Entender', 'Problema, contexto, objetivo e prioridade.'],
  ['Planejar', 'Estrutura, funcionalidades e próximos passos.'],
  ['Construir', 'Produto digital funcional, claro e responsivo.'],
  ['Validar', 'Fluxos, performance, acessibilidade e consistência.'],
  ['Evoluir', 'Entrega preparada para novas etapas.'],
]

const differentials = [
  {
    title: 'Soluções sob medida',
    text: 'Cada projeto parte de uma necessidade real, não de um pacote pronto.',
  },
  {
    title: 'Tecnologia com propósito',
    text: 'A escolha técnica precisa simplificar processos e sustentar o produto.',
  },
  {
    title: 'Arquitetura escalável',
    text: 'Estruturas pensadas para evoluir sem comprometer a base.',
  },
  {
    title: 'Processo estruturado',
    text: 'Entendimento, construção e validação caminham juntos.',
  },
]

export function Hero() {
  return (
    <section className="hero-section" id="inicio">
      <div className="container hero-grid">
        <div className="hero-copy reveal">
          <p className="eyebrow">TechForge</p>
          <h1>
            <span>Software</span>
            <span>que</span>
            <span>estrutura</span>
            <span>ideias.</span>
          </h1>
          <p>
            Engenharia de software para empresas que precisam transformar processos em soluções
            digitais claras, estáveis e preparadas para evoluir.
          </p>
          <div className="hero-actions">
            <Button href="#contato">Iniciar projeto</Button>
            <Button href="#solucoes" variant="ghost">
              Ver soluções
            </Button>
          </div>
        </div>

        <div className="hero-visual reveal" aria-label="Composição visual TechForge">
          <div className="material-frame">
            <div className="material-frame__image">
              <img src="/assets/techforge-symbol.png" alt="" />
            </div>
            <div className="material-frame__meta">
              <span>TechForge</span>
              <strong>Código com propósito.</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Positioning() {
  return (
    <section className="positioning">
      <div className="container positioning__grid">
        <span className="section-index">01</span>
        <h2 className="reveal">Software que estrutura ideias.</h2>
        <p className="reveal">
          A TechForge transforma necessidades reais em soluções digitais funcionais, combinando
          planejamento, design e desenvolvimento.
        </p>
      </div>
    </section>
  )
}

export function Services() {
  return (
    <section className="section section--light" id="solucoes">
      <div className="container">
        <SectionTitle
          eyebrow="02 - Soluções"
          title="Tecnologia aplicada ao que precisa funcionar."
          accent="funcionar"
          description="Uma estrutura objetiva para desenvolver, conectar e automatizar partes importantes da operação."
        />

        <div className="services-list">
          {services.map((service, index) => {
            const Icon = serviceIcons[service.icon]
            return (
              <article className="service-row reveal" key={service.title}>
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
          description="O trabalho combina clareza de escopo, decisões técnicas conscientes e uma entrega preparada para evolução."
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
          title="Portfólio preparado para cases reais."
          accent="cases"
          description="Sem clientes fictícios. Os espaços abaixo existem para receber projetos validados pela TechForge."
        />

        <div className="projects-grid">
          {projects.map((project, index) => (
            <article className="project-card reveal" key={`${project.title}-${index}`}>
              <div className="project-preview" aria-label="Placeholder de projeto TechForge" role="img">
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="project-card__content">
                <span>{project.category}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <a href="#contato">
                  Inserir dados reais
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
          description="Um fluxo simples para sair do problema e chegar a uma entrega digital validada."
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
          <h2>Tecnologia não é o fim. É a estrutura que torna novas ideias possíveis.</h2>
          <p>
            A TechForge desenvolve experiências web, sistemas e automações para transformar
            desafios em soluções digitais úteis, consistentes e preparadas para evoluir.
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
          title="Três integrantes. Uma base técnica em construção."
          accent="base"
          description="A estrutura está pronta para receber nome, função, foto e redes de cada participante."
        />

        <div className="team-grid">
          {team.map((member, index) => (
            <article className="team-member reveal" key={index}>
              <div className="team-member__portrait" aria-label={`Integrante ${index + 1} pendente`}>
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="team-member__info">
                <span>Integrante TechForge</span>
                <h3>{member.name || 'Nome pendente'}</h3>
                <p>{member.role || 'Função e descrição a definir.'}</p>
                <div>
                  <a aria-disabled="true">
                    <ExternalLink aria-hidden="true" size={16} />
                    LinkedIn
                  </a>
                  <a aria-disabled="true">
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
          <h2>Vamos construir algo que faça sentido?</h2>
        </div>
        <Button href="#contato" variant="light">
          Falar sobre um projeto
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

export function Contact() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<'idle' | 'ready'>('idle')

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setStatus('idle')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Partial<Record<keyof FormState, string>> = {}

    if (!form.name.trim()) nextErrors.name = 'Informe seu nome.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Informe um email válido.'
    if (!form.projectType) nextErrors.projectType = 'Selecione o tipo de projeto.'
    if (form.message.trim().length < 20) nextErrors.message = 'Descreva o projeto com pelo menos 20 caracteres.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      setStatus('ready')
    }
  }

  return (
    <section className="section contact-section" id="contato">
      <div className="container contact-grid">
        <div className="contact-copy reveal">
          <p className="eyebrow">09 - Contato</p>
          <h2>Conte o que precisa ser construído.</h2>
          <p>
            O formulário está preparado para validação e futura integração com um backend de envio.
            Nenhuma mensagem é enviada enquanto o endpoint não for configurado.
          </p>
          <div className="contact-note">
            <Mail aria-hidden="true" />
            <span>Email oficial pendente de configuração.</span>
          </div>
        </div>

        <form className="contact-form reveal" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <label>
              Nome
              <input
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
                value={form.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                placeholder="Opcional"
              />
            </label>
            <label>
              Empresa
              <input
                value={form.company}
                onChange={(event) => updateField('company', event.target.value)}
                placeholder="Opcional"
              />
            </label>
          </div>
          <label>
            Tipo de projeto
            <select
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
              value={form.message}
              onChange={(event) => updateField('message', event.target.value)}
              aria-invalid={Boolean(errors.message)}
              placeholder="Conte o contexto, objetivo e o que precisa ser construído."
            />
            {errors.message ? <span className="field-error">{errors.message}</span> : null}
          </label>

          <button type="submit" className="submit-button">
            <Send aria-hidden="true" size={18} />
            Conferir dados
          </button>

          {status === 'ready' ? (
            <p className="form-status" role="status">
              <BadgeCheck aria-hidden="true" size={18} />
              Dados conferidos. Configure um endpoint para habilitar o envio real.
            </p>
          ) : null}
        </form>
      </div>
    </section>
  )
}
