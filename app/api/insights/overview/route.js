import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        activities: true,
      },
    });

    const overview = teachers.map((teacher) => {
      const lessons = teacher.activities.filter(
        (a) => a.activityType === "lesson plan"
      ).length;

      const quizzes = teacher.activities.filter(
        (a) => a.activityType === "quiz"
      ).length;

      const assessments = teacher.activities.filter(
        (a) => a.activityType === "question paper"
      ).length;

      return {
        teacherId: teacher.teacherId,
        name: teacher.name,
        lessons,
        quizzes,
        assessments,
      };
    });

    return Response.json(overview);
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Failed to fetch overview" },
      { status: 500 }
    );
  }
}