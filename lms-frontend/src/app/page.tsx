"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function RootPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    switch (user?.role) {
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
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
    </div>
  );
}
