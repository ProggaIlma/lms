import { Router } from "express";
import { LessonController } from "./lesson.controller";

const router = Router();

router.post("/", LessonController.create);
router.get("/course/:courseId", LessonController.getByCourse);
router.put("/:id", LessonController.update);
router.delete("/:id", LessonController.delete);

export default router;