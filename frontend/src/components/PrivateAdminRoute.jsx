import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateAdminRoute({ children }) {
    const { token, rol } = useAuth();

    // No está logueado; fuera
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Está logueado pero no es admin ; fuera
    if (rol !== "ADMIN") {
        return <Navigate to="/" replace />;
    }

    // si es adminpuede entrar
    return children;
}
