import { Router } from "express";
import {
    getTodasAsCategorias,
    criarCategoria,
    atualizarCategoria,
    deletarCategoria,
} from "../controller/categoriaController.js";
import { autenticarFuncionario } from "../middleware/auth.js";

export const categoriaRouter = Router();

// pública — o site do cliente precisa listar as categorias do cardápio
categoriaRouter.get("/categorias", getTodasAsCategorias);

// administrativas
categoriaRouter.post("/categorias", autenticarFuncionario, criarCategoria);
categoriaRouter.put("/categorias/:id", autenticarFuncionario, atualizarCategoria);
categoriaRouter.delete("/categorias/:id", autenticarFuncionario, deletarCategoria);
