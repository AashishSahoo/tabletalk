"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSidebarOpen } from "@/store/slices/uiSlice";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "mdi:view-dashboard-outline" },
  { href: "/admin/restaurants", label: "Restaurants", icon: "mdi:store-outline" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isOpen = useAppSelector((s) => s.ui.isSidebarOpen);
  const dispatch = useAppDispatch();

  const close = () => dispatch(setSidebarOpen(false));

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-espresso/40 lg:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-espresso text-ivory transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-2 px-6 py-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-saffron-500 text-espresso">
            <Icon icon="mdi:qrcode-scan" width={20} height={20} />
          </span>
          <span className="font-display text-lg">TableTalk</span>
        </div>
        <nav className="mt-2 flex flex-1 flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={clsx(
                  "flex items-center gap-3 rounded-ticket px-3 py-2.5 text-sm transition-colors",
                  active ? "bg-ivory/10 text-ivory" : "text-ivory/70 hover:bg-ivory/5"
                )}
              >
                <Icon icon={item.icon} width={20} height={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-6 py-5 text-xs text-ivory/40">v1.0 · Admin Console</div>
      </aside>
    </>
  );
}
