import { Router } from "express";
import { CategoryController } from "./category.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/auth.middleware"; // ✅ your new file

const router = Router();
const controller = new CategoryController();

// Public
router.get("/", controller.getAll.bind(controller));
router.get("/:id", controller.getById.bind(controller));

// Admin only
router.post("/", authenticate, authorize("SUPER_ADMIN", "ADMIN"), controller.create.bind(controller));
router.patch("/:id", authenticate, authorize("SUPER_ADMIN", "ADMIN"), controller.update.bind(controller));
router.delete("/:id", authenticate, authorize("SUPER_ADMIN", "ADMIN"), controller.delete.bind(controller));

export default router;