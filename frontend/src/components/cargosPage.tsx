import type { JSX } from 'react';
import '../components/styles/cargosPage.css'

export default function cargosPageGarras(): JSX.Element {
    return (
        <div className="page">
            <header className="header">
                <div className="logo" aria-label="Logo Garras" />
                <h1 className="title">Tienda de productos para mascotas: "Garras"</h1>
            </header>
            <main className="main">
            <nav className="tabs" aria-label="Navegación secciones">
                <a className="tab" href="#">Inicio</a>
                <a className="tab active" aria-current="page" href="#">Cargos</a>
                <a className="tab" href="#">Personas</a>
                <a className="tab" href="#">Usuarios</a>
            </nav>
            <section className="card">
                <div className="card-header">Lista de Cargos</div>
                <div className="card-body">
                    <div className="table-wrap">
                        <table className="table" aria-label="Tabla de cargos">
                            <thead>
                                <tr>
                                    <th>Column 1</th>
                                    <th>Column 2</th>
                                    <th>Column 3</th>
                                    <th>Column 4</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i}>
                                        <td>Content {i + 1}</td>
                                        <td>Content {i + 1}</td>
                                        <td>Content {i + 1}</td>
                                        <td>Content {i + 1}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
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



