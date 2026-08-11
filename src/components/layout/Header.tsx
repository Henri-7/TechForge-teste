import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { navigation } from '../../data/navigation'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header ${isScrolled ? 'site-header--scrolled' : ''}`}>
      <a className="brand" href="#inicio" aria-label="TechForge - Início">
        <img src="/assets/techforge-horizontal.png" alt="TechForge" />
      </a>

      <nav className="desktop-nav" aria-label="Navegação principal">
        {navigation.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <a className="header-cta" href="#contato">
        Fale conosco
      </a>

      <button
        className="menu-toggle"
        type="button"
        aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        onClick={() => setIsOpen((value) => !value)}
      >
        {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>

      <div className={`mobile-panel ${isOpen ? 'mobile-panel--open' : ''}`} id="mobile-menu">
        {navigation.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
            {item.label}
          </a>
        ))}
        <a href="#contato" className="mobile-cta" onClick={() => setIsOpen(false)}>
          Fale conosco
        </a>
      </div>
    </header>
  )
}
