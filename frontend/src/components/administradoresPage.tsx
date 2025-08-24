import type { JSX } from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Modal from "./modal";
import "../components/styles/administradores.css";
import "../components/styles/modal.css";
import logo from '../assets/logo.png'

type Usuario = {
  id_persona: number;
  usuario: string;
  password: string;
  id_tipo: number;
};

type Tipo = { id_tipo: number; cargo: string };
type RowState = Usuario & { isEditing?: boolean };

const extractAxiosError = (e: any) => {
  const r = e?.response;
  if (!r) return e?.message || "Error de red";
  if (typeof r.data?.detail === "string") return r.data.detail;
  if (Array.isArray(r.data?.detail)) return r.data.detail.map((x: any) => x.msg).join(" · ");
  return r.data?.message || `Error ${r.status}`;
};

export default function AdministradoresPage(): JSX.Element {
  const [rows, setRows] = useState<RowState[]>([]);
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Wizard
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [busy, setBusy] = useState(false);
  const [wErr, setWErr] = useState<string | null>(null);

  // Datos del wizard
  const [persona, setPersona] = useState({ nombre: "", apellido: "" });
  const [cargo, setCargo] = useState({ cargo: "" });
  const [userDraft, setUserDraft] = useState({ usuario: "", password: "" });

  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("token");
    try { delete (api as any).defaults.headers.common.Authorization; } catch {}
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const [{ data: users }, tiposRes] = await Promise.all([
          api.get<Usuario[]>("/usuarios/"),
          api.get<Tipo[]>("/tipos/").catch(() => ({ data: [] as Tipo[] })),
        ]);
        setRows(users ?? []);
        setTipos(tiposRes.data ?? []);
      } catch (e: any) {
        setErr(extractAxiosError(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getCargoName = (id_tipo: number) =>
    tipos.find((t) => t.id_tipo === id_tipo)?.cargo ?? "—";

  const startEdit = (id_persona: number) =>
    setRows((prev) => prev.map((r) => (r.id_persona === id_persona ? { ...r, isEditing: true } : r)));

  const cancelEdit = (id_persona: number) =>
    setRows((prev) => prev.map((r) => (r.id_persona === id_persona ? { ...r, isEditing: false } : r)));

  const onEditChange = (id_persona: number, field: keyof Usuario, value: string | number) =>
    setRows((prev) => prev.map((r) => (r.id_persona === id_persona ? { ...r, [field]: value } : r)));

  const saveEdit = async (row: RowState) => {
    setErr(null);
    try {
      const payload: Usuario = {
        id_persona: row.id_persona,
        usuario: row.usuario,
        password: row.password,
        id_tipo: Number(row.id_tipo),
      };
      const { data } = await api.put<Usuario>(`/usuarios/${row.id_persona}`, payload);
      setRows((prev) => prev.map((r) => (r.id_persona === row.id_persona ? { ...data, isEditing: false } : r)));
    } catch (e: any) {
      setErr(extractAxiosError(e));
    }
  };

  const remove = async (id_persona: number) => {
    if (!confirm("¿Eliminar esta persona? (Se eliminará su usuario y su cargo si queda sin uso)")) return;
    setErr(null);
    try {
      await api.delete(`/personas/${id_persona}`);
      setRows((prev) => prev.filter((r) => r.id_persona !== id_persona));
      const { data: tiposRef } = await api.get<Tipo[]>("/tipos/").catch(() => ({ data: [] as Tipo[] }));
      setTipos(tiposRef ?? []);
    } catch (e: any) {
      setErr(extractAxiosError(e));
    }
  };

  const openWizard = () => {
    setPersona({ nombre: "", apellido: "" });
    setCargo({ cargo: "" });
    setUserDraft({ usuario: "", password: "" });
    setWErr(null);
    setStep(1);
    setOpen(true);
  };

  const nextFromPersona = () => {
    setWErr(null);
    if (!persona.nombre.trim() || !persona.apellido.trim()) {
      setWErr("Nombre y apellido son obligatorios.");
      return;
    }
    setStep(2);
  };

  const nextFromCargo = () => {
    setWErr(null);
    if (!cargo.cargo.trim()) {
      setWErr("El cargo es obligatorio.");
      return;
    }
    setStep(3);
  };

  const finishWizard = async () => {
    setWErr(null);
    const u = userDraft.usuario.trim();
    const p = userDraft.password.trim();
    if (!u || !p) {
      setWErr("Usuario y contraseña son obligatorios.");
      return;
    }

    try {
      setBusy(true);

      const { data: pPersona } = await api.post("/personas/", {
        nombre: persona.nombre.trim(),
        apellido: persona.apellido.trim(),
      });

      const { data: pTipo } = await api.post("/tipos/", {
        cargo: cargo.cargo.trim(),
      });

      const { data: createdUser } = await api.post<Usuario>("/usuarios/", {
        usuario: u,
        password: p,
        id_persona: pPersona.id_persona,
        id_tipo: pTipo.id_tipo,
      });

      setRows((prev) => [createdUser, ...prev]);
      setTipos((prev) => [...prev, pTipo]);
      setOpen(false);
    } catch (e: any) {
      setWErr(extractAxiosError(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <header className="header">
      <img src={logo} className="logo" />

        <div />
        <h1 className="title">Administradores</h1>

        <div style={{ marginLeft: "auto" }}>
          <button
            onClick={onLogout}
            title="Cerrar sesión"
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid #b6c2d1",
              background: "#ef4444",
              color: "#fff",
              cursor: "pointer",
              boxShadow: "0 6px 12px rgba(239,68,68,.25)"
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="main">
        <nav className="tabs" aria-label="Navegación secciones">
          <aside className="sidebar" aria-label="Menú lateral">
            <nav className="menu">
              <Link to="/home" className="tab">Inicio</Link>
              <Link to="/cargos" className="tab">Cargos</Link>
              <Link to="/personas" className="tab">Personas</Link>
              <Link to="/usuarios" className="tab">Usuarios</Link>
              <Link to="/administradores" className="tab active" aria-current="page">Administradores</Link>
            </nav>
          </aside>
        </nav>

        <section >
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Gestión de Usuarios</span>
            <button type="button" onClick={openWizard}>Crear</button>
          </div>

          <div className="card-body">
            {err && <div style={{ color: "red", marginBottom: 10 }}>{err}</div>}

            <div className="table-wrap">
              <table className="table" aria-label="Tabla de usuarios (admin)">
                <thead>
                  <tr>
                    <th style={{ width: 120 }}>ID Persona</th>
                    <th>Usuario</th>
                    <th>Password</th>
                    <th style={{ width: 200 }}>Cargo</th>
                    <th style={{ width: 180 }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5}>Cargando...</td></tr>
                  ) : rows.length > 0 ? (
                    rows.map((r) => (
                      <tr key={r.id_persona}>
                        {!r.isEditing ? (
                          <>
                            <td>{r.id_persona}</td>
                            <td>{r.usuario}</td>
                            <td>{r.password}</td>
                            <td>{getCargoName(r.id_tipo)}</td>
                            <td style={{ display: "flex", gap: 8 }}>
                              <button type="button" onClick={() => startEdit(r.id_persona)}>Editar</button>
                              <button type="button" onClick={() => remove(r.id_persona)}>Eliminar</button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td><b>{r.id_persona}</b></td>
                            <td>
                              <input
                                value={r.usuario}
                                onChange={(e) => onEditChange(r.id_persona, "usuario", e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                value={r.password}
                                onChange={(e) => onEditChange(r.id_persona, "password", e.target.value)}
                              />
                            </td>
                            <td>
                              {tipos.length > 0 ? (
                                <select
                                  value={r.id_tipo}
                                  onChange={(e) => onEditChange(r.id_persona, "id_tipo", Number(e.target.value))}
                                >
                                  {tipos.map((t) => (
                                    <option key={t.id_tipo} value={t.id_tipo}>
                                      {t.cargo}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input value={getCargoName(r.id_tipo)} disabled />
                              )}
                            </td>
                            <td style={{ display: "flex", gap: 8 }}>
                              <button type="button" onClick={() => saveEdit(r)}>Guardar</button>
                              <button type="button" onClick={() => cancelEdit(r.id_persona)}>Cancelar</button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5}>No hay usuarios</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer-admin">
        <p className="contact">Contáctanos</p>
        <a className="hyperlink" href="#" aria-label="Ir al enlace destacado">
          <div className="link-box" aria-hidden />
          <span className="link-text">Hyperlink</span>
        </a>
      </footer>

      <Modal open={open} onClose={() => !busy && setOpen(false)}>
        <div className="modal-header" style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <h3 style={{ margin: 0 }}>Crear nuevo usuario</h3>
          <span>Paso {step} de 3</span>
        </div>

        <div className="modal-body" style={{ display: "grid", gap: 10 }}>
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); nextFromPersona(); }} className="modal-form" style={{ display: "grid", gap: 8 }}>
              <label>Nombre</label>
              <input value={persona.nombre} onChange={(e) => setPersona({ ...persona, nombre: e.target.value })} required />
              <label>Apellido</label>
              <input value={persona.apellido} onChange={(e) => setPersona({ ...persona, apellido: e.target.value })} required />
            </form>
          )}

          {step === 2 && (
            <form onSubmit={(e) => { e.preventDefault(); nextFromCargo(); }} className="modal-form" style={{ display: "grid", gap: 8 }}>
              <label>Cargo</label>
              <input value={cargo.cargo} onChange={(e) => setCargo({ cargo: e.target.value })} placeholder="Ej. Administrador" required />
            </form>
          )}

          {step === 3 && (
            <form onSubmit={(e) => { e.preventDefault(); finishWizard(); }} className="modal-form" style={{ display: "grid", gap: 8 }}>
              <label>Usuario</label>
              <input value={userDraft.usuario} onChange={(e) => setUserDraft({ ...userDraft, usuario: e.target.value })} required />
              <label>Contraseña</label>
              <input type="password" value={userDraft.password} onChange={(e) => setUserDraft({ ...userDraft, password: e.target.value })} required />
            </form>
          )}

          {wErr && <div style={{ color: "red" }}>{wErr}</div>}
        </div>

        <div className="modal-footer" style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
          <button type="button" onClick={() => setOpen(false)} disabled={busy}>Cancelar</button>
          {step > 1 && <button type="button" onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)} disabled={busy}>Atrás</button>}
          {step < 3 ? (
            <button type="button" onClick={step === 1 ? nextFromPersona : nextFromCargo} disabled={busy}>Siguiente</button>
          ) : (
            <button type="button" onClick={finishWizard} disabled={busy}>{busy ? "Creando..." : "Finalizar"}</button>
          )}
        </div>
      </Modal>
    </div>
  );
}
