import { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import Loading from "../../components/Loading.jsx";

export default function Avisos() {
    const [avisos, setAvisos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [titulo, setTitulo] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [publico, setPublico] = useState(false);

    async function carregar() {
        const dados = await api.get("/avisos", { auth: true });
        setAvisos(dados);
        setCarregando(false);
    }

    useEffect(() => {
        carregar();
    }, []);

    async function criar(e) {
        e.preventDefault();
        if (!titulo.trim() || !mensagem.trim()) return;
        await api.post("/avisos", { titulo, mensagem, publico }, { auth: true });
        setTitulo("");
        setMensagem("");
        setPublico(false);
        carregar();
    }

    async function excluir(id) {
        await api.del(`/avisos/${id}`, { auth: true });
        carregar();
    }

    if (carregando) return <Loading texto="Carregando avisos..." />;

    return (
        <div className="max-w-2xl">
            <h1 className="font-display text-2xl text-areia-50 mb-6">Avisos</h1>

            <form onSubmit={criar} className="bg-mare-900 border border-mare-800 rounded-2xl p-4 flex flex-col gap-3 mb-8">
                <input
                    placeholder="Título"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="foco-visivel rounded-lg bg-mare-950 border border-mare-700 px-3 py-2 text-areia-50"
                />
                <textarea
                    placeholder="Mensagem"
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    rows={2}
                    className="foco-visivel rounded-lg bg-mare-950 border border-mare-700 px-3 py-2 text-areia-50"
                />
                <label className="flex items-center gap-2 text-sm text-areia-100">
                    <input type="checkbox" checked={publico} onChange={(e) => setPublico(e.target.checked)} />
                    Mostrar também para os clientes no site
                </label>
                <button className="foco-visivel self-start bg-brasa-500 hover:bg-brasa-600 text-mare-950 font-semibold rounded-full px-6 py-2">
                    Publicar aviso
                </button>
            </form>

            <div className="flex flex-col gap-2">
                {avisos.map((a) => (
                    <div key={a.id} className="bg-mare-900 border border-mare-800 rounded-xl p-3">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="text-areia-50 text-sm font-semibold">
                                    {a.titulo} {a.publico && <span className="text-brasa-400 text-xs">· público</span>}
                                </p>
                                <p className="text-areia-200/70 text-sm">{a.mensagem}</p>
                                <p className="text-areia-200/40 text-xs mt-1">
                                    por {a.criado_por_nome || "equipe"} em{" "}
                                    {new Date(a.criado_em).toLocaleString("pt-BR")}
                                </p>
                            </div>
                            <button onClick={() => excluir(a.id)} className="foco-visivel text-xs text-areia-200/50 underline">
                                excluir
                            </button>
                        </div>
                    </div>
                ))}
                {avisos.length === 0 && <p className="text-sm text-areia-200/60">Nenhum aviso publicado ainda.</p>}
            </div>
        </div>
    );
}
