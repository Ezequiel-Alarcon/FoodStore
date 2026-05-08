import { Link } from 'react-router-dom';

const HomeDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Banner Principal */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-2xl p-8 md:p-12 text-white shadow-xl">
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">FoodStore Admin</h1>
        <p className="text-blue-100 text-lg md:text-xl max-w-2xl leading-relaxed">
          Panel de control centralizado. Desde aquí podés gestionar el catálogo de productos, 
          organizar las categorías y mantener un control estricto sobre los alérgenos de cada ingrediente.
        </p>
      </div>

      {/* Tarjetas de Acceso Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/productos" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 group transform hover:-translate-y-1">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 text-2xl rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-inner">
            🍔
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Productos</h2>
          <p className="text-slate-500 text-sm leading-relaxed">Gestioná el catálogo completo, modificá precios, controlá el stock y la visibilidad de los platos.</p>
        </Link>

        <Link to="/categorias" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 group transform hover:-translate-y-1">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 text-2xl rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-inner">
            📁
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Categorías</h2>
          <p className="text-slate-500 text-sm leading-relaxed">Organizá tu menú creando jerarquías claras con categorías principales y subcategorías.</p>
        </Link>

        <Link to="/ingredientes" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 group transform hover:-translate-y-1">
          <div className="w-14 h-14 bg-amber-100 text-amber-600 text-2xl rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-inner">
            🍅
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Ingredientes</h2>
          <p className="text-slate-500 text-sm leading-relaxed">Administrá la materia prima y marcá con precisión los alérgenos críticos para la seguridad del cliente.</p>
        </Link>
      </div>
    </div>
  );
};

export default HomeDashboard;
