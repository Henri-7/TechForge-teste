import { useEffect } from 'react'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { WhatsAppFloatingButton } from './components/ui/WhatsAppFloatingButton'
import {
  About,
  Contact,
  ContactCta,
  Differentials,
  Hero,
  Positioning,
  Process,
  Projects,
  Services,
  Team,
} from './components/sections/HomeSections'

function App() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))

    // `.reveal` nasce com opacity: 0 e só o observer acende. Sem a API, o site
    // inteiro abaixo do hero ficaria invisível para sempre — então a ausência
    // dela vira "tudo visível de uma vez", não "nada aparece".
    if (typeof IntersectionObserver === 'undefined') {
      elements.forEach((element) => element.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.16 },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Positioning />
        <Services />
        <Differentials />
        <Projects />
        <Process />
        <About />
        <Team />
        <ContactCta />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </>
  )
}

export default App
