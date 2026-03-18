import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateAdminRoute({ children }) {
    const { token, rol } = useAuth();

    // No está logueado → fuera
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Está logueado pero NO es admin → fuera
    if (rol !== "admin") {
        return <Navigate to="/" replace />;
    }

    // Es admin → puede entrar
    return children;
}
