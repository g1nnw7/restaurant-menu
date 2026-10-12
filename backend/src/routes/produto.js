import { Router } from "express";
import {
    getTodosOsProdutos,
    getProdutoPorId,
    criarProduto,
    atualizarProduto,
    deletarProduto,
} from "../controller/produtoController.js";
import { autenticarFuncionario } from "../middleware/auth.js";

const produtoRouter = Router();

// públicas — clientes navegam o cardápio sem login
produtoRouter.get("/produtos", getTodosOsProdutos);
produtoRouter.get("/produtos/:id", getProdutoPorId);

// administrativas — só funcionário logado edita o cardápio
produtoRouter.post("/produtos", autenticarFuncionario, criarProduto);
produtoRouter.put("/produtos/:id", autenticarFuncionario, atualizarProduto);
produtoRouter.delete("/produtos/:id", autenticarFuncionario, deletarProduto);

export default produtoRouter;
