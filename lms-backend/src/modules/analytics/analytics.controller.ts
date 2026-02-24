import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { AnalyticsRepository } from "./analytics.repository";

export const AnalyticsController = {
  async getAdminStats(req: AuthRequest, res: Response) {
    try {
      const data = await AnalyticsRepository.getAdminStats();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getEnrollmentGrowth(req: AuthRequest, res: Response) {
    try {
      const data = await AnalyticsRepository.getEnrollmentGrowth();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getTopCourses(req: AuthRequest, res: Response) {
    try {
      const data = await AnalyticsRepository.getTopCourses();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getRevenuePerCourse(req: AuthRequest, res: Response) {
    try {
      const data = await AnalyticsRepository.getRevenuePerCourse();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getInstructorStats(req: AuthRequest, res: Response) {
    try {
      const instructorId = req.user!.userId;
      const data = await AnalyticsRepository.getInstructorStats(instructorId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};