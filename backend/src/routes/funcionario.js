import { Router } from "express";
import {
    getTodosOsFuncionarios,
    getFuncionarioPorId,
    criarFuncionario,
    atualizarFuncionario,
    deletarFuncionario,
} from "../controller/funcionarioController.js";
import { autenticarFuncionario, exigirCargo } from "../middleware/auth.js";

export const funcionarioRouter = Router();

// Somente ADMIN gerencia outros funcionários
funcionarioRouter.get("/funcionarios", autenticarFuncionario, exigirCargo("ADMIN"), getTodosOsFuncionarios);
funcionarioRouter.get("/funcionarios/:id", autenticarFuncionario, exigirCargo("ADMIN"), getFuncionarioPorId);
funcionarioRouter.post("/funcionarios", autenticarFuncionario, exigirCargo("ADMIN"), criarFuncionario);
funcionarioRouter.put("/funcionarios/:id", autenticarFuncionario, exigirCargo("ADMIN"), atualizarFuncionario);
funcionarioRouter.delete("/funcionarios/:id", autenticarFuncionario, exigirCargo("ADMIN"), deletarFuncionario);
