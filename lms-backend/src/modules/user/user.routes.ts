import { Router } from "express";
import { UserController } from "./user.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/auth.middleware";

const router = Router();
const controller = new UserController();

router.get("/", authenticate, authorize("SUPER_ADMIN", "ADMIN"), controller.getAll.bind(controller));

router.patch("/:id", authenticate, authorize("SUPER_ADMIN", "ADMIN"), controller.updateActive.bind(controller));
router.post("/admins", authenticate, authorize("SUPER_ADMIN"), controller.createAdmin.bind(controller));

export default router;
