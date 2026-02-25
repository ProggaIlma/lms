"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchCourses, deleteCourse } from "@/store/slices/courseSlice";
import { Course } from "@/types/course.types";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate, formatCurrency } from "@/utils/formatters";
import CourseStatusBadge from "@/components/course/CourseStatusBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Button from "@/components/ui/Button";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { courseApi } from "@/lib/api/course.api";
import toast from "react-hot-toast";
import { CourseStatus } from "@/types/course.types";
export default function AdminCoursesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, isLoading, pagination, error } = useSelector((state: RootState) => state.course);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CourseStatus | "">("");
  const [page, setPage] = useState(1);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const loadCourses = useCallback(() => {
    dispatch(
      fetchCourses({
        search: debouncedSearch || undefined,
        status: (statusFilter as CourseStatus) || undefined,
        page,
        limit: 10,
      }),
    );
  }, [dispatch, debouncedSearch, statusFilter, page]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const handleDeleteClick = (course: Course) => {
    setDeletingCourse(course);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCourse) return;
    setActionLoading(true);
    try {
      await dispatch(deleteCourse(deletingCourse.id)).unwrap();
      setIsConfirmOpen(false);
      setDeletingCourse(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (course: Course, status: string) => {
  setUpdatingStatusId(course.id);
  console.log(course);
  
  try {
    await courseApi.update(course.id, { ...course, status });
    toast.success("Status updated");
    loadCourses(); // * reload from Redux
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Failed to update status");
  } finally {
    setUpdatingStatusId(null);
  }
};
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-surface-900 text-xl">All Courses</h2>
          <p className="text-sm text-surface-500 mt-0.5">{pagination.total} total courses</p>
        </div>
      </div>

      {/* Error */}
      {error && <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-surface-200 p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses..." className="input pl-10" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as CourseStatus | "")} className="input w-auto min-w-[150px]">
          <option value="">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={5} cols={5} />
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-surface-100 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <p className="font-semibold text-surface-700">No courses found</p>
            <p className="text-sm text-surface-400 mt-1">{search || statusFilter ? "Try adjusting your filters" : "No courses created yet"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50">
                  {["Course", "Instructor", "Category", "Price", "Status", "Students", ""].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-surface-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-surface-900">{course.title}</p>
                        <p className="text-xs text-surface-400">{formatDate(course.createdAt)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-surface-600">{course.instructor?.name ?? "—"}</td>
                    <td className="px-6 py-4 text-sm text-surface-600">{course.category?.name ?? "—"}</td>
                    <td className="px-6 py-4 text-sm text-surface-600">{course.isFree ? <span className="text-emerald-600 font-semibold">Free</span> : formatCurrency(course.price)}</td>
                    <td className="px-6 py-4">
                      <CourseStatusBadge status={course.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-surface-600">{course._count?.enrollments ?? 0}</td>
                    <td className="px-6 py-4">
                      {updatingStatusId === course.id ? (
                        <div className="flex items-center gap-2 text-sm text-surface-500">
                          <div className="w-4 h-4 rounded-full border-2 border-surface-300 border-t-primary-600 animate-spin" />
                          Updating...
                        </div>
                      ) : (
                        <select value={course.status} onChange={(e) => handleStatusChange(course, e.target.value)} className="input w-auto text-sm py-1">
                          <option value="DRAFT">Draft</option>
                          <option value="PUBLISHED">Published</option>
                          <option value="ARCHIVED">Archived</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-surface-200">
            <p className="text-sm text-surface-500">
              Page {page} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <Button variant="secondary" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setDeletingCourse(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Archive Course"
        message={`Are you sure you want to archive "${deletingCourse?.title}"?`}
        confirmLabel="Archive"
        isLoading={actionLoading}
      />
    </div>
  );
}
