import { type FC, type ReactNode, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ModalProps {
  /** Modal open state */
  open: boolean
  /** Close handler */
  onClose: () => void
  /** Modal title */
  title?: string
  /** Modal content */
  children: ReactNode
  /** Footer content (buttons) */
  footer?: ReactNode
  /** Additional classes */
  className?: string
  /** Modal size */
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * Modal component — Stitch design
 */
export const Modal: FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  className,
  size = 'md',
}) => {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [open, onClose])

  if (!open) return null

  /** Size classes */
  const sizeClasses: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(37, 25, 19, 0.6)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        className={cn(
          'relative w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200',
          sizeClasses[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}