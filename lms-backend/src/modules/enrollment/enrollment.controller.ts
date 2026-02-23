import { Request, Response } from "express";
import { EnrollmentService } from "./enrollment.service";
import { AuthRequest } from "@middlewares/auth.middleware";
import { Role } from "@prisma/client";
export const EnrollmentController = {
  async enroll(req: AuthRequest, res: Response) {
    
    const userRole = req.user!.role;
    if (userRole !== Role.STUDENT) {
      throw new Error("Only students can enroll");
    }
    try {
      const enrollment = await EnrollmentService.enroll(req.body);
      res.status(201).json(enrollment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async updateStatus(req: AuthRequest, res: Response) {
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    const enrollment = await EnrollmentService.updateStatus(req.params.id as string, req.body.status, userId, userRole);
    res.json(enrollment);
  },
};
