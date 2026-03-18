import "./Dashboard.css";

export default function Dashboard() {
    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Panel de Administración</h1>

            <div className="dashboard-grid">

                <div className="dashboard-card">
                    <h2>Películas</h2>
                    <p>Gestiona el catálogo de películas.</p>
                    <button>Ir a Películas</button>
                </div>

                <div className="dashboard-card">
                    <h2>Usuarios</h2>
                    <p>Consulta y administra los usuarios registrados.</p>
                    <button>Ir a Usuarios</button>
                </div>

                <div className="dashboard-card">
                    <h2>Alquileres</h2>
                    <p>Revisa los alquileres activos y el historial.</p>
                    <button>Ir a Alquileres</button>
                </div>

                <div className="dashboard-card">
                    <h2>Estadísticas</h2>
                    <p>Visualiza datos del videoclub.</p>
                    <button>Ver estadísticas</button>
                </div>

            </div>
        </div>
    );
}
