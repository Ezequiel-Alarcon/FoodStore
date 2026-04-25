from typing import TYPE_CHECKING

from app.modules.producto.models import ProductoCategoria
from ..model_base.base_model import BaseModel
from sqlmodel import Field, Relationship, Column, Integer, ForeignKey

# Evitar las importaciones circulares
if TYPE_CHECKING:
    from ..producto.models import Producto


class Categoria(BaseModel, table=True):
    parent_id: int | None = Field(
        default=None,
        sa_column=Column(Integer, ForeignKey("categoria.id", ondelete="SET NULL")),
        description="FK a categoría padre"
    )
    nombre: str = Field(..., unique=True, max_length=100, description="Nombre de la categoría")
    descripcion: str | None = Field(default=None, description="Descripción")
    imagen_url: str = Field(..., description="URL de imagen de la categoría")

    # Relación con productos a través de la tabla intermedia
    productos: list["Producto"] = Relationship(
        back_populates="categorias",
        link_model=ProductoCategoria
    )