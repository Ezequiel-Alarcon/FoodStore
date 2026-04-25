import { type FC, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Error state */
  error?: boolean
  /** Label text */
  label?: string
  /** Error message */
  errorMessage?: string
}

/**
 * Input component — Stitch design
 */
export const Input: FC<InputProps> = ({
  className,
  error = false,
  label,
  errorMessage,
  id,
  type = 'text',
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-500 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={cn(
          'flex w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base text-slate-900',
          'placeholder:text-slate-400',
          'transition-all',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-400 focus:ring-red-400/20 focus:border-red-400',
          className
        )}
        {...props}
      />
      {error && errorMessage && (
        <p className="text-sm text-red-600 font-medium">{errorMessage}</p>
      )}
    </div>
  )
}