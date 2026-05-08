import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getIngredientes,
    getIngredienteById,
    crearIngrediente,
    actualizarIngrediente,
    eliminarIngrediente
} from "../services/ingredientes.actions";
import type { IIngredienteCreate } from "../types/IIngrediente";

// ==========================================
// QUERIES (Lectura de datos - GET)
// ==========================================

export const useIngredientes = (page: number = 1) => {
    const limit = 20;
    const offset = (page - 1) * limit;
    return useQuery({
        queryKey: ["ingredientes", page],
        queryFn: () => getIngredientes(offset, limit)
    });
}

export const useIngredienteById = (id: string | number) => {
    return useQuery({
        queryKey: ["ingredientes", id],
        queryFn: () => getIngredienteById(id),
        enabled: !!id,
    })
}

// ==========================================
// MUTATIONS (Escritura de datos - POST/PUT/DELETE)
// ==========================================

export const useCreateIngrediente = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: IIngredienteCreate) => crearIngrediente(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
        },
    });
};

export const useUpdateIngrediente = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, data}: {id: number, data: IIngredienteCreate}) => 
            actualizarIngrediente(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
            queryClient.invalidateQueries({ queryKey: ["ingredientes", variables.id]});
        }
    });
};

export const useDeleteIngrediente = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => eliminarIngrediente(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
        }
    });
}