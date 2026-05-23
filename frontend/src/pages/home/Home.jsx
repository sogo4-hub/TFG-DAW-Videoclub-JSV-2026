import { Link } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import "./Home.css";

export default function Home() {
    const { rol } = useAuth();

    return (
        <div className="home">

            <section className="hero">
                <div className="hero-glow" />

                <div className="hero-content">
                    <span className="hero-eyebrow">Tu videoclub digital</span>
                    <h1 className="hero-title">
                        Bienvenidos a<br />
                        <span className="hero-name">Streamflix</span>
                    </h1>
                    <p className="hero-desc">
                        El espíritu del videoclub de barrio, ahora en tu pantalla.
                        Sin filas, sin devoluciones tardías.
                    </p>
                    <a href="/catalogo" className="hero-cta">Explorar catálogo →</a>
                </div>
                <img className="hero-img" src="/imgs/vhs-fondo.jpg" alt="Fondo" />
                <img className="hero-side-img" src="/imgs/posters.avif" alt="Videoclub" />
            </section>

            <section className="schedule">
                <div className="schedule-glow" />

                <div className="schedule-inner">
                    <div className="schedule-header">
                        <h2 className="schedule-title">Horario</h2>
                    </div>

                    <div className="schedule-rows">
                        <div className="schedule-row">
                            <span className="schedule-day">Lunes - Viernes</span>
                            <div className="schedule-bar" />
                            <span className="schedule-time">10:00 - 22:00</span>
                        </div>
                        <div className="schedule-row">
                            <span className="schedule-day">Sábado</span>
                            <div className="schedule-bar" />
                            <span className="schedule-time">10:00 - 23:00</span>
                        </div>
                        <div className="schedule-row">
                            <span className="schedule-day">Domingo</span>
                            <div className="schedule-bar" />
                            <span className="schedule-time">12:00 - 21:00</span>
                        </div>
                    </div>

                    <p className="schedule-note">
                        * El catálogo online está disponible <strong>24 horas</strong>, todos los días.
                    </p>
                </div>

                <div className="schedule-ayuda">
                    {rol === 'ADMIN' ? (
                        <p className="ayuda-texto-admin">
                            Gestiona las dudas de los usuarios desde{' '}
                            <Link to="/dashboard/chat" className="ayuda-link">
                                el panel de ayuda
                            </Link>.
                        </p>
                    ) : (
                        <div className="ayuda-texto-user">
                            <span>¿Tienes alguna duda?</span>
                            <br />
                            <span>
                                Pregunta <Link to="/ayuda" className="ayuda-link">aquí</Link>{' '}
                                y un administrador te responderá.
                            </span>
                            <br />
                            <p className="nota-login">* Debes iniciar sesión para preguntar</p>
                        </div>
                    )}
                </div>
            </section>

        </div>
    );
}