import { CategoryService } from "../category.service";
import { CategoryRepository } from "../category.repository";

const mockCategory = {
  id: "cat-123",
  name: "Web Development",
  isDeleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdById: "user-123",
  updatedById: "user-123",

  createdBy: {
    id: "user-123",
    name: "Test User",
    email: "test@example.com",
  },

  updatedBy: {
    id: "user-123",
    name: "Test User",
    email: "test@example.com",
  },

  _count: {
    categoryCourses: 0,
  },
};

describe("CategoryService", () => {
  let mockRepo: jest.Mocked<CategoryRepository>;
  let service: CategoryService;

  beforeEach(() => {
    mockRepo = {
      findByName: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    } as any;

    service = new CategoryService(mockRepo);
  });

  // ─── CREATE ─────────────────────────────

  describe("createCategory", () => {
    it("should create a category successfully", async () => {
      mockRepo.findByName.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue(mockCategory);

      const result = await service.createCategory(
        { name: "Web Development" },
        "user-123"
      );

      expect(mockRepo.findByName).toHaveBeenCalledWith("Web Development");
      expect(mockRepo.create).toHaveBeenCalledWith(
        { name: "Web Development" },
        "user-123"
      );
      expect(result.name).toBe("Web Development");
    });

    it("should throw if category name already exists", async () => {
      mockRepo.findByName.mockResolvedValue(mockCategory);

      await expect(
        service.createCategory({ name: "Web Development" }, "user-123")
      ).rejects.toThrow("Category with this name already exists");
    });
  });

  // ─── GET BY ID ─────────────────────────────

  describe("getCategoryById", () => {
    it("should return a category by id", async () => {
      mockRepo.findById.mockResolvedValue(mockCategory);

      const result = await service.getCategoryById("cat-123");

      expect(result.id).toBe("cat-123");
    });

    it("should throw 404 if category not found", async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(
        service.getCategoryById("non-existent")
      ).rejects.toThrow("Category not found");
    });
  });

  // ─── UPDATE ─────────────────────────────

  describe("updateCategory", () => {
    it("should update a category successfully", async () => {
      mockRepo.findById.mockResolvedValue(mockCategory);
      mockRepo.findByName.mockResolvedValue(null);
      mockRepo.update.mockResolvedValue({
        ...mockCategory,
        name: "Updated Name",
      });

      const result = await service.updateCategory(
        "cat-123",
        { name: "Updated Name" },
        "user-123"
      );

      expect(result.name).toBe("Updated Name");
    });

    it("should throw if new name is taken by another category", async () => {
      mockRepo.findById.mockResolvedValue(mockCategory);
      mockRepo.findByName.mockResolvedValue({
        ...mockCategory,
        id: "other-cat-456",
      });

      await expect(
        service.updateCategory(
          "cat-123",
          { name: "Taken Name" },
          "user-123"
        )
      ).rejects.toThrow("Category with this name already exists");
    });

    it("should allow updating with the same name", async () => {
      mockRepo.findById.mockResolvedValue(mockCategory);
      mockRepo.findByName.mockResolvedValue(mockCategory);
      mockRepo.update.mockResolvedValue(mockCategory);

      const result = await service.updateCategory(
        "cat-123",
        { name: "Web Development" },
        "user-123"
      );

      expect(result.name).toBe("Web Development");
    });

    it("should throw 404 if category not found", async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(
        service.updateCategory(
          "non-existent",
          { name: "Test" },
          "user-123"
        )
      ).rejects.toThrow("Category not found");
    });
  });

  // ─── DELETE ─────────────────────────────

  describe("deleteCategory", () => {
    it("should soft delete a category with no courses", async () => {
      mockRepo.findById.mockResolvedValue(mockCategory);
      mockRepo.softDelete.mockResolvedValue({
        ...mockCategory,
        isDeleted: true,
      });

      await service.deleteCategory("cat-123", "user-123");

      expect(mockRepo.softDelete).toHaveBeenCalledWith(
        "cat-123",
        "user-123"
      );
    });

    it("should throw if category has assigned courses", async () => {
      mockRepo.findById.mockResolvedValue({
        ...mockCategory,
        _count: { categoryCourses: 3 },
      });

      await expect(
        service.deleteCategory("cat-123", "user-123")
      ).rejects.toThrow("Cannot delete a category that has courses assigned to it. Reassign courses first.");
    });

    it("should throw 404 if category not found", async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(
        service.deleteCategory("non-existent", "user-123")
      ).rejects.toThrow("Category not found");
    });
  });
});