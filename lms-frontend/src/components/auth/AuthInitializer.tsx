"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { fetchCurrentUser } from "@/store/slices/authSlice";
import Cookies from "js-cookie";

export default function AuthInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      dispatch(fetchCurrentUser())
      .unwrap()
      .then((data) => console.log("ME RESPONSE:", data))
      .catch((err) => console.log("ME ERROR:", err));
    }
  }, [dispatch]);

  return null;
}