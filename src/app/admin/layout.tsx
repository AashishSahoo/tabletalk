"use client";

import { usePathname } from "next/navigation";
import AuthGuard from "@/components/admin/AuthGuard";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

const TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/restaurants": "Restaurants",
};

function resolveTitle(pathname: string): string {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.includes("/restaurants/")) return "Restaurant settings";
  return "Admin";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // The login page renders its own centered layout, no shell/guard needed.
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-ivory">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar title={resolveTitle(pathname ?? "")} />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
