import db from "../config/db.js";
import bcrypt from "bcrypt";

function somenteNumeros(str = "") {
    return String(str).replace(/\D/g, "");
}

export async function getTodosOsFuncionarios(req, res) {
    try {
        const query = "SELECT id, nome, cpf, cargo, ativo, criado_em FROM funcionarios ORDER BY id ASC";
        const result = await db.query(query);
        return res.json(result.rows);
    } catch (e) {
        console.error("Erro em getTodosOsFuncionarios:", e);
        return res.status(500).json({ error: "Erro ao buscar funcionários" });
    }
}

export async function getFuncionarioPorId(req, res) {
    try {
        const id = Number(req.params.id);
        const query = "SELECT id, nome, cpf, cargo, ativo, criado_em FROM funcionarios WHERE id = $1";
        const result = await db.query(query, [id]);

        if (result.rows.length === 0) return res.status(404).send("Funcionário não existe!");

        return res.json(result.rows[0]);
    } catch (e) {
        console.error("Erro em getFuncionarioPorId:", e);
        return res.status(500).json({ error: "Erro ao buscar funcionário" });
    }
}

export async function criarFuncionario(req, res) {
    try {
        const { nome, cpf, senha, cargo } = req.body;

        if (!nome || !cpf || !senha) {
            return res.status(400).json({ error: "Nome, CPF e senha são obrigatórios" });
        }

        const cpfLimpo = somenteNumeros(cpf);
        const senhaHash = await bcrypt.hash(senha, 10);

        const query = `
            INSERT INTO funcionarios (nome, cpf, senha_hash, cargo)
            VALUES ($1, $2, $3, $4)
            RETURNING id, nome, cpf, cargo, ativo, criado_em
        `;
        const result = await db.query(query, [nome, cpfLimpo, senhaHash, cargo || "ATENDENTE"]);

        return res.status(201).json(result.rows[0]);
    } catch (e) {
        if (e.code === "23505") {
            return res.status(409).json({ error: "Já existe um funcionário com esse CPF" });
        }
        console.error("Erro em criarFuncionario:", e);
        return res.status(500).json({ error: "Erro ao criar funcionário" });
    }
}

export async function atualizarFuncionario(req, res) {
    try {
        const id = Number(req.params.id);
        const { nome, cargo, ativo, senha } = req.body;

        let senhaHash = null;
        if (senha) {
            senhaHash = await bcrypt.hash(senha, 10);
        }

        const query = `
            UPDATE funcionarios
            SET nome = COALESCE($1, nome),
                cargo = COALESCE($2, cargo),
                ativo = COALESCE($3, ativo),
                senha_hash = COALESCE($4, senha_hash)
            WHERE id = $5
            RETURNING id, nome, cpf, cargo, ativo, criado_em
        `;
        const result = await db.query(query, [nome, cargo, ativo, senhaHash, id]);

        if (result.rows.length === 0) return res.status(404).send("Funcionário não existe!");

        return res.json(result.rows[0]);
    } catch (e) {
        console.error("Erro em atualizarFuncionario:", e);
        return res.status(500).json({ error: "Erro ao atualizar funcionário" });
    }
}

export async function deletarFuncionario(req, res) {
    try {
        const id = Number(req.params.id);
        const query = "DELETE FROM funcionarios WHERE id = $1 RETURNING id";
        const result = await db.query(query, [id]);

        if (result.rows.length === 0) return res.status(404).send("Funcionário não existe!");

        return res.status(204).send();
    } catch (e) {
        console.error("Erro em deletarFuncionario:", e);
        return res.status(500).json({ error: "Erro ao deletar funcionário" });
    }
}
