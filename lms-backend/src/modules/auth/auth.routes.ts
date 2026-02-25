import { Router } from "express";
import { getMeController, loginController,registerController } from "./auth.controller";
import { authenticate } from "@middlewares/auth.middleware";
import { authMiddleware } from "@middlewares/auth.middleware";
const router = Router();

router.post("/login", loginController);
router.post("/register", authMiddleware, registerController);
router.get("/me", authenticate, getMeController);
export default router;
