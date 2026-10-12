import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const formatoPreco = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function CartDrawer({ aberto, onFechar }) {
    const { itens, atualizarQuantidade, remover, total } = useCart();
    const navigate = useNavigate();

    if (!aberto) return null;

    function irParaCheckout() {
        onFechar();
        navigate("/checkout");
    }

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <button
                className="absolute inset-0 bg-black/60"
                onClick={onFechar}
                aria-label="Fechar carrinho"
            />
            <aside className="relative w-full max-w-sm h-full bg-mare-900 border-l border-mare-800 flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-mare-800">
                    <h2 className="font-display text-lg text-areia-50">Seu pedido</h2>
                    <button onClick={onFechar} className="foco-visivel text-2xl leading-none" aria-label="Fechar">
                        ×
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                    {itens.length === 0 && (
                        <p className="text-sm text-areia-200/70">
                            Seu pedido está vazio. Dá uma olhada no cardápio 🦐
                        </p>
                    )}

                    {itens.map((item, index) => (
                        <div key={index} className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <p className="text-sm text-areia-50">{item.produto.nome}</p>
                                <p className="text-xs text-areia-200/60">
                                    {formatoPreco.format(item.produto.preco)} cada
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <button
                                        className="foco-visivel w-6 h-6 border border-mare-700 rounded-full text-xs"
                                        onClick={() => atualizarQuantidade(index, item.quantidade - 1)}
                                        aria-label="Diminuir quantidade"
                                    >
                                        −
                                    </button>
                                    <span className="text-xs w-4 text-center">{item.quantidade}</span>
                                    <button
                                        className="foco-visivel w-6 h-6 border border-mare-700 rounded-full text-xs"
                                        onClick={() => atualizarQuantidade(index, item.quantidade + 1)}
                                        aria-label="Aumentar quantidade"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-brasa-400 font-semibold">
                                    {formatoPreco.format(item.produto.preco * item.quantidade)}
                                </p>
                                <button
                                    onClick={() => remover(index)}
                                    className="foco-visivel text-xs text-areia-200/50 underline mt-1"
                                >
                                    remover
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {itens.length > 0 && (
                    <div className="p-4 border-t border-mare-800">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-areia-100">Total</span>
                            <span className="font-display text-xl text-brasa-400">
                                {formatoPreco.format(total)}
                            </span>
                        </div>
                        <button
                            onClick={irParaCheckout}
                            className="foco-visivel w-full bg-brasa-500 hover:bg-brasa-600 text-mare-950 font-semibold rounded-full py-3"
                        >
                            Fechar pedido
                        </button>
                    </div>
                )}
            </aside>
        </div>
    );
}
