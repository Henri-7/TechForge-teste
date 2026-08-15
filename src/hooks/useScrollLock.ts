import { useEffect } from 'react'

const SCROLL_KEYS = new Set([
  ' ',
  'PageDown',
  'PageUp',
  'ArrowDown',
  'ArrowUp',
  'Home',
  'End',
])

const isTextField = (target: EventTarget | null) =>
  target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)

/**
 * Prende a página enquanto `locked` for true.
 *
 * Não usa `overflow: hidden` de propósito: mexer no overflow da raiz com o hero
 * sticky em cena arrisca um salto de posição. Aqui a roda/toque/teclas são
 * barradas e a posição é reancorada — fio-terra contra a inércia de um flick
 * rápido, que continua gerando scroll depois do preventDefault.
 *
 * `getAnchor` decide onde prender: passar o ponto exato do gatilho, e não o
 * scroll do momento, evita travar já fora da seção quando um flick atravessa o
 * gatilho antes do React reagir.
 */
export function useScrollLock(locked: boolean, getAnchor?: () => number) {
  useEffect(() => {
    if (!locked) return

    const root = document.documentElement
    const isTouchScroll = window.matchMedia('(pointer: coarse)').matches
    const shouldAnchorScroll = !isTouchScroll
    const anchor = getAnchor ? getAnchor() : window.scrollY
    const previousBehavior = root.style.scrollBehavior
    root.style.scrollBehavior = 'auto'

    const prevent = (event: Event) => event.preventDefault()

    let frame = 0

    const onKeyDown = (event: KeyboardEvent) => {
      if (isTextField(event.target)) return
      if (SCROLL_KEYS.has(event.key)) event.preventDefault()
    }

    const hold = () => {
      if (Math.abs(window.scrollY - anchor) > 1) window.scrollTo(0, anchor)
    }

    const requestHold = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        hold()
      })
    }

    if (shouldAnchorScroll) {
      hold()
      window.addEventListener('wheel', prevent, { passive: false })
      window.addEventListener('scroll', requestHold, { passive: true })
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('wheel', prevent)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', requestHold)
      root.style.scrollBehavior = previousBehavior
    }
  }, [locked, getAnchor])
}
