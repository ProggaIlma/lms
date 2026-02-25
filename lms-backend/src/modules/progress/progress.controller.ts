import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { ProgressService } from "./progress.service";
import { markLessonSchema } from "./progress.dto";

export const ProgressController = {
  async markComplete(req: AuthRequest, res: Response) {
    try {
      const data = markLessonSchema.parse(req.body);
      const result = await ProgressService.markComplete(req.user!.userId, data);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(err.statusCode ?? 400).json({ success: false, message: err.message });
    }
  },

  async markIncomplete(req: AuthRequest, res: Response) {
    try {
      const data = markLessonSchema.parse(req.body);
      const result = await ProgressService.markIncomplete(req.user!.userId, data);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(err.statusCode ?? 400).json({ success: false, message: err.message });
    }
  },

  async getCourseProgress(req: AuthRequest, res: Response) {
    try {
      const result = await ProgressService.getCourseProgress(req.user!.userId, req.params.courseId as string);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(err.statusCode ?? 400).json({ success: false, message: err.message });
    }
  },
};
