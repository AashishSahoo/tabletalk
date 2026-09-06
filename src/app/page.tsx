import Link from "next/link";
import { Icon } from "@iconify/react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-saffron-500 text-espresso">
        <Icon icon="mdi:qrcode-scan" width={28} height={28} />
      </span>
      <h1 className="mt-5 font-display text-3xl text-ink">TableTalk</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-muted">
        Turn a single QR scan into a five-star Google review — this page is only reachable
        by staff. Customers land on their restaurant&apos;s own <code>/r/&lt;qrId&gt;</code>{" "}
        link.
      </p>
      <Link
        href="/admin/login"
        className="mt-8 inline-flex items-center gap-2 rounded-ticket bg-espresso px-5 py-3 text-sm font-medium text-ivory transition-colors hover:bg-espresso-light"
      >
        Go to admin console
        <Icon icon="mdi:arrow-right" width={18} height={18} />
      </Link>
    </main>
  );
}
