import { Prisma, PrismaClient } from "@prisma/client";
import { CreateCategoryDTO, UpdateCategoryDTO, CategoryQueryDTO } from "./category.dto";

const prisma = new PrismaClient();



export class CategoryRepository {
  async create(data: CreateCategoryDTO, createdById: string) {
    return prisma.category.create({
      data: {
        name: data.name,
        createdById,
        updatedById: createdById,
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findById(id: string) {
    return prisma.category.findFirst({
      where: { id, isDeleted: false },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        updatedBy: { select: { id: true, name: true, email: true } },
        _count: { select: { categoryCourses: true } },
      },
    });
  }

  async findByName(name: string) {
    return prisma.category.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        isDeleted: false,
      },
    });
  }

  async findAll(query: CategoryQueryDTO) {
    const { search, limit, sortBy, sortOrder, cursor } = query;

    const where: Prisma.CategoryWhereInput = {
      isDeleted: false,
      ...(search && {
        name: { contains: search, mode: "insensitive" },
      }),
    };

    if (cursor) {
      const [total, items] = await prisma.$transaction([
        prisma.category.count({ where }),
        prisma.category.findMany({
          where,
          take: limit,
          skip: 1, 
          cursor: { id: cursor },
          orderBy: { [sortBy]: sortOrder },
          include: {
            _count: { select: { categoryCourses: true } },
          },
        }),
      ]);

      return { items, total, nextCursor: items[items.length - 1]?.id ?? null };
    }

    const page = query.page ?? 1;
    const skip = (page - 1) * limit;

    const [total, items] = await prisma.$transaction([
      prisma.category.count({ where }),
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: { select: { categoryCourses: true } },
        },
      }),
    ]);

    return { items, total, nextCursor: items[items.length - 1]?.id ?? null };
  }

  async update(id: string, data: UpdateCategoryDTO, updatedById: string) {
    return prisma.category.update({
      where: { id },
      data: {
        ...data,
        updatedById,
      },
      include: {
        updatedBy: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async softDelete(id: string, updatedById: string) {
    return prisma.category.update({
      where: { id },
      data: {
        isDeleted: true,
        updatedById,
      },
    });
  }
}