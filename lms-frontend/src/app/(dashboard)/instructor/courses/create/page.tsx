"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema, CourseFormData } from "@/utils/validators";
import { categoryApi } from "@/lib/api/category.api";
import { courseApi } from "@/lib/api/course.api";
import { Category } from "@/types/category.types";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Image from "next/image";
import toast from "react-hot-toast";

export default function CreateCoursePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: { isFree: true, price: 0 },
  });

  const isFree = watch("isFree");

  useEffect(() => {
    categoryApi.getAll({ limit: 100 }).then((res) => setCategories(res.categories));
  }, []);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: CourseFormData) => {
    setIsLoading(true);
    toast.dismiss();
    try {
      await courseApi.create({
        ...data,
        thumbnail: thumbnailFile,
      });
      router.push("/instructor/courses");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create course");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="font-display font-bold text-surface-900 text-xl">Create Course</h2>
        <p className="text-sm text-surface-500 mt-0.5">Fill in the details to create a new course</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Thumbnail */}
        <div className="bg-white rounded-xl border border-surface-200 p-6 space-y-4">
          <h3 className="font-display font-semibold text-surface-900">Thumbnail</h3>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative border-2 border-dashed border-surface-200 rounded-xl overflow-hidden cursor-pointer hover:border-primary-400 transition-colors"
          >
            {thumbnailPreview ? (
              <div className="relative h-48 w-full">
                <Image src={thumbnailPreview} alt="Thumbnail preview" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-semibold">Change image</p>
                </div>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center gap-2 text-surface-400">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm font-medium">Click to upload thumbnail</p>
                <p className="text-xs">PNG, JPG, WebP up to 5MB</p>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleThumbnailChange} className="hidden" />
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-surface-200 p-6 space-y-4">
          <h3 className="font-display font-semibold text-surface-900">Basic Info</h3>

          <Input label="Course title" placeholder="e.g. Complete React Developer Course" error={errors.title?.message} {...register("title")} />

          <div>
            <label className="label">Description</label>
            <textarea rows={4} placeholder="What will students learn in this course?" className={`input resize-none ${errors.description ? "input-error" : ""}`} {...register("description")} />
            {errors.description && <p className="error-msg">{errors.description.message}</p>}
          </div>

          <div>
            <label className="label">Category</label>
            <select className="input" {...register("categoryId")}>
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
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
          {!isFree && <Input label="Price (USD)" type="number" placeholder="29.99" error={errors.price?.message} {...register("price", { valueAsNumber: true })} />}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isLoading}>
            Create Course
          </Button>
        </div>
      </form>
    </div>
  );
}
