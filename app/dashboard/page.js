"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

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

  const totalTeachers = overview.length;
  const totalLessons = overview.reduce((sum, t) => sum + t.lessons, 0);
  const totalQuizzes = overview.reduce((sum, t) => sum + t.quizzes, 0);
  const totalAssessments = overview.reduce((sum, t) => sum + t.assessments, 0);

  return (
    <>
      <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-10 md:py-8">
        <div className="max-w-6xl mx-auto">

          {/* Title */}
          <h1 className="text-3xl font-semibold text-gray-800 mb-8">
            Teacher Insights Dashboard
          </h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard label="Total Teachers" value={totalTeachers} />
            <SummaryCard label="Lessons" value={totalLessons} />
            <SummaryCard label="Quizzes" value={totalQuizzes} />
            <SummaryCard label="Assessments" value={totalAssessments} />
          </div>

          {/* Chart */}
          <div className="mt-12">
            <div className="bg-white p-6 rounded-lg shadow mt-10">
              <h2 className="text-lg font-semibold mb-4 text-zinc-950">
                Overall Distribution
              </h2>

              <div className="w-full h-80">
                <ResponsiveContainer>
                  <BarChart
                    data={[
                      { name: "Lessons", value: totalLessons },
                      { name: "Quizzes", value: totalQuizzes },
                      { name: "Assessments", value: totalAssessments },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow text-center">
      <p className="text-sm text-gray-500 mb-2">{label}</p>
      <h2 className="text-2xl font-semibold text-gray-800">{value}</h2>
    </div>
  );
}
