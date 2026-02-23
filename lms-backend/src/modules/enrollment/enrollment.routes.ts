import { Router } from "express";
import { EnrollmentController } from "./enrollment.controller";

const router = Router();

router.post("/", EnrollmentController.enroll);
router.put("/:id/status", EnrollmentController.updateStatus);

export default router;