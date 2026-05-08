import { useState } from "react";
import type { FormEvent } from "react";
import { useCreateProducto, useUpdateProducto } from "../hooks/useProductos";
import { useCategorias } from "../../categorias/hooks/useCategorias";
import { useIngredientes } from "../../ingredientes/hooks/useIngredientes";
import type { IProducto, IProductoCreate } from "../types/IProducto";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";

interface ProductoFormProps {
  onClose: () => void;
  productoToEdit?: IProducto;
}

export const ProductoForm = ({
  onClose,
  productoToEdit,
}: ProductoFormProps) => {
  // Campos Base
  const [nombre, setNombre] = useState(productoToEdit?.nombre || "");
  const [descripcion, setDescripcion] = useState(
    productoToEdit?.descripcion || "",
  );
  const [precioBase, setPrecioBase] = useState<number | "">(
    productoToEdit?.precio_base || "",
  );
  const [stockCantidad, setStockCantidad] = useState<number | "">(
    productoToEdit?.stock_cantidad ?? 0,
  );
  const [disponible, setDisponible] = useState(
    productoToEdit?.disponible ?? true,
  );

  // Imagen: Para simplificar, permitimos ingresar 1 URL de texto que luego metemos al array de la API
  const [imagenUrl, setImagenUrl] = useState(
    productoToEdit?.imagenes_url?.[0] || "",
  );

  // RELACIONES (Many-to-Many): Guardamos los arrays de IDs
  const [categoriaIds, setCategoriaIds] = useState<number[]>(
    productoToEdit?.categorias?.map((c) => c.id) || [],
  );
  const [ingredienteIds, setIngredienteIds] = useState<number[]>(
    productoToEdit?.ingredientes?.map((i) => i.id) || [],
  );

  // Queries para traer la lista de dependencias
  const { data: catData, isLoading: loadingCat } = useCategorias();
  const { data: ingData, isLoading: loadingIng } = useIngredientes();

  const categorias = catData?.data || [];
  const ingredientes = ingData?.data || [];

  const createMutation = useCreateProducto();
  const updateMutation = useUpdateProducto();

  // Función genérica para manejar los checkboxes de selecciones múltiples
  const handleCheckboxChange = (
    id: number,
    currentIds: number[],
    setIds: (ids: number[]) => void,
  ) => {
    if (currentIds.includes(id)) {
      setIds(currentIds.filter((existingId) => existingId !== id)); // Si estaba, lo saca
    } else {
      setIds([...currentIds, id]); // Si no estaba, lo agrega
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (categoriaIds.length === 0) {
      alert("Debes seleccionar al menos una categoría obligatoriamente.");
      return;
    }

    const dataToSave: IProductoCreate = {
      nombre,
      descripcion: descripcion || undefined,
      precio_base: Number(precioBase),
      stock_cantidad: Number(stockCantidad),
      disponible,
      imagenes_url: imagenUrl ? [imagenUrl] : [],
      categoria_ids: categoriaIds,
      ingrediente_ids: ingredienteIds.length > 0 ? ingredienteIds : undefined,
    };

    if (productoToEdit) {
      updateMutation.mutate(
        { id: productoToEdit.id, data: dataToSave },
        { onSuccess: () => onClose() },
      );
    } else {
      createMutation.mutate(dataToSave, {
        onSuccess: () => onClose(),
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Si todavía no trajimos las categorías y los ingredientes, mostramos un spinner adentro del modal
  if (loadingCat || loadingIng)
    return <LoadingSpinner message="Cargando dependencias..." />;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[80vh] overflow-y-auto px-1"
    >
      {/* Cajas de Texto de Arriba */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Producto
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio Base ($)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={precioBase}
            onChange={(e) =>
              setPrecioBase(e.target.value === "" ? "" : Number(e.target.value))
            }
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock
          </label>
          <input
            type="number"
            min="0"
            value={stockCantidad}
            onChange={(e) =>
              setStockCantidad(
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL de Imagen Principal
        </label>
        <input
          type="url"
          value={imagenUrl}
          onChange={(e) => setImagenUrl(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="disponible"
          checked={disponible}
          onChange={(e) => setDisponible(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label
          htmlFor="disponible"
          className="ml-2 block text-sm text-gray-900 font-medium"
        >
          Producto Disponible en la tienda
        </label>
      </div>

      <hr className="my-4 border-gray-200" />

      {/* RELACIONES: Selectores Múltiples con Checkboxes */}
      <div className="grid grid-cols-2 gap-4">
        {/* Caja de Categorías */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">
            Categorías <span className="text-red-500">* (Mínimo 1)</span>
          </label>
          <div className="max-h-32 overflow-y-auto border border-gray-200 rounded p-2 bg-gray-50">
            {categorias.length === 0 ? (
              <p className="text-xs text-gray-500">Crea categorías primero</p>
            ) : null}
            {categorias.map((cat) => (
              <div key={cat.id} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  id={`cat-${cat.id}`}
                  checked={categoriaIds.includes(cat.id)}
                  onChange={() =>
                    handleCheckboxChange(cat.id, categoriaIds, setCategoriaIds)
                  }
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label
                  htmlFor={`cat-${cat.id}`}
                  className="ml-2 text-sm text-gray-700 cursor-pointer"
                >
                  {cat.nombre}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Caja de Ingredientes */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">
            Ingredientes (Opcional)
          </label>
          <div className="max-h-32 overflow-y-auto border border-gray-200 rounded p-2 bg-gray-50">
            {ingredientes.length === 0 ? (
              <p className="text-xs text-gray-500">
                No hay ingredientes cargados
              </p>
            ) : null}
            {ingredientes.map((ing) => (
              <div key={ing.id} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  id={`ing-${ing.id}`}
                  checked={ingredienteIds.includes(ing.id)}
                  onChange={() =>
                    handleCheckboxChange(
                      ing.id,
                      ingredienteIds,
                      setIngredienteIds,
                    )
                  }
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label
                  htmlFor={`ing-${ing.id}`}
                  className="ml-2 text-sm text-gray-700 cursor-pointer"
                >
                  {ing.nombre}{" "}
                  {ing.es_alergeno && (
                    <span className="text-red-500 text-xs">(A)</span>
                  )}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t mt-4 border-gray-200">
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
          className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
        >
          {isPending ? "Guardando..." : "Guardar Producto"}
        </button>
      </div>
    </form>
  );
};
