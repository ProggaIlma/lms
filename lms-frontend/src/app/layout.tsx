import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/components/Providers";
import AuthInitializer from "@/components/auth/AuthInitializer";
export const metadata: Metadata = {
  title: "LMS Platform",
  description: "A production-ready Learning Management System",
};

import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <AuthInitializer />
          {children}
          <Toaster  
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "10px",
                background: "#1e293b",
                color: "#f8fafc",
                fontSize: "14px",
                fontWeight: "500",
              },
              success: {
                iconTheme: { primary: "#10b981", secondary: "#f8fafc" },
              },
              error: {
                iconTheme: { primary: "#ef4444", secondary: "#f8fafc" },
              },
            }}
          />
        </ReduxProvider>
      </body>
    </html>
  );
}