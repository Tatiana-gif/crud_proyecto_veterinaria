import type { JSX } from "react";
import "../components/styles/usuarioPage.css";
import { Link, useNavigate } from "react-router-dom"; // ← useNavigate
import { useEffect, useState } from "react";
import api from "../services/api"; 
import logo from '../assets/logo.png'


type Row = {
  id: number;
  nombre: string;
  password: string;
};

export default function UsuariosPage(): JSX.Element {
  const [usuarios, setUsuarios] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [rawCount, setRawCount] = useState(0);
  const [rawKeys, setRawKeys] = useState<string[]>([]);

  const navigate = useNavigate(); // ← nav para logout

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
        const { data } = await api.get("/usuarios/");
        console.log("raw /usuarios/:", data);

        const isArray = Array.isArray(data);
        setRawCount(isArray ? data.length : 0);
        setRawKeys(isArray && data.length ? Object.keys(data[0]) : []);

        const rows: Row[] = isArray
          ? data
              .map((r: any): Row | null => {
                const id = r?.id_persona ?? r?.id_usuario ?? r?.id ?? null;
                const nombre = r?.usuario ?? r?.nombre ?? r?.username ?? null;
                const password = r?.password ?? r?.contraseña ?? "";
                if (id == null || nombre == null) return null;
                return { id: Number(id), nombre: String(nombre), password: String(password) };
              })
              .filter((x): x is Row => x !== null)
          : [];

        setUsuarios(rows);
      } catch (e: any) {
        console.error("Error cargando /usuarios/:", e);
        setErr(e?.message || "Error cargando usuarios");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="usuarios-page">
      <header className="usuarios-header">
        <img src={logo} className="logo" />
        <h1 className="usuarios-title">
          Tienda de productos para mascotas Garras
        </h1>

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

      <main className="usuarios-main">
        <nav className="usuarios-tabs" aria-label="Navegación secciones">
          <Link className="usuarios-tab" to="/home">Inicio</Link>
          <Link className="usuarios-tab" to="/cargos">Cargos</Link>
          <Link className="usuarios-tab" to="/personas">Personas</Link>
          <Link className="usuarios-tab active" aria-current="page" to="/usuarios">
            Usuarios
          </Link>
        </nav>

        <section className="usuarios-card">
          <div className="usuarios-card-header">Lista de Usuarios</div>
          <div className="usuarios-card-body">
            <div className="usuarios-table-wrap">
              <table className="usuarios-table" aria-label="Tabla de usuarios">
                <thead>

                  <tr>
                    <th>Nombre completo</th>
                    <th>Contraseña</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={2}>Cargando...</td></tr>
                  ) : err ? (
                    <tr><td colSpan={2} style={{ color: "red" }}>{err}</td></tr>
                  ) : usuarios.length > 0 ? (
                    usuarios.map((u) => (
                      <tr key={u.id}>
                        <td>{u.nombre}</td>
                        <td>{u.password}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={2}>No hay usuarios registrados</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {!loading && !err && usuarios.length === 0 && rawCount > 0 && (
              <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
                * Datos recibidos pero no mapeados. Claves detectadas: [{rawKeys.join(", ")}]
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="usuarios-footer">
        <p className="usuarios-contact">Contáctanos</p>
        <a className="usuarios-hyperlink" href="#" aria-label="Ir al enlace destacado">
          <div className="usuarios-link-box" aria-hidden />
          <span className="usuarios-link-text">Hyperlink</span>
        </a>
      </footer>
    </div>
  );
}
