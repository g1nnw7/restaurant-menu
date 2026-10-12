import db from "../config/db.js";

export async function getAvisos(req, res) {
    try {
        const { somentePublicos } = req.query;
        let query = `
            SELECT a.*, f.nome AS criado_por_nome
            FROM avisos a
            LEFT JOIN funcionarios f ON f.id = a.criado_por
        `;
        const valores = [];
        if (somentePublicos === "true") {
            query += " WHERE a.publico = TRUE";
        }
        query += " ORDER BY a.criado_em DESC";

        const result = await db.query(query, valores);
        return res.json(result.rows);
    } catch (e) {
        console.error("Erro em getAvisos:", e);
        return res.status(500).json({ error: "Erro ao buscar avisos" });
    }
}

export async function criarAviso(req, res) {
    try {
        const { titulo, mensagem, publico } = req.body;
        if (!titulo || !mensagem) {
            return res.status(400).json({ error: "Título e mensagem são obrigatórios" });
        }

        const query = `
            INSERT INTO avisos (titulo, mensagem, publico, criado_por)
            VALUES ($1,$2,COALESCE($3, FALSE),$4)
            RETURNING *
        `;
        const result = await db.query(query, [titulo, mensagem, publico, req.funcionario?.id || null]);
        return res.status(201).json(result.rows[0]);
    } catch (e) {
        console.error("Erro em criarAviso:", e);
        return res.status(500).json({ error: "Erro ao criar aviso" });
    }
}

export async function deletarAviso(req, res) {
    try {
        const id = Number(req.params.id);
        const query = "DELETE FROM avisos WHERE id = $1 RETURNING id";
        const result = await db.query(query, [id]);

        if (result.rows.length === 0) return res.status(404).send("Aviso não existe!");
        return res.status(204).send();
    } catch (e) {
        console.error("Erro em deletarAviso:", e);
        return res.status(500).json({ error: "Erro ao deletar aviso" });
    }
}
