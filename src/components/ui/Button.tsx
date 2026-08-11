import { ArrowRight } from 'lucide-react'
import { PixelFill } from './PixelFill'

type ButtonProps = {
  children: string
  href?: string
  variant?: 'primary' | 'ghost' | 'light'
}

export function Button({ children, href = '#contato', variant = 'primary' }: ButtonProps) {
  return (
    <a className={`button button--${variant}`} href={href}>
      <PixelFill />
      <span>{children}</span>
      <ArrowRight aria-hidden="true" size={18} />
    </a>
  )
}
