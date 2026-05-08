import { useState } from "react";
import type { FormEvent } from "react";
import {
  useCreateCategoria,
  useUpdateCategoria,
  useCategorias,
} from "../hooks/useCategorias";
import type { ICategoria, ICategoriaCreate } from "../types/ICategoria";

interface CategoriaFormProps {
  onClose: () => void;
  categoriaToEdit?: ICategoria;
}

export const CategoriaForm = ({
  onClose,
  categoriaToEdit,
}: CategoriaFormProps) => {
  const [nombre, setNombre] = useState(categoriaToEdit?.nombre || "");
  const [imagenUrl, setImagenUrl] = useState(categoriaToEdit?.imagen_url || "");
  const [descripcion, setDescripcion] = useState(
    categoriaToEdit?.descripcion || "",
  );
  const [parentId, setParentId] = useState<number | "">(
    categoriaToEdit?.parent_id || "",
  );

  // Traemos todas las categorías para rellenar el `<select>`
  const { data: categoriasData } = useCategorias();
  const categorias = categoriasData?.data || [];

  // Filtramos para que una categoría no pueda ser padre de sí misma (evita un bug lógico en el backend)
  const categoriasDisponibles = categorias.filter(
    (cat) => cat.id !== categoriaToEdit?.id,
  );

  const createMutation = useCreateCategoria();
  const updateMutation = useUpdateCategoria();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const dataToSave: ICategoriaCreate = {
      nombre,
      imagen_url: imagenUrl,
      descripcion: descripcion || undefined, // si está vacío mandamos undefined
      parent_id: parentId === "" ? undefined : Number(parentId),
    };

    if (categoriaToEdit) {
      updateMutation.mutate(
        { id: categoriaToEdit.id, data: dataToSave },
        { onSuccess: () => onClose() },
      );
    } else {
      createMutation.mutate(dataToSave, {
        onSuccess: () => onClose(),
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la Categoría
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Ej: Hamburguesas"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Ej: Todas las hamburguesas con medallón de carne..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL de la Imagen
        </label>
        <input
          type="url"
          value={imagenUrl}
          onChange={(e) => setImagenUrl(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Categoría Padre (Opcional)
        </label>
        <select
          value={parentId}
          onChange={(e) =>
            setParentId(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
        >
          <option value="">-- Ninguna (Categoría Principal) --</option>
          {categoriasDisponibles.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors disabled:opacity-50"
        >
          {isPending ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
};
