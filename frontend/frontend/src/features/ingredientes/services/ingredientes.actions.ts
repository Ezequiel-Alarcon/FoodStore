import { get, post, put, remove } from "../../../shared/services/apiService";
import type { IIngrediente, IIngredienteResponse, IIngredienteCreate } from "../types/IIngrediente";

export const getIngredientes = (offset: number = 0, limit: number = 20) => get<IIngredienteResponse>(`/ingredientes?offset=${offset}&limit=${limit}`);

export const getIngredienteById = (id: string | number) => get<IIngrediente>(`/ingredientes/${id}`);

export const crearIngrediente = (data: IIngredienteCreate) => 
  post<IIngredienteCreate, IIngrediente>("/ingredientes", data);

export const actualizarIngrediente = (id: number, data: IIngredienteCreate) => 
  put<IIngredienteCreate, IIngrediente>(`/ingredientes/${id}`, data);

export const eliminarIngrediente = (id: number) => 
  remove<void>(`/ingredientes/${id}`);
