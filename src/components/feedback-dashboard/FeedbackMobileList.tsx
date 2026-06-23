import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { FeedbackStatusBadge } from './FeedbackStatusBadge';
import { Star } from 'lucide-react';
import type { DashboardReview } from './types';

interface FeedbackMobileListProps {
  data: DashboardReview[];
  onRowClick: (review: DashboardReview) => void;
  onResendClick: (e: React.MouseEvent, review: DashboardReview) => void;
}

export function FeedbackMobileList({ data, onRowClick, onResendClick }: FeedbackMobileListProps) {
  const displayValue = (val: string | null | undefined) => {
    if (!val || val.trim() === '') return '—';
    return val;
  };

  const renderStars = (rating: number | null) => {
    if (rating === null) {
      return (
        <div className="flex">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="h-3 w-3 text-muted-foreground/30" />
          ))}
        </div>
      );
    }
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3 md:hidden">
      {data.map((row) => (
        <Card key={row.feedbackId} className="cursor-pointer hover:bg-muted/20 transition-colors" onClick={() => onRowClick(row)}>
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{displayValue(row.patientName)}</p>
                <p className="text-xs text-muted-foreground">{displayValue(row.patientId)}</p>
              </div>
              <FeedbackStatusBadge status={row.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Doctor</p>
                <p>{displayValue(row.doctor)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Submitted</p>
                <p>{displayValue(row.submittedAt ? formatDate(row.submittedAt.split('T')[0]) : null)}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-border/50">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Rating:</span>
                {renderStars(row.rating)}
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center whitespace-nowrap text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-7 px-3 rounded-full border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition shadow-sm"
                onClick={(e) => onResendClick(e, row)}
              >
                Resend Link
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
