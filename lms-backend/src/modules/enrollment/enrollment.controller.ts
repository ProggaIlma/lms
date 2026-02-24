import { Response } from "express";
import { EnrollmentService } from "./enrollment.service";
import { AuthRequest } from "@middlewares/auth.middleware";
import { Role } from "@prisma/client";

export const EnrollmentController = {
  async enroll(req: AuthRequest, res: Response) {
    try {
      const userRole = req.user!.role;
      if (userRole !== Role.STUDENT) {
        return res.status(403).json({ message: "Only students can enroll" });
      }

      const enrollment = await EnrollmentService.enroll({
        studentId: req.user!.userId, // ✅ from token not body
        courseId:  req.body.courseId,
      });

      res.status(201).json({ success: true, data: enrollment });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async getMyEnrollments(req: AuthRequest, res: Response) {
    try {
      const enrollments = await EnrollmentService.getMyEnrollments(
        req.user!.userId
      );
      res.json({ success: true, data: enrollments });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async updateStatus(req: AuthRequest, res: Response) {
    try {
      const enrollment = await EnrollmentService.updateStatus(
        req.params.id as string,
        req.body.status,
        req.user!.userId,
        req.user!.role
      );
      res.json({ success: true, data: enrollment });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
};