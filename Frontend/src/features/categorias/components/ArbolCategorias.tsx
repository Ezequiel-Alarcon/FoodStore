/**
 * ============================================
 * ArbolCategorias — Stitch Design
 * ============================================
 * Componente de árbol para categorías jerárquicas
 */

import { type FC } from 'react'
import { cn } from '@/lib/utils'
import type { CategoriaTreeNode } from '@/types'

interface ArbolCategoriasProps {
  categorias: CategoriaTreeNode[]
  level?: number
  disabledIds?: Set<number>
  disableActionsForDisabled?: boolean
  onEdit: (categoria: CategoriaTreeNode) => void
  onDelete: (categoria: CategoriaTreeNode) => void
}

export const ArbolCategorias: FC<ArbolCategoriasProps> = ({
  categorias,
  level = 0,
  disabledIds,
  disableActionsForDisabled = true,
  onEdit,
  onDelete,
}) => {
  if (categorias.length === 0) {
    return <p className="py-8 text-center text-slate-400 italic">No hay categorías</p>
  }

  return (
    <ul className={cn('space-y-1', level > 0 && 'ml-6 border-l border-slate-200 pl-3')}>
      {categorias.map((categoria) => (
        <CategoriaNode
          key={categoria.id}
          categoria={categoria}
          disabledIds={disabledIds}
          disableActionsForDisabled={disableActionsForDisabled}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

interface CategoriaNodeProps {
  categoria: CategoriaTreeNode
  level?: number
  disabledIds?: Set<number>
  disableActionsForDisabled?: boolean
  onEdit: (categoria: CategoriaTreeNode) => void
  onDelete: (categoria: CategoriaTreeNode) => void
}

const CategoriaNode: FC<CategoriaNodeProps> = ({
  categoria,
  level = 0,
  disabledIds,
  disableActionsForDisabled = true,
  onEdit,
  onDelete,
}) => {
  const hasChildren = categoria.subcategorias && categoria.subcategorias.length > 0
  const isDisabled = !!disabledIds?.has(categoria.id)

  return (
    <li>
      <div
        className={cn(
          'flex items-center justify-between rounded-lg px-4 py-3 hover:bg-slate-50 transition-colors group',
          isDisabled && 'opacity-50',
          level > 0 && 'ml-2'
        )}
      >
        <div className="flex items-center gap-3">
          <span className={cn('material-symbols-outlined text-slate-400', hasChildren && 'text-orange-500')}>
            {hasChildren ? 'folder' : 'folder_open'}
          </span>
          <span className={cn('text-sm font-semibold text-slate-800', isDisabled && 'line-through')}>
            {categoria.nombre}
          </span>
          {categoria.descripcion && (
            <span className="text-xs text-slate-400 hidden md:inline">— {categoria.descripcion}</span>
          )}
          {isDisabled ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
              Desactivada
            </span>
          ) : null}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            disabled={isDisabled && disableActionsForDisabled}
            onClick={() => onEdit(categoria)}
            className="p-2 text-slate-400 hover:text-orange-600 transition-colors disabled:opacity-30"
          >
            <span className="material-symbols-outlined text-xl">edit</span>
          </button>
          <button
            disabled={isDisabled && disableActionsForDisabled}
            onClick={() => onDelete(categoria)}
            className="p-2 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-30"
          >
            <span className="material-symbols-outlined text-xl">delete</span>
          </button>
        </div>
      </div>

      {hasChildren && (
        <ul className="ml-6 border-l border-slate-200 pl-3">
          {categoria.subcategorias!.map((sub) => (
            <CategoriaNode
              key={sub.id}
              categoria={sub}
              level={level + 1}
              disabledIds={disabledIds}
              disableActionsForDisabled={disableActionsForDisabled}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </li>
  )
}