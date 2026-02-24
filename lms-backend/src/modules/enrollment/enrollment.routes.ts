import { Router } from "express";
import { EnrollmentController } from "./enrollment.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.post("/",     authenticate, EnrollmentController.enroll);
router.get("/mine",  authenticate, EnrollmentController.getMyEnrollments);
router.patch("/:id", authenticate, EnrollmentController.updateStatus);

export default router;