/**
 * ============================================
 * ProductosPage Component
 * ============================================
 * Página de gestión de productos con modales.
 * Conecta el CRUD de productos con las vinculaciones N:M
 * de categorías e ingredientes via tablas pivot.
 */

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ProductoList } from './components/ProductoList'
import {
  ProductoForm,
  type ProductoFormSubmitData,
} from './components/ProductoForm'
import {
  useProductos,
  useCreateProducto,
  useUpdateProducto,
  useDeleteProducto,
} from './hooks/useProductos'
import {
  useProductoCategorias,
  useProductoIngredientes,
  useCreateProductoLinks,
  useSyncProductoCategorias,
  useSyncProductoIngredientes,
} from './hooks/useProductoLinks'
import { useCategoriaTree } from '@/features/categorias/hooks/useCategorias'
import { useIngredientes } from '@/features/ingredientes/hooks/useIngredientes'
import type { Producto, ProductoCreate, ProductoUpdate, CategoriaTreeNode } from '@/types'
import { useUiStore } from '@/store/ui-context'
import type { ProductoCategoriaLinkInput, ProductoIngredienteLinkInput } from './components/ProductoForm'
import { toast } from '@/store/toast-store'
import { ApiError } from '@/services/apiService'

/**
 * Página principal de productos
 */
