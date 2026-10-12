import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const itensMenu = [
    { to: "/admin", label: "Pedidos", fim: true },
    { to: "/admin/cardapio", label: "Cardápio" },
    { to: "/admin/horarios", label: "Horários" },
    { to: "/admin/avisos", label: "Avisos" },
];

export default function DashboardLayout() {
    const { funcionario, logout } = useAuth();
    const navigate = useNavigate();

    function handleSair() {
        logout();
        navigate("/");
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <aside className="md:w-56 bg-mare-900 border-b md:border-b-0 md:border-r border-mare-800 p-4 flex md:flex-col gap-2 overflow-x-auto">
                <div className="hidden md:block mb-6">
                    <p className="font-display text-lg text-areia-50">Camarão Express</p>
                    <p className="text-xs text-areia-200/60">Olá, {funcionario?.nome?.split(" ")[0]}</p>
                </div>

                {itensMenu.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.fim}
                        className={({ isActive }) =>
                            `whitespace-nowrap rounded-lg px-3 py-2 text-sm ${
                                isActive ? "bg-brasa-500 text-mare-950 font-semibold" : "text-areia-100 hover:bg-mare-800"
                            }`
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}

                <button
                    onClick={handleSair}
                    className="foco-visivel md:mt-auto whitespace-nowrap rounded-lg px-3 py-2 text-sm text-areia-200/60 hover:text-brasa-400"
                >
                    Sair
                </button>
            </aside>

            <main className="flex-1 p-4 sm:p-8 bg-mare-950">
                <Outlet />
            </main>
        </div>
    );
}
