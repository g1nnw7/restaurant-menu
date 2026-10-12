import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import ProductCard from "../components/ProductCard.jsx";
import ARSizeViewer from "../components/ARSizeViewer.jsx";
import Loading from "../components/Loading.jsx";

export default function Cardapio() {
    const [categorias, setCategorias] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [categoriaAtiva, setCategoriaAtiva] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [produtoAR, setProdutoAR] = useState(null);

    useEffect(() => {
        Promise.all([api.get("/categorias"), api.get("/produtos")])
            .then(([cats, prods]) => {
                setCategorias(cats);
                setProdutos(prods);
            })
            .catch(() => {})
            .finally(() => setCarregando(false));
    }, []);

    const produtosFiltrados = categoriaAtiva
        ? produtos.filter((p) => p.categoria_id === categoriaAtiva)
        : produtos;

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            <h1 className="font-display text-3xl text-areia-50 mb-2">Cardápio</h1>
            <p className="text-areia-200/70 mb-6 text-sm">
                Toque em "ver em tamanho real" para visualizar o prato na sua mesa pela câmera do celular.
            </p>

            <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
                <button
                    onClick={() => setCategoriaAtiva(null)}
                    className={`foco-visivel whitespace-nowrap rounded-full px-4 py-2 text-sm border ${
                        categoriaAtiva === null
                            ? "bg-brasa-500 border-brasa-500 text-mare-950"
                            : "border-mare-700 text-areia-100"
                    }`}
                >
                    Tudo
                </button>
                {categorias.map((c) => (
                    <button
                        key={c.id}
                        onClick={() => setCategoriaAtiva(c.id)}
                        className={`foco-visivel whitespace-nowrap rounded-full px-4 py-2 text-sm border ${
                            categoriaAtiva === c.id
                                ? "bg-brasa-500 border-brasa-500 text-mare-950"
                                : "border-mare-700 text-areia-100"
                        }`}
                    >
                        {c.nome}
                    </button>
                ))}
            </div>

            {carregando && <Loading />}

            {!carregando && produtosFiltrados.length === 0 && (
                <p className="text-sm text-areia-200/70">Nenhum item cadastrado nessa categoria ainda.</p>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {produtosFiltrados.map((produto) => (
                    <ProductCard key={produto.id} produto={produto} onVerTamanhoReal={setProdutoAR} />
                ))}
            </div>

            {produtoAR && <ARSizeViewer produto={produtoAR} onClose={() => setProdutoAR(null)} />}
        </div>
    );
}
