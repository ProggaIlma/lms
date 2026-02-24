import { Router } from "express";
import { getMeController, loginController,registerController } from "./auth.controller";
import { authenticate } from "../../../src/middleware/auth.middleware";
import { authMiddleware } from "../../../src/middleware/auth.middleware";
const router = Router();

router.post("/login", loginController);
router.post("/register", authMiddleware, registerController);
router.get("/me", authenticate, getMeController);
export default router;
