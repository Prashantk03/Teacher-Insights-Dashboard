"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [overview, setOverview] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    fetch("/api/insights/overview")
      .then((res) => res.json())
      .then((data) => setOverview(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-10 md:py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Title */}
          <h1 className="text-3xl font-semibold text-gray-800 mb-8">
            Teachers List
          </h1>

          {/* Table */}
          <div className="mt-12">
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Lessons</th>
                    <th className="px-6 py-3">Quizzes</th>
                    <th className="px-6 py-3">Assessments</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.map((teacher) => (
                    <tr
                      key={teacher.teacherId}
                      onClick={() =>
                        router.push(`/dashboard/teacher/${teacher.teacherId}`)
                      }
                      className="border-t hover:bg-gray-50 cursor-pointer transition overflow-x-auto"
                    >
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {teacher.name}
                      </td>
                      <td className="px-6 py-4 text-zinc-950">
                        {teacher.lessons}
                      </td>
                      <td className="px-6 py-4 text-zinc-950">
                        {teacher.quizzes}
                      </td>
                      <td className="px-6 py-4 text-zinc-950">
                        {teacher.assessments}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
