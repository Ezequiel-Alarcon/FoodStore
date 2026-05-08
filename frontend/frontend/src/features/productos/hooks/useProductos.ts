import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getProductos,
    getProductoById,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} from "../services/productos.actions";

import type { IProductoCreate } from "../types/IProducto";

// ==========================================
// QUERIES (Lectura de datos - GET)
// ==========================================

export const useProductos = (page: number = 1) => {
    const limit = 20;
    const offset = (page - 1) * limit;
    return useQuery({
        queryKey: ["productos", page],
        queryFn: () => getProductos(offset, limit)
    });
}

export const useProductoById = (id: string | number) => {
    return useQuery({
        queryKey: ["productos", id],
        queryFn: () => getProductoById(id),
        enabled: !!id,
    })
}

// ==========================================
// MUTATIONS (Escritura de datos - POST/PUT/DELETE)
// ==========================================

export const useCreateProducto = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: IProductoCreate) => crearProducto(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["productos"] });
        },
    });
};

export const useUpdateProducto = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, data}: {id: number, data: IProductoCreate}) => 
            actualizarProducto(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["productos"] });
            queryClient.invalidateQueries({ queryKey: ["productos", variables.id]});
        }
    });
};

export const useDeleteProducto = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => eliminarProducto(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["productos"] });
        }
    });
}