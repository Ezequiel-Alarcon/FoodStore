/**
 * ============================================
 * Tipos TypeScript - FoodStore Frontend
 * ============================================
 * Modela los schemas del backend de FastAPI
 */

/**
 * --------------------------------------
 * CATEGORÍAS
 * --------------------------------------
 */
export interface Categoria {
  id: number
  parent_id: number | null
  nombre: string
  descripcion: string | null
  imagen_url: string
}

export interface CategoriaBasicRead {
  id: number
  nombre: string
  es_principal: boolean
}

export interface CategoriaTreeNode {
  id: number
  parent_id: number | null
  nombre: string
  descripcion: string | null
  imagen_url: string
  subcategorias: CategoriaTreeNode[]
}

/**
 * --------------------------------------
 * INGREDIENTES
 * --------------------------------------
 */
export interface Ingrediente {
  id: number
  nombre: string
  es_alergeno: boolean
  descripcion: string | null
  productos?: Array<{
    id: number
    nombre: string
  }>
}

export interface IngredienteBasicRead {
  id: number
  nombre: string
  es_alergeno: boolean
}

export interface ProductoIngredienteRelacion {
  producto_id: number
  producto_nombre: string
  ingrediente_id: number
  ingrediente_nombre: string
  es_removible: boolean
  created_at: string
}

export interface ProductoIngredienteListResponse {
  data: ProductoIngredienteRelacion[]
  total: number
}

export interface ProductoCategoriaRelacion {
  producto_id: number
  producto_nombre: string
  categoria_id: number
  categoria_nombre: string
  es_principal: boolean
  created_at: string
}

export interface ProductoCategoriaListResponse {
  data: ProductoCategoriaRelacion[]
  total: number
}

export interface ProductoCategoriaCreate {
  producto_id: number
  categoria_id: number
  es_principal?: boolean
}

export interface ProductoCategoriaUpdate {
  es_principal: boolean
}

export interface ProductoIngredienteCreate {
  producto_id: number
  ingrediente_id: number
  es_removible?: boolean
}

export interface ProductoIngredienteUpdate {
  es_removible: boolean
}

/**
 * --------------------------------------
 * PRODUCTOS
 * --------------------------------------
 */
export interface Producto {
  id: number
  nombre: string
  descripcion: string | null
  precio_base: number
  imagenes_url: string[] | null
  stock_cantidad: number
  disponible: boolean
  categorias: CategoriaBasicRead[]
  ingredientes: IngredienteBasicRead[]
}

export interface ProductoListResponse {
  data: Producto[]
  total: number
}

export interface IngredienteListResponse {
  data: Ingrediente[]
  total: number
}

/**
 * --------------------------------------
 * FORMULARIOS - Create/Update
 * --------------------------------------
 */
export interface ProductoCreate {
  nombre: string
  descripcion?: string
  precio_base: number
  imagenes_url?: string[]
  stock_cantidad: number
  disponible?: boolean
}

export interface ProductoUpdate {
  nombre?: string
  descripcion?: string
  precio_base?: number
  imagenes_url?: string[]
  stock_cantidad?: number
  disponible?: boolean
}

export interface IngredienteCreate {
  nombre: string
  descripcion?: string
  es_alergeno?: boolean
}

export interface IngredienteUpdate {
  nombre?: string
  descripcion?: string
  es_alergeno?: boolean
}

export interface CategoriaCreate {
  parent_id?: number | null
  nombre: string
  descripcion?: string
  imagen_url: string
}

export interface CategoriaUpdate {
  parent_id?: number | null
  nombre?: string
  descripcion?: string
  imagen_url?: string
}

/**
 * --------------------------------------
 * PAGINADO
 * --------------------------------------
 */
export type PaginationParams = {
  offset: number
  limit: number
}

export type ProductoListParams = PaginationParams & {
  include_only_active?: boolean
}

export type IngredienteListParams = PaginationParams