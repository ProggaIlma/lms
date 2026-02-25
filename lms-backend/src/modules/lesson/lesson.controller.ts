import { Response } from "express";
import { LessonService } from "./lesson.service";
import { AuthRequest } from "@middlewares/auth.middleware";
import { createLessonSchema, updateLessonSchema } from "./lesson.dto";


export const LessonController = {
  async create(req: AuthRequest, res: Response) {
  try {
   const data = createLessonSchema.parse({
  ...req.body,
  courseId:    req.params.id,
  createdById: req.user!.userId,
  updatedById: req.user!.userId,
});
const lesson = await LessonService.createLesson(data);
    res.status(201).json({ success: true, data: lesson });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
},

  async update(req: AuthRequest, res: Response) {
    try {
      
      const data = updateLessonSchema.parse({ ...req.body, updatedById: req.user!.userId });
      res.json({ success: true, data: data });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async delete(req: AuthRequest, res: Response) {
    try {
      await LessonService.deleteLesson(
        req.params.lessonId as string,      
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