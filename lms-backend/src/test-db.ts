// src/test-db.ts
import { prisma } from "./config/prisma";

async function test() {
  const users = await prisma.user.findMany();
  console.log(users);
  await prisma.$disconnect();
}

test();
