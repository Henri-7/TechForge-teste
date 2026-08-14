import { useEffect, useRef, useState, type RefObject } from 'react'

/**
 * Progresso (0 -> 1) do scroll dentro do hero, que tem palco sticky e altura extra.
 * O valor fica num ref (não em state) para não re-renderizar a cada scroll, e é
 * publicado no <html> como `--hero-progress` — assim o header, que vive fora da
 * seção, acompanha a mesma fase do texto.
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
    let lastProgress = -1
    let lastRevealed = false

    const update = () => {
      frame = 0
      const distance = Math.max(section.offsetHeight - window.innerHeight, 1)
      const value = Math.min(Math.max(-section.getBoundingClientRect().top / distance, 0), 1)
      progress.current = value

      if (Math.abs(value - lastProgress) >= 0.0005) {
        lastProgress = value
        root.style.setProperty('--hero-progress', value.toFixed(4))
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

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      root.style.removeProperty('--hero-progress')
      root.classList.remove('is-hero-revealed')
    }
  }, [sectionRef, revealAt])

  return { progress, revealed }
}
