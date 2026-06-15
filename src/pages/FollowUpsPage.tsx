import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { FollowUpStatusBadge } from '@/components/shared/StatusBadge'
import { DashboardContentSkeleton } from '@/components/dashboard/DashboardSkeleton'
import { EmptyState } from '@/components/patient-profile/EmptyState'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useDashboard } from '@/hooks/useDashboard'
import { formatDate } from '@/lib/utils'
import type { FollowUpStatus } from '@/data/types'

import { useCompleteFollowUp, COMPLETE_FOLLOW_UP_WORKFLOW_STEPS } from '@/hooks/useCompleteFollowUp'
import { useRescheduleFollowUp, RESCHEDULE_FOLLOW_UP_WORKFLOW_STEPS } from '@/hooks/useRescheduleFollowUp'
import { CompleteFollowUpModal } from '@/components/patient-profile/modals/CompleteFollowUpModal'
import { RescheduleFollowUpModal } from '@/components/patient-profile/modals/RescheduleFollowUpModal'
import { TransactionModals } from '@/components/workflow/TransactionModals'
import type { PatientFollowUpRecord } from '@/data/patientProfileTypes'

type FollowUpFilter = 'today' | 'upcoming' | 'missed' | 'completed'

interface FollowUpsPageProps {
  filter: FollowUpFilter
}

export function FollowUpsPage({ filter }: FollowUpsPageProps) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const { data, isLoading } = useDashboard()

  const [completeTarget, setCompleteTarget] = useState<any | null>(null)
  const [rescheduleTarget, setRescheduleTarget] = useState<any | null>(null)

  const completeHook = useCompleteFollowUp()
  const rescheduleHook = useRescheduleFollowUp()

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

  if (filter !== 'today' && searchQuery.trim() !== '') {
    const query = searchQuery.trim().toLowerCase()
    rows = rows.filter((row) => {
      const text = row.searchText?.toLowerCase() || ''
      return text.includes(query)
    })
  }

  const displayValue = (val: string | null | undefined) => {
    if (!val || val.trim() === '') return '-'
    return val
  }

  const formatRescheduleCount = (c: number | undefined) => {
    if (c === 1) return '1 Time'
    return `${c ?? 0} Times`
  }

  const mapToRecord = (row: any): PatientFollowUpRecord => {
    const resolvedDate = row.followupDate ?? row.date ?? ''
    const resolvedTime = (row.followupTime ?? row.time ?? '').toLowerCase()

    const timeSlot: 'Morning' | 'Afternoon' | 'Night' =
      resolvedTime.includes('afternoon') ? 'Afternoon'
      : resolvedTime.includes('night') ? 'Night'
      : 'Morning'

    return {
      id: row.followupId ?? '',
      patientId: row.patientId ?? '',
      date: resolvedDate,
      timeSlot,
      status: row.status as FollowUpStatus,
      source: 'Manual',
    }
  }

  const completeBtnClass = "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 rounded-full border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition shadow-sm"
  
  const rescheduleBtnClass = "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 rounded-full border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition shadow-sm"

  return (
    <div>
      <PageHeader 
        title={title} 
        description={`${count} follow-ups · ${description}`} 
      />

      {filter !== 'today' && (
        <Card className="mb-6">
          <CardContent className="p-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search follow-up ID, patient, doctor, or phone..."
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      )}

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
                            className="text-left font-medium hover:underline focus:outline-none block"
                          >
                            {displayValue(row.patientName)}
                          </button>
                          <div className="text-xs text-muted-foreground leading-tight">
                            {displayValue(row.patientId)}
                          </div>
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
                                <button 
                                  type="button" 
                                  className={completeBtnClass}
                                  onClick={() => setCompleteTarget(row)}
                                >
                                  ✓ Complete
                                </button>
                              )}
                              {showRescheduleButton && (
                                <button 
                                  type="button" 
                                  className={rescheduleBtnClass}
                                  onClick={() => setRescheduleTarget(row)}
                                >
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

      <TransactionModals
        transaction={completeHook}
        steps={[...COMPLETE_FOLLOW_UP_WORKFLOW_STEPS]}
        loadingTitle="Completing Follow-Up"
      />
      <TransactionModals
        transaction={rescheduleHook}
        steps={[...RESCHEDULE_FOLLOW_UP_WORKFLOW_STEPS]}
        loadingTitle="Rescheduling Follow-Up"
      />
      
      <CompleteFollowUpModal
        open={!!completeTarget}
        onOpenChange={(open) => !open && setCompleteTarget(null)}
        followUp={completeTarget ? mapToRecord(completeTarget) : null}
        onConfirm={(notes) => {
          if (completeTarget) {
            completeHook.submit(
              completeTarget.patientId ?? 'UNKNOWN',
              completeTarget.patientName,
              completeTarget.followupId ?? '',
              notes
            )
          }
        }}
      />
      
      <RescheduleFollowUpModal
        open={!!rescheduleTarget}
        onOpenChange={(open) => !open && setRescheduleTarget(null)}
        followUp={rescheduleTarget ? mapToRecord(rescheduleTarget) : null}
        onSubmit={(input) => {
          if (rescheduleTarget) {
            rescheduleHook.submit(
              rescheduleTarget.patientId ?? 'UNKNOWN',
              rescheduleTarget.patientName,
              input
            )
          }
        }}
      />
    </div>
  )
}
