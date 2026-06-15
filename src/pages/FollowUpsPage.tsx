import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { FollowUpStatusBadge } from '@/components/shared/StatusBadge'
import { DashboardContentSkeleton } from '@/components/dashboard/DashboardSkeleton'
import { EmptyState } from '@/components/patient-profile/EmptyState'
import { Card, CardContent } from '@/components/ui/card'
import { useDashboard } from '@/hooks/useDashboard'
import { formatDate, formatTime } from '@/lib/utils'
import type { FollowUpStatus } from '@/data/types'

type FollowUpFilter = 'today' | 'upcoming' | 'missed' | 'completed'

interface FollowUpsPageProps {
  filter: FollowUpFilter
}

export function FollowUpsPage({ filter }: FollowUpsPageProps) {
  const navigate = useNavigate()
  const { data, isLoading } = useDashboard()

  if (isLoading) {
    return <DashboardContentSkeleton />
  }

  let count = 0
  let rows: any[] = []
  let title = ''
  let description = ''
  let showReschedules = false
  let showCompleteButton = false
  let showRescheduleButton = false

  switch (filter) {
    case 'today':
      count = data?.cards?.todayFollowups ?? 0
      rows = data?.todayFollowups ?? []
      title = "Today's Follow-Ups"
      description = "Today's follow-up queue"
      showReschedules = false
      showCompleteButton = true
      showRescheduleButton = true
      break
    case 'upcoming':
      count = data?.totalUpcomingFollowupSummary?.totalUpcomingFollowups ?? 0
      rows = data?.upcomingFollowups ?? []
      title = 'Upcoming Follow-Ups'
      description = 'Scheduled follow-ups'
      showReschedules = false
      showCompleteButton = true
      showRescheduleButton = true
      break
    case 'missed':
      count = data?.totalMissedFollowupSummary?.totalMissedFollowups ?? 0
      rows = data?.missedFollowups ?? []
      title = 'Missed Follow-Ups'
      description = 'Follow-ups that were missed'
      showReschedules = true
      showCompleteButton = false
      showRescheduleButton = true
      break
    case 'completed':
      count = data?.totalCompletedFollowupSummary?.totalCompletedFollowups ?? 0
      rows = data?.completedFollowups ?? []
      title = 'Completed Follow-Ups'
      description = 'Successfully completed follow-ups'
      showReschedules = true
      showCompleteButton = false
      showRescheduleButton = false
      break
  }

  const displayValue = (val: string | null | undefined) => {
    if (!val || val.trim() === '') return '-'
    return val
  }

  const formatRescheduleCount = (c: number | undefined) => {
    if (c === 1) return '1 Time'
    return `${c ?? 0} Times`
  }

  const completeBtnClass = "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 rounded-full border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition shadow-sm"
  
  const rescheduleBtnClass = "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 rounded-full border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition shadow-sm"

  return (
    <div>
      <PageHeader 
        title={title} 
        description={`${count} follow-ups · ${description}`} 
      />

      {rows.length === 0 ? (
        <div className="py-12">
          <EmptyState title="No follow-ups found" />
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-left text-muted-foreground">
                    <th className="px-6 py-4 font-medium">Patient</th>
                    <th className="px-6 py-4 font-medium">Doctor</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Time</th>
                    {showReschedules && <th className="px-6 py-4 font-medium">Reschedules</th>}
                    <th className="px-6 py-4 font-medium">Status</th>
                    {(showCompleteButton || showRescheduleButton) && (
                      <th className="px-6 py-4 font-medium">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => {
                    const rDate = row.date || row.followupDate
                    const rTime = row.time || row.followupTime
                    
                    return (
                      <tr 
                        key={row.followupId || idx} 
                        className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => {
                              if (!row.patientId) return
                              navigate(`/patients/${row.patientId}`)
                            }}
                            className="text-left font-medium hover:underline focus:outline-none"
                          >
                            {displayValue(row.patientName)}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {displayValue(row.doctor)}
                        </td>
                        <td className="px-6 py-4">
                          {displayValue(rDate ? formatDate(rDate) : '')}
                        </td>
                        <td className="px-6 py-4">
                          {displayValue(rTime)}
                        </td>
                        
                        {showReschedules && (
                          <td className="px-6 py-4 text-muted-foreground">
                            {formatRescheduleCount(row.rescheduleCount)}
                          </td>
                        )}
                        
                        <td className="px-6 py-4">
                          <FollowUpStatusBadge status={row.status as FollowUpStatus} />
                        </td>
                        
                        {(showCompleteButton || showRescheduleButton) && (
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              {showCompleteButton && (
                                <button type="button" className={completeBtnClass}>
                                  ✓ Complete
                                </button>
                              )}
                              {showRescheduleButton && (
                                <button type="button" className={rescheduleBtnClass}>
                                  ↻ Reschedule
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
