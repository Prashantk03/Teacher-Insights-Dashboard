import { PrismaClient } from "@prisma/client";
import xlsx from "xlsx";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function importData() {
  try {
    const filePath = path.join(
      __dirname,
      "Savra_Teacher_Data_Set.xlsx"
    );

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json(sheet);

    console.log(`Total rows found: ${data.length}`);

    for (const row of data) {
  const teacherId = row.Teacher_id;
  const teacherName = row.Teacher_name;
  const activityType = row.Activity_type;
  const createdAt = row.Created_at;
  const subject = row.Subject;
  const className = row.Grade; 

  if (!teacherId || !teacherName || !activityType || !createdAt) {
    console.log("!!Skipping invalid row:", row);
    continue;
  }

  // Upsert Teacher
  const teacher = await prisma.teacher.upsert({
    where: { teacherId: String(teacherId) },
    update: {},
    create: {
      teacherId: String(teacherId),
      name: teacherName,
    },
  });

  try {
    await prisma.activity.create({
      data: {
        teacherRef: teacher.id,
        activityType: activityType.toLowerCase(),
        subject: subject || "Unknown",
        class: String(className || "Unknown"),
        createdAt: new Date(createdAt),
      },
    });
  } catch (err) {
    if (err.code === "P2002") {
      console.log("!! Duplicate skipped");
    } else {
      console.error("!! Error inserting activity:...", err);
    }
  }
} 

    console.log("! Data import completed successfully");
  } catch (error) {
    console.error("!! Import failed:...", error);
  } finally {
    await prisma.$disconnect();
  }
}

importData();