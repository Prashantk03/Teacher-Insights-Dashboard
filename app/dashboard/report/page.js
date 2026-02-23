"use client";

import { useState } from "react";

export default function ReportsPage() {
  const [filter, setFilter] = useState("This Month");

  const reports = [
    {
      id: 1,
      title: "Monthly Teacher Activity",
      type: "Performance",
      generatedOn: "2026-02-01",
      status: "Completed",
    },
    {
      id: 2,
      title: "Quiz Engagement Report",
      type: "Engagement",
      generatedOn: "2026-02-10",
      status: "Completed",
    },
    {
      id: 3,
      title: "Assessment Summary",
      type: "Academic",
      generatedOn: "2026-02-15",
      status: "Pending",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Reports
        </h1>
        <p className="text-sm text-gray-500">
          Generate and review academic performance reports
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {["This Week", "This Month", "This Year"].map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filter === option
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <p className="text-sm text-gray-500">Total Reports</p>
          <h2 className="text-2xl font-semibold text-gray-900 mt-2">
            12
          </h2>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <p className="text-sm text-gray-500">Generated</p>
          <h2 className="text-2xl font-semibold text-gray-900 mt-2">
            9
          </h2>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>
          <h2 className="text-2xl font-semibold text-gray-900 mt-2">
            3
          </h2>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 border-b text-gray-600">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Generated On</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr
                key={report.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {report.title}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {report.type}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {report.generatedOn}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      report.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}