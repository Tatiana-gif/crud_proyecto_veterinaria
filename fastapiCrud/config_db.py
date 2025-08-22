from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "mysql+pymysql://root:admin@localhost:3306/garras"

# Crear el engine sin connect_args (esto es solo para SQLite)
engine = create_engine(DATABASE_URL, echo=True, future=True)

# Crear la sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base de modelos
Base = declarative_base()

# Dependencia para usar en endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
