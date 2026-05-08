import { useState } from "react";
import type { FormEvent } from "react";
import {
  useCreateIngrediente,
  useUpdateIngrediente,
} from "../hooks/useIngredientes";
import type { IIngrediente, IIngredienteCreate } from "../types/IIngrediente";

interface IngredienteFormProps {
  onClose: () => void;
  ingredienteToEdit?: IIngrediente;
}

export const IngredienteForm = ({
  onClose,
  ingredienteToEdit,
}: IngredienteFormProps) => {
  const [nombre, setNombre] = useState(ingredienteToEdit?.nombre || "");
  const [esAlergeno, setEsAlergeno] = useState(
    ingredienteToEdit?.es_alergeno || false,
  );
  const [descripcion, setDescripcion] = useState(
    ingredienteToEdit?.descripcion || "",
  );

  const createMutation = useCreateIngrediente();
  const updateMutation = useUpdateIngrediente();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const dataToSave: IIngredienteCreate = {
      nombre,
      es_alergeno: esAlergeno,
      descripcion: descripcion || undefined,
    };

    if (ingredienteToEdit) {
      updateMutation.mutate(
        { id: ingredienteToEdit.id, data: dataToSave },
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
          Nombre del Ingrediente
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Ej: Tomate"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción (Opcional)
        </label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Ej: Tomate perita fresco"
        />
      </div>

      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          id="esAlergeno"
          checked={esAlergeno}
          onChange={(e) => setEsAlergeno(e.target.checked)}
          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
        />
        <label
          htmlFor="esAlergeno"
          className="ml-2 block text-sm text-gray-900 font-medium"
        >
          ¿Es un alérgeno? (Ej: TACC, Maní, Lácteos)
        </label>
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
