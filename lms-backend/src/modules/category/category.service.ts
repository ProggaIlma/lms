import { CategoryRepository } from "./category.repository";
import { CreateCategoryDTO, UpdateCategoryDTO, CategoryQueryDTO } from "./category.dto";

import { AppError } from "../../utils/AppError";
// const categoryRepository = new CategoryRepository();

export class CategoryService {
  constructor(
    private categoryRepository: CategoryRepository = new CategoryRepository()
  ) {}
  async createCategory(data: CreateCategoryDTO, userId: string) {
    
    const existing = await this.categoryRepository.findByName(data.name);
    if (existing) {
      throw new AppError("Category with this name already exists", 409);
    }

    return this.categoryRepository.create(data, userId);
  }

  async getCategoryById(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new AppError("Category not found", 404);
    }
    return category;
  }

  async getAllCategories(query: CategoryQueryDTO) {
    const { items, total, nextCursor } = await this.categoryRepository.findAll(query);

    return {
      categories: items,
      pagination: {
        total,
        limit: query.limit,
        nextCursor,
        ...(query.cursor
          ? {}
          : {
              page: query.page,
              totalPages: Math.ceil(total / query.limit),
            }),
      },
    };
  }

  async updateCategory(id: string, data: UpdateCategoryDTO, userId: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new AppError("Category not found", 404);
    }

    
    if (data.name && data.name !== category.name) {
      const nameConflict = await this.categoryRepository.findByName(data.name);
      if (nameConflict) {
        throw new AppError("Category with this name already exists", 409);
      }
    }

    return this.categoryRepository.update(id, data, userId);
  }

  async deleteCategory(id: string, userId: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new AppError("Category not found", 404);
    }

    // Optional: prevent deleting a category that has active courses
    if (category._count.categoryCourses > 0) {
      throw new AppError(
        "Cannot delete a category that has courses assigned to it. Reassign courses first.",
        400
      );
    }

    await this.categoryRepository.softDelete(id, userId);
    return { message: "Category deleted successfully" };
  }
}