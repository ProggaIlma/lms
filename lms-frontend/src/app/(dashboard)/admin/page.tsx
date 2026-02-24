"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-surface-800 to-surface-900 rounded-2xl p-6 text-white">
        <p className="text-surface-400 text-sm font-medium">Admin Panel 🛡️</p>
        <h2 className="font-display text-2xl font-bold mt-1">{user?.name}</h2>
        <p className="text-surface-400 text-sm mt-1">{user?.role}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users",   value: "—", icon: "👥", color: "bg-blue-50 text-blue-600" },
          { label: "Total Courses", value: "—", icon: "📚", color: "bg-purple-50 text-purple-600" },
          { label: "Enrollments",   value: "—", icon: "🎓", color: "bg-green-50 text-green-600" },
          { label: "Revenue",       value: "—", icon: "💰", color: "bg-amber-50 text-amber-600" },
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
          <Link href="/admin/users"      className="btn-primary btn">Manage Users</Link>
          <Link href="/admin/categories" className="btn-secondary btn">Manage Categories</Link>
          <Link href="/admin/courses"    className="btn-secondary btn">Manage Courses</Link>
        </div>
      </div>
    </div>
  );
}