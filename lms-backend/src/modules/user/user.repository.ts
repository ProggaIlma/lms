import { PrismaClient, Role } from "@prisma/client";
import { AppError } from "../../utils/AppError";

const prisma = new PrismaClient();

// * shared select — never expose password
const userSelect = {
  id:        true,
  name:      true,
  email:     true,
  role:      true,
  isActive:  true,
  createdAt: true,
};

export const UserRepository = {
findAll: async (params?: {
    role?:   Role;
    search?: string;
    page?:   number;
    limit?:  number;
  }) => {
    const page  = params?.page  ?? 1;
    const limit = params?.limit ?? 10;
    const skip  = (page - 1) * limit;

    const where = {
      ...(params?.role   && { role: params.role }),
      ...(params?.search && {
        OR: [
          { name:  { contains: params.search, mode: "insensitive" as const } },
          { email: { contains: params.search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [total, users] = await prisma.$transaction([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        select:  userSelect,
        orderBy: { createdAt: "desc" },
        skip,
        take:    limit,
      }),
    ]);

    return {
      data:users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  findById: async (id: string) => {
    return prisma.user.findUnique({ where: { id }, select: userSelect });
  },

  findByEmail: async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  },

  create: async (data: {
    name:     string;
    email:    string;
    password: string;
    role:     Role;
  }) => {
    return prisma.user.create({
      data,
      select: userSelect,
    });
  },

  update: async (id: string, data: { isActive?: boolean; role?: Role }) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new AppError("User not found", 404);

    return prisma.user.update({
      where:  { id },
      data,
      select: userSelect,
    });
  },
};