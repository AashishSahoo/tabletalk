"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";
import type { RatingValue, Review, TenantStats } from "@/types";
import { useTenant } from "@/hooks/useTenant";
import { fetchTenantReviews } from "@/lib/api/review";
import { fetchTenantStats } from "@/lib/api/tenant";
import { handleError } from "@/lib/utils/errorHandler";
import RestaurantTabs from "@/components/admin/RestaurantTabs";
import ReviewsTable from "@/components/admin/ReviewsTable";
import { ReviewsTrendChart, RatingDistributionChart } from "@/components/admin/StatsCharts";
import { StatCardSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import clsx from "clsx";

const RATING_FILTERS: (RatingValue | "all")[] = ["all", 5, 4, 3, 2, 1];

export default function RestaurantReviewsPage({ params }: { params: { id: string } }) {
  const { tenant, status: tenantStatus } = useTenant(params.id);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ratingFilter, setRatingFilter] = useState<RatingValue | "all">("all");
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  const [stats, setStats] = useState<TenantStats | null>(null);
  const [statsStatus, setStatsStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (tenantStatus !== "ready") return;
    let isMounted = true;
    setIsLoadingReviews(true);

    (async () => {
      try {
        const result = await fetchTenantReviews({
          tenantUuid: params.id,
          page,
          limit: 10,
          rating: ratingFilter === "all" ? undefined : ratingFilter,
        });
        if (!isMounted) return;
        setReviews(result.items);
        setTotalPages(result.totalPages || 1);
      } catch (error) {
        if (!isMounted) return;
        const appError = handleError("RestaurantReviewsPage:load", error);
        toast.error(appError.message);
      } finally {
        if (isMounted) setIsLoadingReviews(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [params.id, page, ratingFilter, tenantStatus]);

  useEffect(() => {
    if (tenantStatus !== "ready") return;
    let isMounted = true;
    setStatsStatus("loading");

    (async () => {
      try {
        const data = await fetchTenantStats(params.id);
        if (!isMounted) return;
        setStats(data);
        setStatsStatus("ready");
      } catch (error) {
        if (!isMounted) return;
        handleError("RestaurantReviewsPage:stats", error);
        setStatsStatus("error");
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [params.id, tenantStatus]);

  if (tenantStatus === "error") {
    return (
      <div>
        <RestaurantTabs tenantUuid={params.id} />
        <EmptyState icon="mdi:alert-circle-outline" title="Couldn't load this restaurant" />
      </div>
    );
  }

  return (
    <div>
      <RestaurantTabs tenantUuid={params.id} />
      {tenant && (
        <p className="mb-4 text-sm text-ink-muted">
          Reviews collected for <span className="font-medium text-ink">{tenant.name}</span>
        </p>
      )}

      {statsStatus === "loading" && (
        <div className="mb-4 grid gap-4 lg:grid-cols-2">
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      )}
      {statsStatus === "ready" && stats && (
        <div className="mb-6 grid gap-4 lg:grid-cols-2">
          <ReviewsTrendChart data={stats.reviewsLast7Days} />
          <RatingDistributionChart breakdown={stats.ratingBreakdown} />
        </div>
      )}

      <div className="mb-3 flex flex-wrap gap-2">
        {RATING_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => {
              setRatingFilter(f);
              setPage(1);
            }}
            className={clsx(
              "flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              ratingFilter === f
                ? "border-saffron-500 bg-saffron-50 text-ink"
                : "border-ink/15 text-ink-muted hover:border-ink/30"
            )}
          >
            {f === "all" ? (
              "All"
            ) : (
              <>
                <Icon icon="mdi:star" width={12} height={12} className="text-saffron-500" />
                {f}
              </>
            )}
          </button>
        ))}
      </div>

      <ReviewsTable
        reviews={reviews}
        isLoading={isLoadingReviews}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
