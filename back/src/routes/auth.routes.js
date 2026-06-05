import { Router } from "express";

import authController from "../controllers/auth.controller.js";
import asyncHandler from "../middlewares/async-handler.middleware.js";

const router = Router();

router.post("/login", asyncHandler(authController.login));
router.post("/logout", asyncHandler(authController.logout));

export default router;
