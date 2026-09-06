"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { logout } from "@/store/slices/authSlice";
import { logoutAdmin } from "@/lib/api/auth";
import { ADMIN_TOKEN_KEY } from "@/lib/utils/constants";
import { handleError } from "@/lib/utils/errorHandler";

export default function Topbar({ title }: { title: string }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);

  async function handleLogout() {
    try {
      await logoutAdmin();
    } catch (error) {
      handleError("Topbar:logout", error);
    } finally {
      window.localStorage.removeItem(ADMIN_TOKEN_KEY);
      dispatch(logout());
      toast.success("Logged out");
      router.replace("/admin/login");
    }
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-ink/10 bg-ivory/90 px-4 py-3.5 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => dispatch(toggleSidebar())}
          className="rounded-ticket p-2 text-ink hover:bg-ink/5 lg:hidden"
          aria-label="Toggle navigation"
        >
          <Icon icon="mdi:menu" width={22} height={22} />
        </button>
        <h1 className="font-display text-lg text-ink sm:text-xl">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-ink-muted sm:inline">{user?.name}</span>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-ticket px-3 py-1.5 text-sm text-ink-soft hover:bg-ink/5"
        >
          <Icon icon="mdi:logout" width={18} height={18} />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  );
}
