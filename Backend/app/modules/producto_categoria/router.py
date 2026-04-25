from typing import Annotated

from fastapi import APIRouter, Depends, Path, status

from app.core.database import session_factory
from app.modules.producto.unit_of_work import ProductoUnitOfWork
from app.modules.producto_categoria.schemas import (
    ProductoCategoriaCreate,
    ProductoCategoriaList,
    ProductoCategoriaRead,
    ProductoCategoriaUpdate,
)
from app.modules.producto_categoria.service import ProductoCategoriaService

router = APIRouter()


def get_producto_categoria_service() -> ProductoCategoriaService:
    return ProductoCategoriaService(ProductoUnitOfWork(session_factory))


@router.post(
    "/",
    response_model=ProductoCategoriaRead,
    status_code=status.HTTP_201_CREATED,
    summary="Crear relación producto-categoría"
)
def create_producto_categoria(
    data: ProductoCategoriaCreate,
    svc: ProductoCategoriaService = Depends(get_producto_categoria_service)
):
    return svc.create(data)


@router.get(
    "/producto/{producto_id}",
    response_model=ProductoCategoriaList,
    summary="Listar categorías de un producto"
)
def list_categorias_de_producto(
    producto_id: Annotated[int, Path(ge=1, description="ID del producto")],
    svc: ProductoCategoriaService = Depends(get_producto_categoria_service)
):
    return svc.list_by_producto(producto_id)


@router.get(
    "/categoria/{categoria_id}",
    response_model=ProductoCategoriaList,
    summary="Listar productos de una categoría"
)
def list_productos_de_categoria(
    categoria_id: Annotated[int, Path(ge=1, description="ID de la categoría")],
    svc: ProductoCategoriaService = Depends(get_producto_categoria_service)
):
    return svc.list_by_categoria(categoria_id)


@router.patch(
    "/producto/{producto_id}/categoria/{categoria_id}",
    response_model=ProductoCategoriaRead,
    summary="Actualizar relación producto-categoría"
)
def update_producto_categoria(
    producto_id: Annotated[int, Path(ge=1, description="ID del producto")],
    categoria_id: Annotated[int, Path(ge=1, description="ID de la categoría")],
    data: ProductoCategoriaUpdate,
    svc: ProductoCategoriaService = Depends(get_producto_categoria_service)
):
    return svc.update(producto_id, categoria_id, data)


@router.delete(
    "/producto/{producto_id}/categoria/{categoria_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar relación producto-categoría"
)
def delete_producto_categoria(
    producto_id: Annotated[int, Path(ge=1, description="ID del producto")],
    categoria_id: Annotated[int, Path(ge=1, description="ID de la categoría")],
    svc: ProductoCategoriaService = Depends(get_producto_categoria_service)
):
    svc.delete(producto_id, categoria_id)
