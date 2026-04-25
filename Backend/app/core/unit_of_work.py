

class UnitOfWork:
    #Inicializa la sesión de la base de datos
    def __init__(self, session_factory) -> None:
        self._session_factory = session_factory

    #Abre la misma sesion para todos los repositorios cuando se usa la palabra "with"
    def __enter__(self) -> "UnitOfWork":
        # Crea una nueva sesión usando session_factory
        self._session = self._session_factory() 
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        if exc_type is None:
            self._session.commit()
        else:
            self._session.rollback()
        self._session.close()


    def commit(self) -> None:
        self._session.commit()

    def rollback(self) -> None:
        self._session.rollback()