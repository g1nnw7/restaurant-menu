import db from "../config/db.js";

function somenteNumeros(str = "") {
    return String(str).replace(/\D/g, "");
}

function cpfValido(cpf) {
    return /^\d{11}$/.test(cpf);
}

export async function cadastrarCliente(req, res) {
    try {
        const { cpf, nome_completo, mesa } = req.body;

        if (!cpf || !nome_completo || !mesa) {
            return res.status(400).json({ error: "CPF, nome completo e número da mesa são obrigatórios" });
        }

        const cpfLimpo = somenteNumeros(cpf);
        if (!cpfValido(cpfLimpo)) {
            return res.status(400).json({ error: "CPF inválido, informe os 11 dígitos" });
        }

        const query = `
            INSERT INTO clientes (cpf, nome_completo, mesa)
            VALUES ($1, $2, $3)
            RETURNING id, cpf, nome_completo, mesa, criado_em
        `;
        const result = await db.query(query, [cpfLimpo, nome_completo, mesa]);

        return res.status(201).json(result.rows[0]);
    } catch (e) {
        console.error("Erro em cadastrarCliente:", e);
        return res.status(500).json({ error: "Erro ao cadastrar cliente" });
    }
}
