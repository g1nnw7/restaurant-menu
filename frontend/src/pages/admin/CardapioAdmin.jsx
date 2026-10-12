import { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import Loading from "../../components/Loading.jsx";

const formatoPreco = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const PRODUTO_VAZIO = {
    id: null,
    categoria_id: "",
    nome: "",
    descricao: "",
    preco: "",
    imagem_url: "",
    largura_cm: "",
    profundidade_cm: "",
    disponivel: true,
    destaque: false,
};

export default function CardapioAdmin() {
    const [categorias, setCategorias] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [form, setForm] = useState(PRODUTO_VAZIO);
    const [novaCategoria, setNovaCategoria] = useState("");
    const [erro, setErro] = useState("");

    async function carregarTudo() {
        const [cats, prods] = await Promise.all([api.get("/categorias"), api.get("/produtos")]);
        setCategorias(cats);
        setProdutos(prods);
        setCarregando(false);
    }

    useEffect(() => {
        carregarTudo();
    }, []);

    function editar(produto) {
        setForm({
            ...produto,
            categoria_id: produto.categoria_id || "",
            largura_cm: produto.largura_cm || "",
            profundidade_cm: produto.profundidade_cm || "",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function salvarProduto(e) {
        e.preventDefault();
        setErro("");
        const payload = {
            categoria_id: form.categoria_id || null,
            nome: form.nome,
            descricao: form.descricao,
            preco: Number(form.preco),
            imagem_url: form.imagem_url || null,
            largura_cm: form.largura_cm ? Number(form.largura_cm) : null,
            profundidade_cm: form.profundidade_cm ? Number(form.profundidade_cm) : null,
            disponivel: form.disponivel,
            destaque: form.destaque,
        };

        try {
            if (form.id) {
                await api.put(`/produtos/${form.id}`, payload, { auth: true });
            } else {
                await api.post("/produtos", payload, { auth: true });
            }
            setForm(PRODUTO_VAZIO);
            carregarTudo();
        } catch (e) {
            setErro(e.message);
        }
    }

    async function excluirProduto(id) {
        if (!confirm("Remover este item do cardápio?")) return;
        await api.del(`/produtos/${id}`, { auth: true });
        carregarTudo();
    }

    async function adicionarCategoria(e) {
        e.preventDefault();
        if (!novaCategoria.trim()) return;
        await api.post("/categorias", { nome: novaCategoria.trim() }, { auth: true });
        setNovaCategoria("");
        carregarTudo();
    }

    if (carregando) return <Loading texto="Carregando cardápio..." />;

    return (
        <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
            <div>
                <h1 className="font-display text-2xl text-areia-50 mb-4">
                    {form.id ? "Editar item" : "Novo item do cardápio"}
                </h1>

                <form onSubmit={salvarProduto} className="bg-mare-900 border border-mare-800 rounded-2xl p-4 flex flex-col gap-3 mb-8">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <input
                            required
                            placeholder="Nome do prato"
                            value={form.nome}
                            onChange={(e) => setForm({ ...form, nome: e.target.value })}
                            className="foco-visivel rounded-lg bg-mare-950 border border-mare-700 px-3 py-2 text-areia-50"
                        />
                        <select
                            value={form.categoria_id}
                            onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
                            className="foco-visivel rounded-lg bg-mare-950 border border-mare-700 px-3 py-2 text-areia-50"
                        >
                            <option value="">Sem categoria</option>
                            {categorias.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <textarea
                        placeholder="Descrição"
                        value={form.descricao}
                        onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                        className="foco-visivel rounded-lg bg-mare-950 border border-mare-700 px-3 py-2 text-areia-50"
                        rows={2}
                    />

                    <div className="grid gap-3 sm:grid-cols-3">
                        <input
                            required
                            type="number"
                            step="0.01"
                            placeholder="Preço (R$)"
                            value={form.preco}
                            onChange={(e) => setForm({ ...form, preco: e.target.value })}
                            className="foco-visivel rounded-lg bg-mare-950 border border-mare-700 px-3 py-2 text-areia-50"
                        />
                        <input
                            type="number"
                            step="0.1"
                            placeholder="Largura real (cm)"
                            value={form.largura_cm}
                            onChange={(e) => setForm({ ...form, largura_cm: e.target.value })}
                            className="foco-visivel rounded-lg bg-mare-950 border border-mare-700 px-3 py-2 text-areia-50"
                        />
                        <input
                            type="number"
                            step="0.1"
                            placeholder="Profundidade real (cm)"
                            value={form.profundidade_cm}
                            onChange={(e) => setForm({ ...form, profundidade_cm: e.target.value })}
                            className="foco-visivel rounded-lg bg-mare-950 border border-mare-700 px-3 py-2 text-areia-50"
                        />
                    </div>

                    <input
                        placeholder="URL da foto do prato"
                        value={form.imagem_url}
                        onChange={(e) => setForm({ ...form, imagem_url: e.target.value })}
                        className="foco-visivel rounded-lg bg-mare-950 border border-mare-700 px-3 py-2 text-areia-50"
                    />
                    <p className="text-xs text-areia-200/50 -mt-2">
                        As larguras/profundidade em cm alimentam o visualizador de "tamanho real" no cardápio do cliente.
                    </p>

                    <div className="flex gap-6 text-sm text-areia-100">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={form.disponivel}
                                onChange={(e) => setForm({ ...form, disponivel: e.target.checked })}
                            />
                            Disponível
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={form.destaque}
                                onChange={(e) => setForm({ ...form, destaque: e.target.checked })}
                            />
                            Destaque na home
                        </label>
                    </div>

                    {erro && <p className="text-sm text-brasa-400">{erro}</p>}

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="foco-visivel bg-brasa-500 hover:bg-brasa-600 text-mare-950 font-semibold rounded-full px-6 py-2"
                        >
                            {form.id ? "Salvar alterações" : "Adicionar ao cardápio"}
                        </button>
                        {form.id && (
                            <button
                                type="button"
                                onClick={() => setForm(PRODUTO_VAZIO)}
                                className="foco-visivel text-sm text-areia-200/60 underline"
                            >
                                cancelar edição
                            </button>
                        )}
                    </div>
                </form>

                <h2 className="font-display text-xl text-areia-50 mb-3">Itens cadastrados</h2>
                <div className="flex flex-col gap-2">
                    {produtos.map((p) => (
                        <div key={p.id} className="flex items-center justify-between bg-mare-900 border border-mare-800 rounded-xl px-4 py-3">
                            <div>
                                <p className="text-areia-50 text-sm">{p.nome}</p>
                                <p className="text-xs text-areia-200/60">
                                    {p.categoria_nome || "sem categoria"} · {formatoPreco.format(p.preco)}
                                    {!p.disponivel && " · indisponível"}
                                </p>
                            </div>
                            <div className="flex gap-3 text-xs">
                                <button onClick={() => editar(p)} className="foco-visivel text-brasa-400 underline">
                                    editar
                                </button>
                                <button onClick={() => excluirProduto(p.id)} className="foco-visivel text-areia-200/50 underline">
                                    excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="font-display text-xl text-areia-50 mb-3">Categorias</h2>
                <form onSubmit={adicionarCategoria} className="flex gap-2 mb-4">
                    <input
                        placeholder="Nova categoria"
                        value={novaCategoria}
                        onChange={(e) => setNovaCategoria(e.target.value)}
                        className="foco-visivel flex-1 rounded-lg bg-mare-900 border border-mare-700 px-3 py-2 text-areia-50 text-sm"
                    />
                    <button className="foco-visivel bg-mare-800 hover:bg-mare-700 text-areia-50 rounded-lg px-3 text-sm">
                        Adicionar
                    </button>
                </form>
                <ul className="space-y-1 text-sm text-areia-200/80">
                    {categorias.map((c) => (
                        <li key={c.id}>{c.nome}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
