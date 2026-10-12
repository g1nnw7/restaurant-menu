import { Routes, Route } from "react-router-dom";
import SiteLayout from "./components/SiteLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Sobre from "./pages/Sobre.jsx";
import Cardapio from "./pages/Cardapio.jsx";
import Checkout from "./pages/Checkout.jsx";
import FuncionarioLogin from "./pages/FuncionarioLogin.jsx";

import DashboardLayout from "./pages/admin/DashboardLayout.jsx";
import Pedidos from "./pages/admin/Pedidos.jsx";
import CardapioAdmin from "./pages/admin/CardapioAdmin.jsx";
import Horarios from "./pages/admin/Horarios.jsx";
import Avisos from "./pages/admin/Avisos.jsx";

export default function App() {
    return (
        <Routes>
            <Route element={<SiteLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/sobre" element={<Sobre />} />
                <Route path="/cardapio" element={<Cardapio />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/funcionario" element={<FuncionarioLogin />} />
            </Route>

            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Pedidos />} />
                <Route path="cardapio" element={<CardapioAdmin />} />
                <Route path="horarios" element={<Horarios />} />
                <Route path="avisos" element={<Avisos />} />
            </Route>
        </Routes>
    );
}
