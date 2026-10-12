import db from "../config/db.js";

export async function getTodasAsCategorias(req, res) {
    try {
        const query = "SELECT * FROM categorias ORDER BY ordem ASC, nome ASC";
        const result = await db.query(query);
        return res.json(result.rows);
    } catch (e) {
        console.error("Erro em getTodasAsCategorias:", e);
        return res.status(500).json({ error: "Erro ao buscar categorias" });
    }
}

export async function criarCategoria(req, res) {
    try {
        const { nome, ordem } = req.body;
        if (!nome) return res.status(400).json({ error: "Nome é obrigatório" });

        const query = "INSERT INTO categorias (nome, ordem) VALUES ($1, $2) RETURNING *";
        const result = await db.query(query, [nome, ordem || 0]);
        return res.status(201).json(result.rows[0]);
    } catch (e) {
        console.error("Erro em criarCategoria:", e);
        return res.status(500).json({ error: "Erro ao criar categoria" });
    }
}

export async function atualizarCategoria(req, res) {
    try {
        const id = Number(req.params.id);
        const { nome, ordem } = req.body;

        const query = `
            UPDATE categorias SET nome = COALESCE($1, nome), ordem = COALESCE($2, ordem)
            WHERE id = $3 RETURNING *
        `;
        const result = await db.query(query, [nome, ordem, id]);

        if (result.rows.length === 0) return res.status(404).send("Categoria não existe!");
        return res.json(result.rows[0]);
    } catch (e) {
        console.error("Erro em atualizarCategoria:", e);
        return res.status(500).json({ error: "Erro ao atualizar categoria" });
    }
}

export async function deletarCategoria(req, res) {
    try {
        const id = Number(req.params.id);
        const query = "DELETE FROM categorias WHERE id = $1 RETURNING id";
        const result = await db.query(query, [id]);

        if (result.rows.length === 0) return res.status(404).send("Categoria não existe!");
        return res.status(204).send();
    } catch (e) {
        console.error("Erro em deletarCategoria:", e);
        return res.status(500).json({ error: "Erro ao deletar categoria" });
    }
}
