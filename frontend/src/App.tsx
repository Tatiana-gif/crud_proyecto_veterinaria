// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import HomePage from "./components/inicioPage";
import CargosPage from "./components/cargosPage";
import PersonasPage from "./components/personaPage";
import UsuariosPage from "./components/usuarioPage";
import AdministradoresPage from "./components/administradoresPage";
import LoginPage from "./components/loginForm";

function RequireAuth() {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <main className="main-content">
          <Routes>
            {/* Al entrar a /, manda al login */}
            <Route index element={<Navigate to="/login" replace />} />

            {/* El login NUNCA va detrás del guard */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rutas protegidas */}
            <Route element={<RequireAuth />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/cargos" element={<CargosPage />} />
              <Route path="/personas" element={<PersonasPage />} />
              <Route path="/usuarios" element={<UsuariosPage />} />
              <Route path="/administradores" element={<AdministradoresPage />} />
            </Route>

            {/* Catch-all: cualquier ruta desconocida -> login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
