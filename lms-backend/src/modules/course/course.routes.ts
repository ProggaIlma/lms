import { Router } from "express";
import { CourseController } from "./course.controller";
import { authenticate } from "../../../src/middleware/auth.middleware";
import { LessonController } from "../lesson/lesson.controller";

import { authorizeRoles } from "../../../src/middleware/role.middleware";
import { Role } from "@prisma/client";
const router = Router();

import { uploadThumbnail } from "../../middleware/upload.middleware";

router.post("/", authenticate, authorizeRoles(Role.ADMIN, Role.INSTRUCTOR), uploadThumbnail, CourseController.create);

router.put("/:id", authenticate, authorizeRoles(Role.ADMIN, Role.INSTRUCTOR), uploadThumbnail, CourseController.update);
router.get("/", CourseController.getAll);
router.get("/:id", CourseController.getOne);
router.delete("/:id", authenticate, authorizeRoles(Role.ADMIN, Role.INSTRUCTOR), CourseController.delete);

router.post("/:id/lessons", authenticate, authorizeRoles(Role.ADMIN, Role.INSTRUCTOR), LessonController.create);
router.get("/:id/lessons", LessonController.getByCourse);
router.put("/:id/lessons/:lessonId", authenticate, authorizeRoles(Role.ADMIN, Role.INSTRUCTOR), LessonController.update);
router.delete("/:id/lessons/:lessonId", authenticate, authorizeRoles(Role.ADMIN, Role.INSTRUCTOR), LessonController.delete);

export default router;
