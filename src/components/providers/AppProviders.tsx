"use client";

import { useRef, type ReactNode } from "react";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { makeStore, type AppStore } from "@/store/store";

export default function AppProviders({ children }: { children: ReactNode }) {
  // One store instance per browser tab/session (safe with Next.js App Router).
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      {children}
      <Toaster
        position="top-center"
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#880D1E",
            color: "#FFFFFF",
            fontSize: "0.875rem",
            borderRadius: "0.5rem",
            padding: "10px 14px",
          },
          success: {
            iconTheme: { primary: "#CBEEF3", secondary: "#880D1E" },
          },
          error: {
            iconTheme: { primary: "#F49CBB", secondary: "#880D1E" },
          },
        }}
      />
    </Provider>
  );
}
