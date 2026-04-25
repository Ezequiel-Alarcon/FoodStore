from app.core.unit_of_work import UnitOfWork
from app.modules.ingrediente.repository import IngredienteRepository
from app.modules.producto.repository import ProductoRepository



class IngredienteUnitOfWork(UnitOfWork):
    def __init__(self, session_factory) -> None:
        super().__init__(session_factory)

    def __enter__(self):
        super().__enter__()
        self.ingredientes = IngredienteRepository(self._session)
        self.productos = ProductoRepository(self._session)
        return self