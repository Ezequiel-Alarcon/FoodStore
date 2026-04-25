from typing import Optional
from sqlmodel import SQLModel, Field


class CategoriaBasicRead(SQLModel):
    id: int
    nombre: str
    es_principal: bool = Field(
        default=False, description="Si es categoría principal")


class IngredienteBasicRead(SQLModel):
    id: int
    nombre: str
    es_alergeno: bool = Field(default=False, description="Si es alérgeno")


# ─── Base ─────────────────────────────────────────────────────────────────────────────────


class ProductoBase(SQLModel):
    nombre: str = Field(..., description="Nombre del producto", max_length=150)
    descripcion: Optional[str] = Field(
        default=None, description="Descripción del producto")
    precio_base: float = Field(..., description="Precio del producto", ge=0)
    imagenes_url: Optional[list[str]] = Field(
        default=None, description="URLs de imágenes del producto")
    stock_cantidad: int = Field(
        default=0, ge=0, description="Cantidad en stock")
    disponible: bool = Field(
        default=True, description="Indica si el producto está disponible")

# ─── Request schemas ──────────────────────────────────────────────────────────────────────


class ProductoCreate(ProductoBase):
    pass


class ProductoUpdate(SQLModel):
    nombre: Optional[str] = Field(
        default=None, description="Nombre del producto", max_length=150)
    descripcion: Optional[str] = Field(
        default=None, description="Descripción del producto")
    precio_base: Optional[float] = Field(
        default=None, description="Precio del producto", ge=0)
    imagenes_url: Optional[list[str]] = Field(
        default=None, description="URLs de imágenes del producto")
    stock_cantidad: Optional[int] = Field(
        default=None, description="Cantidad en stock", ge=0)
    disponible: Optional[bool] = Field(
        default=None, description="Indica si el producto está disponible")

# ─── Response schemas ────────────────────────────────────────────────────────────────────


class ProductoRead(ProductoBase):
    id: int = Field(..., description="ID del producto")


class ProductoBasicRead(SQLModel):
    id: int = Field(..., description="ID del producto")
    nombre: str = Field(..., description="Nombre del producto")
    precio_base: float = Field(..., description="Precio del producto", ge=0)
    imagenes_url: Optional[list[str]] = Field(
        default=None, description="URLs de imágenes del producto")


class ProductoReadFull(ProductoRead):
    """Producto con categorías e ingredientes"""
    categorias: list[CategoriaBasicRead] = Field(default_factory=list)
    ingredientes: list[IngredienteBasicRead] = Field(default_factory=list)


# Facilita al frontend obtener el total de productos
# para paginación sin hacer una consulta extra
class ProductoList(SQLModel):
    data: list[ProductoReadFull]
    total: int = Field(..., description="Total de productos disponibles")
