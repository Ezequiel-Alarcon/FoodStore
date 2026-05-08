import type { IProducto } from "../../productos/types/IProducto";

export interface IIngredienteBase {
    id: number;
    nombre: string;
    es_alergeno: boolean;
    descripcion: string | null;
}

export interface IIngrediente extends IIngredienteBase {
    // Relaciones
    productos?: IProducto[];
}

export interface IIngredienteCreate {
    nombre: string;
    es_alergeno?: boolean;
    descripcion?: string;
}

export interface IIngredienteResponse {
    data: IIngrediente[];
    total: number;
}
