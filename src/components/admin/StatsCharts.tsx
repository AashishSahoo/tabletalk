"use client";

import "./chartSetup";
import { Bar, Doughnut } from "react-chartjs-2";
import type { TenantStats } from "@/types";

const INK = "#241C12";
const GRID = "rgba(36, 28, 18, 0.06)";

export function ReviewsTrendChart({ data }: { data: TenantStats["reviewsLast7Days"] }) {
  return (
    <div className="ticket-card p-5">
      <p className="mb-4 text-sm font-medium text-ink-soft">Reviews — last 7 days</p>
      <div className="h-56">
        <Bar
          data={{
            labels: data.map((d) =>
              new Date(d.date).toLocaleDateString(undefined, { weekday: "short" })
            ),
            datasets: [
              {
                label: "Reviews",
                data: data.map((d) => d.count),
                backgroundColor: "#E8A33D",
                borderRadius: 6,
                maxBarThickness: 28,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, ticks: { color: INK } },
              y: { beginAtZero: true, grid: { color: GRID }, ticks: { color: INK, precision: 0 } },
            },
          }}
        />
      </div>
    </div>
  );
}

export function RatingDistributionChart({
  breakdown,
}: {
  breakdown: TenantStats["ratingBreakdown"];
}) {
  const order: (1 | 2 | 3 | 4 | 5)[] = [5, 4, 3, 2, 1];
  return (
    <div className="ticket-card p-5">
      <p className="mb-4 text-sm font-medium text-ink-soft">Rating breakdown</p>
      <div className="h-56">
        <Doughnut
          data={{
            labels: order.map((r) => `${r} star`),
            datasets: [
              {
                data: order.map((r) => breakdown[r] ?? 0),
                backgroundColor: ["#3E5C41", "#8FAE8F", "#E8A33D", "#C87F1F", "#B5533C"],
                borderWidth: 0,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "bottom", labels: { color: INK, boxWidth: 12, padding: 12 } },
            },
            cutout: "62%",
          }}
        />
      </div>
    </div>
  );
}
