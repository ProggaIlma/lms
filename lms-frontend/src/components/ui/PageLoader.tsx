"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // * show loader on route change
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* * top progress bar */}
      <div className="h-0.5 bg-primary-100">
        <div className="h-full bg-primary-600 animate-progress" />
      </div>
    </div>
  );
}