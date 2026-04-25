/**
 * ============================================
 * CategoriaForm Component
 * ============================================
 * Formulario para crear/editar categorías con TanStack Form
 * FIX: cuando parentId está vacío, NO enviar el campo (backend lo trata como null)
 */

import { type FC, useEffect, useMemo } from 'react'
import { useForm } from '@tanstack/react-form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { CategoriaTreeNode } from '@/types'

function flattenCategorias(categorias: CategoriaTreeNode[]): CategoriaTreeNode[] {
  return categorias.flatMap((categoria) => [
    categoria,
    ...flattenCategorias(categoria.subcategorias ?? []),
  ])
}

function collectDescendantIds(categoria: CategoriaTreeNode | null | undefined): Set<number> {
  const ids = new Set<number>()
  if (!categoria) {
    return ids
  }

  const visit = (node: CategoriaTreeNode) => {
    for (const sub of node.subcategorias ?? []) {
      ids.add(sub.id)
      visit(sub)
    }
  }

  visit(categoria)
  return ids
}

/**
 * Tipo del formulario
 */
interface FormData {
  nombre: string
  descripcion: string
  imagen_url: string
  parentId: string  // String para manejar el select fácilmente
}

/** 
 * Payload que se envía al backend
 * FIX: parent_id solo se incluye cuando tiene valor (para permitir crear categorías raíz)
 */
interface CategoriaPayload {
  nombre: string
  descripcion?: string
  imagen_url: string
  parent_id?: number | null  // En update permite volver a raíz con null
}

interface CategoriaFormProps {
  /** Categoría a editar (null para crear) */
  categoria?: {
    id: number
    parent_id: number | null
    nombre: string
    descripcion: string | null
    imagen_url: string
  } | null
  /** Categorías para selector de padre */
  categorias: CategoriaTreeNode[]
  /** Handlers */
  onSubmit: (data: CategoriaPayload) => void | Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

/**
 * Formulario para categorías - FIX: permite crear categoría raíz
 * Cuando parentId está vacío, NO se envía parent_id → backend crea como raíz
 */
export const CategoriaForm: FC<CategoriaFormProps> = ({
  categoria,
  categorias,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const allFlat = useMemo(() => flattenCategorias(categorias), [categorias])
  const currentNode = useMemo(
    () => (categoria ? allFlat.find((c) => c.id === categoria.id) ?? null : null),
    [allFlat, categoria]
  )
  const descendantIds = useMemo(() => collectDescendantIds(currentNode), [currentNode])
  // Excluir la categoría actual y sus descendientes para evitar ciclos.
  const categoriasOptions = useMemo(
    () =>
      allFlat.filter(
        (item) => item.id !== categoria?.id && !descendantIds.has(item.id)
      ),
    [allFlat, categoria?.id, descendantIds]
  )

  const initialValues = useMemo<FormData>(
    () => ({
      nombre: categoria?.nombre || '',
      descripcion: categoria?.descripcion || '',
      imagen_url: categoria?.imagen_url || '',
      parentId: categoria?.parent_id?.toString() || '',
    }),
    [categoria]
  )

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      const submitData: CategoriaPayload = {
        nombre: value.nombre,
        imagen_url: value.imagen_url,
      }

      if (value.descripcion && value.descripcion.trim()) {
        submitData.descripcion = value.descripcion
      }

      if (value.parentId && value.parentId !== '') {
        submitData.parent_id = parseInt(value.parentId, 10)
      } else if (categoria) {
        // En edición, vacío significa volver a categoría raíz.
        submitData.parent_id = null
      }

      await onSubmit(submitData)
    },
  })

  useEffect(() => {
    form.reset(initialValues)
  }, [form, initialValues])

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-6"
    >
      {/* Nombre */}
      <form.Field
        name="nombre"
        validators={{
          onChange: ({ value }) => (value.trim().length === 0 ? 'El nombre es requerido' : undefined),
        }}
      >
        {(field) => (
          <Input
            label="Nombre *"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(event) => field.handleChange(event.target.value)}
            error={!field.state.meta.isValid && field.state.meta.isTouched}
            errorMessage={field.state.meta.errors[0]?.toString()}
          />
        )}
      </form.Field>

      {/* Descripción */}
      <form.Field name="descripcion">
        {(field) => (
          <Input
            label="Descripción"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(event) => field.handleChange(event.target.value)}
          />
        )}
      </form.Field>

      {/* URL de imagen */}
      <form.Field
        name="imagen_url"
        validators={{
          onChange: ({ value }) => (value.trim().length === 0 ? 'La URL es requerida' : undefined),
        }}
      >
        {(field) => (
          <Input
            label="URL de Imagen *"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(event) => field.handleChange(event.target.value)}
            error={!field.state.meta.isValid && field.state.meta.isTouched}
            errorMessage={field.state.meta.errors[0]?.toString()}
          />
        )}
      </form.Field>

      {/* Selector de padre */}
      <form.Field name="parentId">
        {(field) => (
          <div className="w-full space-y-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Categoría padre (opcional)
            </label>
            <div className="relative">
              <select
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-base text-slate-900 appearance-none transition-all"
              >
                <option value="">-- Ninguna (categoría raíz) --</option>
                {categoriasOptions.map((cat) => (
                  <option key={cat.id} value={cat.id.toString()}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
            </div>
            <p className="text-xs text-slate-500">
              Dejá vacío para que quede como categoría raíz.
            </p>
          </div>
        )}
      </form.Field>

      {/* Buttons — Stitch stacked */}
      <div className="pt-4 flex flex-col gap-3">
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" loading={isLoading || isSubmitting} disabled={!canSubmit || isLoading} fullWidth>
              {categoria ? 'Actualizar Categoría' : 'Guardar Categoría'}
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
