import { navigation } from '../../data/navigation'
import { services } from '../../data/services'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <img src="/assets/techforge-horizontal.png" alt="TechForge" loading="lazy" />
          <p>Forjando o futuro digital.</p>
        </div>

        <div>
          <h3>Navegação</h3>
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>

        <div>
          <h3>Soluções</h3>
          {services.slice(0, 5).map((service) => (
            <a key={service.title} href="#solucoes">
              {service.title}
            </a>
          ))}
        </div>

        <div>
          <h3>Contato</h3>
          <p className="footer__pending">Instagram, techforge.contato@gmail.com e WhatsApp.</p>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© 2026 TechForge. Todos os direitos reservados.</span>
        <span>Dados reais de contato e portfólio podem ser adicionados em seguida.</span>
      </div>
    </footer>
  )
}
