import { useMemo } from 'react'
import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ProductosPage } from '@/features/productos/ProductosPage'
import { ProductoDetallePage } from '@/features/productos/ProductoDetallePage'
import { CategoriasPage } from '@/features/categorias/CategoriasPage'
import { IngredientesPage } from '@/features/ingredientes/IngredientesPage'
import { ToastContainer } from '@/components/ui/ToastContainer'

/**
 * Rutas disponibles
 */
type RoutePath = '/productos' | '/categorias' | '/ingredientes'

/**
 * Configuración de navegación con Material Symbols
 */
const navItems: { to: RoutePath; label: string; icon: string }[] = [
  { to: '/productos', label: 'Productos', icon: 'inventory_2' },
  { to: '/categorias', label: 'Categorías', icon: 'category' },
  { to: '/ingredientes', label: 'Ingredientes', icon: 'egg_alt' },
]

/**
 * Componente principal App
 */
export default function App() {
  const location = useLocation()

  const currentTitle = useMemo(() => {
    const current = navItems.find((item) => location.pathname.startsWith(item.to))
    return current?.label ?? 'Productos'
  }, [location.pathname])

  return (
    <div className="flex h-screen">
      {/* Sidebar*/}
      <aside className="fixed left-0 top-0 flex flex-col z-40 h-screen w-[260px] border-r border-slate-200 bg-white text-sm font-medium">
        {/* Logo */}
        <div className="px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                restaurant_menu
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">FoodStore</h1>
              <p className="text-xs text-slate-500 font-medium">Panel de Administración</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-4 py-3 transition-all duration-200 ease-in-out',
                  isActive
                    ? 'border-l-4 border-orange-500 bg-orange-50 text-orange-600 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-orange-600 rounded-lg'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className="material-symbols-outlined mr-3"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="ml-[260px] flex-1 flex flex-col min-h-screen bg-slate-50">
        {/* Top bar */}
        <header className="sticky top-0 w-full h-16 flex items-center justify-between px-8 z-30 bg-slate-50/80 backdrop-blur-sm border-b border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{currentTitle}</h2>
          <div className="flex items-center gap-4 text-slate-500">
            <span className="material-symbols-outlined cursor-pointer hover:text-orange-600 transition-colors">notifications</span>
            <span className="material-symbols-outlined cursor-pointer hover:text-orange-600 transition-colors">settings</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/productos" replace />} />
            <Route path="/productos" element={<ProductosPage />} />
            <Route path="/productos/:id" element={<ProductoDetallePage />} />
            <Route path="/categorias" element={<CategoriasPage />} />
            <Route path="/ingredientes" element={<IngredientesPage />} />
          </Routes>
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}