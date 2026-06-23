export type FeedbackStatus = 'Pending' | 'Completed';

export interface DashboardReview {
  feedbackId: string;
  patientId: string;
  patientName: string;
  phone: string;
  doctor: string;
  visitDate: string;
  submittedAt: string | null;
  status: FeedbackStatus;
  rating: number | null;
  reasons: string[];
  comment: string | null;
  googleRedirected: boolean;
  whatsappSent: boolean;
  reviewLinkOpened: boolean;
  snapshotVersion: number;
  generatedAt: string;
  searchText: string;
}
