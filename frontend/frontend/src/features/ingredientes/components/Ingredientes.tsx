import { useState, useMemo } from 'react';
import { useIngredientes, useDeleteIngrediente } from '../hooks/useIngredientes';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import { Modal } from '../../../shared/components/Modal';
import { IngredienteForm } from './IngredienteForm';
import type { IIngrediente } from '../types/IIngrediente';
import { GenericTable } from '../../../shared/components/GenericTable';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { FilterSortBar } from '../../../shared/components/FilterSortBar';
import { PaginationBar } from '../../../shared/components/PaginationBar';
const Ingredientes = () => {
  const [page, setPage] = useState(1);
  const { data: response, isLoading, isError } = useIngredientes(page);
  const deleteMutation = useDeleteIngrediente();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ingredienteToEdit, setIngredienteToEdit] = useState<IIngrediente | undefined>(undefined);

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

  const filteredAndSortedIngredientes = useMemo(() => {
    let result = [...(response?.data || [])];
    
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(i => i.nombre.toLowerCase().includes(term));
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

  const handleOpenCreate = () => {
    setIngredienteToEdit(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ing: IIngrediente) => {
    setIngredienteToEdit(ing);
    setIsModalOpen(true);
  };

  if (isLoading) return <LoadingSpinner message="Cargando ingredientes..." />;
  if (isError) return <ErrorMessage title="¡Error de Conexión!" message="No se pudieron cargar los ingredientes desde el servidor." />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Ingredientes</h1>
        <button 
          onClick={handleOpenCreate}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-md shadow transition-colors"
        >
          + Nuevo Ingrediente
        </button>
      </div>

      <FilterSortBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar ingrediente por nombre..."
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
        headers={['ID', 'Nombre', 'Alérgeno', 'Acciones']}
        data={filteredAndSortedIngredientes}
        emptyMessage={searchTerm ? "No se encontraron ingredientes con esa búsqueda." : "No hay ingredientes registrados. Creá uno para empezar."}
        renderRow={(ing: IIngrediente) => (
          <tr key={ing.id} className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">#{ing.id}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{ing.nombre}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              {ing.es_alergeno ? (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                  Sí (Alérgeno)
                </span>
              ) : (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                  No
                </span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">

              <button 
                onClick={() => handleOpenEdit(ing)}
                className="text-amber-500 hover:text-amber-700 transition-colors"
              >
                Editar
              </button>
              <button 
                onClick={() => confirmDelete(ing.id)}
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
        title={ingredienteToEdit ? "Editar Ingrediente" : "Nuevo Ingrediente"}
      >
        <IngredienteForm 
          onClose={() => setIsModalOpen(false)} 
          ingredienteToEdit={ingredienteToEdit} 
        />
      </Modal>

      <ConfirmDialog 
        isOpen={idToDelete !== null}
        title="Eliminar Ingrediente"
        message="¿Estás seguro de que querés eliminar este ingrediente? Si está vinculado a un producto podría causar errores."
        onConfirm={executeDelete}
        onCancel={() => setIdToDelete(null)}
      />

    </div>
  );
};

export default Ingredientes;
