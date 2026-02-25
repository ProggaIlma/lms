import { Router } from "express";
import { AnalyticsController } from "./analytics.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/auth.middleware";

const router = Router();

// ! Admin only
router.get("/admin",             authenticate, authorize("SUPER_ADMIN", "ADMIN"), AnalyticsController.getAdminStats);
router.get("/enrollment-growth", authenticate, authorize("SUPER_ADMIN", "ADMIN"), AnalyticsController.getEnrollmentGrowth);
router.get("/top-courses",       authenticate, authorize("SUPER_ADMIN", "ADMIN"), AnalyticsController.getTopCourses);
router.get("/revenue",           authenticate, authorize("SUPER_ADMIN", "ADMIN"), AnalyticsController.getRevenuePerCourse);
// ! admin only
router.get("/completion-rates", authenticate, authorize("SUPER_ADMIN", "ADMIN"), AnalyticsController.getCompletionRates);
// ! Instructor only
router.get("/instructor", authenticate, authorize("INSTRUCTOR"), AnalyticsController.getInstructorStats);

export default router;