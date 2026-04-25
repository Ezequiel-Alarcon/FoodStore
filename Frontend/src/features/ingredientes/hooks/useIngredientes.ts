/**
 * ============================================
 * useIngredientes Hook
 * ============================================
 * Custom hook para gestión de ingredientes.
 * SRP: lógica de estado del servidor (queries + mutations).
 * La lógica de API vive en actions/ingrediente.action.ts
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getIngredientes,
  getIngredientesAlergenos,
  getIngrediente,
  crearIngrediente,
  actualizarIngrediente,
  eliminarIngrediente,
} from '@/actions/ingrediente.action'
import type {
  IngredienteListParams,
  IngredienteUpdate,
} from '@/types'

export const ingredienteKeys = {
  all: ['ingredientes'] as const,
  lists: () => [...ingredienteKeys.all, 'list'] as const,
  list: (params: IngredienteListParams) => [...ingredienteKeys.lists(), params] as const,
  details: () => [...ingredienteKeys.all, 'detail'] as const,
  detail: (id: number) => [...ingredienteKeys.details(), id] as const,
}

export function useIngredientes(params: IngredienteListParams) {
  return useQuery({
    queryKey: ingredienteKeys.list(params),
    queryFn: () => getIngredientes(params),
  })
}

export function useIngredientesAlergenos(params: IngredienteListParams) {
  return useQuery({
    queryKey: [...ingredienteKeys.list(params), 'alergenos'] as const,
    queryFn: () => getIngredientesAlergenos(params),
  })
}

export function useIngrediente(id: number) {
  return useQuery({
    queryKey: ingredienteKeys.detail(id),
    queryFn: () => getIngrediente(id),
    enabled: !!id,
  })
}

export function useCreateIngrediente() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: crearIngrediente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ingredienteKeys.lists() })
    },
  })
}

export function useUpdateIngrediente() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IngredienteUpdate> }) =>
      actualizarIngrediente(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ingredienteKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ingredienteKeys.detail(variables.id) })
    },
  })
}

export function useDeleteIngrediente() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: eliminarIngrediente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ingredienteKeys.lists() })
    },
  })
}
