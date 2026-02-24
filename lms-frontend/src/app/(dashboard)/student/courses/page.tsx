"use client";

import { useEffect, useState, useCallback } from "react";
import { courseApi } from "@/lib/api/course.api";
import { enrollmentApi } from "@/lib/api/enrollment.api";
import { Course } from "@/types/course.types";
import { useDebounce } from "@/hooks/useDebounce";
import { formatCurrency } from "@/utils/formatters";
import { TableSkeleton } from "@/components/ui/Skeleton";
import CourseStatusBadge from "@/components/course/CourseStatusBadge";
import Button from "@/components/ui/Button";

export default function BrowseCoursesPage() {
  const [courses, setCourses]         = useState<Course[]>([]);
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [search, setSearch]           = useState("");
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [enrolled, setEnrolled]       = useState<Set<string>>(new Set());
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [total, setTotal]             = useState(0);

  const debouncedSearch = useDebounce(search, 400);

  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await courseApi.getAll({
        search: debouncedSearch || undefined,
        status: "PUBLISHED",
        page,
        limit: 9,
      });
      setCourses(res.courses);
      setTotalPages(res.pagination.totalPages);
      setTotal(res.pagination.total);
    } catch (err: any) {
      setError("Failed to load courses");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, page]);

  // Load enrolled courses to mark already enrolled
  useEffect(() => {
    enrollmentApi.getMyEnrollments().then((res) => {
      const ids = new Set<string>(res.data.map((e: any) => e.courseId));
      setEnrolled(ids);
    }).catch(() => {});
  }, []);

  useEffect(() => { loadCourses(); }, [loadCourses]);
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  const handleEnroll = async (courseId: string) => {
    setEnrollingId(courseId);
    setError(null);
    try {
      await enrollmentApi.enroll(courseId);
setEnrolled((prev) => new Set([...Array.from(prev), courseId]));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to enroll");
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="font-display font-bold text-surface-900 text-xl">Browse Courses</h2>
        <p className="text-sm text-surface-500 mt-0.5">{total} courses available</p>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-xl border border-surface-200 p-4">
        <div className="relative max-w-sm">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="input pl-10"
          />
        </div>
      </div>

      {/* Course Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-surface-200 p-5 space-y-3">
              <div className="animate-pulse bg-surface-200 rounded-lg h-32 w-full" />
              <div className="animate-pulse bg-surface-200 rounded h-4 w-3/4" />
              <div className="animate-pulse bg-surface-200 rounded h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-surface-200">
          <p className="font-semibold text-surface-700">No courses found</p>
          <p className="text-sm text-surface-400 mt-1">
            {search ? "Try a different search term" : "No published courses yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl border border-surface-200 p-5 flex flex-col gap-3 hover:shadow-card-hover transition-shadow">
              {/* Icon */}
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-surface-900 text-sm line-clamp-2">{course.title}</h3>
                <p className="text-xs text-surface-400 mt-1">{course.instructor?.name}</p>
                <p className="text-xs text-surface-400 mt-0.5">
                  {course._count?.lessons ?? 0} lessons
                  {course.category && ` · ${course.category.name}`}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-surface-100">
                <span className={`text-sm font-bold ${course.isFree ? "text-emerald-600" : "text-surface-900"}`}>
                  {course.isFree ? "Free" : formatCurrency(course.price)}
                </span>
                {enrolled.has(course.id) ? (
                  <span className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg font-semibold">
                    Enrolled ✓
                  </span>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    isLoading={enrollingId === course.id}
                    onClick={() => handleEnroll(course.id)}
                  >
                    Enroll
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-surface-200 px-6 py-4">
          <p className="text-sm text-surface-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}