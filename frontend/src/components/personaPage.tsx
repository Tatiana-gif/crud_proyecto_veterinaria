import type { JSX } from "react";
import "../components/styles/personaPage.css";
import { Link, useNavigate } from "react-router-dom";  
import { useEffect, useState } from "react";
import api from "../services/api";
import logo from '../assets/logo.png'


type Persona = {
  id_persona: number;
  nombre: string;
  apellido: string;
};

export default function PersonasPage(): JSX.Element {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();                     

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const { data } = await api.get<Persona[]>("/personas/");
        setPersonas(data ?? []);
      } catch (e: any) {
        setErr(e?.response?.data?.detail || "Error cargando personas");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta persona? Se eliminarán también sus datos asociados.")) return;
    setErr(null);
    try {
      await api.delete(`/personas/${id}`);
      setPersonas(prev => prev.filter(p => p.id_persona !== id));
    } catch (e: any) {
      setErr(e?.response?.data?.detail || "No se pudo eliminar");
    }
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    try { delete (api as any).defaults.headers.common.Authorization; } catch {}
    navigate("/login", { replace: true });
  };

  return (
    <div className="personas-page">
      <header className="personas-header">
         <img src={logo} className="logo" />

        <h1 className="personas-title">
          Tienda de productos para mascotas Garras
        </h1>

        <div style={{ marginLeft: "auto" }}>
          <button className="button button-danger" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="personas-main">
        <nav className="personas-tabs" aria-label="Navegación secciones">
          <Link className="personas-tab" to="/home">Inicio</Link>
          <Link className="personas-tab" to="/cargos">Cargos</Link>
          <Link className="personas-tab active" aria-current="page" to="/personas">Personas</Link>
          <Link className="personas-tab" to="/usuarios">Usuarios</Link>
        </nav>

        <section className="personas-card">
          <div className="personas-card-header">Lista de Personas</div>
          <div className="personas-card-body">
            {err && <div style={{ color: "red", marginBottom: 8 }}>{err}</div>}

            <div className="personas-table-wrap">
              <table className="personas-table" aria-label="Tabla de personas">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={3}>Cargando...</td></tr>
                  ) : personas.length > 0 ? (
                    personas.map(p => (
                      <tr key={p.id_persona}>
                        <td>{p.nombre}</td>
                        <td>{p.apellido}</td>
                        <td>
                          <button
                            className="button button-danger"
                            type="button"
                            onClick={() => onDelete(p.id_persona)}
                            title="Eliminar persona"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={3}>No hay personas registradas</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <footer className="personas-footer">
        <p className="personas-contact">Contáctanos</p>
        <a className="personas-hyperlink" href="#" aria-label="Ir al enlace destacado">
          <div className="personas-link-box" aria-hidden />
          <span className="personas-link-text">Hyperlink</span>
        </a>
      </footer>
    </div>
  );
}
