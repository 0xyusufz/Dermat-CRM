import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/patient-profile/EmptyState';
import { FeedbackKPICards } from '@/components/feedback-dashboard/FeedbackKPICards';
import { FeedbackFilters } from '@/components/feedback-dashboard/FeedbackFilters';
import { FeedbackTable } from '@/components/feedback-dashboard/FeedbackTable';
import { FeedbackMobileList } from '@/components/feedback-dashboard/FeedbackMobileList';
import { ReviewDetailModal } from '@/components/feedback-dashboard/ReviewDetailModal';
import { ResendLinkModal } from '@/components/feedback-dashboard/ResendLinkModal';

import { mockReviews } from '@/mock/mockReviews';
import type { DashboardReview } from '@/components/feedback-dashboard/types';

export function AllReviewsPage() {
  // ─── State ───
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [ratingFilter, setRatingFilter] = useState('All Ratings');
  const [doctorFilter, setDoctorFilter] = useState('All Doctors');
  const [timeFilter, setTimeFilter] = useState('All Time');

  const [selectedReview, setSelectedReview] = useState<DashboardReview | null>(null);
  const [resendTarget, setResendTarget] = useState<DashboardReview | null>(null);

  // ─── Data Derivation ───
  // In Phase 1, using mock data directly
  const baseDataset = mockReviews;
  
  const availableDoctors = useMemo(() => {
    const docs = new Set(baseDataset.map(r => r.doctor));
    return Array.from(docs).filter(Boolean).sort();
  }, [baseDataset]);

  // ─── Filtering Logic ───
  const filteredRows = useMemo(() => {
    let result = baseDataset;

    // 1. Search (real-time, no debounce needed for small local data)
    if (search.trim() !== '') {
      const query = search.trim().toLowerCase();
      result = result.filter((r) => r.searchText.toLowerCase().includes(query));
    }

    // 2. Status
    if (statusFilter !== 'All Statuses') {
      result = result.filter((r) => r.status === statusFilter);
    }

    // 3. Rating
    if (ratingFilter !== 'All Ratings') {
      const targetRating = parseInt(ratingFilter.split(' ')[0], 10);
      result = result.filter((r) => r.rating === targetRating);
    }

    // 4. Doctor
    if (doctorFilter !== 'All Doctors') {
      result = result.filter((r) => r.doctor === doctorFilter);
    }

    // 5. Time
    if (timeFilter !== 'All Time') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      result = result.filter((r) => {
        // Use generatedAt or submittedAt as the reference date
        const refDateStr = r.submittedAt || r.generatedAt;
        if (!refDateStr) return false;
        
        const refDate = new Date(refDateStr);
        refDate.setHours(0, 0, 0, 0);

        const diffTime = today.getTime() - refDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (timeFilter === 'Today') return diffDays === 0;
        if (timeFilter === 'Last 7 Days') return diffDays >= 0 && diffDays <= 7;
        if (timeFilter === 'Last 30 Days') return diffDays >= 0 && diffDays <= 30;

        return true;
      });
    }

    return result;
  }, [baseDataset, search, statusFilter, ratingFilter, doctorFilter, timeFilter]);

  // ─── Handlers ───
  const handleResendClick = (e: React.MouseEvent, review: DashboardReview) => {
    e.stopPropagation(); // Prevent opening the detail modal
    setResendTarget(review);
  };

  const executeResend = () => {
    if (resendTarget) {
      console.log(`[MOCK] Resending feedback link to: ${resendTarget.patientName} (${resendTarget.phone})`);
    }
    setResendTarget(null);
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <PageHeader
        title="All Reviews"
        description="Track patient feedback requests, submissions, ratings, and review activity."
      />

      <FeedbackKPICards data={baseDataset} />

      <FeedbackFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        ratingFilter={ratingFilter}
        onRatingFilterChange={setRatingFilter}
        doctorFilter={doctorFilter}
        onDoctorFilterChange={setDoctorFilter}
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
        availableDoctors={availableDoctors}
      />

      {filteredRows.length === 0 ? (
        <div className="py-12">
          <EmptyState title="No matching reviews found." />
        </div>
      ) : (
        <>
          <FeedbackTable 
            data={filteredRows} 
            onRowClick={setSelectedReview} 
            onResendClick={handleResendClick} 
          />
          <FeedbackMobileList 
            data={filteredRows} 
            onRowClick={setSelectedReview} 
            onResendClick={handleResendClick} 
          />
        </>
      )}

      {/* Modals */}
      <ReviewDetailModal
        open={!!selectedReview}
        onOpenChange={(open) => !open && setSelectedReview(null)}
        review={selectedReview}
      />

      <ResendLinkModal
        open={!!resendTarget}
        onOpenChange={(open) => !open && setResendTarget(null)}
        review={resendTarget}
        onConfirm={executeResend}
      />
    </div>
  );
}
