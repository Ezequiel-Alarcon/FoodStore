/**
 * ============================================
 * IngredienteList — Stitch Design
 * ============================================
 */

import { type FC, useMemo, useState } from 'react'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/Button'
import type { Ingrediente } from '@/types'

interface IngredienteListProps {
  ingredientes: Ingrediente[]
  total: number
  offset: number
  limit: number
  search: string
  isLoading: boolean
  onEdit: (ingrediente: Ingrediente) => void
  onDelete: (ingrediente: Ingrediente) => void
  onNextPage: () => void
  onPrevPage: () => void
  onSearchChange: (value: string) => void
  onLimitChange: (value: number) => void
}

export const IngredienteList: FC<IngredienteListProps> = ({
  ingredientes, total, offset, limit, search, isLoading,
  onEdit, onDelete, onNextPage, onPrevPage, onSearchChange, onLimitChange,
}) => {
  const [sorting, setSorting] = useState<SortingState>([])

  const filteredData = useMemo(() => {
    const s = search.trim().toLowerCase()
    if (!s) return ingredientes
    return ingredientes.filter((i) =>
      i.nombre.toLowerCase().includes(s) || (i.descripcion ?? '').toLowerCase().includes(s)
    )
  }, [ingredientes, search])

  const columns = useMemo<ColumnDef<Ingrediente>[]>(() => [
    {
      accessorKey: 'nombre',
      header: 'Ingrediente',
      cell: ({ row }) => (
        <div>
          <p className="font-bold text-slate-900">{row.original.nombre}</p>
          {row.original.descripcion && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{row.original.descripcion}</p>}
        </div>
      ),
    },
    {
      accessorKey: 'es_alergeno',
      header: 'Tipo',
      cell: ({ row }) => row.original.es_alergeno ? (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-100">
          <span className="material-symbols-outlined text-sm leading-none">warning</span>Alérgeno
        </span>
      ) : (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">Común</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(row.original)} className="p-2 text-slate-400 hover:text-orange-600 transition-colors">
            <span className="material-symbols-outlined">edit</span>
          </button>
          <button onClick={() => onDelete(row.original)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
      ),
    },
  ], [onDelete, onEdit])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredData, columns, state: { sorting }, onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(),
  })

  const hasNext = offset + limit < total
  const hasPrev = offset > 0
  const start = total === 0 ? 0 : offset + 1
  const end = total === 0 ? 0 : Math.min(offset + limit, total)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Buscar ingredientes..."
            className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="font-medium">Filas</span>
          <select value={limit} onChange={(e) => onLimitChange(Number(e.target.value))} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm">
            <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="bg-slate-50 border-b border-slate-200">
                {hg.headers.map((h) => (
                  <th key={h.id} className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">Cargando...</td></tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">No hay ingredientes</td></tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">Mostrando {start} - {end} de {total}</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onPrevPage} disabled={!hasPrev}>Anterior</Button>
          <Button variant="outline" size="sm" onClick={onNextPage} disabled={!hasNext}>Siguiente</Button>
        </div>
      </div>
    </div>
  )
}
