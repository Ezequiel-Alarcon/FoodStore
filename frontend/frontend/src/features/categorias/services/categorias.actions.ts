import { get, post, put, remove } from "../../../shared/services/apiService";
import type { ICategoria, ICategoriaResponse, ICategoriaCreate } from "../types/ICategoria";

export const getCategorias = (offset: number = 0, limit: number = 20) => get<ICategoriaResponse>(`/categorias?offset=${offset}&limit=${limit}`);

export const getCategoriaById = (id: string | number) => get<ICategoria>(`/categorias/${id}`);

export const crearCategoria = (data: ICategoriaCreate) => 
  post<ICategoriaCreate, ICategoria>("/categorias", data);

export const actualizarCategoria = (id: number, data: ICategoriaCreate) => 
  put<ICategoriaCreate, ICategoria>(`/categorias/${id}`, data);

export const eliminarCategoria = (id: number) => 
  remove<void>(`/categorias/${id}`);
