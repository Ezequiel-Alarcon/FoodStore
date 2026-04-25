from fastapi import HTTPException

from app.modules.producto.models import ProductoIngrediente
from app.modules.producto.unit_of_work import ProductoUnitOfWork
from app.modules.producto_ingrediente.schemas import (
    ProductoIngredienteCreate,
    ProductoIngredienteList,
    ProductoIngredienteRead,
    ProductoIngredienteUpdate,
)


class ProductoIngredienteService:
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

    def _get_ingrediente_or_404(self, uow: ProductoUnitOfWork, ingrediente_id: int):
        ingrediente = uow.ingredientes.get_by_id(ingrediente_id)
        if not ingrediente:
            raise HTTPException(
                status_code=404,
                detail=f"Ingrediente con ID {ingrediente_id} no encontrado"
            )
        return ingrediente

    def _get_relacion_or_404(self, uow: ProductoUnitOfWork, producto_id: int, ingrediente_id: int):
        relacion = uow.producto_ingredientes.get(producto_id, ingrediente_id)
        if not relacion:
            raise HTTPException(
                status_code=404,
                detail="La relación producto-ingrediente no existe"
            )
        return relacion

    def _to_read(self, uow: ProductoUnitOfWork, relacion: ProductoIngrediente) -> ProductoIngredienteRead:
        producto = self._get_producto_or_404(uow, relacion.producto_id)
        ingrediente = self._get_ingrediente_or_404(uow, relacion.ingrediente_id)
        return ProductoIngredienteRead(
            producto_id=relacion.producto_id,
            producto_nombre=producto.nombre,
            ingrediente_id=relacion.ingrediente_id,
            ingrediente_nombre=ingrediente.nombre,
            es_removible=relacion.es_removible,
            created_at=relacion.created_at,
        )

    def create(self, data: ProductoIngredienteCreate) -> ProductoIngredienteRead:
        with self._uow as uow:
            self._get_producto_or_404(uow, data.producto_id)
            self._get_ingrediente_or_404(uow, data.ingrediente_id)

            existente = uow.producto_ingredientes.get(data.producto_id, data.ingrediente_id)
            if existente:
                raise HTTPException(
                    status_code=400,
                    detail="El producto ya está asociado a ese ingrediente"
                )

            relacion = ProductoIngrediente.model_validate(data)
            uow.producto_ingredientes.create(relacion)
            return self._to_read(uow, relacion)

    def list_by_producto(self, producto_id: int) -> ProductoIngredienteList:
        with self._uow as uow:
            self._get_producto_or_404(uow, producto_id)
            relaciones = uow.producto_ingredientes.list_by_producto(producto_id)
            data = [self._to_read(uow, relacion) for relacion in relaciones]
            return ProductoIngredienteList(data=data, total=len(data))

    def list_by_ingrediente(self, ingrediente_id: int) -> ProductoIngredienteList:
        with self._uow as uow:
            self._get_ingrediente_or_404(uow, ingrediente_id)
            relaciones = uow.producto_ingredientes.list_by_ingrediente(ingrediente_id)
            data = [self._to_read(uow, relacion) for relacion in relaciones]
            return ProductoIngredienteList(data=data, total=len(data))

    def update(self, producto_id: int, ingrediente_id: int, data: ProductoIngredienteUpdate) -> ProductoIngredienteRead:
        with self._uow as uow:
            relacion = self._get_relacion_or_404(uow, producto_id, ingrediente_id)
            relacion.es_removible = data.es_removible
            uow.producto_ingredientes.create(relacion)
            return self._to_read(uow, relacion)

    def delete(self, producto_id: int, ingrediente_id: int) -> None:
        with self._uow as uow:
            relacion = self._get_relacion_or_404(uow, producto_id, ingrediente_id)
            uow.producto_ingredientes.delete(relacion)
