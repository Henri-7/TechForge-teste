import { Component, type ErrorInfo, type ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
  fallback: ReactNode
}

type ErrorBoundaryState = {
  failed: boolean
}

/**
 * Componente de classe porque não existe equivalente em hook: `getDerivedState-
 * FromError` é a única forma de impedir que um erro de render suba até a raiz.
 * O `onUncaughtError` do createRoot (React 19) só observa o erro — o React
 * desmonta a árvore inteira do mesmo jeito, e a página fica em branco.
 *
 * Sem reset: o que isto protege são falhas permanentes na sessão (chunk que não
 * parseia, download que não veio, contexto WebGL que morreu). Tentar de novo só
 * repetiria o erro.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Falha contida pelo ErrorBoundary:', error, info.componentStack)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
