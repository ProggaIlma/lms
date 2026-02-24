"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { register as registerUser } from "@/store/slices/authSlice";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema, RegisterFormData } from "@/utils/validators";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, isLoading, error, clearError } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "STUDENT" },
  });

  const selectedRole = watch("role");

  useEffect(() => {
    if (isAuthenticated && user) {
      clearError();
      switch (user.role) {
        case "INSTRUCTOR": router.replace("/instructor"); break;
        case "STUDENT":    router.replace("/student");    break;
        default:           router.replace("/admin");
      }
    }
  }, [isAuthenticated, user, router]);

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...payload } = data;
    dispatch(registerUser(payload));
  };

  return (
    <div className="bg-white rounded-2xl shadow-modal p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="font-display font-bold text-surface-900 text-lg">LMS Platform</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-surface-900">Create an account</h1>
        <p className="text-surface-500 text-sm mt-1">Join thousands of learners and instructors</p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full name"
          type="text"
          placeholder="John Doe"
          error={errors.name?.message}
          leftIcon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
          {...register("name")}
        />

        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          leftIcon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          }
          {...register("email")}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          leftIcon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
          {...register("password")}
        />

        <Input
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          leftIcon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
          {...register("confirmPassword")}
        />

        {/* Role selector */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            I want to join as
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(["STUDENT", "INSTRUCTOR"] as const).map((role) => (
              <label
                key={role}
                className={`relative flex items-center gap-3 p-3.5 rounded-lg border-2 cursor-pointer transition-all duration-150 ${
                  selectedRole === role
                    ? "border-primary-500 bg-primary-50"
                    : "border-surface-200 hover:border-surface-300"
                }`}
              >
                <input
                  type="radio"
                  value={role}
                  className="sr-only"
                  {...register("role")}
                />
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  selectedRole === role ? "bg-primary-100" : "bg-surface-100"
                }`}>
                  {role === "STUDENT" ? (
                    <svg className={`w-4 h-4 ${selectedRole === role ? "text-primary-600" : "text-surface-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  ) : (
                    <svg className={`w-4 h-4 ${selectedRole === role ? "text-primary-600" : "text-surface-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${selectedRole === role ? "text-primary-700" : "text-surface-700"}`}>
                    {role === "STUDENT" ? "Student" : "Instructor"}
                  </p>
                  <p className="text-xs text-surface-400">
                    {role === "STUDENT" ? "Learn courses" : "Teach courses"}
                  </p>
                </div>
              </label>
            ))}
          </div>
          {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-surface-500 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-primary-600 font-semibold hover:text-primary-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}