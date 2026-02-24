import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UserRepository {
  async findAll(params: {
    search?: string;
    role?: string;
    page: number;
    limit: number;
  }) {
    const { search, role, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      ...(search && {
        OR: [
          { name:  { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(role && { role: role as any }),
    };

    const [total, users] = await prisma.$transaction([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id:        true,
          name:      true,
          email:     true,
          role:      true,
          isActive:  true,
          createdAt: true,
        },
      }),
    ]);

    return { users, total };
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id:        true,
        name:      true,
        email:     true,
        role:      true,
        isActive:  true,
        createdAt: true,
      },
    });
  }

  async updateActive(id: string, isActive: boolean) {
    return prisma.user.update({
      where: { id },
      data:  { isActive },
      select: {
        id:       true,
        name:     true,
        email:    true,
        role:     true,
        isActive: true,
      },
    });
  }
}