import "dotenv/config";

import express from "express";

// Prisma ja esta instalado, mas a conexao com o banco fica desativada por enquanto.
// Quando o DATABASE_URL estiver configurado, descomente o codigo abaixo.
//
// import { PrismaClient } from "@prisma/client";
//
// const prisma = new PrismaClient({
//   log: ["query", "error", "warn"],
// });

const app = express();

const port = 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "stocky-backend",
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
