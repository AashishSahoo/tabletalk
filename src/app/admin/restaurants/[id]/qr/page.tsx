"use client";

import { useTenant } from "@/hooks/useTenant";
import RestaurantTabs from "@/components/admin/RestaurantTabs";
import QRCodeCard from "@/components/admin/QRCodeCard";
import EmptyState from "@/components/ui/EmptyState";

function QRCardSkeleton() {
  return <div className="ticket-card mx-auto h-96 max-w-sm animate-pulse" />;
}

export default function RestaurantQrPage({ params }: { params: { id: string } }) {
  const { tenant, status } = useTenant(params.id);

  return (
    <div>
      <RestaurantTabs tenantUuid={params.id} />

      {status === "loading" && <QRCardSkeleton />}

      {status === "error" && (
        <EmptyState icon="mdi:alert-circle-outline" title="Couldn't load this restaurant" />
      )}

      {status === "ready" && tenant && <QRCodeCard tenant={tenant} />}
    </div>
  );
}
