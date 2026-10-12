import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import CartDrawer from "./CartDrawer.jsx";

export default function SiteLayout() {
    const [carrinhoAberto, setCarrinhoAberto] = useState(false);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar onAbrirCarrinho={() => setCarrinhoAberto(true)} />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
            <CartDrawer aberto={carrinhoAberto} onFechar={() => setCarrinhoAberto(false)} />
        </div>
    );
}
