"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { fetchCurrentAdmin } from "@/lib/api/auth";
import { setCredentials, setUnauthenticated } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ADMIN_TOKEN_KEY } from "@/lib/utils/constants";
import Spinner from "@/components/ui/Spinner";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const status = useAppSelector((s) => s.auth.status);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function rehydrate() {
      const token = window.localStorage.getItem(ADMIN_TOKEN_KEY);
      if (!token) {
        if (isMounted) {
          dispatch(setUnauthenticated());
          router.replace("/admin/login");
        }
        return;
      }
      try {
        const user = await fetchCurrentAdmin();
        if (isMounted) dispatch(setCredentials({ user, token }));
      } catch {
        if (isMounted) {
          window.localStorage.removeItem(ADMIN_TOKEN_KEY);
          dispatch(setUnauthenticated());
          router.replace("/admin/login");
        }
      } finally {
        if (isMounted) setChecked(true);
      }
    }

    if (status === "authenticated") {
      setChecked(true);
    } else {
      rehydrate();
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked || status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <Spinner size="lg" label="Loading your dashboard…" />
      </div>
    );
  }

  if (status !== "authenticated") return null;

  return <>{children}</>;
}
