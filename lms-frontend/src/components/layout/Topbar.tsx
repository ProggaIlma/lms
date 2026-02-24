"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const pageTitles: Record<string, string> = {
  "/admin":                "Dashboard",
  "/admin/users":          "Users",
  "/admin/categories":     "Categories",
  "/admin/courses":        "Courses",
  "/instructor":           "Dashboard",
  "/instructor/courses":   "My Courses",
  "/instructor/analytics": "Analytics",
  "/student":              "Dashboard",
  "/student/courses":      "Browse Courses",
  "/student/my-courses":   "My Courses",
};

export default function Topbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const title = pageTitles[pathname] ?? "Dashboard";

  return (
    <header className="fixed top-0 left-60 right-0 h-16 bg-white border-b border-surface-200 flex items-center justify-between px-6 z-20">
      <h1 className="font-display font-bold text-surface-900 text-lg">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-surface-500">
          Welcome, <span className="font-semibold text-surface-900">{user?.name}</span>
        </span>
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
          <span className="text-xs font-bold text-primary-700">
            {user?.name?.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  );
}