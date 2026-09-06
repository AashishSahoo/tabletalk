"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import clsx from "clsx";

const TABS = [
  { key: "settings", label: "Settings", icon: "mdi:tune-variant" },
  { key: "reviews", label: "Reviews", icon: "mdi:comment-text-multiple-outline" },
  { key: "qr", label: "QR code", icon: "mdi:qrcode" },
];

export default function RestaurantTabs({ tenantUuid }: { tenantUuid: string }) {
  const pathname = usePathname() ?? "";

  function hrefFor(key: string) {
    return key === "settings"
      ? `/admin/restaurants/${tenantUuid}`
      : `/admin/restaurants/${tenantUuid}/${key}`;
  }

  function isActive(key: string) {
    const target = hrefFor(key);
    return key === "settings" ? pathname === target : pathname.startsWith(target);
  }

  return (
    <div className="mb-6 flex gap-1 overflow-x-auto border-b border-ink/10">
      {TABS.map((tab) => {
        const active = isActive(tab.key);
        return (
          <Link
            key={tab.key}
            href={hrefFor(tab.key)}
            className={clsx(
              "flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3.5 py-2.5 text-sm font-medium transition-colors",
              active
                ? "border-saffron-500 text-ink"
                : "border-transparent text-ink-muted hover:text-ink"
            )}
          >
            <Icon icon={tab.icon} width={16} height={16} />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
