"use client";

import { useTenant } from "@/hooks/useTenant";
import { useAppDispatch } from "@/store/hooks";
import { upsertTenant } from "@/store/slices/tenantSlice";
import RestaurantTabs from "@/components/admin/RestaurantTabs";
import TenantForm from "@/components/admin/TenantForm";
import EmptyState from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

export default function RestaurantSettingsPage({ params }: { params: { id: string } }) {
  const { tenant, status } = useTenant(params.id);
  const dispatch = useAppDispatch();

  return (
    <div>
      <RestaurantTabs tenantUuid={params.id} />

      {status === "loading" && (
        <div className="ticket-card space-y-4 p-6">
          <Skeleton className="h-5 w-40" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {status === "error" && (
        <EmptyState
          icon="mdi:alert-circle-outline"
          title="Couldn't load this restaurant"
          description="It may have been removed, or something went wrong."
        />
      )}

      {status === "ready" && tenant && (
        <div className="ticket-card p-6">
          <TenantForm
            tenant={tenant}
            onSaved={(saved) => {
              dispatch(upsertTenant(saved));
            }}
          />
        </div>
      )}
    </div>
  );
}
