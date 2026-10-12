import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET } from "../middleware/auth.js";

function somenteNumeros(str = "") {
    return String(str).replace(/\D/g, "");
}

export async function loginFuncionario(req, res) {
    try {
        const { cpf, senha } = req.body;

        if (!cpf || !senha) {
            return res.status(400).json({ error: "Informe CPF e senha" });
        }

        const cpfLimpo = somenteNumeros(cpf);
        const query = "SELECT * FROM funcionarios WHERE cpf = $1 AND ativo = TRUE";
        const result = await db.query(query, [cpfLimpo]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "CPF ou senha inválidos" });
        }

        const funcionario = result.rows[0];
        const senhaOk = await bcrypt.compare(senha, funcionario.senha_hash);

        if (!senhaOk) {
            return res.status(401).json({ error: "CPF ou senha inválidos" });
        }

        const token = jwt.sign(
            { id: funcionario.id, nome: funcionario.nome, cargo: funcionario.cargo },
            SECRET,
            { expiresIn: "12h" }
        );

        return res.json({
            token,
            funcionario: {
                id: funcionario.id,
                nome: funcionario.nome,
                cargo: funcionario.cargo,
            },
        });
    } catch (e) {
        console.error("Erro em loginFuncionario:", e);
        return res.status(500).json({ error: "Erro ao efetuar login" });
    }
}

export async function meuPerfil(req, res) {
    return res.json(req.funcionario);
}
