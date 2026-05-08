import type { IProducto } from "../../productos/types/IProducto";

export interface ICategoriaBase {
    id: number;
    nombre: string;
    descripcion: string | null;
    imagen_url: string;
    parent_id: number | null;
}

export interface ICategoria extends ICategoriaBase {
    // Relaciones para cuando pedís la categoría completa
    parent?: ICategoriaBase | null;
    subcategorias?: ICategoria[];
    productos?: IProducto[];
}

export interface ICategoriaCreate {
    nombre: string;
    descripcion?: string;
    imagen_url: string;
    parent_id?: number;
}

export interface ICategoriaResponse {
    data: ICategoria[];
    total: number;
}
