/**
 * ============================================
 * CategoriasPage — Stitch Design
 * ============================================
 */

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ArbolCategorias } from './components/ArbolCategorias'
import { CategoriaForm } from './components/CategoriaForm'
import {
  useCategoriaTree,
  useCreateCategoria,
  useUpdateCategoria,
  useDeleteCategoria,
} from './hooks/useCategorias'
import type { CategoriaCreate, CategoriaUpdate, CategoriaTreeNode } from '@/types'
import { toast } from '@/store/toast-store'
import { ApiError } from '@/services/apiService'

export function CategoriasPage() {
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaTreeNode | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const { data, isLoading } = useCategoriaTree()
  const createMutation = useCreateCategoria()
  const updateMutation = useUpdateCategoria()
  const deleteMutation = useDeleteCategoria()

  const handleEdit = (categoria: CategoriaTreeNode) => {
    setSelectedCategoria(categoria)
    setIsEditModalOpen(true)
  }

  const handleDelete = (categoria: CategoriaTreeNode) => {
    setSelectedCategoria(categoria)
    setIsDeleteModalOpen(true)
  }

  const handleCreateSubmit = async (data: CategoriaCreate | CategoriaUpdate) => {
    try {
      await createMutation.mutateAsync(data as CategoriaCreate)
      setIsCreateModalOpen(false)
      toast.success('Categoría creada exitosamente')
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.detail)
      } else {
        toast.error('Error inesperado al crear la categoría')
      }
    }
  }

  const handleUpdateSubmit = async (data: CategoriaCreate | CategoriaUpdate) => {
    if (!selectedCategoria) return
    try {
      await updateMutation.mutateAsync({ id: selectedCategoria.id, data: data as Partial<CategoriaUpdate> })
      setIsEditModalOpen(false)
      setSelectedCategoria(null)
      toast.success('Categoría actualizada exitosamente')
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.detail)
      } else {
        toast.error('Error inesperado al actualizar la categoría')
      }
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedCategoria) return
    try {
      await deleteMutation.mutateAsync(selectedCategoria.id)
      setIsDeleteModalOpen(false)
      setSelectedCategoria(null)
      toast.success('Categoría eliminada exitosamente')
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.detail)
      } else {
        toast.error('Error inesperado al eliminar la categoría')
      }
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900" style={{ letterSpacing: '-0.02em' }}>
            Categorías
          </h2>
          <p className="text-base text-slate-500 mt-1">Gestiona la jerarquía de categorías del catálogo.</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md shadow-orange-600/20"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 600" }}>add</span>
          Nueva Categoría
        </button>
      </div>

      {/* Tree Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Árbol de categorías</p>
        </div>
        <div className="p-4">
          {isLoading ? (
            <p className="py-8 text-center text-slate-500">Cargando...</p>
          ) : (
            <ArbolCategorias
              categorias={data?.data || []}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Create Modal */}
      <Modal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Nueva Categoría" size="md">
        <CategoriaForm
          categorias={data?.data || []}
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedCategoria(null) }}
        title="Editar Categoría"
        size="md"
      >
        <CategoriaForm
          categoria={selectedCategoria || null}
          categorias={data?.data || []}
          onSubmit={handleUpdateSubmit}
          onCancel={() => { setIsEditModalOpen(false); setSelectedCategoria(null) }}
          isLoading={updateMutation.isPending}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setSelectedCategoria(null) }}
        title="Confirmar Eliminación"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-700">
            ¿Estás seguro de que deseas eliminar la categoría{' '}
            <strong className="text-slate-900">{selectedCategoria?.nombre}</strong>?
          </p>
          {selectedCategoria?.subcategorias && selectedCategoria.subcategorias.length > 0 && (
            <div className="flex items-start gap-3 p-3 rounded-lg border border-amber-200 bg-amber-50">
              <span className="material-symbols-outlined text-amber-500 text-lg mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                warning
              </span>
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Esta categoría tiene {selectedCategoria.subcategorias.length} subcategoría{selectedCategoria.subcategorias.length > 1 ? 's' : ''}</p>
                <p className="mt-1 text-amber-700">
                  Las subcategorías serán reasignadas automáticamente al nivel superior.
                </p>
              </div>
            </div>
          )}
          <p className="text-sm text-slate-500">Esta acción no se puede deshacer.</p>
          <div className="pt-2 flex flex-col gap-3">
            <Button variant="destructive" onClick={handleConfirmDelete} loading={deleteMutation.isPending} fullWidth>
              Eliminar Categoría
            </Button>
            <Button variant="outline" onClick={() => { setIsDeleteModalOpen(false); setSelectedCategoria(null) }} fullWidth>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}