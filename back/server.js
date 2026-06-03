import "dotenv/config";

import express from "express";

import NotFoundError from "./src/errors/not-found.error.js";
import errorMiddleware from "./src/middlewares/error.middleware.js";
import loadRoutes from "./src/routes/index.js";

const app = express();

const port = 3000;

app.use(express.json());
app.use(await loadRoutes());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "stocky-backend",
  });
});

app.use((req, res) => {
  throw new NotFoundError("Rota não encontrada", {
    path: req.originalUrl,
  });
});

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
