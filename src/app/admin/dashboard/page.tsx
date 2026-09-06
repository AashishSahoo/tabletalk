"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { TenantStats } from "@/types";
import { fetchOverviewStats } from "@/lib/api/tenant";
import { handleError } from "@/lib/utils/errorHandler";
import StatCard from "@/components/admin/StatCard";
import { StatCardSkeleton } from "@/components/ui/Skeleton";
import { ReviewsTrendChart, RatingDistributionChart } from "@/components/admin/StatsCharts";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";

type Overview = TenantStats & { totalTenants: number; activeTenants: number };

export default function DashboardPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  async function load() {
    setStatus("loading");
    try {
      const data = await fetchOverviewStats();
      setOverview(data);
      setStatus("ready");
    } catch (error) {
      const appError = handleError("DashboardPage:load", error);
      toast.error(appError.message);
      setStatus("error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (status === "error") {
    return (
      <EmptyState
        icon="mdi:chart-box-outline"
        title="Couldn't load dashboard stats"
        description="Something went wrong while fetching your overview."
        action={
          <Button size="sm" onClick={load}>
            Try again
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {status === "loading" || !overview ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="Total restaurants"
              value={overview.totalTenants}
              icon="mdi:store-outline"
              tone="ink"
            />
            <StatCard
              label="Active restaurants"
              value={overview.activeTenants}
              icon="mdi:check-decagram-outline"
              tone="pine"
            />
            <StatCard
              label="Total reviews"
              value={overview.totalReviews}
              icon="mdi:comment-text-multiple-outline"
              tone="saffron"
            />
            <StatCard
              label="Average rating"
              value={overview.averageRating.toFixed(1)}
              icon="mdi:star-outline"
              tone="clay"
            />
          </>
        )}
      </div>

      {status === "ready" && overview && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ReviewsTrendChart data={overview.reviewsLast7Days} />
          <RatingDistributionChart breakdown={overview.ratingBreakdown} />
        </div>
      )}
    </div>
  );
}
