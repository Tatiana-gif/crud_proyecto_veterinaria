import type { JSX } from 'react';
import '../components/styles/inicioPage.css'
import image from '../assets/R (2).jpeg'
export default function HomePetsGarras(): JSX.Element {
    return (
        <div className="page">
        
            <header className="header">
                <div className="logo" aria-label="Logo Garras" />
                <h1 className="title">Tienda de productos para mascotas: "Garras"</h1>
            </header>
            <div className="body">
        
                <aside className="sidebar" aria-label="Menú lateral">
                    <nav className="menu">
                        <button className="menu-btn">Inicio</button>
                        <button className="menu-btn">Cargos</button>
                        <button className="menu-btn">Personas</button>
                        <button className="menu-btn">Usuarios</button>
                        <button className="menu-btn">Administradores</button>
                    </nav>
                </aside>

                <main className="main">
                    <section className="content">
                        <h2>Contenido</h2>
                        <img src={image} alt="image-content" className="image-content" />

                        <div className="content-figure" aria-hidden>

                        </div>
                    </section>
                    <section className="panel panel-mision">
                        <h3>Misión</h3>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt laboriosam, laborum temporibus harum beatae sapiente sunt id consequatur delectus ad deserunt, obcaecati quos velit quo tempore sequi ea. Nulla, ex.
                            Consequuntur tenetur repellendus nemo nulla modi ratione perspiciatis est optio, repellat recusandae eligendi ad dicta magni ut doloribus eum quae at excepturi reprehenderit eaque? Optio eligendi molestias cumque qui praesentium.
                        </p>
                    </section>

                    <section className="panel panel-vision">
                        <h3>Visión</h3>
                        <p>
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsum, animi atque velit voluptates temporibus aliquid tempora magni expedita nulla culpa voluptatum officiis possimus doloribus error. Cumque vero sapiente quisquam commodi?
                            Quisquam, nesciunt. Inventore architecto nostrum quod dolorem? Eum voluptatum perferendis at facilis repellat placeat voluptatibus nobis minima error non, fugit illo laboriosam tempora magni suscipit nihil veritatis, accusantium totam consequatur?
                        </p>
                    </section>
                </main>
            </div>

            <footer className="footer">
            </footer>
        </div>
    );
}


