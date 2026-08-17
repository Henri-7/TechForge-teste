import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { navigation } from '../../data/navigation'
import { PixelFill } from '../ui/PixelFill'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const isScrolledRef = useRef(false)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const next = window.scrollY > 20
      if (next === isScrolledRef.current) return
      isScrolledRef.current = next
      setIsScrolled(next)
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 861px)')
    const closeOnDesktop = () => {
      if (media.matches) setIsOpen(false)
    }

    closeOnDesktop()
    media.addEventListener('change', closeOnDesktop)
    return () => media.removeEventListener('change', closeOnDesktop)
  }, [])

  return (
    <header className={`site-header ${isScrolled ? 'site-header--scrolled' : ''}`}>
      <a className="brand" href="#inicio" aria-label="TechForge">
        <img src="/assets/techforge-horizontal.png" alt="TechForge" />
      </a>

      <nav className="desktop-nav" aria-label="Menu">
        {navigation.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <a className="header-cta" href="#contato">
        <PixelFill />
        <span>Contato</span>
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
          <PixelFill />
          <span>Contato</span>
        </a>
      </div>
    </header>
  )
}
