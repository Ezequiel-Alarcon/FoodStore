/**
 * ============================================
 * ToastContainer — Stitch Design
 * ============================================
 * Renderiza las notificaciones toast activas.
 * Se monta una sola vez en App.tsx.
 *
 * SRP: solo presentación de toasts.
 */

import { type FC } from 'react'
import { useToasts, type ToastVariant } from '@/store/toast-store'
import { cn } from '@/lib/utils'

const variantConfig: Record<ToastVariant, { icon: string; bg: string; border: string; text: string; iconColor: string }> = {
  success: {
    icon: 'check_circle',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    iconColor: 'text-emerald-500',
  },
  error: {
    icon: 'error',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    iconColor: 'text-red-500',
  },
  warning: {
    icon: 'warning',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    iconColor: 'text-amber-500',
  },
  info: {
    icon: 'info',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    iconColor: 'text-blue-500',
  },
}

export const ToastContainer: FC = () => {
  const { toasts, removeToast } = useToasts()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => {
        const config = variantConfig[t.variant]
        return (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg',
              'min-w-[320px] max-w-[420px]',
              'animate-toast-in',
              config.bg,
              config.border,
            )}
            role="alert"
          >
            <span
              className={cn('material-symbols-outlined text-xl shrink-0 mt-0.5', config.iconColor)}
              style={{ fontVariationSettings: "'FILL' 1, 'wght' 500" }}
            >
              {config.icon}
            </span>
            <p className={cn('text-sm font-medium leading-snug flex-1', config.text)}>
              {t.message}
            </p>
            <button
              onClick={() => removeToast(t.id)}
              className={cn('shrink-0 p-0.5 rounded-lg transition-colors hover:bg-black/5', config.text)}
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        )
      })}
    </div>
  )
}
