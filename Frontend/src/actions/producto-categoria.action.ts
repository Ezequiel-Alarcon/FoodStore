/**
 * ============================================
 * Producto-Categoría Actions (pivot N:M)
 * ============================================
 */

import { get, post, patch, remove } from '@/services/apiService'
import type {
  ProductoCategoriaListResponse,
  ProductoCategoriaCreate,
  ProductoCategoriaUpdate,
  ProductoCategoriaRelacion,
} from '@/types'

export const getCategoriasDeProducto = (productoId: number) =>
  get<ProductoCategoriaListResponse>(`/producto-categorias/producto/${productoId}`)

export const vincularCategoriaAProducto = (data: ProductoCategoriaCreate) =>
  post<ProductoCategoriaCreate, ProductoCategoriaRelacion>('/producto-categorias/', data)

export const actualizarVinculoCategoria = (
  productoId: number,
  categoriaId: number,
  data: ProductoCategoriaUpdate,
) =>
  patch<ProductoCategoriaUpdate, ProductoCategoriaRelacion>(
    `/producto-categorias/producto/${productoId}/categoria/${categoriaId}`,
    data,
  )

export const desvincularCategoriaDeProducto = (productoId: number, categoriaId: number) =>
  remove(`/producto-categorias/producto/${productoId}/categoria/${categoriaId}`)
