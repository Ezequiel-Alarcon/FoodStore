/**
 * ============================================
 * useCategorias Hook
 * ============================================
 * Custom hook para gestión de categorías.
 * SRP: lógica de estado del servidor (queries + mutations).
 * La lógica de API vive en actions/categoria.action.ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCategorias,
  getCategoriaTree,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from '@/actions/categoria.action'
import type { CategoriaUpdate } from '@/types'

/**
 * Query keys
 */
export const categoriaKeys = {
  all: ['categorias'] as const,
  lists: () => [...categoriaKeys.all, 'list'] as const,
  list: () => [...categoriaKeys.lists()] as const,
  tree: () => [...categoriaKeys.all, 'tree'] as const,
  details: () => [...categoriaKeys.all, 'detail'] as const,
  detail: (id: number) => [...categoriaKeys.details(), id] as const,
}

/**
 * Hook para listar categorías
 */
export function useCategorias() {
  return useQuery({
    queryKey: categoriaKeys.list(),
    queryFn: getCategorias,
  })
}

/**
 * Hook para obtener árbol de categorías
 */
export function useCategoriaTree() {
  return useQuery({
    queryKey: categoriaKeys.tree(),
    queryFn: getCategoriaTree,
  })
}

/**
 * Hook para crear categoría
 */
export function useCreateCategoria() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: crearCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriaKeys.lists() })
      queryClient.invalidateQueries({ queryKey: categoriaKeys.tree() })
    },
  })
}

/**
 * Hook para actualizar categoría
 */
export function useUpdateCategoria() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CategoriaUpdate> }) =>
      actualizarCategoria(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoriaKeys.lists() })
      queryClient.invalidateQueries({ queryKey: categoriaKeys.tree() })
      queryClient.invalidateQueries({ queryKey: categoriaKeys.detail(variables.id) })
    },
  })
}

/**
 * Hook para eliminar categoría
 */
export function useDeleteCategoria() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: eliminarCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriaKeys.lists() })
      queryClient.invalidateQueries({ queryKey: categoriaKeys.tree() })
    },
  })
}