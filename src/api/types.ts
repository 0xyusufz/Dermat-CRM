export interface ApiResponse<T> {
  success: boolean
  data: T
}

export interface DashboardCards {
  totalPatients: number
  consultationPending: number
  activePatients: number
  todayFollowups: number
  missedFollowups: number
  activePrescriptions: number
}

export interface RecentRegistration {
  patientId: string
  name: string
  phone: string
  doctor: string
  date: string
  status: string
}

export interface ActivityFeedItem {
  type: string
  title: string
  description: string
  createdAt: string
  patientCode?: string
  priority?: string
}

export interface ConsultationPendingItem {
  patientId: string
  name: string
  phone?: string
  doctor: string
  registrationDate: string
  daysWaiting: number
}

export interface TodayFollowupItem {
  followupId?: string
  patientId?: string
  patientName: string
  doctor: string
  date: string
  time: string
  status: string
}

export interface PatientSearchIndexItem {
  patientId: string
  fullName: string
  displayName: string
  phone: string
  doctor: string
  status: string
  gender: string
  age: number
  registrationDate: string
  searchText: string
}

export interface ActivePrescriptionItem {
  prescriptionId?: string
  patientId?: string
  patientName: string
  doctor?: string
  medicine: string
  dosage: string
  frequency: string
  startDate?: string
  endDate?: string
  daysRemaining: number
  status: string
}

export interface DashboardData {
  cards: DashboardCards
  recentRegistrations: RecentRegistration[]
  activityFeed: ActivityFeedItem[]
  consultationPending: ConsultationPendingItem[]
  todayFollowups: TodayFollowupItem[]
  activePrescriptions: ActivePrescriptionItem[]
  patientSearchIndex?: PatientSearchIndexItem[]
  meta?: Record<string, unknown>
  generatedAt?: string
}
