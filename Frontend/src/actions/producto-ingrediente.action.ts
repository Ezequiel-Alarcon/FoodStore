/**
 * ============================================
 * Producto-Ingrediente Actions (pivot N:M)
 * ============================================
 */

import { get, post, patch, remove } from '@/services/apiService'
import type {
  ProductoIngredienteListResponse,
  ProductoIngredienteCreate,
  ProductoIngredienteUpdate,
  ProductoIngredienteRelacion,
} from '@/types'

export const getIngredientesDeProducto = (productoId: number) =>
  get<ProductoIngredienteListResponse>(`/producto-ingredientes/producto/${productoId}`)

export const vincularIngredienteAProducto = (data: ProductoIngredienteCreate) =>
  post<ProductoIngredienteCreate, ProductoIngredienteRelacion>('/producto-ingredientes/', data)

export const actualizarVinculoIngrediente = (
  productoId: number,
  ingredienteId: number,
  data: ProductoIngredienteUpdate,
) =>
  patch<ProductoIngredienteUpdate, ProductoIngredienteRelacion>(
    `/producto-ingredientes/producto/${productoId}/ingrediente/${ingredienteId}`,
    data,
  )

export const desvincularIngredienteDeProducto = (productoId: number, ingredienteId: number) =>
  remove(`/producto-ingredientes/producto/${productoId}/ingrediente/${ingredienteId}`)
