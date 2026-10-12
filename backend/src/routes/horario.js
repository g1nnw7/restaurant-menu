import { Router } from "express";
import { getHorarios, atualizarHorario } from "../controller/horarioController.js";
import { autenticarFuncionario } from "../middleware/auth.js";

export const horarioRouter = Router();

horarioRouter.get("/horarios", getHorarios); // público — aparece no site
horarioRouter.put("/horarios/:diaSemana", autenticarFuncionario, atualizarHorario);
