"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/store/slices/categorySlice";
import { Category } from "@/types/category.types";
import { CategoryFormData } from "@/utils/validators";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate } from "@/utils/formatters";
import CategoryModal from "@/components/category/CategoryModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { clearCourseError } from "@/store/slices/courseSlice";

export default function CategoriesPage() {
  const dispatch = useDispatch<AppDispatch>();
  
  const { categories, isLoading, pagination, error } = useSelector(
    (state: RootState) => state.category
  );

  const [search, setSearch]                         = useState("");
  const [page, setPage]                             = useState(1);
  const [isModalOpen, setIsModalOpen]               = useState(false);
  const [isConfirmOpen, setIsConfirmOpen]           = useState(false);
  const [editingCategory, setEditingCategory]       = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory]     = useState<Category | null>(null);
  const [actionLoading, setActionLoading]           = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const loadCategories = useCallback(() => {
    dispatch(fetchCategories({ search: debouncedSearch || undefined, page, limit: 10 }));
    clearCourseError();  }, [dispatch, debouncedSearch, page]);

  useEffect(() => { loadCategories(); }, [loadCategories]);
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  const handleCreate = () => { setEditingCategory(null); setIsModalOpen(true); };
  const handleEdit = (category: Category) => { setEditingCategory(category); setIsModalOpen(true); };
  const handleDeleteClick = (category: Category) => { setDeletingCategory(category); setIsConfirmOpen(true); };

  const handleModalSubmit = async (data: CategoryFormData) => {
    setActionLoading(true);
    try {
      if (editingCategory) {
        await dispatch(updateCategory({ id: editingCategory.id, payload: data })).unwrap();
      } else {
        await dispatch(createCategory(data)).unwrap();
      }
      setIsModalOpen(false);
      setEditingCategory(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    setActionLoading(true);
    try {
      await dispatch(deleteCategory(deletingCategory.id)).unwrap();
      setIsConfirmOpen(false);
      setDeletingCategory(null);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-surface-900 text-xl">Categories</h2>
          <p className="text-sm text-surface-500 mt-0.5">
            {pagination.total} total categor{pagination.total === 1 ? "y" : "ies"}
          </p>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Category
        </Button>
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
            placeholder="Search categories..."
            className="input pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
        {isLoading ? (
          <div className="p-6"><TableSkeleton rows={5} cols={4} /></div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-surface-100 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <p className="font-semibold text-surface-700">No categories found</p>
            <p className="text-sm text-surface-400 mt-1">
              {search ? "Try a different search term" : "Create your first category to get started"}
            </p>
            {!search && (
              <Button variant="primary" className="mt-4" onClick={handleCreate}>
                Create Category
              </Button>
            )}
          </div>
        ) : (
         <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-50">
                {["Name", "Courses", "Created", "Status", ""].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-surface-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <span className="font-medium text-surface-900 text-sm">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-surface-600">
                    {category._count?.categoryCourses ?? 0} courses
                  </td>
                  <td className="px-6 py-4 text-sm text-surface-500">
                    {formatDate(category.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="success">Active</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(category)}
                        className="p-1.5 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}

        {/* Pagination */}
        {!isLoading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-surface-200">
            <p className="text-sm text-surface-500">
              Page {pagination.page} of {pagination.totalPages}
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

      {/* Modals */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingCategory(null);clearCourseError();   }}
        onSubmit={handleModalSubmit}
        editingCategory={editingCategory}
        isLoading={actionLoading}
      />
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => { setIsConfirmOpen(false); setDeletingCategory(null); }}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deletingCategory?.name}"? This action cannot be undone.`}
        isLoading={actionLoading}
      />
    </div>
  );
}