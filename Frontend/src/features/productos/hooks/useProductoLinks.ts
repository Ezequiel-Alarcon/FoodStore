/**
 * ============================================
 * useProductoLinks Hook
 * ============================================
 * Hooks para gestionar las vinculaciones N:M
 * entre Producto ↔ Categoría y Producto ↔ Ingrediente
 *
 * SRP: lógica de estado del servidor.
 * La lógica de API vive en actions/producto-categoria.action.ts
 * y actions/producto-ingrediente.action.ts
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategoriasDeProducto,
  vincularCategoriaAProducto,
  actualizarVinculoCategoria,
  desvincularCategoriaDeProducto,
} from "@/actions/producto-categoria.action";
import {
  getIngredientesDeProducto,
  vincularIngredienteAProducto,
  actualizarVinculoIngrediente,
  desvincularIngredienteDeProducto,
} from "@/actions/producto-ingrediente.action";
import type {
  ProductoCategoriaCreate,
  ProductoIngredienteCreate,
} from "@/types";
import { productoKeys } from "./useProductos";

/**
 * Query keys para vinculaciones
 */
export const productoLinkKeys = {
  categorias: (productoId: number) =>
    [...productoKeys.all, "categorias", productoId] as const,
  ingredientes: (productoId: number) =>
    [...productoKeys.all, "ingredientes", productoId] as const,
};

/**
 * Hook para obtener las categorías vinculadas a un producto
 */
export function useProductoCategorias(productoId: number | null) {
  return useQuery({
    queryKey: productoLinkKeys.categorias(productoId ?? 0),
    queryFn: () => getCategoriasDeProducto(productoId!),
    enabled: !!productoId,
  });
}

/**
 * Hook para obtener los ingredientes vinculados a un producto
 */
export function useProductoIngredientes(productoId: number | null) {
  return useQuery({
    queryKey: productoLinkKeys.ingredientes(productoId ?? 0),
    queryFn: () => getIngredientesDeProducto(productoId!),
    enabled: !!productoId,
  });
}

/**
 * Hook para sincronizar categorías de un producto.
 *
 * Estrategia: borrar las que ya no están → crear las nuevas.
 * Es la forma más simple y segura de manejar relaciones N:M
 * desde el frontend sin complicar la lógica de diff.
 */
export function useSyncProductoCategorias() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productoId,
      currentCategoriaIds,
      desired,
    }: {
      productoId: number;
      currentCategoriaIds: number[];
      desired: ProductoCategoriaCreate[];
    }) => {
      const desiredIds = desired.map((d) => d.categoria_id);

      // Borrar las que ya no están
      const toDelete = currentCategoriaIds.filter(
        (id) => !desiredIds.includes(id),
      );
      for (const catId of toDelete) {
        await desvincularCategoriaDeProducto(productoId, catId);
      }

      // Crear las nuevas
      const toCreate = desired.filter(
        (d) => !currentCategoriaIds.includes(d.categoria_id),
      );
      for (const link of toCreate) {
        await vincularCategoriaAProducto(link);
      }

      // Actualizar es_principal en las que ya existían
      const toUpdate = desired.filter((d) =>
        currentCategoriaIds.includes(d.categoria_id),
      );
      for (const link of toUpdate) {
        await actualizarVinculoCategoria(productoId, link.categoria_id, {
          es_principal: link.es_principal ?? false,
        });
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productoLinkKeys.categorias(variables.productoId),
      });
      queryClient.invalidateQueries({ queryKey: productoKeys.lists() });
    },
  });
}

/**
 * Hook para sincronizar ingredientes de un producto.
 * Misma estrategia: borrar viejos → crear nuevos → actualizar existentes.
 */
export function useSyncProductoIngredientes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productoId,
      currentIngredienteIds,
      desired,
    }: {
      productoId: number;
      currentIngredienteIds: number[];
      desired: ProductoIngredienteCreate[];
    }) => {
      const desiredIds = desired.map((d) => d.ingrediente_id);

      // Borrar las que ya no están
      const toDelete = currentIngredienteIds.filter(
        (id) => !desiredIds.includes(id),
      );
      for (const ingId of toDelete) {
        await desvincularIngredienteDeProducto(productoId, ingId);
      }

      // Crear las nuevas
      const toCreate = desired.filter(
        (d) => !currentIngredienteIds.includes(d.ingrediente_id),
      );
      for (const link of toCreate) {
        await vincularIngredienteAProducto(link);
      }

      // Actualizar es_removible en las que ya existían
      const toUpdate = desired.filter((d) =>
        currentIngredienteIds.includes(d.ingrediente_id),
      );
      for (const link of toUpdate) {
        await actualizarVinculoIngrediente(productoId, link.ingrediente_id, {
          es_removible: link.es_removible ?? false,
        });
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productoLinkKeys.ingredientes(variables.productoId),
      });
      queryClient.invalidateQueries({ queryKey: productoKeys.lists() });
    },
  });
}

/**
 * Hook para crear todas las vinculaciones de un producto nuevo.
 * Se usa después de crear el producto (cuando ya tenemos el ID).
 */
export function useCreateProductoLinks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productoId,
      categorias,
      ingredientes,
    }: {
      productoId: number;
      categorias: ProductoCategoriaCreate[];
      ingredientes: ProductoIngredienteCreate[];
    }) => {
      // Crear todas las vinculaciones de categoría
      for (const link of categorias) {
        await vincularCategoriaAProducto({
          ...link,
          producto_id: productoId,
        });
      }

      // Crear todas las vinculaciones de ingrediente
      for (const link of ingredientes) {
        await vincularIngredienteAProducto({
          ...link,
          producto_id: productoId,
        });
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productoLinkKeys.categorias(variables.productoId),
      });
      queryClient.invalidateQueries({
        queryKey: productoLinkKeys.ingredientes(variables.productoId),
      });
      queryClient.invalidateQueries({ queryKey: productoKeys.lists() });
    },
  });
}
