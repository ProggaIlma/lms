"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Cookies from "js-cookie";

export default function RootPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");

    // No token at all — go to login
    if (!token) {
      router.replace("/login");
      return;
    }

    // Token exists but Redux hasn't hydrated user yet — wait
    if (!isAuthenticated || !user) {
      setChecking(true);
      return;
    }

    // User loaded — redirect based on role
    switch (user.role) {
      case "SUPER_ADMIN":
      case "ADMIN":
        router.replace("/admin");
        break;
      case "INSTRUCTOR":
        router.replace("/instructor");
        break;
      case "STUDENT":
        router.replace("/student");
        break;
      default:
        router.replace("/login");
    }

    setChecking(false);
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      <p className="text-sm text-surface-500">Loading...</p>
    </div>
  );
}