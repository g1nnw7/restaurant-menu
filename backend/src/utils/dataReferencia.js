/**
 * Calcula a "data operacional" usada para numerar os pedidos.
 *
 * Regra pedida: os números de pedido são sequenciais e RESETAM
 * todo dia às 23:59. Ou seja, a partir das 23:59:00 os pedidos já
 * pertencem ao "dia seguinte" e a contagem volta para 1.
 *
 * Isso é calculado on-the-fly (não depende de nenhum cron rodando
 * no horário exato) — mesmo que o servidor reinicie ou fique fora
 * do ar, o número correto é sempre recalculado a partir do horário
 * atual.
 */
export function getDataReferencia(agora = new Date()) {
    const horas = agora.getHours();
    const minutos = agora.getMinutes();

    const dataBase = new Date(agora);

    // A partir de 23:59 já conta como o dia seguinte
    if (horas === 23 && minutos >= 59) {
        dataBase.setDate(dataBase.getDate() + 1);
    }

    const ano = dataBase.getFullYear();
    const mes = String(dataBase.getMonth() + 1).padStart(2, "0");
    const dia = String(dataBase.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`; // formato aceito pelo tipo DATE do Postgres
}
