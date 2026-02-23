"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function TeacherDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/insights/teacher/${id}`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
  <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-8">
    <div className="max-w-6xl mx-auto space-y-10">

      {/* Back */}
      <button
        onClick={() => router.back()}
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back
      </button>

      {/* Header Section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h1 className="text-3xl font-semibold text-gray-900">
          {data.name}
        </h1>
        <p className="text-gray-500 mt-1">
          Teacher ID: {data.teacherId}
        </p>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard label="Lessons" value={data.totals.lessons} />
        <StatCard label="Quizzes" value={data.totals.quizzes} />
        <StatCard label="Assessments" value={data.totals.assessments} />
      </div>

      {/* Activity History */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Activity History
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-left">Grade</th>
                <th className="px-4 py-3 text-left">Type</th>
              </tr>
            </thead>
            <tbody>
              {data.activities.map((act) => (
                <tr key={act.id} className="border-t">
                  <td className="px-4 py-3">
                    {new Date(act.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{act.subject}</td>
                  <td className="px-4 py-3">Grade {act.grade}</td>
                  <td className="px-4 py-3 capitalize">
                    {act.type}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-6 text-gray-800">
          Weekly Summary
        </h2>

        <div className="overflow-x-auto mb-8">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Week</th>
                <th className="px-4 py-3 text-left">Lessons</th>
                <th className="px-4 py-3 text-left">Quizzes</th>
                <th className="px-4 py-3 text-left">Assessments</th>
              </tr>
            </thead>
            <tbody>
              {data.weekly.map((week, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-3 font-medium">
                    {week.week}
                  </td>
                  <td className="px-4 py-3">{week.lessons}</td>
                  <td className="px-4 py-3">{week.quizzes}</td>
                  <td className="px-4 py-3">{week.assessments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer>
            <BarChart data={data.weekly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="lessons" fill="#6366f1" />
              <Bar dataKey="quizzes" fill="#10b981" />
              <Bar dataKey="assessments" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  </div>
);
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow text-center">
      <p className="text-sm text-gray-500 mb-2">{label}</p>
      <h2 className="text-2xl font-semibold text-gray-800">{value}</h2>
    </div>
  );
}
