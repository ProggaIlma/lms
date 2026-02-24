import axiosInstance from "../axios";
import { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth.types";

export const authApi = {
  // auth.api.ts
register: async (payload: RegisterPayload) => {
  console.log("CALLING API WITH:", payload);
  const response = await axiosInstance.post("/auth/register", payload);
  console.log("RAW AXIOS RESPONSE:", response);
  console.log("RESPONSE DATA:", response.data);
  return response.data;
},

login: async (payload: LoginPayload) => {
  const response = await axiosInstance.post("/auth/login", payload);
  return response.data; // ✅ must return this
},

 getMe: async () => {
  const { data } = await axiosInstance.get("/auth/me");
  console.log("RAW ME DATA:", data); // ← add this
  return data;
},

  logout: async (): Promise<void> => {
    await axiosInstance.post("/auth/logout");
  },
};
