import { Router } from "express";
import { CourseController } from "./course.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { LessonController } from "../lesson/lesson.controller";

import { authorizeRoles } from "../../middleware/role.middleware";
import { Role } from "@prisma/client";
const router = Router();

import { uploadThumbnail } from "../../middleware/upload.middleware";

router.post("/", authenticate, authorizeRoles(Role.ADMIN, Role.INSTRUCTOR), uploadThumbnail, CourseController.create);

router.put("/:id", authenticate, authorizeRoles(Role.ADMIN, Role.INSTRUCTOR,Role.SUPER_ADMIN), uploadThumbnail, CourseController.update);
router.get("/", CourseController.getAll);
router.get("/:id", CourseController.getOne);
router.delete("/:id", authenticate, authorizeRoles(Role.ADMIN, Role.INSTRUCTOR, Role.SUPER_ADMIN), CourseController.delete);

router.post("/:id/lessons", authenticate, authorizeRoles(Role.ADMIN, Role.INSTRUCTOR), LessonController.create);
router.get("/:id/lessons", LessonController.getByCourse);
router.put("/:id/lessons/:lessonId", authenticate, authorizeRoles(Role.ADMIN, Role.INSTRUCTOR), LessonController.update);
router.delete("/:id/lessons/:lessonId", authenticate, authorizeRoles(Role.ADMIN, Role.INSTRUCTOR), LessonController.delete);

export default router;
