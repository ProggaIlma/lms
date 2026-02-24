import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { logout, clearError } from "@/store/slices/authSlice";
import { Role } from "@/types/auth.types";

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const hasRole = (...roles: Role[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const isAdmin = hasRole("ADMIN", "SUPER_ADMIN");
  const isSuperAdmin = hasRole("SUPER_ADMIN");
  const isInstructor = hasRole("INSTRUCTOR");
  const isStudent = hasRole("STUDENT");

  const handleLogout = () => dispatch(logout());
  const handleClearError = () => dispatch(clearError());

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    hasRole,
    isAdmin,
    isSuperAdmin,
    isInstructor,
    isStudent,
    logout: handleLogout,
    clearError: handleClearError,
  };
}
