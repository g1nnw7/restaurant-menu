import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "troque_este_segredo_em_producao";

export function autenticarFuncionario(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token não informado" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, SECRET);
        req.funcionario = payload; // { id, nome, cargo }
        return next();
    } catch (e) {
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
}

export function exigirCargo(...cargosPermitidos) {
    return (req, res, next) => {
        if (!req.funcionario) {
            return res.status(401).json({ error: "Não autenticado" });
        }
        if (!cargosPermitidos.includes(req.funcionario.cargo)) {
            return res.status(403).json({ error: "Sem permissão para esta ação" });
        }
        return next();
    };
}

export { SECRET };
