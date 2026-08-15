import { useEffect, useRef, useState, type RefObject } from 'react'

/**
 * Progresso (0 -> 1) do scroll dentro do hero, que tem palco sticky e altura extra.
 * O valor fica num ref (não em state) para não re-renderizar a cada scroll. O
 * progresso visual fica no hero; apenas `--copy-in` sobe ao <html> para manter
 * o header sincronizado sem invalidar a página inteira com `--hero-progress`.
 *
 * Passado `revealAt`, a classe `is-hero-revealed` entra no <html> (para o que não
 * dá para interpolar em CSS, como `pointer-events`) e `revealed` vira true — é o
 * gatilho da digitação do texto. Só esse cruzamento re-renderiza.
 */
export function useHeroProgress(sectionRef: RefObject<HTMLElement | null>, revealAt = 0.66) {
  const progress = useRef(0)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const root = document.documentElement
    let frame = 0
    let measureFrame = 0
    let lastProgress = -1
    let lastRevealed = false
    let sectionTop = 0
    let scrollDistance = 1

    const measure = () => {
      measureFrame = 0
      const rect = section.getBoundingClientRect()
      sectionTop = rect.top + window.scrollY
      scrollDistance = Math.max(section.offsetHeight - document.documentElement.clientHeight, 1)
      update()
    }

    const update = () => {
      frame = 0
      const value = Math.min(Math.max((window.scrollY - sectionTop) / scrollDistance, 0), 1)
      progress.current = value

      if (Math.abs(value - lastProgress) >= 0.0005) {
        lastProgress = value
        const formatted = value.toFixed(4)
        const copyIn = Math.min(Math.max((value - 0.79) * 16, 0), 1).toFixed(4)
        section.style.setProperty('--hero-progress', formatted)
        section.style.setProperty('--copy-in', copyIn)
        root.style.setProperty('--copy-in', copyIn)
      }

      const next = value >= revealAt
      if (next !== lastRevealed) {
        lastRevealed = next
        root.classList.toggle('is-hero-revealed', next)
        setRevealed(next)
      }
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    const onResize = () => {
      if (!measureFrame) measureFrame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      if (measureFrame) cancelAnimationFrame(measureFrame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
      section.style.removeProperty('--hero-progress')
      section.style.removeProperty('--copy-in')
      root.style.removeProperty('--copy-in')
      root.classList.remove('is-hero-revealed')
    }
  }, [sectionRef, revealAt])

  return { progress, revealed }
}
