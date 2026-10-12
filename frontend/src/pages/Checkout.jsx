import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { api } from "../api/client.js";

const formatoPreco = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function formatarCpf(valor) {
    return valor.replace(/\D/g, "").slice(0, 11);
}

export default function Checkout() {
    const { itens, total, limpar } = useCart();
    const [cpf, setCpf] = useState("");
    const [nomeCompleto, setNomeCompleto] = useState("");
    const [mesa, setMesa] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState("");
    const [pedidoConfirmado, setPedidoConfirmado] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setErro("");

        if (cpf.length !== 11) {
            setErro("Informe um CPF válido (11 dígitos).");
            return;
        }
        if (!nomeCompleto.trim() || !mesa.trim()) {
            setErro("Preencha nome completo e número da mesa.");
            return;
        }

        setEnviando(true);
        try {
            const cliente = await api.post("/clientes", {
                cpf,
                nome_completo: nomeCompleto.trim(),
                mesa: mesa.trim(),
            });

            const pedido = await api.post("/pedidos", {
                cliente_id: cliente.id,
                mesa: mesa.trim(),
                itens: itens.map((i) => ({
                    produto_id: i.produto.id,
                    quantidade: i.quantidade,
                    observacao: i.observacao || undefined,
                })),
            });

            setPedidoConfirmado(pedido);
            limpar();
        } catch (e) {
            setErro(e.message || "Não foi possível enviar o pedido. Tente novamente.");
        } finally {
            setEnviando(false);
        }
    }

    if (pedidoConfirmado) {
        return (
            <div className="max-w-md mx-auto px-4 py-20 text-center">
                <p className="text-areia-200/70 mb-2">Pedido enviado para a cozinha!</p>
                <p className="font-display text-7xl text-brasa-400 mb-4">
                    #{pedidoConfirmado.numero_pedido}
                </p>
                <p className="text-areia-200/80 mb-8">
                    Guarde esse número — ele vai ser chamado quando o pedido estiver pronto na mesa {mesa}.
                </p>
                <Link
                    to="/cardapio"
                    className="foco-visivel inline-block bg-brasa-500 hover:bg-brasa-600 text-mare-950 font-semibold rounded-full px-6 py-3"
                >
                    Pedir mais alguma coisa
                </Link>
            </div>
        );
    }

    if (itens.length === 0) {
        return (
            <div className="max-w-md mx-auto px-4 py-20 text-center">
                <p className="text-areia-200/80 mb-6">Seu pedido está vazio.</p>
                <Link
                    to="/cardapio"
                    className="foco-visivel inline-block bg-brasa-500 hover:bg-brasa-600 text-mare-950 font-semibold rounded-full px-6 py-3"
                >
                    Ver cardápio
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
            <h1 className="font-display text-3xl text-areia-50 mb-6">Fechar pedido</h1>

            <div className="bg-mare-900 border border-mare-800 rounded-2xl p-4 mb-8">
                {itens.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm py-1">
                        <span className="text-areia-100">
                            {item.quantidade}× {item.produto.nome}
                        </span>
                        <span className="text-areia-200/70">
                            {formatoPreco.format(item.produto.preco * item.quantidade)}
                        </span>
                    </div>
                ))}
                <div className="flex justify-between border-t border-mare-800 mt-2 pt-2 font-semibold">
                    <span className="text-areia-50">Total</span>
                    <span className="text-brasa-400">{formatoPreco.format(total)}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <p className="text-sm text-areia-200/70">
                    Para enviar o pedido, complete um cadastro rápido:
                </p>

                <div>
                    <label className="block text-sm mb-1 text-areia-100" htmlFor="cpf">
                        CPF
                    </label>
                    <input
                        id="cpf"
                        inputMode="numeric"
                        value={cpf}
                        onChange={(e) => setCpf(formatarCpf(e.target.value))}
                        placeholder="Somente números"
                        className="foco-visivel w-full rounded-lg bg-mare-900 border border-mare-700 px-4 py-3 text-areia-50"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1 text-areia-100" htmlFor="nome">
                        Nome completo
                    </label>
                    <input
                        id="nome"
                        value={nomeCompleto}
                        onChange={(e) => setNomeCompleto(e.target.value)}
                        className="foco-visivel w-full rounded-lg bg-mare-900 border border-mare-700 px-4 py-3 text-areia-50"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1 text-areia-100" htmlFor="mesa">
                        Número da mesa
                    </label>
                    <input
                        id="mesa"
                        value={mesa}
                        onChange={(e) => setMesa(e.target.value)}
                        className="foco-visivel w-full rounded-lg bg-mare-900 border border-mare-700 px-4 py-3 text-areia-50"
                        required
                    />
                </div>

                {erro && <p className="text-sm text-brasa-400">{erro}</p>}

                <button
                    type="submit"
                    disabled={enviando}
                    className="foco-visivel bg-brasa-500 hover:bg-brasa-600 disabled:opacity-50 text-mare-950 font-semibold rounded-full py-3 mt-2"
                >
                    {enviando ? "Enviando..." : "Confirmar pedido"}
                </button>
            </form>
        </div>
    );
}
