import { get, post, put, remove } from "../../../shared/services/apiService";
import type { IProducto, IProductoResponse, IProductoCreate } from "../types/IProducto";

export const getProductos = (offset: number = 0, limit: number = 20) => get<IProductoResponse>(`/productos?offset=${offset}&limit=${limit}`);

export const getProductoById = (id: string | number) => get<IProducto>(`/productos/${id}`);

export const crearProducto = (data: IProductoCreate) => 
  post<IProductoCreate, IProducto>("/productos", data);

export const actualizarProducto = (id: number, data: IProductoCreate) => 
  put<IProductoCreate, IProducto>(`/productos/${id}`, data);

export const eliminarProducto = (id: number) => 
  remove<void>(`/productos/${id}`);
