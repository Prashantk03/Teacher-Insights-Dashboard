import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.admin.upsert({
    where: { email: "admin@savra.com" },
    update: {},
    create: {
      email: "admin@savra.com",
      password: hashedPassword,
    },
  });

  return Response.json({
    message: "Admin seeded successfully",
    admin,
  });
}