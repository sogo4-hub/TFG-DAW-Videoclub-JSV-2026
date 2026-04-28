import { useNavigate } from "react-router-dom";
import "./dashboard.css";

export default function Dashboard() {

    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Panel de Administración</h1>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h2>Películas</h2>
                    <p>Gestiona el catálogo de películas.</p>
                    <button onClick={() => handleNavigation("/dashboard/peliculas")}>
                        Ir a Películas
                    </button>
                </div>

                <div className="dashboard-card">
                    <h2>Usuarios</h2>
                    <p>Consulta y administra los usuarios registrados.</p>
                    <button onClick={() => handleNavigation("/usuarios")}>
                        Ir a Usuarios
                    </button>
                </div>

                <div className="dashboard-card">
                    <h2>Alquileres</h2>
                    <p>Revisa los alquileres activos y el historial.</p>
                    <button onClick={() => handleNavigation("/rentas")}>
                        Ir a Alquileres
                    </button>
                </div>

                <div className="dashboard-card">
                    <h2>Estadísticas</h2>
                    <p>Visualiza datos del videoclub.</p>
                    <button onClick={() => handleNavigation("/stats")}>
                        Ver estadísticas
                    </button>
                </div>

            </div>
        </div>
    );
}
