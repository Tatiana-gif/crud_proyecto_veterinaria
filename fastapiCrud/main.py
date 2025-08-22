from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from config_db import Base, engine, get_db
import models
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordRequestForm

app = FastAPI()

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    
    if form_data.username == "admin" and form_data.password == "1234":
        return {"access_token": "fake-token-admin", "token_type": "bearer"}
    return {"error": "Credenciales inválidas"}

# Crear tablas automáticamente
Base.metadata.create_all(bind=engine)

app = FastAPI()

# ---------------- SCHEMAS ----------------
class PersonaBase(BaseModel):
    nombre: str
    apellido: str

class PersonaOut(PersonaBase):
    id_persona: int
    class Config:
        orm_mode = True


class TipoBase(BaseModel):
    cargo: str

class TipoOut(TipoBase):
    id_tipo: int
    class Config:
        orm_mode = True

class UsuarioBase(BaseModel):
    usuario: str
    password: str
    id_persona: int
    id_tipo: int

class UsuarioOut(UsuarioBase):
    id_usuario: int
    class Config:
        orm_mode = True

# ---------------- ENDPOINTS PERSONA ----------------
@app.post("/personas/", response_model=PersonaOut)
def create_persona(persona: PersonaBase, db: Session = Depends(get_db)):
    db_persona = models.Persona(**persona.dict())
    db.add(db_persona)
    db.commit()
    db.refresh(db_persona)
    return db_persona

@app.get("/personas/", response_model=list[PersonaOut])
def get_personas(db: Session = Depends(get_db)):
    return db.query(models.Persona).all()

@app.get("/personas/{id}", response_model=PersonaOut)
def get_persona(id: int, db: Session = Depends(get_db)):
    persona = db.query(models.Persona).filter(models.Persona.id_persona == id).first()
    if not persona:
        raise HTTPException(status_code=404, detail="Persona no encontrada")
    return persona

@app.put("/personas/{id}", response_model=PersonaOut)
def update_persona(id: int, datos: PersonaBase, db: Session = Depends(get_db)):
    persona = db.query(models.Persona).filter(models.Persona.id_persona == id).first()
    if not persona:
        raise HTTPException(status_code=404, detail="Persona no encontrada")
    persona.nombre = datos.nombre
    persona.apellido = datos.apellido
    db.commit()
    db.refresh(persona)
    return persona

@app.delete("/personas/{id}")
def delete_persona(id: int, db: Session = Depends(get_db)):
    persona = db.query(models.Persona).filter(models.Persona.id_persona == id).first()
    if not persona:
        raise HTTPException(status_code=404, detail="Persona no encontrada")
    db.delete(persona)
    db.commit()
    return {"message": "Persona eliminada correctamente"}

# ---------------- ENDPOINTS TIPO ----------------
@app.post("/tipos/", response_model=TipoOut)
def create_tipo(tipo: TipoBase, db: Session = Depends(get_db)):
    db_tipo = models.Tipo(**tipo.dict())
    db.add(db_tipo)
    db.commit()
    db.refresh(db_tipo)
    return db_tipo

@app.get("/tipos/", response_model=list[TipoOut])
def get_tipos(db: Session = Depends(get_db)):
    return db.query(models.Tipo).all()

@app.get("/tipos/{id}", response_model=TipoOut)
def get_tipo(id: int, db: Session = Depends(get_db)):
    tipo = db.query(models.Tipo).filter(models.Tipo.id_tipo == id).first()
    if not tipo:
        raise HTTPException(status_code=404, detail="Tipo no encontrado")
    return tipo

@app.put("/tipos/{id}", response_model=TipoOut)
def update_tipo(id: int, datos: TipoBase, db: Session = Depends(get_db)):
    tipo = db.query(models.Tipo).filter(models.Tipo.id_tipo == id).first()
    if not tipo:
        raise HTTPException(status_code=404, detail="Tipo no encontrado")
    tipo.cargo = datos.cargo
    db.commit()
    db.refresh(tipo)
    return tipo

@app.delete("/tipos/{id}")
def delete_tipo(id: int, db: Session = Depends(get_db)):
    tipo = db.query(models.Tipo).filter(models.Tipo.id_tipo == id).first()
    if not tipo:
        raise HTTPException(status_code=404, detail="Tipo no encontrado")
    db.delete(tipo)
    db.commit()
    return {"message": "Tipo eliminado correctamente"}


# ---------------- ENDPOINTS USUARIO ----------------
@app.post("/usuarios/", response_model=UsuarioOut)
def create_usuario(usuario: UsuarioBase, db: Session = Depends(get_db)):
    db_usuario = models.Usuario(**usuario.dict())
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

@app.get("/usuarios/", response_model=list[UsuarioOut])
def get_usuarios(db: Session = Depends(get_db)):
    return db.query(models.Usuario).all()

@app.get("/usuarios/{id}", response_model=UsuarioOut)
def get_usuario(id: int, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.id_usuario == id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

@app.put("/usuarios/{id}", response_model=UsuarioOut)
def update_usuario(id: int, datos: UsuarioBase, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.id_usuario == id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    usuario.usuario = datos.usuario
    usuario.password = datos.password
    usuario.id_persona = datos.id_persona
    usuario.id_tipo = datos.id_tipo
    db.commit()
    db.refresh(usuario)
    return usuario

@app.delete("/usuarios/{id}")
def delete_usuario(id: int, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.id_usuario == id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db.delete(usuario)
    db.commit()
    return {"message": "Usuario eliminado correctamente"}
