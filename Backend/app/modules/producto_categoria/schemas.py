from datetime import datetime

from sqlmodel import Field, SQLModel


class ProductoCategoriaCreate(SQLModel):
    producto_id: int = Field(..., description="ID del producto")
    categoria_id: int = Field(..., description="ID de la categoría")
    es_principal: bool = Field(
        default=False,
        description="Indica si esta categoría es la principal del producto"
    )


class ProductoCategoriaUpdate(SQLModel):
    es_principal: bool = Field(
        ...,
        description="Permite cambiar si la categoría es principal para el producto"
    )


class ProductoCategoriaRead(SQLModel):
    producto_id: int
    producto_nombre: str
    categoria_id: int
    categoria_nombre: str
    es_principal: bool
    created_at: datetime


class ProductoCategoriaList(SQLModel):
    data: list[ProductoCategoriaRead]
    total: int
