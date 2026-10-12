import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Loading from "./Loading.jsx";

export default function ProtectedRoute({ children }) {
    const { funcionario, carregando } = useAuth();

    if (carregando) return <Loading />;
    if (!funcionario) return <Navigate to="/funcionario" replace />;

    return children;
}
