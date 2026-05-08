import { useParams, useNavigate } from 'react-router-dom';
import { useProductoById } from '../hooks/useProductos';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';

const DetailProducto = () => {
  // Acá extraemos los parámetros de la URL
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Llamamos al hook usando el ID dinámico
  const { data: producto, isLoading, isError } = useProductoById(id || "");

  if (isLoading) return <LoadingSpinner message="Cargando detalles del producto..." />;
  if (isError || !producto) return <ErrorMessage title="¡Oops!" message="No se pudo encontrar el producto solicitado." />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Botón Volver */}
      <button 
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 transition-colors"
      >
        ← Volver al listado
      </button>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row">
        {/* Lado Izquierdo: Imagen */}
        <div className="w-full md:w-2/5 bg-slate-50 flex items-center justify-center p-8 border-r border-slate-100">
          {producto.imagenes_url && producto.imagenes_url.length > 0 ? (
            <img 
              src={producto.imagenes_url[0]} 
              alt={producto.nombre} 
              className="w-full max-w-sm rounded-lg shadow-md object-cover aspect-square"
            />
          ) : (
            <div className="w-full aspect-square max-w-xs bg-slate-200 rounded-lg flex items-center justify-center text-slate-400">
              Sin imagen
            </div>
          )}
        </div>

        {/* Lado Derecho: Info */}
        <div className="p-8 w-full md:w-3/5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-black text-slate-800">{producto.nombre}</h1>
              <span className="text-2xl font-bold text-emerald-600">${producto.precio_base}</span>
            </div>
            
            <p className="text-slate-600 text-lg mb-6 leading-relaxed">
              {producto.descripcion || "Sin descripción detallada disponible."}
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Categorías */}
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Categorías</h3>
                <div className="flex flex-wrap gap-2">
                  {producto.categorias && producto.categorias.length > 0 ? (
                    producto.categorias.map(cat => (
                      <span 
                        key={cat.id}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {cat.nombre}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-sm">Sin categoría</span>
                  )}
                </div>
              </div>

              {/* Ingredientes */}
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Ingredientes</h3>
                <ul className="space-y-1">
                  {producto.ingredientes && producto.ingredientes.length > 0 ? (
                    producto.ingredientes.map(ing => (
                      <li key={ing.id} className="text-sm text-slate-700 flex items-center gap-2">
                        • {ing.nombre} 
                        {ing.es_alergeno && (
                          <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold uppercase rounded">
                            Alérgeno
                          </span>
                        )}
                      </li>
                    ))
                  ) : (
                    <span className="text-slate-400 text-sm">Sin ingredientes</span>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-500 uppercase">Estado:</span>
              {producto.disponible ? (
                <span className="flex items-center gap-1 text-emerald-600 font-semibold text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Disponible
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-600 font-semibold text-sm">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span> No disponible
                </span>
              )}
            </div>
            <div className="text-sm font-medium text-slate-500">
              Stock: <span className="text-slate-800 font-bold">{producto.stock_cantidad}</span> un.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProducto;
