"use client";

import { useEffect, useState } from "react";
import { analyticsApi } from "@/lib/api/analytics.api";
import { formatCurrency, formatNumber } from "@/utils/formatters";

interface InstructorStats {
  totalCourses:  number;
  totalStudents: number;
  totalRevenue:  number;
  topCourses:    {
    id:     string;
    title:  string;
    price:  number;
    isFree: boolean;
    _count: { enrollments: number; lessons: number };
  }[];
}

export default function InstructorAnalyticsPage() {
  const [stats, setStats]       = useState<InstructorStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    analyticsApi.getInstructorStats()
      .then((res) => setStats(res.data))
      .catch(() => setError("Failed to load analytics"))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <p className="text-indigo-200 text-sm font-medium">Instructor Analytics 📊</p>
        <h2 className="font-display text-2xl font-bold mt-1">Your Performance</h2>
        <p className="text-indigo-200 text-sm mt-1">Track your courses and revenue</p>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "My Courses",
            value: isLoading ? "—" : formatNumber(stats?.totalCourses ?? 0),
            icon:  "📚",
            color: "bg-indigo-50 text-indigo-600",
          },
          {
            label: "Total Students",
            value: isLoading ? "—" : formatNumber(stats?.totalStudents ?? 0),
            icon:  "👥",
            color: "bg-green-50 text-green-600",
          },
          {
            label: "Total Revenue",
            value: isLoading ? "—" : formatCurrency(stats?.totalRevenue ?? 0),
            icon:  "💰",
            color: "bg-amber-50 text-amber-600",
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-surface-200 p-5">
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center text-xl mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-display font-bold text-surface-900">{stat.value}</p>
            <p className="text-sm text-surface-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Top Courses Table */}
      <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-200">
          <h3 className="font-display font-semibold text-surface-900">Course Performance</h3>
        </div>
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-surface-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : !stats?.topCourses?.length ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="font-semibold text-surface-700">No courses yet</p>
            <p className="text-sm text-surface-400 mt-1">Create a course to see analytics</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-50">
                {["Course", "Lessons", "Students", "Price", "Revenue"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {stats.topCourses.map((course) => (
                <tr key={course.id} className="hover:bg-surface-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-surface-900">
                    {course.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-surface-600">
                    {course._count.lessons}
                  </td>
                  <td className="px-6 py-4 text-sm text-surface-600">
                    {course._count.enrollments}
                  </td>
                  <td className="px-6 py-4 text-sm text-surface-600">
                    {course.isFree ? (
                      <span className="text-emerald-600 font-semibold">Free</span>
                    ) : (
                      formatCurrency(course.price)
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-surface-900">
                    {course.isFree ? "—" : formatCurrency(course.price * course._count.enrollments)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}