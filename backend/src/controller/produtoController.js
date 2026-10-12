import db from "../config/db.js";

export async function getTodosOsProdutos(req, res) {
    try {
        const { categoria_id, somenteDisponiveis } = req.query;

        let query = `
            SELECT p.*, c.nome AS categoria_nome
            FROM produtos p
            LEFT JOIN categorias c ON c.id = p.categoria_id
        `;
        const condicoes = [];
        const valores = [];

        if (categoria_id) {
            valores.push(categoria_id);
            condicoes.push(`p.categoria_id = $${valores.length}`);
        }
        if (somenteDisponiveis === "true") {
            condicoes.push("p.disponivel = TRUE");
        }
        if (condicoes.length > 0) {
            query += " WHERE " + condicoes.join(" AND ");
        }
        query += " ORDER BY c.ordem ASC NULLS LAST, p.nome ASC";

        const result = await db.query(query, valores);
        return res.json(result.rows);
    } catch (e) {
        console.error("Erro em getTodosOsProdutos:", e);
        return res.status(500).json({ error: "Erro ao buscar produtos" });
    }
}

export async function getProdutoPorId(req, res) {
    try {
        const id = Number(req.params.id);
        const query = "SELECT * FROM produtos WHERE id = $1";
        const result = await db.query(query, [id]);

        if (result.rows.length === 0) return res.status(404).send("Produto não existe!");

        return res.json(result.rows[0]);
    } catch (e) {
        console.error("Erro em getProdutoPorId:", e);
        return res.status(500).json({ error: "Erro ao buscar produto" });
    }
}

export async function criarProduto(req, res) {
    try {
        const {
            categoria_id, nome, descricao, preco, imagem_url,
            disponivel, largura_cm, profundidade_cm, destaque,
        } = req.body;

        if (!nome || preco === undefined) {
            return res.status(400).json({ error: "Nome e preço são obrigatórios" });
        }

        const query = `
            INSERT INTO produtos
                (categoria_id, nome, descricao, preco, imagem_url, disponivel, largura_cm, profundidade_cm, destaque)
            VALUES ($1,$2,$3,$4,$5,COALESCE($6, TRUE),$7,$8,COALESCE($9, FALSE))
            RETURNING *
        `;
        const result = await db.query(query, [
            categoria_id || null, nome, descricao || null, preco, imagem_url || null,
            disponivel, largura_cm || null, profundidade_cm || null, destaque,
        ]);

        return res.status(201).json(result.rows[0]);
    } catch (e) {
        console.error("Erro em criarProduto:", e);
        return res.status(500).json({ error: "Erro ao criar produto" });
    }
}

export async function atualizarProduto(req, res) {
    try {
        const id = Number(req.params.id);
        const {
            categoria_id, nome, descricao, preco, imagem_url,
            disponivel, largura_cm, profundidade_cm, destaque,
        } = req.body;

        const query = `
            UPDATE produtos SET
                categoria_id = COALESCE($1, categoria_id),
                nome = COALESCE($2, nome),
                descricao = COALESCE($3, descricao),
                preco = COALESCE($4, preco),
                imagem_url = COALESCE($5, imagem_url),
                disponivel = COALESCE($6, disponivel),
                largura_cm = COALESCE($7, largura_cm),
                profundidade_cm = COALESCE($8, profundidade_cm),
                destaque = COALESCE($9, destaque),
                atualizado_em = NOW()
            WHERE id = $10
            RETURNING *
        `;
        const result = await db.query(query, [
            categoria_id, nome, descricao, preco, imagem_url,
            disponivel, largura_cm, profundidade_cm, destaque, id,
        ]);

        if (result.rows.length === 0) return res.status(404).send("Produto não existe!");

        return res.json(result.rows[0]);
    } catch (e) {
        console.error("Erro em atualizarProduto:", e);
        return res.status(500).json({ error: "Erro ao atualizar produto" });
    }
}

export async function deletarProduto(req, res) {
    try {
        const id = Number(req.params.id);
        const query = "DELETE FROM produtos WHERE id = $1 RETURNING id";
        const result = await db.query(query, [id]);

        if (result.rows.length === 0) return res.status(404).send("Produto não existe!");

        return res.status(204).send();
    } catch (e) {
        console.error("Erro em deletarProduto:", e);
        return res.status(500).json({ error: "Erro ao deletar produto" });
    }
}
