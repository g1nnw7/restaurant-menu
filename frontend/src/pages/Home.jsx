import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import ProductCard from "../components/ProductCard.jsx";
import AvisoBanner from "../components/AvisoBanner.jsx";
import ARSizeViewer from "../components/ARSizeViewer.jsx";
import Loading from "../components/Loading.jsx";

const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export default function Home() {
    const [destaques, setDestaques] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [produtoAR, setProdutoAR] = useState(null);

    useEffect(() => {
        Promise.all([
            api.get("/produtos", { params: { somenteDisponiveis: "true" } }),
            api.get("/horarios"),
        ])
            .then(([produtos, horarios]) => {
                setDestaques(produtos.filter((p) => p.destaque).slice(0, 3));
                setHorarios(horarios);
            })
            .catch(() => {})
            .finally(() => setCarregando(false));
    }, []);

    const hoje = new Date().getDay();
    const horarioHoje = horarios.find((h) => h.dia_semana === hoje);

    return (
        <div>
            <AvisoBanner />

            <section className="relative overflow-hidden bg-gradient-to-b from-mare-900 to-mare-950 border-b border-mare-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid gap-10 sm:grid-cols-2 items-center">
                    <div>
                        <p className="uppercase tracking-widest text-brasa-400 text-xs mb-3">
                            Meu Jardim Food Park · Estreito · Florianópolis
                        </p>
                        <h1 className="font-display text-4xl sm:text-5xl text-areia-50 leading-tight mb-4">
                            Camarão na brasa, direto do food truck para a sua mesa.
                        </h1>
                        <p className="text-areia-200/80 mb-8 max-w-md">
                            Porções generosas, tempero de casa e aquele clima de food park à beira-mar.
                            Escolha a mesa, monte o pedido e a gente chama pelo número quando estiver pronto.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                to="/cardapio"
                                className="foco-visivel bg-brasa-500 hover:bg-brasa-600 text-mare-950 font-semibold rounded-full px-6 py-3"
                            >
                                Ver cardápio
                            </Link>
                            <Link
                                to="/sobre"
                                className="foco-visivel border border-mare-700 hover:border-brasa-400 text-areia-100 rounded-full px-6 py-3"
                            >
                                Conheça a franquia
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-3xl bg-gradient-to-br from-brasa-500/20 to-mare-800 border border-mare-700 h-64 sm:h-80 flex items-center justify-center text-7xl">
                        🦐
                    </div>
                </div>
                <div className="onda-divisor" style={{ "--onda-cor": "#0a2530" }} />
            </section>

            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                <div className="flex items-end justify-between mb-6">
                    <h2 className="font-display text-2xl text-areia-50">Os queridinhos da casa</h2>
                    <Link to="/cardapio" className="text-sm text-brasa-400 hover:underline">
                        ver cardápio completo →
                    </Link>
                </div>

                {carregando && <Loading />}

                {!carregando && destaques.length === 0 && (
                    <p className="text-sm text-areia-200/70">
                        Os destaques do cardápio aparecem aqui assim que forem marcados no painel do funcionário.
                    </p>
                )}

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {destaques.map((produto) => (
                        <ProductCard key={produto.id} produto={produto} onVerTamanhoReal={setProdutoAR} />
                    ))}
                </div>
            </section>

            <section className="bg-mare-900 border-y border-mare-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid gap-8 sm:grid-cols-2">
                    <div>
                        <h2 className="font-display text-2xl text-areia-50 mb-3">Horário de hoje</h2>
                        {horarioHoje ? (
                            <p className="text-areia-200/80">
                                {DIAS[hoje]} —{" "}
                                {horarioHoje.aberto
                                    ? `${horarioHoje.abre_as?.slice(0, 5)} às ${horarioHoje.fecha_as?.slice(0, 5)}`
                                    : "fechado"}
                            </p>
                        ) : (
                            <p className="text-areia-200/60 text-sm">Consulte nossos horários no cardápio.</p>
                        )}
                        <ul className="mt-4 space-y-1 text-sm text-areia-200/70">
                            {horarios.map((h) => (
                                <li key={h.dia_semana} className={h.dia_semana === hoje ? "text-areia-50" : ""}>
                                    {DIAS[h.dia_semana]}:{" "}
                                    {h.aberto ? `${h.abre_as?.slice(0, 5)} – ${h.fecha_as?.slice(0, 5)}` : "fechado"}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-display text-2xl text-areia-50 mb-3">Onde estamos</h2>
                        <p className="text-areia-200/80">
                            Meu Jardim Food Park, Estreito — Florianópolis/SC.
                            <br />
                            Procure pelo trailer do Camarão Express 🦐
                        </p>
                    </div>
                </div>
            </section>

            {produtoAR && <ARSizeViewer produto={produtoAR} onClose={() => setProdutoAR(null)} />}
        </div>
    );
}
