import db from "../config/db.js";
import { getDataReferencia } from "../utils/dataReferencia.js";

const STATUS_VALIDOS = ["RECEBIDO", "EM_PREPARO", "PRONTO", "ENTREGUE", "CANCELADO"];

/**
 * Pega (de forma atômica) o próximo número sequencial do dia operacional atual.
 * O UPSERT com ON CONFLICT garante que, mesmo com vários pedidos chegando ao
 * mesmo tempo, cada um recebe um número diferente e em ordem.
 */
async function proximoNumeroDoDia(client, dataReferencia) {
    const query = `
        INSERT INTO contadores_pedido (data_referencia, ultimo_numero)
        VALUES ($1, 1)
        ON CONFLICT (data_referencia)
        DO UPDATE SET ultimo_numero = contadores_pedido.ultimo_numero + 1
        RETURNING ultimo_numero
    `;
    const result = await client.query(query, [dataReferencia]);
    return result.rows[0].ultimo_numero;
}

export async function criarPedido(req, res) {
    const client = await db.connect();
    try {
        const { cliente_id, mesa, observacao, itens } = req.body;

        if (!mesa || !Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({ error: "Mesa e ao menos um item são obrigatórios" });
        }

        await client.query("BEGIN");

        const dataReferencia = getDataReferencia();
        const numeroDiario = await proximoNumeroDoDia(client, dataReferencia);

        // busca preços atuais dos produtos para não confiar no preço vindo do front
        const idsProdutos = itens.map((i) => i.produto_id);
        const produtosResult = await client.query(
            "SELECT id, preco, disponivel FROM produtos WHERE id = ANY($1::int[])",
            [idsProdutos]
        );
        const produtosPorId = new Map(produtosResult.rows.map((p) => [p.id, p]));

        let total = 0;
        for (const item of itens) {
            const produto = produtosPorId.get(item.produto_id);
            if (!produto) throw new Error(`Produto ${item.produto_id} não encontrado`);
            total += Number(produto.preco) * Number(item.quantidade);
        }

        const pedidoResult = await client.query(
            `INSERT INTO pedidos (numero_diario, data_referencia, cliente_id, mesa, observacao, total)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [numeroDiario, dataReferencia, cliente_id || null, mesa, observacao || null, total]
        );
        const pedido = pedidoResult.rows[0];

        for (const item of itens) {
            const produto = produtosPorId.get(item.produto_id);
            await client.query(
                `INSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco_unitario, observacao)
                 VALUES ($1,$2,$3,$4,$5)`,
                [pedido.id, item.produto_id, item.quantidade, produto.preco, item.observacao || null]
            );
        }

        await client.query("COMMIT");

        return res.status(201).json({
            ...pedido,
            numero_pedido: pedido.numero_diario, // número a ser exibido ao cliente
        });
    } catch (e) {
        await client.query("ROLLBACK");
        console.error("Erro em criarPedido:", e);
        return res.status(500).json({ error: "Erro ao criar pedido" });
    } finally {
        client.release();
    }
}

export async function getPedidosDoDia(req, res) {
    try {
        const dataReferencia = req.query.data || getDataReferencia();

        const query = `
            SELECT pe.*, c.nome_completo, c.cpf
            FROM pedidos pe
            LEFT JOIN clientes c ON c.id = pe.cliente_id
            WHERE pe.data_referencia = $1
            ORDER BY pe.numero_diario ASC
        `;
        const result = await db.query(query, [dataReferencia]);

        const pedidos = result.rows;
        const idsPedidos = pedidos.map((p) => p.id);

        let itensPorPedido = new Map();
        if (idsPedidos.length > 0) {
            const itensResult = await db.query(
                `SELECT pi.*, pr.nome AS produto_nome
                 FROM pedido_itens pi
                 JOIN produtos pr ON pr.id = pi.produto_id
                 WHERE pi.pedido_id = ANY($1::int[])`,
                [idsPedidos]
            );
            itensPorPedido = itensResult.rows.reduce((mapa, item) => {
                if (!mapa.has(item.pedido_id)) mapa.set(item.pedido_id, []);
                mapa.get(item.pedido_id).push(item);
                return mapa;
            }, new Map());
        }

        const pedidosComItens = pedidos.map((p) => ({
            ...p,
            itens: itensPorPedido.get(p.id) || [],
        }));

        return res.json(pedidosComItens);
    } catch (e) {
        console.error("Erro em getPedidosDoDia:", e);
        return res.status(500).json({ error: "Erro ao buscar pedidos" });
    }
}

export async function getPedidoPorId(req, res) {
    try {
        const id = Number(req.params.id);
        const result = await db.query("SELECT * FROM pedidos WHERE id = $1", [id]);

        if (result.rows.length === 0) return res.status(404).send("Pedido não existe!");

        return res.json(result.rows[0]);
    } catch (e) {
        console.error("Erro em getPedidoPorId:", e);
        return res.status(500).json({ error: "Erro ao buscar pedido" });
    }
}

export async function atualizarStatusPedido(req, res) {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;

        if (!STATUS_VALIDOS.includes(status)) {
            return res.status(400).json({ error: `Status inválido. Use um de: ${STATUS_VALIDOS.join(", ")}` });
        }

        const query = `
            UPDATE pedidos SET status = $1, atualizado_em = NOW()
            WHERE id = $2 RETURNING *
        `;
        const result = await db.query(query, [status, id]);

        if (result.rows.length === 0) return res.status(404).send("Pedido não existe!");

        return res.json(result.rows[0]);
    } catch (e) {
        console.error("Erro em atualizarStatusPedido:", e);
        return res.status(500).json({ error: "Erro ao atualizar status do pedido" });
    }
}
