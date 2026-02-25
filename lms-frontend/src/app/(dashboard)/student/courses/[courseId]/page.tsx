"use client";
              import { getYouTubeEmbedUrl } from "@/utils/formatters";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { courseApi } from "@/lib/api/course.api";
import { progressApi } from "@/lib/api/progress.api";
import { Lesson } from "@/types/course.types";
import { Skeleton } from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

interface LessonProgress {
  lessonId:    string;
  isCompleted: boolean;
}

export default function CoursePlayerPage() {
  const { courseId }  = useParams() as { courseId: string };
  const router        = useRouter();

  const [course, setCourse]               = useState<any>(null);
  const [lessons, setLessons]             = useState<Lesson[]>([]);
  const [activeLesson, setActiveLesson]   = useState<Lesson | null>(null);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [progress, setProgress]           = useState(0);
  const [isLoading, setIsLoading]         = useState(true);
  const [marking, setMarking]             = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [courseRes, progressRes] = await Promise.all([
          courseApi.getById(courseId),
          progressApi.getCourseProgress(courseId),
        ]);

        const c = courseRes.data;
        setCourse(c);
        setLessons((c as any).lessons ?? []);
        setActiveLesson((c as any).lessons?.[0] ?? null);
        setProgress(progressRes.data.progress);
        setLessonProgress(progressRes.data.lessonProgress ?? []);
      } catch (err: any) {
        toast.error("Failed to load course");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [courseId]);

  const isCompleted = (lessonId: string) =>
    lessonProgress.some((lp) => lp.lessonId === lessonId && lp.isCompleted);

  const handleToggleComplete = async (lesson: Lesson) => {
    setMarking(true);
    try {
      const completed = isCompleted(lesson.id);
      const result    = completed
        ? await progressApi.markIncomplete({ lessonId: lesson.id, courseId })
        : await progressApi.markComplete({ lessonId: lesson.id, courseId });

      // * update local progress state
      setProgress(result.data.progress);
      setLessonProgress((prev) => {
        const exists = prev.find((lp) => lp.lessonId === lesson.id);
        if (exists) {
          return prev.map((lp) =>
            lp.lessonId === lesson.id ? { ...lp, isCompleted: !completed } : lp
          );
        }
        return [...prev, { lessonId: lesson.id, isCompleted: !completed }];
      });

      if (!completed) toast.success("Lesson completed! 🎉");
      if (result.data.progress === 100) {
        toast.success("Course completed! Congratulations! 🏆");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update progress");
    } finally {
      setMarking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="col-span-2 h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-surface-900 text-xl">{course?.title}</h2>
          <p className="text-sm text-surface-500 mt-0.5">{lessons.length} lessons</p>
        </div>
        <Button variant="secondary" onClick={() => router.back()}>Back</Button>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-xl border border-surface-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-surface-700">Course Progress</span>
          <span className="text-sm font-bold text-primary-600">{progress}%</span>
        </div>
        <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress === 100 && (
          <p className="text-xs text-emerald-600 font-semibold mt-2">
            🏆 Course completed!
          </p>
        )}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* * Lesson content */}
        <div className="lg:col-span-2 space-y-4">
          {activeLesson ? (
            <div className="bg-white rounded-xl border border-surface-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-surface-900">
                  {activeLesson.order}. {activeLesson.title}
                </h3>
                {activeLesson.isPreview && (
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
                    Preview
                  </span>
                )}
              </div>

              {/* Video */}

// * replace the iframe section
{activeLesson.videoUrl && (
  <div className="aspect-video bg-surface-900 rounded-lg mb-4 overflow-hidden">
    <iframe
      src={getYouTubeEmbedUrl(activeLesson.videoUrl) ?? activeLesson.videoUrl}
      className="w-full h-full"
      allowFullScreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    />
  </div>
)}

              {/* Content */}
              <p className="text-sm text-surface-600 leading-relaxed whitespace-pre-wrap">
                {activeLesson.content}
              </p>

              {/* Mark complete button */}
              <div className="mt-6 flex items-center gap-3">
                <Button
                  variant={isCompleted(activeLesson.id) ? "secondary" : "primary"}
                  onClick={() => handleToggleComplete(activeLesson)}
                  isLoading={marking}
                >
                  {isCompleted(activeLesson.id) ? "✓ Completed" : "Mark as Complete"}
                </Button>

                {/* * next lesson */}
                {lessons.findIndex((l) => l.id === activeLesson.id) < lessons.length - 1 && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const idx  = lessons.findIndex((l) => l.id === activeLesson.id);
                      setActiveLesson(lessons[idx + 1]);
                    }}
                  >
                    Next Lesson →
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-surface-200 p-12 text-center">
              <p className="text-surface-500">Select a lesson to start learning</p>
            </div>
          )}
        </div>

        {/* * Lesson list */}
        <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-surface-200">
            <h3 className="font-semibold text-surface-900 text-sm">Lessons</h3>
          </div>
          <div className="divide-y divide-surface-100">
            {lessons
              .sort((a, b) => a.order - b.order)
              .map((lesson) => {
                const completed = isCompleted(lesson.id);
                const isActive  = activeLesson?.id === lesson.id;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLesson(lesson)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                      ${isActive ? "bg-primary-50" : "hover:bg-surface-50"}`}
                  >
                    {/* * completion indicator */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold
                      ${completed
                        ? "bg-emerald-100 text-emerald-600"
                        : isActive
                          ? "bg-primary-100 text-primary-600"
                          : "bg-surface-100 text-surface-400"
                      }`}
                    >
                      {completed ? "✓" : lesson.order}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate
                        ${isActive ? "text-primary-700" : "text-surface-700"}`}
                      >
                        {lesson.title}
                      </p>
                      {lesson.isPreview && (
                        <span className="text-xs text-blue-500">Preview</span>
                      )}
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}