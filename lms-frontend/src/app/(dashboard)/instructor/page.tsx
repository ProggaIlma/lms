"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { analyticsApi } from "@/lib/api/analytics.api";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import Link from "next/link";

interface InstructorStats {
  totalCourses:  number;
  totalStudents: number;
  totalRevenue:  number;
}

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [stats, setStats]       = useState<InstructorStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    analyticsApi.getInstructorStats()
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Analytics error:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <p className="text-indigo-200 text-sm font-medium">Instructor Panel 🎓</p>
        <h2 className="font-display text-2xl font-bold mt-1">Welcome, {user?.name}</h2>
        <p className="text-indigo-200 text-sm mt-1">Manage your courses and students</p>
      </div>

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
            label: "Students",
            value: isLoading ? "—" : formatNumber(stats?.totalStudents ?? 0),
            icon:  "👥",
            color: "bg-green-50 text-green-600",
          },
          {
            label: "Revenue",
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

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-surface-200 p-6">
        <h3 className="font-display font-bold text-surface-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/instructor/courses/create" className="btn-primary btn">Create Course</Link>
          <Link href="/instructor/courses"        className="btn-secondary btn">My Courses</Link>
          <Link href="/instructor/analytics"      className="btn-secondary btn">View Analytics</Link>
        </div>
      </div>
    </div>
  );
}