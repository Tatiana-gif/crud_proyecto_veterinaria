from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from config_db import Base

class Persona(Base):
    __tablename__ = "persona"
    id_persona = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(45))
    apellido = Column(String(45))

    usuario = relationship("Usuario", back_populates="persona", uselist=False)


class Tipo(Base):
    __tablename__ = "tipo"
    id_tipo = Column(Integer, primary_key=True, index=True)
    cargo = Column(String(45))

    usuarios = relationship("Usuario", back_populates="tipo")


class Usuario(Base):
    __tablename__ = "usuario"
    id_persona = Column(Integer, ForeignKey("persona.id_persona"), primary_key=True)
    id_tipo = Column(Integer, ForeignKey("tipo.id_tipo"))
    usuario = Column(String(45), unique=True)
    password = Column(String(45))

    persona = relationship("Persona", back_populates="usuario")
    tipo = relationship("Tipo", back_populates="usuarios")
