import { Router } from "express";
import {
    criarPedido,
    getPedidosDoDia,
    getPedidoPorId,
    atualizarStatusPedido,
} from "../controller/pedidoController.js";
import { autenticarFuncionario } from "../middleware/auth.js";

export const pedidoRouter = Router();

// pública — cliente faz o pedido e consulta o próprio pedido pelo número
pedidoRouter.post("/pedidos", criarPedido);
pedidoRouter.get("/pedidos/:id", getPedidoPorId);

// administrativas — painel de funcionários
pedidoRouter.get("/pedidos", autenticarFuncionario, getPedidosDoDia);
pedidoRouter.put("/pedidos/:id/status", autenticarFuncionario, atualizarStatusPedido);
