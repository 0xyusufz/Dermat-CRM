import { Card, CardContent } from '@/components/ui/card';
import { Star, MessageSquare, Clock, Send } from 'lucide-react';
import type { DashboardReview } from './types';

interface FeedbackKPICardsProps {
  data: DashboardReview[];
}

export function FeedbackKPICards({ data }: FeedbackKPICardsProps) {
  const totalRequests = data.length;
  const completedReviews = data.filter((r) => r.status === 'Completed').length;
  const pendingReviews = data.filter((r) => r.status === 'Pending').length;

  const validRatings = data.filter((r) => r.status === 'Completed' && r.rating !== null).map((r) => r.rating as number);
  const avgRating = validRatings.length > 0
    ? (validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length).toFixed(1)
    : '—';

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Total Review Requests</p>
            <Send className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold">{totalRequests}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Reviews Submitted</p>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold">{completedReviews}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Pending Reviews</p>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold">{pendingReviews}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
            <Star className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold">{avgRating !== '—' ? `${avgRating} ★` : '—'}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
