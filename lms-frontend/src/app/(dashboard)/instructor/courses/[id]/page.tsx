"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema, CourseFormData, lessonSchema, LessonFormData } from "@/utils/validators";
import { courseApi } from "@/lib/api/course.api";
import { categoryApi } from "@/lib/api/category.api";
import { Category } from "@/types/category.types";
import { Course, Lesson } from "@/types/course.types";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/Skeleton";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function EditCoursePage() {
  const { id }  = useParams() as { id: string };
  const router  = useRouter();

  const [course, setCourse]         = useState<Course | null>(null);
  const [lessons, setLessons]       = useState<Lesson[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [isSaving, setIsSaving]     = useState(false);

  // Thumbnail
  const fileInputRef                            = useRef<HTMLInputElement>(null);
  const [thumbnailFile, setThumbnailFile]       = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Lesson modal state
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson]         = useState<Lesson | null>(null);
  const [isDeletingLesson, setIsDeletingLesson]   = useState<Lesson | null>(null);
  const [isConfirmOpen, setIsConfirmOpen]         = useState(false);
  const [lessonLoading, setLessonLoading]         = useState(false);

  // Course form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
  });

  // Lesson form
  const {
    register:     registerLesson,
    handleSubmit: handleLessonSubmit,
    reset:        resetLesson,
    formState:    { errors: lessonErrors },
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
  });

  const isFree = watch("isFree");

  // Load course + categories
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [courseRes, catRes] = await Promise.all([
          courseApi.getById(id),
          categoryApi.getAll({ limit: 100 }),
        ]);

        const c = courseRes.data;
        setCourse(c);
        setLessons((c as any).lessons ?? []);
        setCategories(catRes.categories);

        // Set thumbnail preview if exists
        if (c.thumbnail) {
          setThumbnailPreview(`http://localhost:5000${c.thumbnail}`);
        }

        reset({
          title:       c.title,
          description: c.description,
          categoryId:  c.categoryId ?? "",
          price:       c.price,
          isFree:      c.isFree,
        });
      } catch (err: any) {
 
        toast.error(err.response?.data?.message || "Failed to load course");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, reset]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  // Save course
  const onSaveCourse = async (data: CourseFormData) => {
    setIsSaving(true);
    toast.dismiss();
    try {
      await courseApi.update(id, {
        ...data,
        thumbnail: thumbnailFile ?? undefined,
      });
      toast.success("Course updated successfully");
      setTimeout(() => toast.dismiss(), 3000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update course");
    } finally {
      setIsSaving(false);
    }
  };

  // Lesson handlers
  const handleAddLesson = () => {
    setEditingLesson(null);
    resetLesson({ title: "", content: "", videoUrl: "", order: lessons.length + 1, isPreview: false });
    setIsLessonModalOpen(true);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    resetLesson({
      title:     lesson.title,
      content:   lesson.content,
      videoUrl:  lesson.videoUrl ?? "",
      order:     lesson.order,
      isPreview: lesson.isPreview,
    });
    setIsLessonModalOpen(true);
  };

  const onSaveLesson = async (data: LessonFormData) => {
    setLessonLoading(true);
    try {
      if (editingLesson) {
        const res = await courseApi.updateLesson(id, editingLesson.id, data);
        setLessons((prev) => prev.map((l) => l.id === editingLesson.id ? res.data : l));
      } else {
        const res = await courseApi.createLesson(id, data);
        setLessons((prev) => [...prev, res.data]);
      }
      setIsLessonModalOpen(false);
      resetLesson();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save lesson");
    } finally {
      setLessonLoading(false);
    }
  };

  const handleDeleteLesson = (lesson: Lesson) => {
    setIsDeletingLesson(lesson);
    setIsConfirmOpen(true);
  };

  const confirmDeleteLesson = async () => {
    if (!isDeletingLesson) return;
    setLessonLoading(true);
    try {
      await courseApi.deleteLesson(id, isDeletingLesson.id);
      setLessons((prev) => prev.filter((l) => l.id !== isDeletingLesson.id));
      setIsConfirmOpen(false);
      setIsDeletingLesson(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete lesson");
    } finally {
      setLessonLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-surface-900 text-xl">Edit Course</h2>
          <p className="text-sm text-surface-500 mt-0.5">{course?.title}</p>
        </div>
        <Button variant="secondary" onClick={() => router.back()}>Back</Button>
      </div>

      <form onSubmit={handleSubmit(onSaveCourse)} className="space-y-5">

        {/* Thumbnail */}
        <div className="bg-white rounded-xl border border-surface-200 p-6 space-y-4">
          <h3 className="font-display font-semibold text-surface-900">Thumbnail</h3>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative border-2 border-dashed border-surface-200 rounded-xl overflow-hidden cursor-pointer hover:border-primary-400 transition-colors"
          >
            {thumbnailPreview ? (
              <div className="relative h-48 w-full">
                <Image
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-semibold">Change image</p>
                </div>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center gap-2 text-surface-400">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium">Click to upload thumbnail</p>
                <p className="text-xs">PNG, JPG, WebP up to 5MB</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleThumbnailChange}
            className="hidden"
          />
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-surface-200 p-6 space-y-4">
          <h3 className="font-display font-semibold text-surface-900">Basic Info</h3>

          <Input
            label="Course title"
            placeholder="e.g. Complete React Developer Course"
            error={errors.title?.message}
            {...register("title")}
          />

          <div>
            <label className="label">Description</label>
            <textarea
              rows={4}
              placeholder="What will students learn?"
              className={`input resize-none ${errors.description ? "input-error" : ""}`}
              {...register("description")}
            />
            {errors.description && <p className="error-msg">{errors.description.message}</p>}
          </div>

          <div>
            <label className="label">Category</label>
            <select className="input" {...register("categoryId")}>
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl border border-surface-200 p-6 space-y-4">
          <h3 className="font-display font-semibold text-surface-900">Pricing</h3>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isFree"
              className="w-4 h-4 accent-primary-600"
              {...register("isFree")}
              onChange={(e) => {
                setValue("isFree", e.target.checked);
                if (e.target.checked) setValue("price", 0);
              }}
            />
            <label htmlFor="isFree" className="text-sm font-medium text-surface-700">
              This is a free course
            </label>
          </div>
          {!isFree && (
            <Input
              label="Price (USD)"
              type="number"
              placeholder="29.99"
              error={errors.price?.message}
              {...register("price", { valueAsNumber: true })}
            />
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="primary" type="submit" isLoading={isSaving}>
            Save Changes
          </Button>
        </div>
      </form>

      {/* Lessons */}
      <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200">
          <div>
            <h3 className="font-display font-semibold text-surface-900">Lessons</h3>
            <p className="text-xs text-surface-400 mt-0.5">{lessons.length} lessons</p>
          </div>
          <Button variant="primary" size="sm" onClick={handleAddLesson}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Lesson
          </Button>
        </div>

        {lessons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="font-semibold text-surface-700">No lessons yet</p>
            <p className="text-sm text-surface-400 mt-1">Add your first lesson to get started</p>
            <Button variant="primary" className="mt-4" size="sm" onClick={handleAddLesson}>
              Add Lesson
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-surface-100">
            {lessons
              .sort((a, b) => a.order - b.order)
              .map((lesson) => (
                <div key={lesson.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-50 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary-600">{lesson.order}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-surface-900 truncate">{lesson.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {lesson.isPreview && (
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                          Preview
                        </span>
                      )}
                      {lesson.videoUrl && (
                        <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-medium">
                          Video
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditLesson(lesson)}
                      className="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(lesson)}
                      className="p-1.5 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Lesson Modal */}
      <Modal
        isOpen={isLessonModalOpen}
        onClose={() => { setIsLessonModalOpen(false); resetLesson(); }}
        title={editingLesson ? "Edit Lesson" : "Add Lesson"}
        size="lg"
      >
        <form onSubmit={handleLessonSubmit(onSaveLesson)} className="space-y-4">
          <Input
            label="Lesson title"
            placeholder="e.g. Introduction to React"
            error={lessonErrors.title?.message}
            {...registerLesson("title")}
          />
          <div>
            <label className="label">Content</label>
            <textarea
              rows={4}
              placeholder="Lesson content..."
              className={`input resize-none ${lessonErrors.content ? "input-error" : ""}`}
              {...registerLesson("content")}
            />
            {lessonErrors.content && <p className="error-msg">{lessonErrors.content.message}</p>}
          </div>
          <Input
            label="Video URL (optional)"
            placeholder="https://youtube.com/..."
            error={lessonErrors.videoUrl?.message}
            {...registerLesson("videoUrl")}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Order"
              type="number"
              error={lessonErrors.order?.message}
              {...registerLesson("order", { valueAsNumber: true })}
            />
            <div className="flex items-center gap-3 pt-7">
              <input
                type="checkbox"
                id="isPreview"
                className="w-4 h-4 accent-primary-600"
                {...registerLesson("isPreview")}
              />
              <label htmlFor="isPreview" className="text-sm font-medium text-surface-700">
                Free preview
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => { setIsLessonModalOpen(false); resetLesson(); }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={lessonLoading}>
              {editingLesson ? "Save Changes" : "Add Lesson"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Lesson Confirm */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => { setIsConfirmOpen(false); setIsDeletingLesson(null); }}
        onConfirm={confirmDeleteLesson}
        title="Delete Lesson"
        message={`Are you sure you want to delete "${isDeletingLesson?.title}"?`}
        isLoading={lessonLoading}
      />
    </div>
  );
}