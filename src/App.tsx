import { useEffect } from 'react'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
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
    </>
  )
}

export default App
