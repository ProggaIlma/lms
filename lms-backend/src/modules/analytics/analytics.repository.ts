import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const AnalyticsRepository = {
  // * Total counts for admin
  getAdminStats: async () => {
    const [totalUsers, totalCourses, totalEnrollments, revenue] =
      await prisma.$transaction([
        prisma.user.count(),
        prisma.course.count({ where: { isDeleted: false } }),
        prisma.enrollment.count(),
        prisma.course.aggregate({
          where:  { isDeleted: false, isFree: false },
          _sum:   { price: true },
        }),
      ]);

    return {
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue: revenue._sum.price ?? 0,
    };
  },

  // * Enrollment growth for last 10 days
  getEnrollmentGrowth: async () => {
    const days = 10;
    const results = [];

    for (let i = days - 1; i >= 0; i--) {
      const date  = new Date();
      date.setDate(date.getDate() - i);
      const start = new Date(date.setHours(0, 0, 0, 0));
      const end   = new Date(date.setHours(23, 59, 59, 999));

      const count = await prisma.enrollment.count({
        where: { enrolledAt: { gte: start, lte: end } },
      });

      results.push({
        date:  start.toISOString().split("T")[0],
        count,
      });
    }

    return results;
  },

  // * Top 5 popular courses by enrollment
  getTopCourses: async () => {
    return prisma.course.findMany({
      where:   { isDeleted: false },
      orderBy: { enrollments: { _count: "desc" } },
      take:    5,
      select: {
        id:          true,
        title:       true,
        thumbnail:   true,
        isFree:      true,
        price:       true,
        instructor:  { select: { name: true } },
        _count:      { select: { enrollments: true, lessons: true } },
      },
    });
  },

  // * Revenue per course
  getRevenuePerCourse: async () => {
    const courses = await prisma.course.findMany({
      where: { isDeleted: false, isFree: false },
      select: {
        id:     true,
        title:  true,
        price:  true,
        _count: { select: { enrollments: true } },
      },
    });

    return courses.map((c) => ({
      id:       c.id,
      title:    c.title,
      price:    c.price,
      students: c._count.enrollments,
      revenue:  c.price * c._count.enrollments,
    }));
  },

  // * Instructor stats
  getInstructorStats: async (instructorId: string) => {
    const [courses, enrollments] = await prisma.$transaction([
      prisma.course.count({
        where: { instructorId, isDeleted: false },
      }),
      prisma.enrollment.count({
        where: { course: { instructorId } },
      }),
    ]);

    const revenue = await prisma.course.aggregate({
      where:  { instructorId, isDeleted: false, isFree: false },
      _sum:   { price: true },
    });

    const topCourses = await prisma.course.findMany({
      where:   { instructorId, isDeleted: false },
      orderBy: { enrollments: { _count: "desc" } },
      take:    5,
      select: {
        id:     true,
        title:  true,
        price:  true,
        isFree: true,
        _count: { select: { enrollments: true, lessons: true } },
      },
    });

    return {
      totalCourses:     courses,
      totalStudents:    enrollments,
      totalRevenue:     revenue._sum.price ?? 0,
      topCourses,
    };
  },
};