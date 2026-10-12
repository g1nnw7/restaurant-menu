import db from "../config/db.js";

export async function getHorarios(req, res) {
    try {
        const query = "SELECT * FROM horario_funcionamento ORDER BY dia_semana ASC";
        const result = await db.query(query);
        return res.json(result.rows);
    } catch (e) {
        console.error("Erro em getHorarios:", e);
        return res.status(500).json({ error: "Erro ao buscar horários" });
    }
}

export async function atualizarHorario(req, res) {
    try {
        const diaSemana = Number(req.params.diaSemana);
        const { aberto, abre_as, fecha_as } = req.body;

        const query = `
            UPDATE horario_funcionamento
            SET aberto = COALESCE($1, aberto),
                abre_as = $2,
                fecha_as = $3
            WHERE dia_semana = $4
            RETURNING *
        `;
        const result = await db.query(query, [aberto, abre_as || null, fecha_as || null, diaSemana]);

        if (result.rows.length === 0) return res.status(404).send("Dia da semana inválido!");
        return res.json(result.rows[0]);
    } catch (e) {
        console.error("Erro em atualizarHorario:", e);
        return res.status(500).json({ error: "Erro ao atualizar horário" });
    }
}
