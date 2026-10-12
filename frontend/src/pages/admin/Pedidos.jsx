import { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import Loading from "../../components/Loading.jsx";

const PROXIMO_STATUS = {
    RECEBIDO: "EM_PREPARO",
    EM_PREPARO: "PRONTO",
    PRONTO: "ENTREGUE",
};

const LABEL_STATUS = {
    RECEBIDO: "Recebido",
    EM_PREPARO: "Em preparo",
    PRONTO: "Pronto",
    ENTREGUE: "Entregue",
    CANCELADO: "Cancelado",
};

const COR_STATUS = {
    RECEBIDO: "bg-brasa-500 text-mare-950",
    EM_PREPARO: "bg-yellow-500 text-mare-950",
    PRONTO: "bg-green-500 text-mare-950",
    ENTREGUE: "bg-mare-700 text-areia-100",
    CANCELADO: "bg-red-900 text-areia-100",
};

const formatoPreco = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function Pedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    async function carregar() {
        try {
            const dados = await api.get("/pedidos", { auth: true });
            setPedidos(dados);
        } catch (e) {
            // silencioso — mantém a última lista carregada em caso de falha momentânea
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregar();
        const intervalo = setInterval(carregar, 8000);
        return () => clearInterval(intervalo);
    }, []);

    async function avancarStatus(pedido) {
        const proximo = PROXIMO_STATUS[pedido.status];
        if (!proximo) return;
        await api.put(`/pedidos/${pedido.id}/status`, { status: proximo }, { auth: true });
        carregar();
    }

    async function cancelar(pedido) {
        await api.put(`/pedidos/${pedido.id}/status`, { status: "CANCELADO" }, { auth: true });
        carregar();
    }

    if (carregando) return <Loading texto="Carregando pedidos..." />;

    const ativos = pedidos.filter((p) => !["ENTREGUE", "CANCELADO"].includes(p.status));
    const finalizados = pedidos.filter((p) => ["ENTREGUE", "CANCELADO"].includes(p.status));

    return (
        <div>
            <h1 className="font-display text-2xl text-areia-50 mb-1">Pedidos de hoje</h1>
            <p className="text-sm text-areia-200/60 mb-6">
                A numeração reseta automaticamente todo dia às 23:59. Atualiza sozinho a cada poucos segundos.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {ativos.map((pedido) => (
                    <div key={pedido.id} className="bg-mare-900 border border-mare-800 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-display text-2xl text-brasa-400">#{pedido.numero_diario}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${COR_STATUS[pedido.status]}`}>
                                {LABEL_STATUS[pedido.status]}
                            </span>
                        </div>
                        <p className="text-sm text-areia-100">Mesa {pedido.mesa}</p>
                        {pedido.nome_completo && (
                            <p className="text-xs text-areia-200/60 mb-2">{pedido.nome_completo}</p>
                        )}
                        <ul className="text-sm text-areia-200/80 my-2 space-y-0.5">
                            {pedido.itens?.map((item) => (
                                <li key={item.id}>
                                    {item.quantidade}× {item.produto_nome}
                                </li>
                            ))}
                        </ul>
                        <p className="text-sm font-semibold text-areia-50 mb-3">
                            {formatoPreco.format(pedido.total)}
                        </p>
                        <div className="flex gap-2">
                            {PROXIMO_STATUS[pedido.status] && (
                                <button
                                    onClick={() => avancarStatus(pedido)}
                                    className="foco-visivel flex-1 bg-brasa-500 hover:bg-brasa-600 text-mare-950 text-sm font-semibold rounded-full py-2"
                                >
                                    Marcar "{LABEL_STATUS[PROXIMO_STATUS[pedido.status]]}"
                                </button>
                            )}
                            <button
                                onClick={() => cancelar(pedido)}
                                className="foco-visivel text-xs text-areia-200/50 underline"
                            >
                                cancelar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {ativos.length === 0 && (
                <p className="text-sm text-areia-200/60">Nenhum pedido em aberto no momento.</p>
            )}

            {finalizados.length > 0 && (
                <details className="mt-10">
                    <summary className="cursor-pointer text-sm text-areia-200/60">
                        Ver pedidos finalizados de hoje ({finalizados.length})
                    </summary>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                        {finalizados.map((pedido) => (
                            <div key={pedido.id} className="bg-mare-900/50 border border-mare-800 rounded-xl p-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-areia-200/70">#{pedido.numero_diario} · Mesa {pedido.mesa}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${COR_STATUS[pedido.status]}`}>
                                        {LABEL_STATUS[pedido.status]}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </details>
            )}
        </div>
    );
}
