import { Router } from "express";

import usuariosController from "../controllers/usuarios.controller.js";
import asyncHandler from "../middlewares/async-handler.middleware.js";

const router = Router();

router.post("/", asyncHandler(usuariosController.criarUsuario));

export default router;
