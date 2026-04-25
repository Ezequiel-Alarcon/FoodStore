/**
 * ============================================
 * useProductos Hook
 * ============================================
 * Custom hook para gestión de productos con TanStack Query.
 * SRP: lógica de estado del servidor (queries + mutations).
 * La lógica de API vive en actions/producto.action.ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getProductos,
  getProductosActivos,
  getProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from '@/actions/producto.action'
import type {
  PaginationParams,
  ProductoListParams,
  ProductoUpdate,
} from '@/types'

/**
 * Query keys
 */
export const productoKeys = {
  all: ['productos'] as const,
  lists: () => [...productoKeys.all, 'list'] as const,
  list: (params: ProductoListParams) => [...productoKeys.lists(), params] as const,
  details: () => [...productoKeys.all, 'detail'] as const,
  detail: (id: number) => [...productoKeys.details(), id] as const,
}

/**
 * Hook para listar productos
 */
export function useProductos(params: ProductoListParams) {
  return useQuery({
    queryKey: productoKeys.list(params),
    queryFn: () => getProductos(params),
  })
}

/**
 * Hook para listar solo productos activos (catálogo público)
 */
export function useProductosActivos(params: PaginationParams) {
  const activeParams: ProductoListParams = {
    ...params,
    include_only_active: true,
  }

  return useQuery({
    queryKey: productoKeys.list(activeParams),
    queryFn: () => getProductosActivos(params),
  })
}

/**
 * Hook para obtener un producto por ID
 */
export function useProducto(id: number) {
  return useQuery({
    queryKey: productoKeys.detail(id),
    queryFn: () => getProducto(id),
    enabled: !!id,
  })
}

/**
 * Hook para crear producto
 */
export function useCreateProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: crearProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productoKeys.lists() })
    },
  })
}

/**
 * Hook para actualizar producto
 */
export function useUpdateProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProductoUpdate> }) =>
      actualizarProducto(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productoKeys.lists() })
      queryClient.invalidateQueries({ queryKey: productoKeys.detail(variables.id) })
    },
  })
}

/**
 * Hook para eliminar producto
 */
export function useDeleteProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: eliminarProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productoKeys.lists() })
    },
  })
}