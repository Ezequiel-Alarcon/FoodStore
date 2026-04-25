/**
 * ============================================
 * ProductoDetallePage — Ruta Dinámica
 * ============================================
 * Página de detalle de un producto individual.
 * Usa useParams() para extraer el ID de la URL
 * y useProducto(id) para traer los datos del servidor.
 */

import { Link, useParams, useNavigate } from 'react-router-dom'
import { useProducto } from './hooks/useProductos'
import { Button } from '@/components/ui/Button'

export function ProductoDetallePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const productoId = Number(id)

  const { data: producto, isLoading, isError } = useProducto(productoId)

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent" />
          <p className="text-sm text-slate-500 font-medium">Cargando producto...</p>
        </div>
      </div>
    )
  }

  if (isError || !producto) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center space-y-4">
          <span className="material-symbols-outlined text-4xl text-red-400">error</span>
          <p className="text-slate-700 font-medium">No se pudo encontrar el producto</p>
          <p className="text-sm text-slate-500">El producto con ID <strong>{id}</strong> no existe o fue eliminado.</p>
          <Button variant="outline" onClick={() => navigate('/productos')}>
            Volver a Productos
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/productos" className="hover:text-orange-600 transition-colors">
          Productos
        </Link>
        <span className="material-symbols-outlined text-base">chevron_right</span>
        <span className="text-slate-900 font-medium">{producto.nombre}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2
            className="text-3xl font-bold tracking-tight text-slate-900"
            style={{ letterSpacing: '-0.02em' }}
          >
            {producto.nombre}
          </h2>
          {producto.descripcion && (
            <p className="text-base text-slate-500 mt-1">{producto.descripcion}</p>
          )}
        </div>
        <Button variant="outline" onClick={() => navigate('/productos')}>
          <span className="material-symbols-outlined mr-2 text-base">arrow_back</span>
          Volver
        </Button>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Precio */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Precio</p>
          <p className="text-2xl font-bold text-slate-900">${producto.precio_base.toFixed(2)}</p>
        </div>

        {/* Stock */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Stock</p>
          <p className="text-2xl font-bold text-slate-900">{producto.stock_cantidad}</p>
        </div>

        {/* Estado */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Estado</p>
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
              producto.disponible
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            <span
              className="material-symbols-outlined text-base mr-1.5"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {producto.disponible ? 'check_circle' : 'cancel'}
            </span>
            {producto.disponible ? 'Disponible' : 'No disponible'}
          </span>
        </div>
      </div>

      {/* Relaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categorías */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Categorías ({producto.categorias?.length ?? 0})
            </p>
          </div>
          <div className="p-5">
            {(producto.categorias ?? []).length === 0 ? (
              <p className="text-sm text-slate-400 italic">Sin categorías asignadas</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {producto.categorias.map((cat) => (
                  <span
                    key={cat.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
                      cat.es_principal
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}
                  >
                    {cat.es_principal && (
                      <span
                        className="material-symbols-outlined text-sm leading-none"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    )}
                    {cat.nombre}
                    {cat.es_principal && (
                      <span className="text-xs opacity-70">(Principal)</span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ingredientes */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Ingredientes ({producto.ingredientes?.length ?? 0})
            </p>
          </div>
          <div className="p-5">
            {(producto.ingredientes ?? []).length === 0 ? (
              <p className="text-sm text-slate-400 italic">Sin ingredientes asignados</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {producto.ingredientes.map((ing) => (
                  <span
                    key={ing.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold ${
                      ing.es_alergeno
                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                        : 'bg-green-50 text-green-700 border border-green-100'
                    }`}
                  >
                    {ing.es_alergeno && (
                      <span className="material-symbols-outlined text-sm leading-none">
                        warning
                      </span>
                    )}
                    {ing.nombre}
                    {ing.es_alergeno && (
                      <span className="text-xs opacity-70">(Alérgeno)</span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
