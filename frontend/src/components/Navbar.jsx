import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const links = [
    { to: "/", label: "Início" },
    { to: "/cardapio", label: "Cardápio" },
    { to: "/sobre", label: "A franquia" },
];

export default function Navbar({ onAbrirCarrinho }) {
    const [aberto, setAberto] = useState(false);
    const { quantidadeTotal } = useCart();

    return (
        <header className="sticky top-0 z-40 bg-mare-950/95 backdrop-blur border-b border-mare-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 font-display text-xl text-areia-50">
                    <span aria-hidden="true">🦐</span>
                    Camarão Express
                </Link>

                <nav className="hidden md:flex items-center gap-8 font-body text-sm">
                    {links.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            className={({ isActive }) =>
                                `transition-colors hover:text-brasa-400 ${
                                    isActive ? "text-brasa-400" : "text-areia-100"
                                }`
                            }
                        >
                            {l.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onAbrirCarrinho}
                        className="foco-visivel relative rounded-full border border-mare-700 px-3 py-2 text-sm hover:border-brasa-400 transition-colors"
                        aria-label="Abrir carrinho"
                    >
                        Pedido
                        {quantidadeTotal > 0 && (
                            <span className="absolute -top-2 -right-2 bg-brasa-500 text-mare-950 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {quantidadeTotal}
                            </span>
                        )}
                    </button>

                    <button
                        className="md:hidden foco-visivel p-2"
                        onClick={() => setAberto((v) => !v)}
                        aria-label="Abrir menu"
                        aria-expanded={aberto}
                    >
                        <div className="w-6 h-0.5 bg-areia-100 mb-1.5" />
                        <div className="w-6 h-0.5 bg-areia-100 mb-1.5" />
                        <div className="w-6 h-0.5 bg-areia-100" />
                    </button>
                </div>
            </div>

            {aberto && (
                <nav className="md:hidden border-t border-mare-800 bg-mare-950 px-4 py-3 flex flex-col gap-3">
                    {links.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            onClick={() => setAberto(false)}
                            className="py-1 text-areia-100 hover:text-brasa-400"
                        >
                            {l.label}
                        </NavLink>
                    ))}
                    <NavLink to="/funcionario" onClick={() => setAberto(false)} className="py-1 text-areia-200/70 text-sm">
                        Acesso do funcionário
                    </NavLink>
                </nav>
            )}
        </header>
    );
}
