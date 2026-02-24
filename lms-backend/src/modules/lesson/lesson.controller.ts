import { Response } from "express";
import { LessonService } from "./lesson.service";
import { AuthRequest } from "@middlewares/auth.middleware";

export const LessonController = {
  async create(req: AuthRequest, res: Response) {
  try {
    const lesson = await LessonService.createLesson({ // ✅ only 1 argument
      ...req.body,
      courseId:    req.params.id,
      createdById: req.user!.userId,
      updatedById: req.user!.userId,
    });
    res.status(201).json({ success: true, data: lesson });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
},

  async update(req: AuthRequest, res: Response) {
    try {
      const lesson = await LessonService.updateLesson(
        req.params.lessonId as string,       // ✅ lessonId from URL
        { ...req.body, updatedById: req.user!.userId },
        req.user!.role,
        req.user!.userId
      );
      res.json({ success: true, data: lesson });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async delete(req: AuthRequest, res: Response) {
    try {
      await LessonService.deleteLesson(
        req.params.lessonId as string,       // ✅ lessonId from URL
        req.user!.role,
        req.user!.userId
      );
      res.json({ success: true, message: "Lesson deleted" });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async getByCourse(req: AuthRequest, res: Response) {
    try {
      const lessons = await LessonService.getCourseLessons(req.params.id as string);
      res.json({ success: true, data: lessons });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};