import { type FC, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Button component variants
 */
type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

interface ButtonProps {
  /** Button content */
  children: ReactNode
  /** Visual variant */
  variant?: ButtonVariant
  /** Size */
  size?: ButtonSize
  /** Disabled state */
  disabled?: boolean
  /** Loading state */
  loading?: boolean
  /** Click handler */
  onClick?: () => void
  /** Type attribute */
  type?: 'button' | 'submit' | 'reset'
  /** Additional classes */
  className?: string
  /** Full width */
  fullWidth?: boolean
}

/**
 * Button component — Stitch design
 */
export const Button: FC<ButtonProps> = ({
  children,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className,
  fullWidth = false,
}) => {
  /** Base classes */
  const baseClasses = 'inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50'

  /** Variant classes — Stitch palette */
  const variantClasses: Record<ButtonVariant, string> = {
    default: 'bg-orange-600 text-white hover:bg-orange-700 shadow-md shadow-orange-600/20',
    destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/20',
    outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    ghost: 'text-slate-500 hover:bg-slate-100 hover:text-orange-600',
    link: 'text-orange-600 underline-offset-4 hover:underline',
  }

  /** Size classes */
  const sizeClasses: Record<ButtonSize, string> = {
    default: 'h-10 px-5 py-2',
    sm: 'h-9 px-3',
    lg: 'h-12 px-8',
    icon: 'h-10 w-10',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {loading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  )
}