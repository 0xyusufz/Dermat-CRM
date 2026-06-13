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
                <th className="pb-3 font-medium">Patient</th>
                <th className="pb-3 font-medium">Doctor</th>
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {followups.map((fu) => (
                <tr
                  key={fu.followupId ?? `${fu.patientName}-${fu.time}`}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-3 font-medium">{fu.patientName}</td>
                  <td className="py-3 text-muted-foreground">{fu.doctor}</td>
                  <td className="py-3">{formatFollowupTime(fu.time)}</td>
                  <td className="py-3">
                    <FollowupStatusBadge status={fu.status} />
                  </td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => onComplete?.(fu)}>
                        Complete
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onReschedule?.(fu)}>
                        Reschedule
                      </Button>
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

