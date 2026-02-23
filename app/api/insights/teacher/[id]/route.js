import { prisma } from "@/lib/prisma";

function getWeekKey(date) {
  const d = new Date(date);
  const year = d.getFullYear();

  const firstDay = new Date(d.getFullYear(), 0, 1);
  const pastDays = Math.floor((d - firstDay) / 86400000);
  const week = Math.ceil((pastDays + firstDay.getDay() + 1) / 7);

  return `${year}-W${week}`;
}

export async function GET(req, context) {
  try {
    const { id } = await context.params;

    const teacher = await prisma.teacher.findUnique({
      where: { teacherId: id },
      include: { activities: true },
    });

    if (!teacher) {
      return Response.json(
        { message: "Teacher not found" },
        { status: 404 }
      );
    }

    // TOTAL COUNTS
    const lessons = teacher.activities.filter(
      (a) => a.activityType === "lesson plan"
    ).length;

    const quizzes = teacher.activities.filter(
      (a) => a.activityType === "quiz"
    ).length;

    const assessments = teacher.activities.filter(
      (a) => a.activityType === "question paper"
    ).length;

    // WEEKLY DATA
    const weeklyMap = {};

    for (const activity of teacher.activities) {
      const weekKey = getWeekKey(activity.createdAt);

      if (!weeklyMap[weekKey]) {
        weeklyMap[weekKey] = {
          week: weekKey,
          lessons: 0,
          quizzes: 0,
          assessments: 0,
        };
      }

      if (activity.activityType === "lesson plan") {
        weeklyMap[weekKey].lessons++;
      } else if (activity.activityType === "quiz") {
        weeklyMap[weekKey].quizzes++;
      } else if (activity.activityType === "question paper") {
        weeklyMap[weekKey].assessments++;
      }
    }

    // FORMAT ACTIVITIES
    const formattedActivities = teacher.activities.map((a) => ({
      id: a.id,
      subject: a.subject,
      grade: a.class, // rename class → grade
      type: a.activityType,
      createdAt: a.createdAt,
    }));

    return Response.json({
      teacherId: teacher.teacherId,
      name: teacher.name,
      totals: { lessons, quizzes, assessments },
      weekly: Object.values(weeklyMap),
      activities: formattedActivities, // NEW
    });

  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Failed to fetch teacher insights" },
      { status: 500 }
    );
  }
}