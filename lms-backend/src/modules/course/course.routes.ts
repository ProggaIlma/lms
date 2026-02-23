import { Router } from "express";
import { CourseController } from "./course.controller";
import { authenticate } from "../../../src/middleware/auth.middleware";

import { authorizeRoles } from "../../../src/middleware/role.middleware";
import { Role } from "@prisma/client";
const router = Router();
router.post("/", authenticate, authorizeRoles(Role.ADMIN, Role.INSTRUCTOR), CourseController.create);
router.get("/", CourseController.getAll);
router.get("/:id", CourseController.getOne);
router.put("/:id", authenticate, authorizeRoles(Role.ADMIN, Role.INSTRUCTOR), CourseController.update);
router.delete("/:id", authenticate, authorizeRoles(Role.ADMIN, Role.INSTRUCTOR), CourseController.delete);

export default router;
