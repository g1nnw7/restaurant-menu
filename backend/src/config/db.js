import pkg from "pg";
import "dotenv/config";

const { Pool } = pkg;

const db = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "camarao_express",
});

db.on("error", (err) => {
    console.error("Erro inesperado no pool do PostgreSQL:", err);
});

export default db;
