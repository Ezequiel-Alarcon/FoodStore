from fastapi import HTTPException

from app.modules.producto.models import ProductoCategoria
from app.modules.producto.unit_of_work import ProductoUnitOfWork
from app.modules.producto_categoria.schemas import (
    ProductoCategoriaCreate,
    ProductoCategoriaList,
    ProductoCategoriaRead,
    ProductoCategoriaUpdate,
)


class ProductoCategoriaService:
    def __init__(self, uow: ProductoUnitOfWork) -> None:
        self._uow = uow

    def _get_producto_or_404(self, uow: ProductoUnitOfWork, producto_id: int):
        producto = uow.productos.get_by_id(producto_id)
        if not producto:
            raise HTTPException(
                status_code=404,
                detail=f"Producto con ID {producto_id} no encontrado"
            )
        return producto

    def _get_categoria_or_404(self, uow: ProductoUnitOfWork, categoria_id: int):
        categoria = uow.categorias.get_by_id(categoria_id)
        if not categoria:
            raise HTTPException(
                status_code=404,
                detail=f"Categoría con ID {categoria_id} no encontrada"
            )
        return categoria

    def _get_relacion_or_404(self, uow: ProductoUnitOfWork, producto_id: int, categoria_id: int):
        relacion = uow.producto_categorias.get(producto_id, categoria_id)
        if not relacion:
            raise HTTPException(
                status_code=404,
                detail="La relación producto-categoría no existe"
            )
        return relacion

    def _to_read(self, uow: ProductoUnitOfWork, relacion: ProductoCategoria) -> ProductoCategoriaRead:
        producto = self._get_producto_or_404(uow, relacion.producto_id)
        categoria = self._get_categoria_or_404(uow, relacion.categoria_id)
        return ProductoCategoriaRead(
            producto_id=relacion.producto_id,
            producto_nombre=producto.nombre,
            categoria_id=relacion.categoria_id,
            categoria_nombre=categoria.nombre,
            es_principal=relacion.es_principal,
            created_at=relacion.created_at,
        )

    def create(self, data: ProductoCategoriaCreate) -> ProductoCategoriaRead:
        with self._uow as uow:
            self._get_producto_or_404(uow, data.producto_id)
            self._get_categoria_or_404(uow, data.categoria_id)

            existente = uow.producto_categorias.get(data.producto_id, data.categoria_id)
            if existente:
                raise HTTPException(
                    status_code=400,
                    detail="El producto ya está asociado a esa categoría"
                )

            if data.es_principal:
                uow.producto_categorias.clear_principal_for_producto(data.producto_id)

            relacion = ProductoCategoria.model_validate(data)
            uow.producto_categorias.create(relacion)
            return self._to_read(uow, relacion)

    def list_by_producto(self, producto_id: int) -> ProductoCategoriaList:
        with self._uow as uow:
            self._get_producto_or_404(uow, producto_id)
            relaciones = uow.producto_categorias.list_by_producto(producto_id)
            data = [self._to_read(uow, relacion) for relacion in relaciones]
            return ProductoCategoriaList(data=data, total=len(data))

    def list_by_categoria(self, categoria_id: int) -> ProductoCategoriaList:
        with self._uow as uow:
            self._get_categoria_or_404(uow, categoria_id)
            relaciones = uow.producto_categorias.list_by_categoria(categoria_id)
            data = [self._to_read(uow, relacion) for relacion in relaciones]
            return ProductoCategoriaList(data=data, total=len(data))

    def update(self, producto_id: int, categoria_id: int, data: ProductoCategoriaUpdate) -> ProductoCategoriaRead:
        with self._uow as uow:
            relacion = self._get_relacion_or_404(uow, producto_id, categoria_id)

            if data.es_principal:
                uow.producto_categorias.clear_principal_for_producto(producto_id, keep_categoria_id=categoria_id)

            relacion.es_principal = data.es_principal
            uow.producto_categorias.create(relacion)
            return self._to_read(uow, relacion)

    def delete(self, producto_id: int, categoria_id: int) -> None:
        with self._uow as uow:
            relacion = self._get_relacion_or_404(uow, producto_id, categoria_id)
            uow.producto_categorias.delete(relacion)
