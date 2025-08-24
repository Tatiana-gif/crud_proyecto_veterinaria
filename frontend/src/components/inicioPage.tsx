import type { JSX } from 'react';
import '../components/styles/inicioPage.css';
import image from '../assets/R (2).jpeg';
import { Link, useNavigate } from "react-router-dom"; // ← useNavigate
import api from "../services/api";  
import logo from '../assets/logo.png'
                    // ← para limpiar el header auth

export default function HomePetsGarras(): JSX.Element {
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("token");
    try { delete (api as any).defaults.headers.common.Authorization; } catch {}
    navigate("/login", { replace: true });
  };

  return (
    <div className="page">
      <header className="header">
         <img src={logo} className="logo" />
        <h1 className="title">Tienda de productos para mascotas Garras</h1>

        {/* Botón a la derecha */}
        <div style={{ marginLeft: "auto" }}>
          <button
            className="button button-danger"
            onClick={onLogout}
            title="Cerrar sesión"
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid #b6c2d1",
              cursor: "pointer"
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="body">
        <aside className="sidebar" aria-label="Menú lateral">
          <nav className="menu">
            <Link className="menu-btn" to="/home">Inicio</Link>
            <Link className="menu-btn" to="/cargos">Cargos</Link>
            <Link className="menu-btn" to="/personas">Personas</Link>
            <Link className="menu-btn" to="/usuarios">Usuarios</Link>
            <Link className="menu-btn" to="/administradores">Administradores</Link>
          </nav>
        </aside>

        <main className="main">
          <section className="content">
            <h2>Contenido</h2>
            <img src={image} alt="image-content" className="image-content" />
            <div className="content-figure" aria-hidden />
          </section>

          <section className="panel panel-mision">
            <h3>Misión</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque numquam nihil inventore nam unde cum ipsa doloribus non itaque molestiae dignissimos, iste quos est beatae quo perferendis consectetur saepe necessitatibus!
              Perferendis dolorem, illo debitis animi dolore ducimus, doloribus quisquam impedit culpa quis voluptate ipsa. Ipsa voluptates nesciunt, reiciendis adipisci placeat architecto qui consequuntur ex molestias! Et delectus quae sit dolor?
            </p>
          </section>

          <section className="panel panel-vision">
            <h3>Visión</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente totam laborum doloremque nemo ut aperiam eius consequuntur assumenda autem odit, facere sit et ipsum recusandae veniam tenetur itaque, error impedit.
              A laudantium tempora eius facilis veritatis suscipit consequuntur dicta quam impedit quo dolor repudiandae aliquam ut doloribus dolorem fugit cum neque cupiditate, odit doloremque esse? Earum dolor dolorum ullam maxime.
            </p>
          </section>
        </main>
      </div>

      <footer className="footer">
              <p className="personas-contact">Contáctanos</p>
        <a className="personas-hyperlink" href="#" aria-label="Ir al enlace destacado">
          <div className="personas-link-box" aria-hidden />
          <span className="personas-link-text">Hyperlink</span>
        </a>
        </footer>
    </div>
  );
}
