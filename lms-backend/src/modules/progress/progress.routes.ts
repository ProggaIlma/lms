import { Router } from "express";
import { ProgressController } from "./progress.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/auth.middleware";

const router = Router();

// * student only routes
router.post("/complete",         authenticate, authorize("STUDENT"), ProgressController.markComplete);
router.post("/incomplete",       authenticate, authorize("STUDENT"), ProgressController.markIncomplete);
router.get("/:courseId",         authenticate, authorize("STUDENT"), ProgressController.getCourseProgress);

export default router;