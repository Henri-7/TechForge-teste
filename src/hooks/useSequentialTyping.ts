import { useEffect, useMemo, useState } from 'react'

const PAUSE_BETWEEN_BLOCKS = 340
const START_DELAY = 260
const FALLBACK_SPEED = 24

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Digita uma sequência de blocos de texto, um caractere por vez, como código
 * sendo escrito. `speeds` é o intervalo em ms por caractere de cada bloco — a
 * troca de bloco ganha uma pausa maior, que é o que dá o ritmo de "linha nova".
 *
 * Os arrays precisam ser constantes de módulo: são dependências do efeito.
 */
export function useSequentialTyping(segments: string[], speeds: number[], active: boolean) {
  const reduced = useMemo(prefersReducedMotion, [])

  // instante (ms desde o início) em que cada caractere entra
  const timeline = useMemo(() => {
    const times: number[] = []
    let cursor = START_DELAY

    segments.forEach((text, index) => {
      const speed = speeds[index] ?? FALLBACK_SPEED
      for (let char = 0; char < text.length; char += 1) {
        cursor += speed
        times.push(cursor)
      }
      cursor += PAUSE_BETWEEN_BLOCKS
    })

    return times
  }, [segments, speeds])

  const total = timeline.length
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    if (reduced) {
      setTyped(total)
      return
    }

    if (!active) {
      setTyped(0)
      return
    }

    // rAF em vez de setTimeout encadeado: em aba de fundo o navegador estrangula
    // timers, e a digitação (que segura o scroll) levaria minutos para terminar
    let frame = 0
    let count = 0
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      while (count < total && timeline[count] <= elapsed) count += 1
      setTyped(count)
      if (count < total) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, reduced, total, timeline])

  const slices = useMemo(() => {
    let offset = 0
    return segments.map((text) => {
      const visible = Math.min(Math.max(typed - offset, 0), text.length)
      offset += text.length
      return visible
    })
  }, [segments, typed])

  const done = typed >= total
  // o cursor fica no bloco que está sendo escrito e, no fim, parado na última linha
  const caretIndex = done
    ? segments.length - 1
    : slices.findIndex((visible, index) => visible < segments[index].length)

  return { slices, caretIndex, done }
}
