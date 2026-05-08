import { Route, Routes } from 'react-router-dom'
import Categoria from '../features/categorias/components/Categoria'
import Productos from '../features/productos/components/Productos'
import DetailProducto from '../features/productos/components/DetailProducto'
import Ingredientes from '../features/ingredientes/components/Ingredientes'
import { HomeLayout } from '../shared/layout/Home'
import HomeDashboard from './HomeDashboard'

const AppRouter = () => {
    return (
        <Routes>
            {/* Ruta principal */}
            <Route path="/" element={<HomeLayout />}>
                {/* Dashboard (Ruta por defecto) */}
                <Route index element={<HomeDashboard />} />
                
                {/* Rutas de productos */}
                <Route path="productos" element={<Productos />} />
                <Route path="productos/:id" element={<DetailProducto />} />

                {/* Rutas de categorias */}
                <Route path="categorias" element={<Categoria />} />

                {/* Rutas de ingredientes */}
                <Route path="ingredientes" element={<Ingredientes />} />
            </Route>
        </Routes>
    )
}

export default AppRouter