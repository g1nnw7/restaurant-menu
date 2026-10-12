/**
 * Cria (ou atualiza) o funcionário ADMIN inicial, já com a senha
 * criptografada em bcrypt — necessário porque o schema.sql sozinho
 * não consegue gerar o hash.
 *
 * Uso:
 *   node db/seed-admin.js "Nome do Admin" 12345678900 minhaSenha123
 *
 * (rode a partir da pasta backend/, depois de configurar o .env)
 */
import "dotenv/config";
import bcrypt from "bcrypt";
import db from "../src/config/db.js";

async function main() {
    const [, , nome, cpf, senha] = process.argv;

    if (!nome || !cpf || !senha) {
        console.log('Uso: node db/seed-admin.js "Nome do Admin" 12345678900 minhaSenha123');
        process.exit(1);
    }

    const cpfLimpo = cpf.replace(/\D/g, "");
    const senhaHash = await bcrypt.hash(senha, 10);

    const query = `
        INSERT INTO funcionarios (nome, cpf, senha_hash, cargo)
        VALUES ($1, $2, $3, 'ADMIN')
        ON CONFLICT (cpf) DO UPDATE SET senha_hash = EXCLUDED.senha_hash, nome = EXCLUDED.nome
        RETURNING id, nome, cpf, cargo
    `;
    const result = await db.query(query, [nome, cpfLimpo, senhaHash]);

    console.log("Funcionário admin pronto:", result.rows[0]);
    process.exit(0);
}

main().catch((e) => {
    console.error("Erro ao criar admin:", e);
    process.exit(1);
});
