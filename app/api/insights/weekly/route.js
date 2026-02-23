import { prisma } from "@/lib/prisma";

function getWeekKey(date) {
  const d = new Date(date);
  const year = d.getFullYear();

  const firstDay = new Date(d.getFullYear(), 0, 1);
  const pastDays = Math.floor((d - firstDay) / 86400000);
  const week = Math.ceil((pastDays + firstDay.getDay() + 1) / 7);

  return `${year}-W${week}`;
}

export async function GET() {
  try {
    const activities = await prisma.activity.findMany();

    const weeklyMap = {};

    for (const activity of activities) {
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

    const result = Object.values(weeklyMap).sort((a, b) =>
      a.week.localeCompare(b.week)
    );

    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Failed to fetch weekly data" },
      { status: 500 }
    );
  }
}