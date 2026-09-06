"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import type { Tenant } from "@/types";
import { deleteTenant, fetchTenants } from "@/lib/api/tenant";
import { handleError } from "@/lib/utils/errorHandler";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTenants, upsertTenant, removeTenant } from "@/store/slices/tenantSlice";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import TenantForm from "@/components/admin/TenantForm";

function RestaurantCardSkeleton() {
  return <div className="ticket-card h-44 animate-pulse p-5" />;
}

export default function RestaurantsPage() {
  const dispatch = useAppDispatch();
  const tenants = useAppSelector((s) => s.tenant.list);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Tenant | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = useCallback(
    async (query: string) => {
      setStatus("loading");
      try {
        const result = await fetchTenants({ page: 1, limit: 24, search: query || undefined });
        dispatch(setTenants({ items: result.items, total: result.total }));
        setStatus("ready");
      } catch (error) {
        const appError = handleError("RestaurantsPage:load", error);
        toast.error(appError.message);
        setStatus("error");
      }
    },
    [dispatch]
  );

  useEffect(() => {
    load(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => load(search), 350);
    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function confirmDelete() {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteTenant(pendingDelete.uuid);
      dispatch(removeTenant(pendingDelete.uuid));
      toast.success(`${pendingDelete.name} was removed`);
      setPendingDelete(null);
    } catch (error) {
      const appError = handleError("RestaurantsPage:delete", error);
      toast.error(appError.message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <Input
            placeholder="Search restaurants…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Icon icon="mdi:plus" width={18} height={18} />
          Add restaurant
        </Button>
      </div>

      {status === "loading" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <RestaurantCardSkeleton key={i} />
          ))}
        </div>
      )}

      {status === "ready" && tenants.length === 0 && (
        <EmptyState
          icon="mdi:store-plus-outline"
          title="No restaurants yet"
          description="Add your first restaurant to generate its feedback QR code."
          action={<Button onClick={() => setCreateOpen(true)}>Add restaurant</Button>}
        />
      )}

      {status === "ready" && tenants.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tenants.map((tenant) => (
            <div key={tenant.uuid} className="ticket-card flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-base text-ink">{tenant.name}</p>
                  <p className="text-xs text-ink-muted">{tenant.contact.email}</p>
                </div>
                <Badge tone={tenant.isActive ? "success" : "neutral"}>
                  {tenant.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="mt-1 flex flex-wrap gap-2">
                <Link href={`/admin/restaurants/${tenant.uuid}`}>
                  <Button size="sm" variant="outline">
                    <Icon icon="mdi:tune-variant" width={16} height={16} />
                    Settings
                  </Button>
                </Link>
                <Link href={`/admin/restaurants/${tenant.uuid}/reviews`}>
                  <Button size="sm" variant="outline">
                    <Icon icon="mdi:comment-text-multiple-outline" width={16} height={16} />
                    Reviews
                  </Button>
                </Link>
                <Link href={`/admin/restaurants/${tenant.uuid}/qr`}>
                  <Button size="sm" variant="outline">
                    <Icon icon="mdi:qrcode" width={16} height={16} />
                    QR
                  </Button>
                </Link>
                <Button size="sm" variant="ghost" onClick={() => setPendingDelete(tenant)}>
                  <Icon icon="mdi:trash-can-outline" width={16} height={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        title="Add a restaurant"
        maxWidthClass="max-w-2xl"
      >
        <TenantForm
          onCancel={() => setCreateOpen(false)}
          onSaved={(tenant) => {
            dispatch(upsertTenant(tenant));
            setCreateOpen(false);
          }}
        />
      </Modal>

      <Modal
        isOpen={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Remove restaurant"
      >
        <p className="text-sm text-ink-soft">
          This will permanently remove{" "}
          <span className="font-medium text-ink">{pendingDelete?.name}</span> and its QR code.
          Existing reviews are kept for your records.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setPendingDelete(null)}>
            Cancel
          </Button>
          <Button variant="danger" isLoading={isDeleting} onClick={confirmDelete}>
            Remove
          </Button>
        </div>
      </Modal>
    </div>
  );
}
