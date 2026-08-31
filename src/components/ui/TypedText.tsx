type TypedTextProps = {
  text: string
  visible: number
  caret?: boolean
}

/**
 * O texto completo fica numa camada transparente que reserva o espaço — sem ela
 * o layout pularia a cada caractere. A camada por cima mostra o trecho já
 * digitado e sai da árvore de acessibilidade: quem lê tela recebe o texto todo.
 */
export function TypedText({ text, visible, caret = false }: TypedTextProps) {
  return (
    <span className="typed">
      <span className="typed__ghost">{text}</span>
      <span className="typed__visible" aria-hidden="true">
        {text.slice(0, visible)}
        {caret ? <i className="typed__caret" /> : null}
      </span>
    </span>
  )
}
