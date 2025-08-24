import type { JSX } from "react";
import "../components/styles/cargosPage.css";
import { Link, useNavigate } from "react-router-dom"; // ← useNavigate
import { useEffect, useState } from "react";
import api from "../services/api";
import logo from '../assets/logo.png'


type TipoRow = {
  id_tipo: number;
  cargo: string;
};

export default function cargosPageGarras(): JSX.Element {
  const [rows, setRows] = useState<TipoRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

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
        let res;
        try {
          res = await api.get("/tipos/");
        } catch (e: any) {
          if (e?.response?.status === 404) {
            res = await api.get("/cargos/");
          } else {
            throw e;
          }
        }

        const data = Array.isArray(res.data) ? res.data : [];
        const normalized: TipoRow[] = data
          .map((r: any): TipoRow | null => {
            const id = r?.id_tipo ?? r?.id ?? r?.id_cargo;
            const cargo = r?.cargo ?? r?.nombre ?? r?.name;
            if (id == null || cargo == null) return null;
            return { id_tipo: Number(id), cargo: String(cargo) };
          })
          .filter((x): x is TipoRow => x !== null);

        setRows(normalized);
      } catch (e: any) {
        setErr(e?.message || "Error cargando cargos");
        console.error("GET /tipos|/cargos failed:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="page">
      <header className="header">
        <img src={logo} className="logo" />
        <h1 className="title">Tienda de productos para mascotas Garras</h1>

        {/* Botón Cerrar sesión a la derecha */}
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
              <Link to="/administradores" className="tab">Administradores</Link>
            </nav>
          </aside>
        </nav>

        <section className="card">
          <div className="card-header">Lista de Cargos</div>
          <div className="card-body">
            <div className="table-wrap">
              <table className="table" aria-label="Tabla de cargos">
                <thead>
                  <tr>
                    <th>id_tipo</th>
                    <th>cargo</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={2}>Cargando...</td></tr>
                  ) : err ? (
                    <tr><td colSpan={2} style={{ color: "red" }}>{err}</td></tr>
                  ) : rows.length > 0 ? (
                    rows.map((r) => (
                      <tr key={r.id_tipo}>
                        <td>{r.id_tipo}</td>
                        <td>{r.cargo}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={2}>No hay cargos registrados</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer-cargos">
        <p className="contact">Contáctanos</p>
        <a className="hyperlink" href="#" aria-label="Ir al enlace destacado">
          <div className="link-box" aria-hidden />
          <span className="link-text">Hyperlink</span>
        </a>
      </footer>
    </div>
  );
}
