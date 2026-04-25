from sqlmodel import SQLModel, create_engine, Session
from app.core.config import settings

if not settings.DATABASE_URL:
    raise ValueError(
        "DATABASE_URL is not set. Please configure it in the .env file or as an environment variable."
    )

engine = create_engine(
    settings.DATABASE_URL,
    echo=True,
)

def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)

#crea una nueva sesion por request, con expire_on_commit=False para evitar que 
# los objetos se vuelvan obsoletos después de un commit
def session_factory() -> Session:
    return Session(engine, expire_on_commit=False)