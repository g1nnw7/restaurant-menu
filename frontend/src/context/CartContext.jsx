import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [itens, setItens] = useState([]); // { produto, quantidade, observacao }

    function adicionar(produto, quantidade = 1, observacao = "") {
        setItens((atual) => {
            const existente = atual.find((i) => i.produto.id === produto.id && i.observacao === observacao);
            if (existente) {
                return atual.map((i) =>
                    i === existente ? { ...i, quantidade: i.quantidade + quantidade } : i
                );
            }
            return [...atual, { produto, quantidade, observacao }];
        });
    }

    function atualizarQuantidade(index, quantidade) {
        setItens((atual) => {
            if (quantidade <= 0) return atual.filter((_, i) => i !== index);
            return atual.map((item, i) => (i === index ? { ...item, quantidade } : item));
        });
    }

    function remover(index) {
        setItens((atual) => atual.filter((_, i) => i !== index));
    }

    function limpar() {
        setItens([]);
    }

    const total = useMemo(
        () => itens.reduce((soma, i) => soma + Number(i.produto.preco) * i.quantidade, 0),
        [itens]
    );

    const quantidadeTotal = useMemo(() => itens.reduce((soma, i) => soma + i.quantidade, 0), [itens]);

    return (
        <CartContext.Provider
            value={{ itens, adicionar, atualizarQuantidade, remover, limpar, total, quantidadeTotal }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
