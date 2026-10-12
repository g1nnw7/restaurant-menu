import { useState } from "react";
import ImagemPrato from "./ImagemPrato.jsx";
import { useCart } from "../context/CartContext.jsx";

const formatoPreco = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function ProductCard({ produto, onVerTamanhoReal }) {
    const [quantidade, setQuantidade] = useState(1);
    const { adicionar } = useCart();

    function handleAdicionar() {
        adicionar(produto, quantidade);
        setQuantidade(1);
    }

    return (
        <article className="flex flex-col bg-mare-900 rounded-2xl overflow-hidden border border-mare-800 shadow-casco">
            <ImagemPrato produto={produto} className="h-44 w-full" />

            <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-lg text-areia-50 leading-tight">{produto.nome}</h3>
                    <span className="font-display text-brasa-400 whitespace-nowrap">
                        {formatoPreco.format(produto.preco)}
                    </span>
                </div>

                {produto.descricao && (
                    <p className="text-sm text-areia-200/80 flex-1">{produto.descricao}</p>
                )}

                {!produto.disponivel && (
                    <p className="text-xs font-medium text-brasa-400">Indisponível no momento</p>
                )}

                <div className="flex items-center justify-between gap-2 mt-2">
                    <button
                        onClick={() => onVerTamanhoReal(produto)}
                        className="foco-visivel text-xs text-areia-200/70 underline decoration-dotted hover:text-brasa-400"
                    >
                        Ver em tamanho real
                    </button>
                </div>

                {produto.disponivel && (
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-mare-700 rounded-full">
                            <button
                                className="foco-visivel w-8 h-8 text-areia-100"
                                onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                                aria-label="Diminuir quantidade"
                            >
                                −
                            </button>
                            <span className="w-6 text-center text-sm">{quantidade}</span>
                            <button
                                className="foco-visivel w-8 h-8 text-areia-100"
                                onClick={() => setQuantidade((q) => q + 1)}
                                aria-label="Aumentar quantidade"
                            >
                                +
                            </button>
                        </div>
                        <button
                            onClick={handleAdicionar}
                            className="foco-visivel flex-1 bg-brasa-500 hover:bg-brasa-600 text-mare-950 font-semibold rounded-full py-2 text-sm transition-colors"
                        >
                            Adicionar
                        </button>
                    </div>
                )}
            </div>
        </article>
    );
}
