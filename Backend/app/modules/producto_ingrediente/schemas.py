from datetime import datetime

from sqlmodel import Field, SQLModel


class ProductoIngredienteCreate(SQLModel):
    producto_id: int = Field(..., description="ID del producto")
    ingrediente_id: int = Field(..., description="ID del ingrediente")
    es_removible: bool = Field(
        default=False,
        description="Indica si el ingrediente puede quitarse del producto"
    )


class ProductoIngredienteUpdate(SQLModel):
    es_removible: bool = Field(
        ...,
        description="Permite cambiar si el ingrediente es removible"
    )


class ProductoIngredienteRead(SQLModel):
    producto_id: int
    producto_nombre: str
    ingrediente_id: int
    ingrediente_nombre: str
    es_removible: bool
    created_at: datetime


class ProductoIngredienteList(SQLModel):
    data: list[ProductoIngredienteRead]
    total: int
