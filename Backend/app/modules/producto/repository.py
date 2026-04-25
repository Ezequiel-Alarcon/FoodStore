from typing import Any, cast

from sqlmodel import Session, select, func
from app.core.repository import BaseRepository
from app.modules.producto.models import Producto, ProductoCategoria, ProductoIngrediente


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session) -> None:
        # Inicializamos el repositorio con la sesión y el modelo específico
        super().__init__(session, Producto)

    # Método para obtener productos disponibles con paginación
    def get_active(self, offset: int = 0, limit: int = 20) -> list[Producto]:
        return list(self.session.exec(
            select(Producto)
            .where(Producto.disponible)
            .where(Producto.borrado == False)  # noqa: E712
            .offset(offset)
            .limit(limit)
        ).all()
        )

    # Método para contar el total de productos disponibles
    def count_active(self) -> int:
        resultado = self.session.exec(
        select(func.count()).select_from(Producto).where(Producto.disponible)
        .where(Producto.borrado == False)  # noqa: E712
        ).first()
        return resultado or 0

    # Método para obtener productos por categoría con paginación
    def get_by_category(self, categoria_id: int, offset: int = 0, limit: int = 20) -> list[Producto]:
        return list(self.session.exec(
            select(Producto)
            .join(ProductoCategoria)
            .where(ProductoCategoria.categoria_id == categoria_id)
            .where(Producto.borrado == False)  # noqa: E712
            .offset(offset)
            .limit(limit)
        ).all())

    # Método para contar productos de una categoría específica
    def count_by_category(self, categoria_id: int) -> int:
        resultado = self.session.exec(
            select(func.count()).select_from(Producto)
            .join(ProductoCategoria)
            .where(ProductoCategoria.categoria_id == categoria_id)
            .where(Producto.borrado == False)  # noqa: E712
        ).first()
        return resultado or 0


class ProductoCategoriaRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def create(self, instance: ProductoCategoria) -> ProductoCategoria:
        self.session.add(instance)
        self.session.flush()
        self.session.refresh(instance)
        return instance

    def get(self, producto_id: int, categoria_id: int) -> ProductoCategoria | None:
        return self.session.exec(
            select(ProductoCategoria)
            .where(ProductoCategoria.producto_id == producto_id)
            .where(ProductoCategoria.categoria_id == categoria_id)
        ).first()

    def list_by_producto(self, producto_id: int) -> list[ProductoCategoria]:
        return list(
            self.session.exec(
                select(ProductoCategoria)
                .where(ProductoCategoria.producto_id == producto_id)
                .order_by(cast(Any, ProductoCategoria.categoria_id))
            ).all()
        )

    def list_by_categoria(self, categoria_id: int) -> list[ProductoCategoria]:
        return list(
            self.session.exec(
                select(ProductoCategoria)
                .where(ProductoCategoria.categoria_id == categoria_id)
                .order_by(cast(Any, ProductoCategoria.producto_id))
            ).all()
        )

    def count_by_producto(self, producto_id: int) -> int:
        resultado = self.session.exec(
            select(func.count()).select_from(ProductoCategoria)
            .where(ProductoCategoria.producto_id == producto_id)
        ).first()
        return resultado or 0

    def count_by_categoria(self, categoria_id: int) -> int:
        resultado = self.session.exec(
            select(func.count()).select_from(ProductoCategoria)
            .where(ProductoCategoria.categoria_id == categoria_id)
        ).first()
        return resultado or 0

    def clear_principal_for_producto(self, producto_id: int, keep_categoria_id: int | None = None) -> None:
        relaciones = self.list_by_producto(producto_id)
        for relacion in relaciones:
            if keep_categoria_id is not None and relacion.categoria_id == keep_categoria_id:
                continue
            if relacion.es_principal:
                relacion.es_principal = False
                self.session.add(relacion)
        self.session.flush()

    def delete(self, instance: ProductoCategoria) -> None:
        self.session.delete(instance)
        self.session.flush()


class ProductoIngredienteRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def create(self, instance: ProductoIngrediente) -> ProductoIngrediente:
        self.session.add(instance)
        self.session.flush()
        self.session.refresh(instance)
        return instance

    def get(self, producto_id: int, ingrediente_id: int) -> ProductoIngrediente | None:
        return self.session.exec(
            select(ProductoIngrediente)
            .where(ProductoIngrediente.producto_id == producto_id)
            .where(ProductoIngrediente.ingrediente_id == ingrediente_id)
        ).first()

    def list_by_producto(self, producto_id: int) -> list[ProductoIngrediente]:
        return list(
            self.session.exec(
                select(ProductoIngrediente)
                .where(ProductoIngrediente.producto_id == producto_id)
                .order_by(cast(Any, ProductoIngrediente.ingrediente_id))
            ).all()
        )

    def list_by_ingrediente(self, ingrediente_id: int) -> list[ProductoIngrediente]:
        return list(
            self.session.exec(
                select(ProductoIngrediente)
                .where(ProductoIngrediente.ingrediente_id == ingrediente_id)
                .order_by(cast(Any, ProductoIngrediente.producto_id))
            ).all()
        )

    def delete(self, instance: ProductoIngrediente) -> None:
        self.session.delete(instance)
        self.session.flush()
