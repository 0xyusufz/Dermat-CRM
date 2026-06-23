import { PageHeader } from '@/components/shared/PageHeader';

export function SubmittedReviewsPage() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <PageHeader
        title="Submitted Reviews"
        description="Coming Soon: Detailed analytics and deep dive into submitted patient reviews."
      />
      <div className="flex items-center justify-center h-64 border rounded-xl border-dashed border-border">
        <p className="text-muted-foreground">This page is under construction.</p>
      </div>
    </div>
  );
}
