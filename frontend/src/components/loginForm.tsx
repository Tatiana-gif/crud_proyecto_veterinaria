import { useEffect, useState } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import api from "../services/api";
import "../components/styles/loginForm.css";   
import logo from '../assets/logo.png' 

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation() as any;

  useEffect(() => {
    if (location?.state?.prefillUser) setUsername(location.state.prefillUser);
  }, [location?.state?.prefillUser]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null);

    const u = username.trim();
    const p = password.trim();
    if (!u || !p) return setErr("Usuario y contraseña son obligatorios.");

    try {
      setLoading(true);
      const body = new URLSearchParams();
      body.append("username", u);
      body.append("password", p);

      const { data } = await api.post("/login", body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      localStorage.setItem("token", data.access_token);
      navigate("/home", { replace: true });
    } catch (e: any) {
      setErr(e?.response?.data?.detail || "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="header">
        <img src={logo} className="logo" />
        <h1 className="title">Tienda de productos para mascotas Garras</h1>
      </header>

      <main className="main-login">
        <div className="login-page">
          <section className="login-card" aria-label="Iniciar sesión">
            <header className="login-header">
              <h1 className="login-title">Bienvenido</h1>
              <p className="login-subtitle">Accede con tu cuenta</p>
            </header>

            <form className="login-form" onSubmit={onSubmit} noValidate>
              <div className="form-row">
                <label htmlFor="username" className="form-label">Usuario</label>
                <input
                  id="username"
                  name="username"
                  className="form-input"
                  placeholder="tu_usuario"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); if (err) setErr(null); }}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <div className="form-password">
                  <input
                    id="password"
                    name="password"
                    type={showPw ? "text" : "password"}
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (err) setErr(null); }}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => setShowPw(s => !s)}
                    aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPw ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              {err && <div className="form-error" role="alert">{err}</div>}

              <div className="form-actions">
                <button className="btn-primary" type="submit" disabled={loading}>
                  {loading ? "Ingresando..." : "Ingresar"}
                </button>
              </div>
            </form>

          </section>
        </div>
      </main>

      <footer className="footer">
        <p className="contact">Contáctanos</p>
        <a className="hyperlink" href="#" aria-label="Ir al enlace destacado">
          <div className="link-box" aria-hidden />
          <span className="link-text">Hyperlink</span>
        </a>
      </footer>
    </div>
  );
}
