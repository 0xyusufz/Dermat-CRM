import { motion } from 'framer-motion'
import { Search, Stethoscope, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { ConsultationPending } from '@/components/dashboard/ConsultationPending'
import {
  DashboardContentSkeleton,
  StatsCardsSkeleton,
} from '@/components/dashboard/DashboardSkeleton'
import { DashboardError } from '@/components/dashboard/DashboardError'
import { RecentRegistrations } from '@/components/dashboard/RecentRegistrations'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { TodayFollowups } from '@/components/dashboard/TodayFollowups'
import { PageHeader } from '@/components/shared/PageHeader'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDashboard } from '@/hooks/useDashboard'
import { CompleteFollowUpModal } from '@/components/patient-profile/modals/CompleteFollowUpModal'
import { RescheduleFollowUpModal } from '@/components/patient-profile/modals/RescheduleFollowUpModal'
import { TransactionModals } from '@/components/workflow/TransactionModals'
import { useCompleteFollowUp, COMPLETE_FOLLOW_UP_WORKFLOW_STEPS } from '@/hooks/useCompleteFollowUp'
import { useRescheduleFollowUp, RESCHEDULE_FOLLOW_UP_WORKFLOW_STEPS } from '@/hooks/useRescheduleFollowUp'
import type { TodayFollowupItem } from '@/api/types'
import type { PatientFollowUpRecord } from '@/data/patientProfileTypes'
import type { FollowUpStatus } from '@/data/types'

const quickActions = [
  {
    title: 'New Registration',
    description: 'Register a new patient',
    icon: UserPlus,
    path: '/registration',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    title: 'New Consultation',
    description: 'Start patient consultation',
    icon: Stethoscope,
    path: '/consultation',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    title: 'Search Patient',
    description: 'Find patient records',
    icon: Search,
    path: '/patients',
    gradient: 'from-emerald-500 to-teal-600',
  },
]

export function DashboardPage() {
  const { data, isLoading, isError, refetch, isFetching } = useDashboard()

  const [completeTarget, setCompleteTarget] = useState<TodayFollowupItem | null>(null)
  const [rescheduleTarget, setRescheduleTarget] = useState<TodayFollowupItem | null>(null)

  const completeHook = useCompleteFollowUp()
  const rescheduleHook = useRescheduleFollowUp()

  useEffect(() => {
    if (completeHook.success || rescheduleHook.success) {
      refetch()
    }
  }, [completeHook.success, rescheduleHook.success, refetch])

  const mapToRecord = (item: TodayFollowupItem): PatientFollowUpRecord => ({
    id: item.followupId ?? '',
    patientId: item.patientId ?? '',
    date: item.date,
    timeSlot: item.time.toLowerCase().includes('afternoon') ? 'Afternoon' : item.time.toLowerCase().includes('night') ? 'Night' : 'Morning',
    status: item.status as FollowUpStatus,
    source: 'Manual',
  })

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Clinic overview — understand your clinic status at a glance."
      />

      {isError ? (
        <DashboardError onRetry={() => refetch()} isRetrying={isFetching} />
      ) : (
        <>
          {isLoading ? <StatsCardsSkeleton /> : data ? <StatsCards cards={data.cards} /> : null}

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {quickActions.map((action, i) => {
              const Icon = action.icon
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  whileHover={{ y: -2 }}
                >
                  <Link
                    to={action.path}
                    className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 card-shadow transition-all hover:shadow-lg"
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-sm`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold group-hover:text-primary transition-colors">
                        {action.title}
                      </p>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {isLoading ? (
            <DashboardContentSkeleton />
          ) : data ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  <RecentRegistrations registrations={data.recentRegistrations} />
                  <ConsultationPending patients={data.consultationPending} />
                  <TodayFollowups 
                    followups={data.todayFollowups} 
                    onComplete={setCompleteTarget}
                    onReschedule={setRescheduleTarget}
                  />
                </div>

                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle>Activity Feed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ActivityFeed activities={data.activityFeed} />
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ) : null}

          <TransactionModals transaction={completeHook} steps={[...COMPLETE_FOLLOW_UP_WORKFLOW_STEPS]} loadingTitle="Completing Follow-Up" />
          <TransactionModals transaction={rescheduleHook} steps={[...RESCHEDULE_FOLLOW_UP_WORKFLOW_STEPS]} loadingTitle="Rescheduling Follow-Up" />

          <CompleteFollowUpModal
            open={!!completeTarget}
            onOpenChange={(open) => !open && setCompleteTarget(null)}
            followUp={completeTarget ? mapToRecord(completeTarget) : null}
            onConfirm={(notes) => {
              if (completeTarget) {
                completeHook.submit(completeTarget.patientId ?? 'UNKNOWN', completeTarget.patientName, completeTarget.followupId ?? '', notes)
              }
            }}
          />

          <RescheduleFollowUpModal
            open={!!rescheduleTarget}
            onOpenChange={(open) => !open && setRescheduleTarget(null)}
            followUp={rescheduleTarget ? mapToRecord(rescheduleTarget) : null}
            onSubmit={(input) => {
              if (rescheduleTarget) {
                rescheduleHook.submit(rescheduleTarget.patientId ?? 'UNKNOWN', rescheduleTarget.patientName, input)
              }
            }}
          />
        </>
      )}
    </div>
  )
}
