import { Router } from "express";
import { cadastrarCliente } from "../controller/clienteController.js";

export const clienteRouter = Router();

// pública — cadastro rápido antes de fazer o pedido (CPF, nome, mesa)
clienteRouter.post("/clientes", cadastrarCliente);
