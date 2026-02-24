"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, CategoryFormData } from "@/utils/validators";
import { Category } from "@/types/category.types";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => void;
  editingCategory?: Category | null;
  isLoading?: boolean;
}

export default function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  editingCategory,
  isLoading,
}: CategoryModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (editingCategory) {
      reset({ name: editingCategory.name });
    } else {
      reset({ name: "" });
    }
  }, [editingCategory, reset, isOpen]);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingCategory ? "Edit Category" : "Create Category"}
      size="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Category name"
          placeholder="e.g. Web Development"
          error={errors.name?.message}
          {...register("name")}
          autoFocus
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isLoading}>
            {editingCategory ? "Save changes" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}