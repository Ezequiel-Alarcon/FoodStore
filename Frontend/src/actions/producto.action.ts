/**
 * ============================================
 * Producto Actions
 * ============================================
 * Lógica de API para productos.
 * SRP: solo comunicación con el servidor.
 */

import { get, post, patch, remove } from '@/services/apiService'
import type {
  Producto,
  ProductoCreate,
  ProductoUpdate,
  ProductoListResponse,
  ProductoListParams,
  PaginationParams,
} from '@/types'

export const getProductos = (params: ProductoListParams) =>
  get<ProductoListResponse>('/productos/', params)

export const getProductosActivos = (params: PaginationParams) =>
  get<ProductoListResponse>('/productos/', {
    ...params,
    include_only_active: true,
  })

export const getProducto = (id: number) =>
  get<Producto>(`/productos/${id}`)

export const getProductosPorCategoria = (categoriaId: number, params: PaginationParams) =>
  get<ProductoListResponse>(`/productos/categoria/${categoriaId}`, params)

export const crearProducto = (data: ProductoCreate) =>
  post<ProductoCreate, Producto>('/productos/', data)

export const actualizarProducto = (id: number, data: Partial<ProductoUpdate>) =>
  patch<Partial<ProductoUpdate>, Producto>(`/productos/${id}`, data)

export const eliminarProducto = (id: number) =>
  remove(`/productos/${id}`)
