"use client";

import { useEffect, useState, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate } from "@/utils/formatters";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { TableSkeleton } from "@/components/ui/Skeleton";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast/headless";

type Role = "SUPER_ADMIN" | "ADMIN" | "INSTRUCTOR" | "STUDENT";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
}

const roleBadge: Record<Role, "info" | "warning" | "success" | "neutral"> = {
  SUPER_ADMIN: "warning",
  ADMIN:       "info",
  INSTRUCTOR:  "success",
  STUDENT:     "neutral",
};

export default function UsersPage() {
  const [users, setUsers]           = useState<User[]>([]);
  const [total, setTotal]           = useState(0);
  const [isLoading, setIsLoading]   = useState(false);
  const [search, setSearch]         = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "">("");
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // holds userId

  const debouncedSearch = useDebounce(search, 400);
  const limit = 10;

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
   
    toast.dismiss(); 
    try {
      const params: Record<string, any> = { page, limit };
      if (debouncedSearch) params.search = debouncedSearch;
      if (roleFilter)      params.role   = roleFilter;

      const { data } = await axiosInstance.get("/users", { params });
      setUsers(data.data ?? data.users ?? []);
      setTotal(data.pagination?.total ?? data.total ?? 0);
      setTotalPages(data.pagination?.totalPages ?? Math.ceil((data.total ?? 0) / limit));
    } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to fetch users");

    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, roleFilter, page]);

  useEffect(() => { loadUsers(); }, [loadUsers]);
  useEffect(() => { setPage(1); }, [debouncedSearch, roleFilter]);

  const toggleActive = async (user: User) => {
    setActionLoading(user.id);
    try {
      await axiosInstance.patch(`/users/${user.id}`, { isActive: !user.isActive });
      setUsers((prev) =>
        prev.map((u) => u.id === user.id ? { ...u, isActive: !u.isActive } : u)
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update user");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-surface-900 text-xl">Users</h2>
          <p className="text-sm text-surface-500 mt-0.5">{total} total users</p>
        </div>
      </div>

     

      {/* Filters */}
      <div className="bg-white rounded-xl border border-surface-200 p-4 flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="input pl-10"
          />
        </div>

        {/* Role filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as Role | "")}
          className="input w-auto min-w-[150px]"
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="INSTRUCTOR">Instructor</option>
          <option value="STUDENT">Student</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
        {isLoading ? (
          <div className="p-6"><TableSkeleton rows={6} cols={5} /></div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-surface-100 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="font-semibold text-surface-700">No users found</p>
            <p className="text-sm text-surface-400 mt-1">
              {search || roleFilter ? "Try adjusting your filters" : "No users registered yet"}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-50">
                {["User", "Role", "Status", "Joined", "Action"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider px-6 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-surface-50 transition-colors">
                  {/* User */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-primary-700">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-surface-900">{user.name}</p>
                        <p className="text-xs text-surface-400">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <Badge variant={roleBadge[user.role]}>
                      {user.role.replace("_", " ")}
                    </Badge>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <Badge variant={user.isActive ? "success" : "danger"}>
                      {user.isActive ? "Active" : "Suspended"}
                    </Badge>
                  </td>

                  {/* Joined */}
                  <td className="px-6 py-4 text-sm text-surface-500">
                    {formatDate(user.createdAt)}
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4">
                    <Button
                      variant={user.isActive ? "danger" : "secondary"}
                      size="sm"
                      isLoading={actionLoading === user.id}
                      onClick={() => toggleActive(user)}
                    >
                      {user.isActive ? "Suspend" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-surface-200">
            <p className="text-sm text-surface-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}