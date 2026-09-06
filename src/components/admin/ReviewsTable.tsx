"use client";

import { Icon } from "@iconify/react";
import type { Review } from "@/types";
import { RatingBadge, Badge } from "@/components/ui/Badge";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";

interface ReviewsTableProps {
  reviews: Review[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ReviewsTable({
  reviews,
  isLoading,
  page,
  totalPages,
  onPageChange,
}: ReviewsTableProps) {
  return (
    <div className="ticket-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Comment</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} columns={4} />)}

            {!isLoading &&
              reviews.map((review) => (
                <tr key={review.uuid} className="align-top">
                  <td className="px-4 py-3">
                    <RatingBadge rating={review.rating} />
                  </td>
                  <td className="max-w-md px-4 py-3 text-ink-soft">{review.comment}</td>
                  <td className="px-4 py-3">
                    <Badge tone={review.wasSuggested ? "neutral" : "success"}>
                      {review.wasSuggested ? "Suggested" : "Custom"}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink-muted">
                    {new Date(review.createdAt).toLocaleDateString(undefined, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!isLoading && reviews.length === 0 && (
        <div className="p-2">
          <EmptyState
            icon="mdi:comment-text-outline"
            title="No reviews yet"
            description="Once customers scan the QR and submit feedback, it will show up here."
          />
        </div>
      )}

      {!isLoading && reviews.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-ink/10 px-4 py-3">
          <span className="text-xs text-ink-muted">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              <Icon icon="mdi:chevron-left" width={18} height={18} />
              Prev
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              Next
              <Icon icon="mdi:chevron-right" width={18} height={18} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
