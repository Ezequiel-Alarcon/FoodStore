from typing import Annotated

from fastapi import APIRouter, Depends, Path, status

from app.core.database import session_factory
from app.modules.producto.unit_of_work import ProductoUnitOfWork
from app.modules.producto_ingrediente.schemas import (
    ProductoIngredienteCreate,
    ProductoIngredienteList,
    ProductoIngredienteRead,
    ProductoIngredienteUpdate,
)
from app.modules.producto_ingrediente.service import ProductoIngredienteService

router = APIRouter()


def get_producto_ingrediente_service() -> ProductoIngredienteService:
    return ProductoIngredienteService(ProductoUnitOfWork(session_factory))


@router.post(
    "/",
    response_model=ProductoIngredienteRead,
    status_code=status.HTTP_201_CREATED,
    summary="Crear relación producto-ingrediente"
)
def create_producto_ingrediente(
    data: ProductoIngredienteCreate,
    svc: ProductoIngredienteService = Depends(get_producto_ingrediente_service)
):
    return svc.create(data)


@router.get(
    "/producto/{producto_id}",
    response_model=ProductoIngredienteList,
    summary="Listar ingredientes de un producto"
)
def list_ingredientes_de_producto(
    producto_id: Annotated[int, Path(ge=1, description="ID del producto")],
    svc: ProductoIngredienteService = Depends(get_producto_ingrediente_service)
):
    return svc.list_by_producto(producto_id)


@router.get(
    "/ingrediente/{ingrediente_id}",
    response_model=ProductoIngredienteList,
    summary="Listar productos de un ingrediente"
)
def list_productos_de_ingrediente(
    ingrediente_id: Annotated[int, Path(ge=1, description="ID del ingrediente")],
    svc: ProductoIngredienteService = Depends(get_producto_ingrediente_service)
):
    return svc.list_by_ingrediente(ingrediente_id)


@router.patch(
    "/producto/{producto_id}/ingrediente/{ingrediente_id}",
    response_model=ProductoIngredienteRead,
    summary="Actualizar relación producto-ingrediente"
)
def update_producto_ingrediente(
    producto_id: Annotated[int, Path(ge=1, description="ID del producto")],
    ingrediente_id: Annotated[int, Path(ge=1, description="ID del ingrediente")],
    data: ProductoIngredienteUpdate,
    svc: ProductoIngredienteService = Depends(get_producto_ingrediente_service)
):
    return svc.update(producto_id, ingrediente_id, data)


@router.delete(
    "/producto/{producto_id}/ingrediente/{ingrediente_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar relación producto-ingrediente"
)
def delete_producto_ingrediente(
    producto_id: Annotated[int, Path(ge=1, description="ID del producto")],
    ingrediente_id: Annotated[int, Path(ge=1, description="ID del ingrediente")],
    svc: ProductoIngredienteService = Depends(get_producto_ingrediente_service)
):
    svc.delete(producto_id, ingrediente_id)
