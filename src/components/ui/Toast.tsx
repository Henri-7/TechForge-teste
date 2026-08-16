import { BadgeCheck, X } from 'lucide-react'
import { useEffect } from 'react'

type ToastProps = {
  open: boolean
  name: string
  onClose: () => void
  duration?: number
}

export function Toast({ open, name, onClose, duration = 6000 }: ToastProps) {
  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(onClose, duration)
    return () => window.clearTimeout(timer)
  }, [open, duration, onClose])

  if (!open) return null

  return (
    <div className="toast" role="status" aria-live="polite">
      <BadgeCheck aria-hidden="true" size={22} className="toast__icon" />
      <div className="toast__content">
        <strong>Mensagem enviada, {name}.</strong>
        <p>
          Recebemos os detalhes do seu projeto e já estamos entusiasmados com o que podemos
          construir juntos. Em breve entraremos em contato.
        </p>
      </div>
      <button type="button" className="toast__close" onClick={onClose} aria-label="Fechar aviso">
        <X aria-hidden="true" size={16} />
      </button>
    </div>
  )
}
