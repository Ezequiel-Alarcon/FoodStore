/**
 * ============================================
 * IngredienteForm — Stitch Design
 * ============================================
 */

import { type FC, useEffect, useMemo } from 'react'
import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Ingrediente, IngredienteCreate, IngredienteUpdate } from '@/types'

interface FormData {
  nombre: string
  descripcion: string
  es_alergeno: boolean
}

interface IngredienteFormProps {
  ingrediente?: Ingrediente | null
  onSubmit: (data: IngredienteCreate | IngredienteUpdate) => void | Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export const IngredienteForm: FC<IngredienteFormProps> = ({
  ingrediente, onSubmit, onCancel, isLoading = false,
}) => {
  const initialValues = useMemo<FormData>(() =>
    ingrediente
      ? { nombre: ingrediente.nombre, descripcion: ingrediente.descripcion || '', es_alergeno: ingrediente.es_alergeno }
      : { nombre: '', descripcion: '', es_alergeno: false },
    [ingrediente]
  )

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      const payload: IngredienteCreate | IngredienteUpdate = {
        nombre: value.nombre,
        descripcion: value.descripcion.trim() ? value.descripcion : undefined,
        es_alergeno: value.es_alergeno,
      }
      await onSubmit(payload)
    },
  })

  useEffect(() => { form.reset(initialValues) }, [form, initialValues])

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }}
      className="space-y-6"
    >
      <form.Field name="nombre" validators={{ onChange: ({ value }) => (value.trim().length === 0 ? 'El nombre es requerido' : undefined) }}>
        {(field) => (
          <Input label="Nombre *" value={field.state.value} onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            error={!field.state.meta.isValid && field.state.meta.isTouched}
            errorMessage={field.state.meta.errors[0]?.toString()} placeholder="ej. Harina de trigo" />
        )}
      </form.Field>

      <form.Field name="descripcion">
        {(field) => (
          <Input label="Descripción" value={field.state.value} onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)} placeholder="Descripción opcional" />
        )}
      </form.Field>

      <form.Field name="es_alergeno">
        {(field) => (
          <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
            field.state.value
              ? 'border-amber-200 bg-amber-50'
              : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
          }`}>
            <input type="checkbox" checked={field.state.value} onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-amber-600 focus:ring-amber-600" />
            <div>
              <span className="text-sm text-slate-700 font-medium">Es alérgeno</span>
              <p className="text-xs text-slate-500 mt-0.5">Marcalo si puede causar reacciones alérgicas</p>
            </div>
          </label>
        )}
      </form.Field>

      <div className="pt-4 flex flex-col gap-3">
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" loading={isLoading || isSubmitting} disabled={!canSubmit || isLoading} fullWidth>
              {ingrediente ? 'Actualizar Ingrediente' : 'Guardar Ingrediente'}
            </Button>
          )}
        </form.Subscribe>
        <Button type="button" variant="outline" onClick={onCancel} fullWidth>
          Descartar Cambios
        </Button>
      </div>
    </form>
  )
}
