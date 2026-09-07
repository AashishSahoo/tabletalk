import type { Metadata, Viewport } from "next";
import AppProviders from "@/components/providers/AppProviders";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "TableTalk — Restaurant Feedback",
  description: "Scan, rate, and share your experience in seconds.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#880D1E",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
