"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { Tenant } from "@/types";
import { fetchTenantByUuid } from "@/lib/api/tenant";
import { handleError } from "@/lib/utils/errorHandler";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedTenant } from "@/store/slices/tenantSlice";

export function useTenant(tenantUuid: string) {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((s) => s.tenant.selected);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let isMounted = true;
    setStatus("loading");

    (async () => {
      try {
        const tenant = await fetchTenantByUuid(tenantUuid);
        if (!isMounted) return;
        dispatch(setSelectedTenant(tenant));
        setStatus("ready");
      } catch (error) {
        if (!isMounted) return;
        const appError = handleError("useTenant:load", error);
        toast.error(appError.message);
        setStatus("error");
      }
    })();

    return () => {
      isMounted = false;
      dispatch(setSelectedTenant(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantUuid]);

  const tenant: Tenant | null = selected?.uuid === tenantUuid ? selected : null;

  return { tenant, status };
}
