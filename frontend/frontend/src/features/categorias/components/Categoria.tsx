import { useState, useMemo } from 'react';
import { useCategorias, useDeleteCategoria } from '../hooks/useCategorias';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import { Modal } from '../../../shared/components/Modal';
import { CategoriaForm } from './CategoriaForm';
import type { ICategoria } from '../types/ICategoria';
import { GenericTable } from '../../../shared/components/GenericTable';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { FilterSortBar } from '../../../shared/components/FilterSortBar';
import { PaginationBar } from '../../../shared/components/PaginationBar';

const Categoria = () => {
  const [page, setPage] = useState(1);
  const { data: response, isLoading, isError } = useCategorias(page);
  const deleteMutation = useDeleteCategoria();

  // Uso de useState para manejar la UI interactiva (Modal)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoriaToEdit, setCategoriaToEdit] = useState<ICategoria | undefined>(undefined);

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

  const filteredAndSortedCategorias = useMemo(() => {
    let result = [...(response?.data || [])];
    
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(c => c.nombre.toLowerCase().includes(term));
    }

    result.sort((a, b) => {
      switch (sortOption) {
        case 'nombre_asc': return a.nombre.localeCompare(b.nombre);
        case 'nombre_desc': return b.nombre.localeCompare(a.nombre);
        case 'id_desc': return b.id - a.id;
        case 'id_asc':
        default:
          return a.id - b.id;
      }
    });

    return result;
  }, [response?.data, searchTerm, sortOption]);

  // Función para abrir el modal en modo "Creación"
  const handleOpenCreate = () => {
    setCategoriaToEdit(undefined); // Limpiamos cualquier dato viejo
    setIsModalOpen(true);
  };

  // Función para abrir el modal en modo "Edición"
  const handleOpenEdit = (cat: ICategoria) => {
    setCategoriaToEdit(cat); // Le pasamos los datos actuales para que rellene los inputs
    setIsModalOpen(true);
  };

  if (isLoading) return <LoadingSpinner message="Cargando categorías..." />;
  if (isError) return <ErrorMessage title="¡Error de Conexión!" message="No se pudieron cargar las categorías desde el servidor." />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Categorías</h1>
        <button 
          onClick={handleOpenCreate}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-md shadow transition-colors"
        >
          + Nueva Categoría
        </button>
      </div>

      <FilterSortBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar categoría por nombre..."
        sortOption={sortOption}
        onSortChange={setSortOption}
        sortOptions={[
          { value: 'id_asc', label: 'ID (Menor a Mayor)' },
          { value: 'id_desc', label: 'ID (Mayor a Menor)' },
          { value: 'nombre_asc', label: 'Nombre (A-Z)' },
          { value: 'nombre_desc', label: 'Nombre (Z-A)' }
        ]}
      />

      <GenericTable 
        headers={['ID', 'Imagen', 'Nombre', 'Acciones']}
        data={filteredAndSortedCategorias}
        emptyMessage={searchTerm ? "No se encontraron categorías con esa búsqueda." : "No hay categorías registradas. Creá una para empezar."}
        renderRow={(cat: ICategoria) => (
          <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">#{cat.id}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              {cat.imagen_url ? (
                <img src={cat.imagen_url} alt={cat.nombre} className="h-10 w-10 rounded-full object-cover shadow-sm border border-slate-200" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-slate-200" />
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{cat.nombre}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">

              <button 
                onClick={() => handleOpenEdit(cat)}
                className="text-amber-500 hover:text-amber-700 transition-colors"
              >
                Editar
              </button>
              <button 
                onClick={() => confirmDelete(cat.id)}
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

      {/* Renderizamos el Modal solo si isModalOpen es true */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={categoriaToEdit ? "Editar Categoría" : "Nueva Categoría"}
      >
        {/* Le pasamos la categoría a editar (si existe) y la función para cerrar */}
        <CategoriaForm 
          onClose={() => setIsModalOpen(false)} 
          categoriaToEdit={categoriaToEdit} 
        />
      </Modal>

      {/* Confirmación para eliminar */}
      <ConfirmDialog 
        isOpen={idToDelete !== null}
        title="Eliminar Categoría"
        message="¿Estás completamente seguro de que querés eliminar esta categoría? Esta acción no se puede deshacer."
        onConfirm={executeDelete}
        onCancel={() => setIdToDelete(null)}
      />

    </div>
  );
};

export default Categoria;