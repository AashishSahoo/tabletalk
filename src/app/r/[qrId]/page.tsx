import ReviewForm from "@/components/customer/ReviewForm";

export default function CustomerFeedbackPage({ params }: { params: { qrId: string } }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ivory px-4 py-10">
      <ReviewForm qrId={params.qrId} />
      <p className="mt-6 text-xs text-ink-muted">Powered by TableTalk</p>
    </main>
  );
}
