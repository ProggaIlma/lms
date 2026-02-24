"use client";

import { useEffect, useState } from "react";
import { enrollmentApi } from "@/lib/api/enrollment.api";
import { formatDate } from "@/utils/formatters";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { toast } from "react-hot-toast/headless";

type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "DROPPED";

interface Enrollment {
  id: string;
  status: EnrollmentStatus;
  enrolledAt: string;
  courseId: string;
  course: {
    id: string;
    title: string;
    description: string;
    isFree: boolean;
    price: number;
    instructor: { name: string };
    category:   { name: string } | null;
    _count:     { lessons: number };
  };
}

const statusBadge: Record<EnrollmentStatus, "success" | "neutral" | "danger"> = {
  ACTIVE:    "success",
  COMPLETED: "neutral",
  DROPPED:   "danger",
};

export default function MyCoursesPage() {
  const [enrollments, setEnrollments]   = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [updatingId, setUpdatingId]     = useState<string | null>(null);

  useEffect(() => {
    enrollmentApi.getMyEnrollments()
      .then((res) => setEnrollments(res.data))
      .catch(() => toast.error("Failed to load enrollments"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDrop = async (enrollmentId: string) => {
    setUpdatingId(enrollmentId);
    try {
      await enrollmentApi.updateStatus(enrollmentId, "DROPPED");
      setEnrollments((prev) =>
        prev.map((e) => e.id === enrollmentId ? { ...e, status: "DROPPED" } : e)
      );
    } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to update enrollment");
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-bold text-surface-900 text-xl">My Courses</h2>
        <p className="text-sm text-surface-500 mt-0.5">{enrollments.length} enrolled courses</p>
      </div>

     

      {enrollments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-surface-200">
          <p className="font-semibold text-surface-700">No enrollments yet</p>
          <p className="text-sm text-surface-400 mt-1">Browse courses and enroll to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="bg-white rounded-xl border border-surface-200 p-5 flex items-center gap-4">
              {/* Icon */}
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-surface-900 text-sm truncate">
                  {enrollment.course.title}
                </p>
                <p className="text-xs text-surface-400 mt-0.5">
                  {enrollment.course.instructor?.name}
                  {enrollment.course.category && ` · ${enrollment.course.category.name}`}
                  {` · ${enrollment.course._count?.lessons ?? 0} lessons`}
                </p>
                <p className="text-xs text-surface-400 mt-0.5">
                  Enrolled {formatDate(enrollment.enrolledAt)}
                </p>
              </div>

              {/* Status + Action */}
              <div className="flex items-center gap-3 shrink-0">
                <Badge variant={statusBadge[enrollment.status]}>
                  {enrollment.status}
                </Badge>
                {enrollment.status === "ACTIVE" && (
                  <Button
                    variant="danger"
                    size="sm"
                    isLoading={updatingId === enrollment.id}
                    onClick={() => handleDrop(enrollment.id)}
                  >
                    Drop
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}