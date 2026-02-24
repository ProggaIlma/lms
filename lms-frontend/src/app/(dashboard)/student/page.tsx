"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
        <p className="text-primary-200 text-sm font-medium">Welcome back 👋</p>
        <h2 className="font-display text-2xl font-bold mt-1">{user?.name}</h2>
        <p className="text-primary-200 text-sm mt-1">Continue your learning journey</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Enrolled Courses", value: "0", icon: "📚" },
          { label: "Completed",        value: "0", icon: "✅" },
          { label: "In Progress",      value: "0", icon: "⏳" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-surface-200 p-5 flex items-center gap-4">
            <span className="text-3xl">{stat.icon}</span>
            <div>
              <p className="text-2xl font-display font-bold text-surface-900">{stat.value}</p>
              <p className="text-sm text-surface-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-surface-200 p-6">
        <h3 className="font-display font-bold text-surface-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/student/courses" className="btn-primary btn">
            Browse Courses
          </Link>
          <Link href="/student/my-courses" className="btn-secondary btn">
            My Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
