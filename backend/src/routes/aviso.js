import { Router } from "express";
import { getAvisos, criarAviso, deletarAviso } from "../controller/avisoController.js";
import { autenticarFuncionario } from "../middleware/auth.js";

export const avisoRouter = Router();

avisoRouter.get("/avisos", getAvisos); // com ?somentePublicos=true dá pra usar no site também
avisoRouter.post("/avisos", autenticarFuncionario, criarAviso);
avisoRouter.delete("/avisos/:id", autenticarFuncionario, deletarAviso);
