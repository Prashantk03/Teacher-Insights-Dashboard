import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      orderBy: { name: "asc" },
    });

    return Response.json(teachers);
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}