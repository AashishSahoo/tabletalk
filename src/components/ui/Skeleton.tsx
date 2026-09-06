import clsx from "clsx";

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx("skeleton", className)} aria-hidden="true" />;
}

/** Skeleton for the customer review card while tenant config is loading. */
export function ReviewCardSkeleton() {
  return (
    <div className="ticket-card w-full max-w-sm mx-auto p-6 pt-8">
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
      <div className="mt-8 flex justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-9 rounded-full" />
        ))}
      </div>
      <div className="mt-8 space-y-2">
        <Skeleton className="h-10 w-full rounded-ticket" />
        <Skeleton className="h-10 w-full rounded-ticket" />
        <Skeleton className="h-10 w-3/4 rounded-ticket" />
      </div>
      <Skeleton className="mt-8 h-12 w-full rounded-ticket" />
    </div>
  );
}

/** Skeleton for a stat card on the admin dashboard. */
export function StatCardSkeleton() {
  return (
    <div className="ticket-card p-5">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-8 w-16" />
    </div>
  );
}

/** Skeleton for a row in the admin reviews table. */
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
