/**
 * ============================================
 * Toast Store — Vanilla React
 * ============================================
 * Estado global para notificaciones toast.
 * Usa useSyncExternalStore para suscripción reactiva
 * sin dependencias externas.
 *
 * SRP: solo manejo de estado de notificaciones.
 */

import { useSyncExternalStore } from 'react'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  variant: ToastVariant
  duration?: number
}

// ── Store interno ─────────────────────────────────────────────────

let toasts: Toast[] = []
let counter = 0
const listeners = new Set<() => void>()

function emitChange() {
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): Toast[] {
  return toasts
}

function addToast(toast: Omit<Toast, 'id'>) {
  const id = `toast-${++counter}-${Date.now()}`
  const newToast: Toast = { ...toast, id }
  toasts = [...toasts, newToast]
  emitChange()

  // Auto-remove después del duration
  const duration = toast.duration ?? 4000
  if (duration > 0) {
    setTimeout(() => removeToast(id), duration)
  }
}

function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id)
  emitChange()
}

// ── Hook para componentes React ───────────────────────────────────

export function useToasts() {
  const currentToasts = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  return { toasts: currentToasts, removeToast }
}

// ── API imperativa para uso desde mutations ───────────────────────

export const toast = {
  success: (message: string) =>
    addToast({ message, variant: 'success' }),
  error: (message: string) =>
    addToast({ message, variant: 'error', duration: 6000 }),
  warning: (message: string) =>
    addToast({ message, variant: 'warning' }),
  info: (message: string) =>
    addToast({ message, variant: 'info' }),
}
