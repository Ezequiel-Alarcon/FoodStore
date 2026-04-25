/**
 * ============================================
 * Ingrediente Actions
 * ============================================
 * Lógica de API para ingredientes.
 * SRP: solo comunicación con el servidor.
 */

import { get, post, patch, remove } from '@/services/apiService'
import type {
  Ingrediente,
  IngredienteCreate,
  IngredienteUpdate,
  IngredienteListResponse,
  IngredienteListParams,
} from '@/types'

export const getIngredientes = (params: IngredienteListParams) =>
  get<IngredienteListResponse>('/ingredientes/', params)

export const getIngredientesAlergenos = (params: IngredienteListParams) =>
  get<IngredienteListResponse>('/ingredientes/alergenos', params)

export const getIngrediente = (id: number) =>
  get<Ingrediente>(`/ingredientes/${id}`)

export const crearIngrediente = (data: IngredienteCreate) =>
  post<IngredienteCreate, Ingrediente>('/ingredientes/', data)

export const actualizarIngrediente = (id: number, data: Partial<IngredienteUpdate>) =>
  patch<Partial<IngredienteUpdate>, Ingrediente>(`/ingredientes/${id}`, data)

export const eliminarIngrediente = (id: number) =>
  remove(`/ingredientes/${id}`)
