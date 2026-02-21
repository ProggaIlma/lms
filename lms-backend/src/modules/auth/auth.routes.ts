import { Router } from "express";
import { loginController,registerController } from "./auth.controller";
import { authMiddleware } from "../../../src/middleware/auth.middleware";
const router = Router();

router.post("/login", loginController);
router.post("/register", authMiddleware, registerController);
export default router;
