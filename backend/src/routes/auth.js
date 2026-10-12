import { Router } from "express";
import { loginFuncionario, meuPerfil } from "../controller/authController.js";
import { autenticarFuncionario } from "../middleware/auth.js";

export const authRouter = Router();

authRouter.post("/auth/login", loginFuncionario);
authRouter.get("/auth/me", autenticarFuncionario, meuPerfil);
