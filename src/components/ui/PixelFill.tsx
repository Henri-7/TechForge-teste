import { useEffect, useRef, useState, type CSSProperties } from 'react'

/**
 * Camada que preenche um botão no hover com blocos quadrados de 8px, cada um
 * entrando num instante próprio. O atraso vem de um hash determinístico da
 * posição da célula: o padrão de ruído é sempre o mesmo entre execuções e nunca
 * vira uma varredura direcional. Na saída a ordem se inverte, mais rápida.
 *
 * A grade é derivada do tamanho real do botão, então o bloco continua quadrado
 * em botões de qualquer largura. A cor vem de `--pixel-color`, definida por
 * variante no styles.css.
 */

const CELL_SIZE = 8
const MAX_DELAY = 340
/** a saída é mais curta que a entrada, senão o botão demora a "apagar" */
const LEAVE_FACTOR = 0.55
/**
 * Teto de elementos. Só o submit do formulário chega perto: com 567px de
 * largura ele pediria mais de 400 blocos. Passando daqui o bloco cresce em vez
 * de multiplicar nós no DOM.
 */
const MAX_CELLS = 320

/** fract(sin(c * 127.1 + r * 311.7) * 43758.5453) — ruído estável, sem direção */
const hash = (column: number, row: number) => {
  const value = Math.sin(column * 127.1 + row * 311.7) * 43758.5453
  return value - Math.floor(value)
}

type Cell = {
  left: number
  top: number
  size: number
  enter: number
  leave: number
}

function buildCells(width: number, height: number): Cell[] {
  let size = CELL_SIZE
  let columns = Math.ceil(width / size)
  let rows = Math.ceil(height / size)

  while (columns * rows > MAX_CELLS) {
    size += 1
    columns = Math.ceil(width / size)
    rows = Math.ceil(height / size)
  }

  const cells: Cell[] = []

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const enter = hash(column, row) * MAX_DELAY

      cells.push({
        left: column * size,
        top: row * size,
        size,
        enter,
        leave: (MAX_DELAY - enter) * LEAVE_FACTOR,
      })
    }
  }

  return cells
}

export function PixelFill() {
  const layer = useRef<HTMLSpanElement>(null)
  const [cells, setCells] = useState<Cell[]>([])

  useEffect(() => {
    const node = layer.current
    // sem ResizeObserver (Safari < 13.1) a grade não é construída e o botão
    // fica sem o preenchimento por pixels — perda puramente cosmética
    if (!node || typeof ResizeObserver === 'undefined') return

    let measured = ''
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (width <= 0 || height <= 0) return

      // as células são absolutas e não alteram a caixa, mas medir só quando o
      // tamanho muda de fato evita reconstruir a grade à toa
      const key = `${Math.round(width)}x${Math.round(height)}`
      if (key === measured) return
      measured = key

      setCells(buildCells(width, height))
    })

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <span className="pixel-fill" aria-hidden="true" ref={layer}>
      {cells.map((cell, index) => (
        <i
          key={index}
          className="pixel-fill__cell"
          style={
            {
              left: `${cell.left}px`,
              top: `${cell.top}px`,
              width: `${cell.size}px`,
              height: `${cell.size}px`,
              '--enter': `${Math.round(cell.enter)}ms`,
              '--leave': `${Math.round(cell.leave)}ms`,
            } as CSSProperties
          }
        />
      ))}
    </span>
  )
}
