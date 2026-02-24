import { Router } from "express";
import { UserController } from "./user.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/auth.middleware";

const router     = Router();
const controller = new UserController();

// GET /api/v1/users — Admin + Super Admin only
router.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  controller.getAll.bind(controller)
);

// PATCH /api/v1/users/:id — suspend / activate
router.patch(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  controller.updateActive.bind(controller)
);

export default router;