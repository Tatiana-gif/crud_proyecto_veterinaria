from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from config_db import Base

class Persona(Base):
    __tablename__ = "persona"

    id_persona = Column(Integer, primary_key=True, autoincrement=True, index=True)
    nombre = Column(String(45), nullable=False)
    apellido = Column(String(45), nullable=False)

    # Relación 1–1 con Usuario. Si borras Persona, borra su Usuario (via ON DELETE CASCADE).
    usuario = relationship(
        "Usuario",
        back_populates="persona",
        uselist=False,
        passive_deletes=True,
    )


class Tipo(Base):
    __tablename__ = "tipo"

    id_tipo = Column(Integer, primary_key=True, autoincrement=True, index=True)
    cargo = Column(String(45), nullable=False)

    usuarios = relationship("Usuario", back_populates="tipo")


class Usuario(Base):
    __tablename__ = "usuario"

    id_persona = Column(
        Integer,
        ForeignKey("persona.id_persona", ondelete="CASCADE"),
        primary_key=True,
    )
    id_tipo = Column(Integer, ForeignKey("tipo.id_tipo"), nullable=False)

    usuario = Column(String(45), unique=True, nullable=False)
    password = Column(String(128), nullable=False)

    persona = relationship("Persona", back_populates="usuario")
    tipo = relationship("Tipo", back_populates="usuarios")
