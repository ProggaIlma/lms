import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/components/Providers";

export const metadata: Metadata = {
  title: "LMS Platform",
  description: "A production-ready Learning Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