export function ProductosPage() {
  const { productosQuery, setProductosQuery } = useUiStore()
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const pagination = useMemo(
    () => ({ offset: productosQuery.offset, limit: productosQuery.limit }),
    [productosQuery.offset, productosQuery.limit]
  )

  // ── Queries principales ─────────────────────────────────────────
  const { data, isLoading } = useProductos(pagination)

  // Listas completas de categorías e ingredientes para el formulario
  const { data: categoriasTreeData } = useCategoriaTree()
  const { data: ingredientesData } = useIngredientes({ offset: 0, limit: 100 })

  // Vinculaciones del producto seleccionado (solo cuando se edita)
  const { data: currentCatLinks } = useProductoCategorias(selectedProducto?.id ?? null)
  const { data: currentIngLinks } = useProductoIngredientes(selectedProducto?.id ?? null)

  // Aplanar el árbol de categorías para obtener solo las activas y visibles
  const categoriasDisponibles = useMemo(() => {
    const flatten = (nodes: CategoriaTreeNode[]): { id: number; nombre: string }[] =>
      nodes.flatMap((n) => [
        { id: n.id, nombre: n.nombre },
        ...flatten(n.subcategorias ?? []),
      ])
    return flatten(categoriasTreeData?.data ?? [])
  }, [categoriasTreeData])

  const ingredientesDisponibles = useMemo(
    () => ingredientesData?.data ?? [],
    [ingredientesData]
  )

  // Filtrar categorías/ingredientes borrados de los productos para la tabla
  const filteredProductos = useMemo(() => {
    const productos = data?.data || []
    const activeCatIds = new Set(categoriasDisponibles.map((c) => c.id))
    const activeIngIds = new Set(ingredientesDisponibles.map((i) => i.id))

    return productos.map((p) => ({
      ...p,
      categorias: (p.categorias ?? []).filter((c) => activeCatIds.has(c.id)),
      ingredientes: (p.ingredientes ?? []).filter((i) => activeIngIds.has(i.id)),
    }))
  }, [data, categoriasDisponibles, ingredientesDisponibles])

  // Links iniciales para el form de edición
  const initialCategoriaLinks = useMemo<ProductoCategoriaLinkInput[]>(() => {
    if (!currentCatLinks?.data) return []
    return currentCatLinks.data.map((link) => ({
      categoria_id: link.categoria_id,
      es_principal: link.es_principal,
    }))
  }, [currentCatLinks])

  const initialIngredienteLinks = useMemo<ProductoIngredienteLinkInput[]>(() => {
    if (!currentIngLinks?.data) return []
    return currentIngLinks.data.map((link) => ({
      ingrediente_id: link.ingrediente_id,
      es_removible: link.es_removible,
    }))
  }, [currentIngLinks])

  useEffect(() => {
    if (!data) return

    if (pagination.offset >= data.total && data.total > 0) {
      setProductosQuery((prev) => ({
        ...prev,
        offset: Math.max(0, data.total - prev.limit),
      }))
    }
  }, [data, pagination.offset, setProductosQuery])

  // ── Mutations ───────────────────────────────────────────────────
  const createMutation = useCreateProducto()
  const updateMutation = useUpdateProducto()
  const deleteMutation = useDeleteProducto()
  const createLinksMutation = useCreateProductoLinks()
  const syncCategoriasMutation = useSyncProductoCategorias()
  const syncIngredientesMutation = useSyncProductoIngredientes()

  // Estado de carga combinado para el form
  const isCreating =
    createMutation.isPending || createLinksMutation.isPending
  const isUpdating =
    updateMutation.isPending ||
    syncCategoriasMutation.isPending ||
    syncIngredientesMutation.isPending

  // ── Handlers de paginación ──────────────────────────────────────
  const handleNextPage = () => {
    setProductosQuery((prev) => ({ ...prev, offset: prev.offset + prev.limit }))
  }

  const handlePrevPage = () => {
    setProductosQuery((prev) => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }))
  }

  const handleSearchChange = (search: string) => {
    setProductosQuery((prev) => ({ ...prev, search, offset: 0 }))
  }

  const handleLimitChange = (limit: number) => {
    setProductosQuery((prev) => ({ ...prev, limit, offset: 0 }))
  }

  // ── Handlers de CRUD ────────────────────────────────────────────
  const handleEdit = (producto: Producto) => {
    setSelectedProducto(producto)
    setIsEditModalOpen(true)
  }

  const handleDelete = (producto: Producto) => {
    setSelectedProducto(producto)
    setIsDeleteModalOpen(true)
  }

  /**
   * Crear producto + vinculaciones en un solo flujo:
   * 1. Crear el producto → obtenemos el ID
   * 2. Con ese ID, crear todas las vinculaciones N:M
   */
  const handleCreateSubmit = async (formData: ProductoFormSubmitData) => {
    try {
      // 1. Crear el producto
      const nuevoProducto = await createMutation.mutateAsync(
        formData.producto as ProductoCreate
      )

      // 2. Crear vinculaciones con el ID del nuevo producto
      if (formData.categorias.length > 0 || formData.ingredientes.length > 0) {
        await createLinksMutation.mutateAsync({
          productoId: nuevoProducto.id,
          categorias: formData.categorias.map((c) => ({
            producto_id: nuevoProducto.id,
            categoria_id: c.categoria_id,
            es_principal: c.es_principal,
          })),
          ingredientes: formData.ingredientes.map((i) => ({
            producto_id: nuevoProducto.id,
            ingrediente_id: i.ingrediente_id,
            es_removible: i.es_removible,
          })),
        })
      }

      setIsCreateModalOpen(false)
      toast.success('Producto creado exitosamente')
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.detail)
      } else {
        toast.error('Error inesperado al crear el producto')
      }
    }
  }

  /**
   * Actualizar producto + sincronizar vinculaciones:
   * 1. Actualizar datos del producto
   * 2. Sincronizar categorías (borrar viejas, crear nuevas, actualizar flags)
   * 3. Sincronizar ingredientes (ídem)
   */
  const handleUpdateSubmit = async (formData: ProductoFormSubmitData) => {
    if (!selectedProducto) return

    const productoId = selectedProducto.id

    try {
      // 1. Actualizar producto
      await updateMutation.mutateAsync({
        id: productoId,
        data: formData.producto as Partial<ProductoUpdate>,
      })

      // 2. Sincronizar categorías
      const currentCatIds = (currentCatLinks?.data ?? []).map((l) => l.categoria_id)
      await syncCategoriasMutation.mutateAsync({
        productoId,
        currentCategoriaIds: currentCatIds,
        desired: formData.categorias.map((c) => ({
          producto_id: productoId,
          categoria_id: c.categoria_id,
          es_principal: c.es_principal,
        })),
      })

      // 3. Sincronizar ingredientes
      const currentIngIds = (currentIngLinks?.data ?? []).map((l) => l.ingrediente_id)
      await syncIngredientesMutation.mutateAsync({
        productoId,
        currentIngredienteIds: currentIngIds,
        desired: formData.ingredientes.map((i) => ({
          producto_id: productoId,
          ingrediente_id: i.ingrediente_id,
          es_removible: i.es_removible,
        })),
      })

      setIsEditModalOpen(false)
      setSelectedProducto(null)
      toast.success('Producto actualizado exitosamente')
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.detail)
      } else {
        toast.error('Error inesperado al actualizar el producto')
      }
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedProducto) return
    try {
      await deleteMutation.mutateAsync(selectedProducto.id)
      setIsDeleteModalOpen(false)
      setSelectedProducto(null)
      toast.success('Producto eliminado exitosamente')
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.detail)
      } else {
        toast.error('Error inesperado al eliminar el producto')
      }
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900" style={{ letterSpacing: '-0.02em' }}>
            Productos
          </h2>
          <p className="text-base text-slate-500 mt-1">Gestiona el catálogo de productos e inventario.</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md shadow-orange-600/20"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 600" }}>add</span>
          Nuevo Producto
        </button>
      </div>

      {/* Table */}
      <ProductoList
        productos={filteredProductos}
        total={data?.total || 0}
        offset={pagination.offset}
        limit={pagination.limit}
        search={productosQuery.search}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        onSearchChange={handleSearchChange}
        onLimitChange={handleLimitChange}
      />

      {/* Create Modal */}
      <Modal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nuevo Producto"
        size="lg"
      >
        <ProductoForm
          categoriasDisponibles={categoriasDisponibles}
          ingredientesDisponibles={ingredientesDisponibles}
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={isCreating}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedProducto(null)
        }}
        title="Editar Producto"
        size="lg"
      >
        <ProductoForm
          producto={selectedProducto}
          categoriasDisponibles={categoriasDisponibles}
          ingredientesDisponibles={ingredientesDisponibles}
          initialCategoriaLinks={initialCategoriaLinks}
          initialIngredienteLinks={initialIngredienteLinks}
          onSubmit={handleUpdateSubmit}
          onCancel={() => {
            setIsEditModalOpen(false)
            setSelectedProducto(null)
          }}
          isLoading={isUpdating}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedProducto(null)
        }}
        title="Confirmar Eliminación"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-700">
            ¿Estás seguro de que deseas eliminar el producto{' '}
            <strong className="text-slate-900">{selectedProducto?.nombre}</strong>?
          </p>
          <p className="text-sm text-slate-500">
            Esta acción no se puede deshacer.
          </p>
          <div className="pt-2 flex flex-col gap-3">
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              loading={deleteMutation.isPending}
              fullWidth
            >
              Eliminar Producto
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false)
                setSelectedProducto(null)
              }}
              fullWidth
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}