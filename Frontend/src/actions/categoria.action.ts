/**
 * ============================================
 * Categoría Actions
 * ============================================
 * Lógica de API para categorías.
 * SRP: solo comunicación con el servidor.
 */

import { get, post, patch, remove } from '@/services/apiService'
import type {
  Categoria,
  CategoriaCreate,
  CategoriaUpdate,
  CategoriaTreeNode,
} from '@/types'

/** Respuesta paginada de categorías */
interface CategoriaListResponse {
  data: Categoria[]
  total: number
}

/** Respuesta del árbol de categorías */
interface CategoriaTreeResponse {
  data: CategoriaTreeNode[]
  total: number
}

export const getCategorias = () =>
  get<CategoriaListResponse>('/categorias/')

export const getCategoriaTree = () =>
  get<CategoriaTreeResponse>('/categorias/arbol')

export const getCategoria = (id: number) =>
  get<Categoria>(`/categorias/${id}`)

export const crearCategoria = (data: CategoriaCreate) =>
  post<CategoriaCreate, Categoria>('/categorias/', data)

export const actualizarCategoria = (id: number, data: Partial<CategoriaUpdate>) =>
  patch<Partial<CategoriaUpdate>, Categoria>(`/categorias/${id}`, data)

export const eliminarCategoria = (id: number) =>
  remove(`/categorias/${id}`)
