from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel

from config_db import Base, engine, get_db
import models

app = FastAPI()

# ---- CORS (frontend en 5173/3000) ----
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,     
    allow_credentials=False,    
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear tablas automáticamente
Base.metadata.create_all(bind=engine)

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


class UsuarioOut(BaseModel):
    id_persona: int
    id_tipo: int
    usuario: str
    password: str
    class Config:
        orm_mode = True


# ---------------- LOGIN ----------------
@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    Autenticación básica contra la tabla Usuario.
    (Hoy comparas password en claro. Cuando migres a bcrypt, verifica el hash aquí.)
    """
    user = (
        db.query(models.Usuario)
        .filter(models.Usuario.usuario == form_data.username)
        .first()
    )
    if not user or user.password != form_data.password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales inválidas")

    return {"access_token": f"token-user-{user.id_persona}", "token_type": "bearer"}


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

@app.get("/personas/{id_persona}", response_model=PersonaOut)
def get_persona(id_persona: int, db: Session = Depends(get_db)):
    persona = db.query(models.Persona).filter(models.Persona.id_persona == id_persona).first()
    if not persona:
        raise HTTPException(status_code=404, detail="Persona no encontrada")
    return persona


@app.delete("/personas/{id_persona}")
def delete_persona(id_persona: int, db: Session = Depends(get_db)):
    # 1) Persona
    persona = (
        db.query(models.Persona)
        .filter(models.Persona.id_persona == id_persona)
        .first()
    )
    if not persona:
        raise HTTPException(status_code=404, detail="Persona no encontrada")

    user = (
        db.query(models.Usuario)
        .filter(models.Usuario.id_persona == id_persona)
        .first()
    )
    tipo_id = user.id_tipo if user else None

    if user:
        db.delete(user)

    db.delete(persona)
    db.commit()  

    tipo_eliminado = False
    if tipo_id is not None:
        restantes = (
            db.query(models.Usuario)
            .filter(models.Usuario.id_tipo == tipo_id)
            .count()
        )
        if restantes == 0:
            tipo = (
                db.query(models.Tipo)
                .filter(models.Tipo.id_tipo == tipo_id)
                .first()
            )
            if tipo:
                db.delete(tipo)
                db.commit()
                tipo_eliminado = True

    return {
        "message": "Persona y usuario eliminados.",
        "tipo_eliminado": tipo_eliminado
    }



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

@app.get("/usuarios/{id_persona}", response_model=UsuarioOut)
def get_usuario(id_persona: int, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.id_persona == id_persona).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

@app.put("/usuarios/{id_persona}", response_model=UsuarioOut)
def update_usuario(id_persona: int, datos: UsuarioBase, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.id_persona == id_persona).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    usuario.usuario = datos.usuario
    usuario.password = datos.password
    usuario.id_persona = datos.id_persona
    usuario.id_tipo = datos.id_tipo
    db.commit()
    db.refresh(usuario)
    return usuario

@app.delete("/usuarios/{id_persona}")
def delete_usuario(id_persona: int, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.id_persona == id_persona).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db.delete(usuario)
    db.commit()
    return {"message": "Usuario eliminado correctamente"}
# ---------------- ENDPOINTS TIPO (CARGOS) ----------------
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

@app.get("/tipos/{id_tipo}", response_model=TipoOut)
def get_tipo(id_tipo: int, db: Session = Depends(get_db)):
    tipo = db.query(models.Tipo).filter(models.Tipo.id_tipo == id_tipo).first()
    if not tipo:
        raise HTTPException(status_code=404, detail="Tipo no encontrado")
    return tipo

@app.put("/tipos/{id_tipo}", response_model=TipoOut)
def update_tipo(id_tipo: int, payload: TipoBase, db: Session = Depends(get_db)):
    tipo = db.query(models.Tipo).filter(models.Tipo.id_tipo == id_tipo).first()
    if not tipo:
        raise HTTPException(status_code=404, detail="Tipo no encontrado")
    tipo.cargo = payload.cargo
    db.commit()
    db.refresh(tipo)
    return tipo

@app.delete("/tipos/{id_tipo}")
def delete_tipo(id_tipo: int, db: Session = Depends(get_db)):
    tipo = db.query(models.Tipo).filter(models.Tipo.id_tipo == id_tipo).first()
    if not tipo:
        raise HTTPException(status_code=404, detail="Tipo no encontrado")
    db.delete(tipo)
    db.commit()
    return {"message": "Tipo eliminado correctamente"}

@app.get("/cargos/", response_model=list[TipoOut])
def get_cargos_alias(db: Session = Depends(get_db)):
    return db.query(models.Tipo).all()
