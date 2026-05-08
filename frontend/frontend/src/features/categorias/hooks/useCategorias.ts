import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getCategorias,
    getCategoriaById,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
} from "../services/categorias.actions";
import type { ICategoriaCreate } from "../types/ICategoria";

// ==========================================
// QUERIES (Lectura de datos - GET)
// ==========================================

export const useCategorias = (page: number = 1) => {
    const limit = 20;
    const offset = (page - 1) * limit;
    return useQuery({
        queryKey: ["categorias", page], // Etiqueta para el caché
        queryFn: () => getCategorias(offset, limit),   // La función para buscar los datos
    });
};

export const useCategoriaById = (id: string | number) => {
    return useQuery({
        queryKey: ["categorias", id], // Caché específico para este ID
        queryFn: () => getCategoriaById(id),
        enabled: !!id, // Evita que se dispare si el ID es nulo o indefinido
    });
};

// ==========================================
// MUTATIONS (Escritura de datos - POST/PUT/DELETE)
// ==========================================

export const useCreateCategoria = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ICategoriaCreate) => crearCategoria(data),
        onSuccess: () => {
            // Decimos a TanStack: "Los datos viejos ya no sirven, andá a buscar los nuevos"
            queryClient.invalidateQueries({ queryKey: ["categorias"] });
        },
    });
};

export const useUpdateCategoria = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: ICategoriaCreate }) =>
            actualizarCategoria(id, data),
        onSuccess: (_, variables) => {
            // Refrescamos la lista general y también el detalle de esta categoría en particular
            queryClient.invalidateQueries({ queryKey: ["categorias"] });
            queryClient.invalidateQueries({ queryKey: ["categorias", variables.id] });
        },
    });
};

export const useDeleteCategoria = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => eliminarCategoria(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categorias"] });
        },
    });
};
