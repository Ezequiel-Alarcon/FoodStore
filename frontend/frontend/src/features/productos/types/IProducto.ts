import type { ICategoria } from "../../categorias/types/ICategoria";
import type { IIngrediente } from "../../ingredientes/types/IIngrediente";

export interface IProductoBase {
    id: number;
    nombre: string;
    descripcion: string | null;
    precio_base: number;
    imagenes_url: string[] | null;
    stock_cantidad: number;
    disponible: boolean;
}

export interface IProducto extends IProductoBase {
    // Relaciones para cuando el GET trae todo
    categorias?: ICategoria[];
    ingredientes?: IIngrediente[];
}

export interface IProductoCreate {
    nombre: string;
    descripcion?: string;
    precio_base: number;
    stock_cantidad: number;
    disponible?: boolean;
    imagenes_url?: string[];
    categoria_ids: number[];
    ingrediente_ids?: number[];
}

export interface IProductoResponse {
    data: IProducto[];
    total: number;
}
