import { Response, NextFunction } from "express";
import { CategoryService } from "./category.service";
import { AuthRequest } from "@middlewares/auth.middleware";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryQuerySchema,
} from "./category.dto";

const categoryService = new CategoryService();

export class CategoryController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const body = createCategorySchema.parse(req.body);
      const userId = req.user!.userId;

      const category = await categoryService.createCategory(body, userId);

      res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const query = categoryQuerySchema.parse(req.query);
      const result = await categoryService.getAllCategories(query);

      res.status(200).json({
        success: true,
        message: "Categories fetched successfully",
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const category = await categoryService.getCategoryById(id as any);

      res.status(200).json({
        success: true,
        message: "Category fetched successfully",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const body = updateCategorySchema.parse(req.body);
      const userId = req.user!.userId; // ✅ fixed

      const updated = await categoryService.updateCategory(id as any, body, userId);

      res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.userId; // ✅ fixed

      const result = await categoryService.deleteCategory(id as any, userId);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}