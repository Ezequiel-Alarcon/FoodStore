from app.core.unit_of_work import UnitOfWork
from app.modules.categoria.repository import CategoriaRepository
from app.modules.producto.repository import ProductoRepository



class CategoriaUnitOfWork(UnitOfWork):
    def __init__(self, session_factory) -> None:
        super().__init__(session_factory)
    
    def __enter__(self):
        super().__enter__()
        self.categorias = CategoriaRepository(self._session)
        self.productos = ProductoRepository(self._session)
        return self
