import type { FollowUpStatus } from '@/data/types'
import type { TodayFollowupItem } from '@/api/types'
import { FollowUpStatusBadge } from '@/components/shared/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatTime } from '@/lib/utils'

const FOLLOW_UP_STATUSES: FollowUpStatus[] = [
  'Scheduled',
  'Completed',
  'Missed',
  'Rescheduled',
  'Cancelled',
  'Superseded',
]

function formatFollowupTime(time: string): string {
  if (time.includes(':')) return formatTime(time)
  return time
}

function FollowupStatusBadge({ status }: { status: string }) {
  if (FOLLOW_UP_STATUSES.includes(status as FollowUpStatus)) {
    return <FollowUpStatusBadge status={status as FollowUpStatus} />
  }
  return <Badge variant="secondary">{status}</Badge>
}

interface TodayFollowupsProps {
  followups: TodayFollowupItem[]
  onComplete?: (fu: TodayFollowupItem) => void
  onReschedule?: (fu: TodayFollowupItem) => void
}

export function TodayFollowups({ followups, onComplete, onReschedule }: TodayFollowupsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Follow-Ups</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-4 pb-4 font-medium">Patient</th>
                <th className="px-4 pb-4 font-medium">Doctor</th>
                <th className="px-4 pb-4 font-medium">Time</th>
                <th className="px-4 pb-4 font-medium">Status</th>
                <th className="px-4 pb-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {followups.map((fu) => (
                <tr
                  key={fu.followupId ?? `${fu.patientName}-${fu.time}`}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="px-4 py-4 align-middle">
                    <p className="font-medium leading-none">{fu.patientName}</p>
                    {fu.patientId && (
                      <p className="mt-1.5 text-xs text-muted-foreground">{fu.patientId}</p>
                    )}
                  </td>
                  <td className="px-4 py-4 align-middle text-muted-foreground">{fu.doctor}</td>
                  <td className="px-4 py-4 align-middle">{formatFollowupTime(fu.time)}</td>
                  <td className="px-4 py-4 align-middle">
                    <FollowupStatusBadge status={fu.status} />
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <div className="flex flex-row flex-nowrap items-center gap-2">
                      <button 
                        type="button"
                        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 rounded-full border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition shadow-sm"
                        onClick={() => onComplete?.(fu)}
                        disabled={fu.status === 'Completed'}
                      >
                        ✓ Complete
                      </button>
                      <button 
                        type="button"
                        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 rounded-full border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition shadow-sm"
                        onClick={() => onReschedule?.(fu)}
                        disabled={fu.status === 'Completed'}
                      >
                        ↻ Reschedule
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

