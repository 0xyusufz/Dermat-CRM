import { FollowUpStatusBadge } from '@/components/shared/StatusBadge'
import type { PatientFollowUpRecord } from '@/data/patientProfileTypes'
import { formatDate } from '@/lib/utils'

export function FollowUpHistoryTable({ history }: { history: PatientFollowUpRecord[] }) {
  if (history.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
        No follow-up history yet. Completed and closed follow-ups will appear here.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Completed Date</th>
          </tr>
        </thead>
        <tbody>
          {history.map((fu) => (
            <tr key={fu.id} className="border-b border-border/80 last:border-0 hover:bg-muted/20">
              <td className="px-4 py-3 font-medium">{formatDate(fu.date)}</td>
              <td className="px-4 py-3">{fu.timeSlot}</td>
              <td className="px-4 py-3">
                <FollowUpStatusBadge status={fu.status} />
              </td>
              <td className="px-4 py-3 text-muted-foreground">{fu.source}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {fu.completedDate ? formatDate(fu.completedDate) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
