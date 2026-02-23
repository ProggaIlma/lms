import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: "super@test.com" }
  });

  if (existing) {
    console.log("SUPER_ADMIN already exists");
    return;
  }

  const hashed = await bcrypt.hash("123456", 10);

  await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "super@test.com",
      password: hashed,
      role: Role.SUPER_ADMIN
    }
  });

  console.log("SUPER_ADMIN created");
}

main().finally(() => prisma.$disconnect());