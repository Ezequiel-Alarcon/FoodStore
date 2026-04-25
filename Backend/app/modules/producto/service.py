from fastapi import HTTPException
from typing import cast

from app.modules.producto.models import Producto
from app.modules.producto.schemas import (
    CategoriaBasicRead,
    IngredienteBasicRead,
    ProductoCreate,
    ProductoReadFull,
    ProductoUpdate,
)

from app.modules.producto.unit_of_work import ProductoUnitOfWork

class ProductoService:
    def __init__(self, uow: ProductoUnitOfWork) -> None:
            self._uow = uow

    # ── Helpers privados ─────────────────────────────────────────────────────
    def _get_or_404(self, uow: ProductoUnitOfWork, producto_id: int) -> Producto:
        producto = uow.productos.get_by_id(producto_id)
        if not producto:
            raise HTTPException(
                status_code=404,
                detail=f"Producto con ID {producto_id} no encontrado"
            )
        return producto
    
    def _validar_nombre_unico(self, name: str) -> None:
        with self._uow as uow:
            producto = uow.productos.get_by_name(name)
            if producto:
                raise HTTPException(
                    status_code=400,
                    detail=f"El nombre '{name}' ya está en uso por otro producto"
                )

    def _to_read_full(self, uow: ProductoUnitOfWork, producto: Producto) -> ProductoReadFull:
        categoria_links = uow.producto_categorias.list_by_producto(cast(int, producto.id))
        categoria_principal_por_id = {
            link.categoria_id: link.es_principal
            for link in categoria_links
        }

        categorias = [
            CategoriaBasicRead(
                id=cast(int, categoria.id),
                nombre=categoria.nombre,
                es_principal=categoria_principal_por_id.get(cast(int, categoria.id), False),
            )
            for categoria in producto.categorias
            if not categoria.borrado
        ]
        ingredientes = [
            IngredienteBasicRead(
                id=cast(int, ingrediente.id),
                nombre=ingrediente.nombre,
                es_alergeno=ingrediente.es_alergeno,
            )
            for ingrediente in producto.ingredientes
            if not ingrediente.borrado
        ]
        return ProductoReadFull(
            id=cast(int, producto.id),
            nombre=producto.nombre,
            descripcion=producto.descripcion,
            precio_base=producto.precio_base,
            imagenes_url=producto.imagenes_url,
            stock_cantidad=producto.stock_cantidad,
            disponible=producto.disponible,
            categorias=categorias,
            ingredientes=ingredientes,
        )

    # ── Métodos públicos ───────────────────────────────────────────────────

    def create(self, data: ProductoCreate) -> ProductoReadFull:
        self._validar_nombre_unico(data.nombre)
        nuevo_producto = Producto.model_validate(data)
        with self._uow as uow:
            uow.productos.create(nuevo_producto)
            return self._to_read_full(uow, nuevo_producto)

    def get_all(self, offset: int = 0, limit: int = 20):
        with self._uow as uow:
            productos = uow.productos.get_all(offset, limit)
            total = uow.productos.count()
            resultado = {"data": [self._to_read_full(uow, p) for p in productos], "total": total}
            return resultado
    
    def get_active(self, offset: int = 0, limit: int = 20):
        with self._uow as uow:
            productos = uow.productos.get_active(offset, limit)
            total = uow.productos.count_active()
            resultado = {"data": [self._to_read_full(uow, p) for p in productos], "total": total}
            return resultado
    
    def get_by_category(self, categoria_id: int, offset: int = 0, limit: int = 20):
        with self._uow as uow:
            categoria = uow.categorias.get_by_id(categoria_id)
            if not categoria:
                raise HTTPException(
                    status_code=404,
                    detail=f"Categoría con ID {categoria_id} no encontrada"
                )
            productos = uow.productos.get_by_category(categoria_id, offset, limit)
            total = uow.productos.count_by_category(categoria_id)
            resultado = {"data": [self._to_read_full(uow, p) for p in productos], "total": total}
            return resultado
    
    def get_by_id(self, producto_id: int) -> ProductoReadFull:
        with self._uow as uow:
            producto = self._get_or_404(uow, producto_id)
            return self._to_read_full(uow, producto)
    
    def update(self, producto_id: int, data: ProductoUpdate) -> ProductoReadFull:
        with self._uow as uow:
            producto = self._get_or_404(uow, producto_id)
            patch = data.model_dump(exclude_unset=True)

            if "nombre" in patch and patch["nombre"] != producto.nombre:
                existente = uow.productos.get_by_name(patch["nombre"])
                if existente and existente.id != producto_id:
                    raise HTTPException(
                        status_code=400,
                        detail=f"El nombre '{patch['nombre']}' ya está en uso por otro producto"
                    )

            for field, value in patch.items():
                setattr(producto, field, value)

            uow.productos.update(producto)
            return self._to_read_full(uow, producto)

    def delete(self, producto_id: int) -> None:
        with self._uow as uow:
            producto = self._get_or_404(uow, producto_id)
            uow.productos.delete(producto)
