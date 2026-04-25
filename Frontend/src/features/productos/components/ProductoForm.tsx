/**
 * ============================================
 * ProductoForm Component
 * ============================================
 * Formulario para crear/editar productos con TanStack Form
 */

import { type FC, useEffect, useMemo } from 'react'
import { useForm } from '@tanstack/react-form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type {
  Ingrediente,
  Producto,
  ProductoCreate,
  ProductoUpdate,
} from '@/types'

/**
 * Tipo del formulario
 */
interface FormData {
  nombre: string
  descripcion: string
  precio_base: number
  stock_cantidad: number
  disponible: boolean
  selectedCategoryIds: number[]
  principalCategoryId: number | null
  selectedIngredientIds: number[]
  removableIngredientIds: number[]
}

export interface ProductoCategoriaLinkInput {
  categoria_id: number
  es_principal: boolean
}

export interface ProductoIngredienteLinkInput {
  ingrediente_id: number
  es_removible: boolean
}

export interface ProductoFormSubmitData {
  producto: ProductoCreate | ProductoUpdate
  categorias: ProductoCategoriaLinkInput[]
  ingredientes: ProductoIngredienteLinkInput[]
}

interface ProductoFormProps {
  /** Producto a editar (null para crear) */
  producto?: Producto | null
  categoriasDisponibles: { id: number; nombre: string }[]
  ingredientesDisponibles: Ingrediente[]
  initialCategoriaLinks?: ProductoCategoriaLinkInput[]
  initialIngredienteLinks?: ProductoIngredienteLinkInput[]
  /** handlers */
  onSubmit: (data: ProductoFormSubmitData) => void | Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

/**
 * Formulario para productos - versión simplificada sin Zod
 */
export const ProductoForm: FC<ProductoFormProps> = ({
  producto,
  categoriasDisponibles,
  ingredientesDisponibles,
  initialCategoriaLinks = [],
  initialIngredienteLinks = [],
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const initialCategoryIds =
    initialCategoriaLinks.length > 0
      ? initialCategoriaLinks.map((item) => item.categoria_id)
      : (producto?.categorias ?? []).map((item) => item.id)

  const initialPrincipalCategoryId =
    initialCategoriaLinks.find((item) => item.es_principal)?.categoria_id ?? null

  const initialIngredientIds =
    initialIngredienteLinks.length > 0
      ? initialIngredienteLinks.map((item) => item.ingrediente_id)
      : (producto?.ingredientes ?? []).map((item) => item.id)

  const initialRemovableIngredientIds = initialIngredienteLinks
    .filter((item) => item.es_removible)
    .map((item) => item.ingrediente_id)

  const initialValues = useMemo<FormData>(
    () =>
      producto
        ? {
            nombre: producto.nombre,
            descripcion: producto.descripcion || '',
            precio_base: producto.precio_base,
            stock_cantidad: producto.stock_cantidad,
            disponible: producto.disponible,
            selectedCategoryIds: initialCategoryIds,
            principalCategoryId: initialPrincipalCategoryId,
            selectedIngredientIds: initialIngredientIds,
            removableIngredientIds: initialRemovableIngredientIds,
          }
        : {
            nombre: '',
            descripcion: '',
            precio_base: 0,
            stock_cantidad: 0,
            disponible: true,
            selectedCategoryIds: [],
            principalCategoryId: null,
            selectedIngredientIds: [],
            removableIngredientIds: [],
          },
    [
      initialCategoryIds,
      initialIngredientIds,
      initialPrincipalCategoryId,
      initialRemovableIngredientIds,
      producto,
    ]
  )

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      // Extraer solo los campos del producto, sin los de vinculación
      const productoPayload: ProductoCreate | ProductoUpdate = {
        nombre: value.nombre,
        descripcion: value.descripcion?.trim() ? value.descripcion : undefined,
        precio_base: value.precio_base,
        stock_cantidad: value.stock_cantidad,
        disponible: value.disponible,
      }

      const categorias = value.selectedCategoryIds.map((categoriaId) => ({
        categoria_id: categoriaId,
        es_principal: value.principalCategoryId === categoriaId,
      }))

      const ingredientes = value.selectedIngredientIds.map((ingredienteId) => ({
        ingrediente_id: ingredienteId,
        es_removible: value.removableIngredientIds.includes(ingredienteId),
      }))

      await onSubmit({
        producto: productoPayload,
        categorias,
        ingredientes,
      })
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

      {/* Precio */}
      <form.Field
        name="precio_base"
        validators={{
          onChange: ({ value }) =>
            Number.isNaN(value) || value < 0 ? 'El precio no puede ser negativo' : undefined,
        }}
      >
        {(field) => (
          <Input
            label="Precio *"
            type="number"
            step="0.01"
            value={String(field.state.value)}
            onBlur={field.handleBlur}
            onChange={(event) => field.handleChange(event.target.valueAsNumber)}
            error={!field.state.meta.isValid && field.state.meta.isTouched}
            errorMessage={field.state.meta.errors[0]?.toString()}
          />
        )}
      </form.Field>

      {/* Stock */}
      <form.Field
        name="stock_cantidad"
        validators={{
          onChange: ({ value }) =>
            Number.isNaN(value) || value < 0 ? 'El stock no puede ser negativo' : undefined,
        }}
      >
        {(field) => (
          <Input
            label="Stock *"
            type="number"
            value={String(field.state.value)}
            onBlur={field.handleBlur}
            onChange={(event) => field.handleChange(event.target.valueAsNumber)}
            error={!field.state.meta.isValid && field.state.meta.isTouched}
            errorMessage={field.state.meta.errors[0]?.toString()}
          />
        )}
      </form.Field>

      {/* Disponible */}
      <form.Field name="disponible">
        {(field) => (
          <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              id="disponible"
              checked={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-orange-600 focus:ring-orange-600"
            />
            <span className="text-sm text-slate-700 font-medium">Producto disponible</span>
          </label>
        )}
      </form.Field>

      <form.Field name="selectedCategoryIds">
        {(field) => (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Categorías vinculadas</p>
            {categoriasDisponibles.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No hay categorías disponibles.</p>
            ) : (
              <form.Field name="principalCategoryId">
                {(principalField) => (
                  <div className="grid grid-cols-2 gap-2">
                    {categoriasDisponibles.map((categoria) => {
                      const selected = field.state.value.includes(categoria.id)
                      const isPrincipal = principalField.state.value === categoria.id
                      return (
                        <label
                          key={categoria.id}
                          className={`flex items-center justify-between gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                            isPrincipal
                              ? 'border-emerald-300 bg-emerald-50 ring-1 ring-emerald-200'
                              : selected
                                ? 'border-blue-200 bg-blue-50'
                                : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={(event) => {
                                const next = event.target.checked
                                  ? [...field.state.value, categoria.id]
                                  : field.state.value.filter((id) => id !== categoria.id)

                                field.handleChange(next)
                                if (!next.includes(principalField.state.value ?? -1)) {
                                  principalField.handleChange(null)
                                }
                              }}
                              className={`w-5 h-5 rounded border-slate-300 focus:ring-offset-0 ${
                                isPrincipal
                                  ? 'text-emerald-600 focus:ring-emerald-600'
                                  : 'text-blue-600 focus:ring-blue-600'
                              }`}
                            />
                            <span className={`text-sm ${isPrincipal ? 'font-semibold text-emerald-800' : 'text-slate-700'}`}>
                              {categoria.nombre}
                            </span>
                          </span>
                          {selected ? (
                            <button
                              type="button"
                              onClick={() => principalField.handleChange(
                                isPrincipal ? null : categoria.id
                              )}
                              className={`rounded-full px-2 py-0.5 text-xs font-semibold transition-colors ${
                                isPrincipal
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                              }`}
                            >
                              Principal
                            </button>
                          ) : null}
                        </label>
                      )
                    })}
                  </div>
                )}
              </form.Field>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="selectedIngredientIds">
        {(field) => (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ingredientes vinculados</p>
            {ingredientesDisponibles.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No hay ingredientes disponibles.</p>
            ) : (
              <form.Field name="removableIngredientIds">
                {(removableField) => (
                  <div className="grid grid-cols-2 gap-2">
                    {ingredientesDisponibles.map((ingrediente) => {
                      const selected = field.state.value.includes(ingrediente.id)
                      const isRemovable = removableField.state.value.includes(ingrediente.id)

                      return (
                        <div
                          key={ingrediente.id}
                          className={`p-3 rounded-lg border transition-colors ${
                            selected
                              ? ingrediente.es_alergeno
                                ? 'border-amber-200 bg-amber-50'
                                : 'border-green-200 bg-green-50'
                              : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                          }`}
                        >
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={(event) => {
                                const next = event.target.checked
                                  ? [...field.state.value, ingrediente.id]
                                  : field.state.value.filter((id) => id !== ingrediente.id)

                                field.handleChange(next)
                                if (!next.includes(ingrediente.id)) {
                                  removableField.handleChange(
                                    removableField.state.value.filter((id) => id !== ingrediente.id)
                                  )
                                }
                              }}
                              className="w-5 h-5 rounded border-slate-300 text-orange-600 focus:ring-orange-600"
                            />
                            <span className="text-sm text-slate-700">
                              {ingrediente.nombre}
                              {ingrediente.es_alergeno && (
                                <span className="ml-1 text-amber-600 font-semibold">⚠</span>
                              )}
                            </span>
                          </label>
                          {selected && (
                            <label className="flex items-center gap-1 text-xs text-slate-500 mt-2 ml-7 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isRemovable}
                                onChange={(event) => {
                                  const nextRemovable = event.target.checked
                                    ? [...removableField.state.value, ingrediente.id]
                                    : removableField.state.value.filter((id) => id !== ingrediente.id)
                                  removableField.handleChange(nextRemovable)
                                }}
                                className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-600"
                              />
                              Removible
                            </label>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </form.Field>
            )}
          </div>
        )}
      </form.Field>

      {/* Buttons — Stitch stacked style */}
      <div className="pt-4 flex flex-col gap-3">
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" loading={isLoading || isSubmitting} disabled={!canSubmit || isLoading} fullWidth>
              {producto ? 'Actualizar Producto' : 'Guardar Producto'}
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