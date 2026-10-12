import "dotenv/config";
import express from "express";
import cors from "cors";
import { authRouter } from "./src/routes/auth.js";
import { funcionarioRouter } from "./src/routes/funcionario.js";
import { categoriaRouter } from "./src/routes/categoria.js";
import produtoRouter from "./src/routes/produto.js";
import { clienteRouter } from "./src/routes/cliente.js";
import { pedidoRouter } from "./src/routes/pedido.js";
import { avisoRouter } from "./src/routes/aviso.js";
import { horarioRouter } from "./src/routes/horario.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ ok: true, servico: "Camarão Express API" });
});

app.use(authRouter);
app.use(funcionarioRouter);
app.use(categoriaRouter);
app.use(produtoRouter);
app.use(clienteRouter);
app.use(pedidoRouter);
app.use(avisoRouter);
app.use(horarioRouter);

export default app;
