import { Request, Response } from "express";
import { LessonService } from "./lesson.service";
import { AuthRequest } from "@middlewares/auth.middleware";

export const LessonController = {
  async create(req: AuthRequest, res: Response) {
    const lesson = await LessonService.createLesson(req.body, req.user);
    res.status(201).json(lesson);
  },

  async update(req: AuthRequest, res: Response) {
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    const lesson = await LessonService.updateLesson(req.params.id as string, req.body, userRole, userId);
    res.json(lesson);
  },

  async delete(req: AuthRequest, res: Response) {
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    await LessonService.deleteLesson(req.params.id as string, userRole, userId);
    res.json({ message: "Lesson deleted" });
  },

  async getByCourse(req: Request, res: Response) {
    const lessons = await LessonService.getCourseLessons(req.params.courseId as string);
    res.json(lessons);
  },
};
