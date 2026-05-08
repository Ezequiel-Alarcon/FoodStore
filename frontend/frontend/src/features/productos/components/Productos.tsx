import { useState, useMemo } from 'react';
import { useProductos, useDeleteProducto } from '../hooks/useProductos';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import { Modal } from '../../../shared/components/Modal';
import { ProductoForm } from './ProductoForm';
import type { IProducto } from '../types/IProducto';
import { GenericTable } from '../../../shared/components/GenericTable';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { FilterSortBar } from '../../../shared/components/FilterSortBar';
import { PaginationBar } from '../../../shared/components/PaginationBar';
const Productos = () => {
  const [page, setPage] = useState(1);
  const { data: response, isLoading, isError } = useProductos(page);
  const deleteMutation = useDeleteProducto();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productoToEdit, setProductoToEdit] = useState<IProducto | undefined>(undefined);

  const totalItems = response?.total || 0;

  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  const confirmDelete = (id: number) => {
    setIdToDelete(id);
  };

  const executeDelete = () => {
    if (idToDelete !== null) {
      deleteMutation.mutate(idToDelete);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('id_asc');

  const filteredAndSortedProductos = useMemo(() => {
    let result = [...(response?.data || [])];
    
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => p.nombre.toLowerCase().includes(term));
    }

    result.sort((a, b) => {
      switch (sortOption) {
        case 'nombre_asc': return a.nombre.localeCompare(b.nombre);
        case 'nombre_desc': return b.nombre.localeCompare(a.nombre);
        case 'precio_asc': return a.precio_base - b.precio_base;
        case 'precio_desc': return b.precio_base - a.precio_base;
        case 'id_desc': return b.id - a.id;
        case 'id_asc':
        default:
          return a.id - b.id;
      }
    });

    return result;
  }, [response?.data, searchTerm, sortOption]);

  const handleOpenCreate = () => {
    setProductoToEdit(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: IProducto) => {
    setProductoToEdit(prod);
    setIsModalOpen(true);
  };

  if (isLoading) return <LoadingSpinner message="Cargando productos..." />;
  if (isError) return <ErrorMessage title="¡Error de Conexión!" message="No se pudieron cargar los productos desde el servidor." />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Productos</h1>
        <button 
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow transition-colors"
        >
          + Nuevo Producto
        </button>
      </div>

      <FilterSortBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar producto por nombre..."
        sortOption={sortOption}
        onSortChange={setSortOption}
        sortOptions={[
          { value: 'id_asc', label: 'ID (Menor a Mayor)' },
          { value: 'id_desc', label: 'ID (Mayor a Menor)' },
          { value: 'nombre_asc', label: 'Nombre (A-Z)' },
          { value: 'nombre_desc', label: 'Nombre (Z-A)' },
          { value: 'precio_asc', label: 'Precio (Menor a Mayor)' },
          { value: 'precio_desc', label: 'Precio (Mayor a Menor)' }
        ]}
      />

      <GenericTable 
        headers={['ID', 'Nombre', 'Precio', 'Stock', 'Acciones']}
        data={filteredAndSortedProductos}
        emptyMessage={searchTerm ? "No se encontraron productos con esa búsqueda." : "No hay productos registrados. Usá el botón para crear el primero."}
        renderRow={(prod: IProducto) => (
          <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">#{prod.id}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{prod.nombre}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-600 font-bold">${prod.precio_base}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              {prod.stock_cantidad > 0 ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                    {prod.stock_cantidad} en caja
                  </span>
              ) : (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Sin Stock
                  </span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
              <Link to={`/productos/${prod.id}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                Ver detalle
              </Link>
              <button 
                onClick={() => handleOpenEdit(prod)}
                className="text-amber-500 hover:text-amber-700 transition-colors"
              >
                Editar
              </button>
              <button 
                onClick={() => confirmDelete(prod.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                Eliminar
              </button>
            </td>
          </tr>
        )}
      />

      <PaginationBar 
        currentPage={page}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={productoToEdit ? "Editar Producto" : "Nuevo Producto"}
      >
        <ProductoForm 
          onClose={() => setIsModalOpen(false)} 
          productoToEdit={productoToEdit} 
        />
      </Modal>

      <ConfirmDialog 
        isOpen={idToDelete !== null}
        title="Eliminar Producto"
        message="¿Estás seguro de que querés eliminar este producto? Desaparecerá del menú permanentemente."
        onConfirm={executeDelete}
        onCancel={() => setIdToDelete(null)}
      />

    </div>
  );
};

export default Productos;
