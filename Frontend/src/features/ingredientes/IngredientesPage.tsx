/**
 * ============================================
 * IngredientesPage — Stitch Design
 * ============================================
 */

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { IngredienteList } from './components/IngredienteList'
import { IngredienteForm } from './components/IngredienteForm'
import {
  useCreateIngrediente,
  useDeleteIngrediente,
  useIngredientes,
  useUpdateIngrediente,
} from './hooks/useIngredientes'
import type {
  Ingrediente,
  IngredienteCreate,
  IngredienteListParams,
  IngredienteUpdate,
} from '@/types'
import { toast } from '@/store/toast-store'
import { ApiError } from '@/services/apiService'

const defaultParams: IngredienteListParams = { offset: 0, limit: 20 }

export function IngredientesPage() {
  const [params, setParams] = useState<IngredienteListParams>(defaultParams)
  const [search, setSearch] = useState('')
  const [selectedIngrediente, setSelectedIngrediente] = useState<Ingrediente | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const queryParams = useMemo(
    () => ({ offset: params.offset, limit: params.limit }),
    [params.offset, params.limit]
  )

  const { data, isLoading } = useIngredientes(queryParams)
  const createMutation = useCreateIngrediente()
  const updateMutation = useUpdateIngrediente()
  const deleteMutation = useDeleteIngrediente()

  const handleNextPage = () => {
    setParams((prev) => ({ ...prev, offset: prev.offset + prev.limit }))
  }

  const handlePrevPage = () => {
    setParams((prev) => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }))
  }

  const handleLimitChange = (limit: number) => {
    setParams((prev) => ({ ...prev, limit, offset: 0 }))
  }

  const handleCreateSubmit = async (data: IngredienteCreate | IngredienteUpdate) => {
    try {
      await createMutation.mutateAsync(data as IngredienteCreate)
      setIsCreateModalOpen(false)
      toast.success('Ingrediente creado exitosamente')
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.detail)
      } else {
        toast.error('Error inesperado al crear el ingrediente')
      }
    }
  }

  const handleUpdateSubmit = async (data: IngredienteCreate | IngredienteUpdate) => {
    if (!selectedIngrediente) return
    try {
      await updateMutation.mutateAsync({ id: selectedIngrediente.id, data: data as Partial<IngredienteUpdate> })
      setIsEditModalOpen(false)
      setSelectedIngrediente(null)
      toast.success('Ingrediente actualizado exitosamente')
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.detail)
      } else {
        toast.error('Error inesperado al actualizar el ingrediente')
      }
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedIngrediente) return
    try {
      await deleteMutation.mutateAsync(selectedIngrediente.id)
      setIsDeleteModalOpen(false)
      setSelectedIngrediente(null)
      toast.success('Ingrediente eliminado exitosamente')
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.detail)
      } else {
        toast.error('Error inesperado al eliminar el ingrediente')
      }
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900" style={{ letterSpacing: '-0.02em' }}>
            Ingredientes
          </h2>
          <p className="text-base text-slate-500 mt-1">Gestiona ingredientes y alérgenos del catálogo.</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md shadow-orange-600/20"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 600" }}>add</span>
          Nuevo Ingrediente
        </button>
      </div>

      <IngredienteList
        ingredientes={data?.data || []}
        total={data?.total || 0}
        offset={queryParams.offset}
        limit={queryParams.limit}
        search={search}
        isLoading={isLoading}
        onEdit={(ingrediente) => { setSelectedIngrediente(ingrediente); setIsEditModalOpen(true) }}
        onDelete={(ingrediente) => { setSelectedIngrediente(ingrediente); setIsDeleteModalOpen(true) }}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        onSearchChange={setSearch}
        onLimitChange={handleLimitChange}
      />

      <Modal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Nuevo Ingrediente" size="md">
        <IngredienteForm
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>

      <Modal
        open={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedIngrediente(null) }}
        title="Editar Ingrediente"
        size="md"
      >
        <IngredienteForm
          ingrediente={selectedIngrediente}
          onSubmit={handleUpdateSubmit}
          onCancel={() => { setIsEditModalOpen(false); setSelectedIngrediente(null) }}
          isLoading={updateMutation.isPending}
        />
      </Modal>

      <Modal
        open={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setSelectedIngrediente(null) }}
        title="Confirmar Eliminación"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-700">
            ¿Estás seguro de que deseas eliminar el ingrediente{' '}
            <strong className="text-slate-900">{selectedIngrediente?.nombre}</strong>?
          </p>
          <p className="text-sm text-slate-500">Esta acción no se puede deshacer.</p>
          <div className="pt-2 flex flex-col gap-3">
            <Button variant="destructive" onClick={handleConfirmDelete} loading={deleteMutation.isPending} fullWidth>
              Eliminar Ingrediente
            </Button>
            <Button variant="outline" onClick={() => { setIsDeleteModalOpen(false); setSelectedIngrediente(null) }} fullWidth>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
