"use client";

import { useEffect, useState } from "react";
import { analyticsApi } from "@/lib/api/analytics.api";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
} from "recharts";

interface AdminStats {
  totalUsers:       number;
  totalCourses:     number;
  totalEnrollments: number;
  totalRevenue:     number;
}

export default function AdminAnalyticsPage() {
  const [stats, setStats]                   = useState<AdminStats | null>(null);
  const [growth, setGrowth]                 = useState<any[]>([]);
  const [topCourses, setTopCourses]         = useState<any[]>([]);
  const [completionRates, setCompletionRates] = useState<any[]>([]);
  const [isLoading, setIsLoading]           = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, growthRes, topRes, ratesRes] = await Promise.all([
          analyticsApi.getAdminStats(),
          analyticsApi.getEnrollmentGrowth(),
          analyticsApi.getTopCourses(),
          analyticsApi.getCompletionRates(),
        ]);
        setStats(statsRes.data);
        setGrowth(growthRes.data);
        setTopCourses(topRes.data);
        setCompletionRates(ratesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-surface-800 to-surface-900 rounded-2xl p-6 text-white">
        <p className="text-surface-400 text-sm font-medium">Admin Panel 🛡️</p>
        <h2 className="font-display text-2xl font-bold mt-1">Analytics Overview</h2>
        <p className="text-surface-400 text-sm mt-1">Platform performance at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Users",
            value: isLoading ? "—" : formatNumber(stats?.totalUsers ?? 0),
            icon:  "👥",
            color: "bg-blue-50 text-blue-600",
          },
          {
            label: "Total Courses",
            value: isLoading ? "—" : formatNumber(stats?.totalCourses ?? 0),
            icon:  "📚",
            color: "bg-purple-50 text-purple-600",
          },
          {
            label: "Enrollments",
            value: isLoading ? "—" : formatNumber(stats?.totalEnrollments ?? 0),
            icon:  "🎓",
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

      {/* Enrollment Growth Chart */}
      <div className="bg-white rounded-xl border border-surface-200 p-6">
        <h3 className="font-display font-semibold text-surface-900 mb-6">
          Enrollment Growth — Last 10 Days
        </h3>
        {isLoading ? (
          <div className="h-64 bg-surface-100 rounded-lg animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={growth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickFormatter={(val) => val.slice(5)}
              />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                labelFormatter={(val) => `Date: ${val}`}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ fill: "#6366f1", r: 4 }}
                activeDot={{ r: 6 }}
                name="Enrollments"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top Courses Chart */}
      <div className="bg-white rounded-xl border border-surface-200 p-6">
        <h3 className="font-display font-semibold text-surface-900 mb-6">
          Top 5 Popular Courses
        </h3>
        {isLoading ? (
          <div className="h-64 bg-surface-100 rounded-lg animate-pulse" />
        ) : topCourses.length === 0 ? (
          <p className="text-sm text-surface-400 text-center py-8">No course data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topCourses} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="title"
                tick={{ fontSize: 11, fill: "#64748b" }}
                width={140}
                tickFormatter={(val) => val.length > 20 ? val.slice(0, 20) + "…" : val}
              />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                formatter={(val) => [`${val} students`, "Enrollments"]}
              />
              <Bar
                dataKey="_count.enrollments"
                fill="#6366f1"
                radius={[0, 4, 4, 0]}
                name="Students"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Instructor Completion Rates */}
      <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-200">
          <h3 className="font-display font-semibold text-surface-900">
            Instructor Completion Rates
          </h3>
        </div>
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 bg-surface-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : completionRates.length === 0 ? (
          <p className="text-sm text-surface-400 text-center py-8">No instructor data yet</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-50">
                {["Instructor", "Courses", "Enrollments", "Completed", "Rate"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {completionRates.map((row) => (
                <tr key={row.instructorId} className="hover:bg-surface-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-surface-900">
                    {row.instructorName}
                  </td>
                  <td className="px-6 py-4 text-sm text-surface-600">{row.totalCourses}</td>
                  <td className="px-6 py-4 text-sm text-surface-600">{row.totalEnrollments}</td>
                  <td className="px-6 py-4 text-sm text-surface-600">{row.completedEnrollments}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-600 rounded-full transition-all"
                          style={{ width: `${row.completionRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-primary-600 w-12 text-right">
                        {row.completionRate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </div>
    </div>
  );
}