import {
  Bell,
  CalendarCheck,
  ClipboardList,
  Pill,
  Stethoscope,
  UserPlus,
} from 'lucide-react'
import type { PatientTimelineEvent, TimelineEventType } from '@/data/patientProfileTypes'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

const meta: Record<
  TimelineEventType,
  { icon: typeof UserPlus; color: string; category: string }
> = {
  patient_registered: { icon: UserPlus, color: 'bg-blue-500', category: 'Registration' },
  consultation_completed: { icon: ClipboardList, color: 'bg-violet-500', category: 'Consultations' },
  condition_created: { icon: Stethoscope, color: 'bg-indigo-500', category: 'Condition Created' },
  medicine_added: { icon: Pill, color: 'bg-purple-500', category: 'Medicine Changes' },
  medicine_updated: { icon: Pill, color: 'bg-purple-400', category: 'Medicine Changes' },
  medicine_discontinued: { icon: Pill, color: 'bg-red-500', category: 'Medicine Changes' },
  follow_up_scheduled: { icon: CalendarCheck, color: 'bg-indigo-500', category: 'Follow-Ups' },
  follow_up_rescheduled: { icon: CalendarCheck, color: 'bg-amber-500', category: 'Follow-Ups' },
  follow_up_completed: { icon: CalendarCheck, color: 'bg-emerald-500', category: 'Follow-Ups' },
  visit_completed: { icon: Bell, color: 'bg-emerald-600', category: 'Completed Visits' },
}

export function ProfileTimelineTab({ events }: { events: PatientTimelineEvent[] }) {
  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  if (sorted.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
        No timeline events yet.
      </p>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="relative">
        {sorted.map((event, i) => {
          const m = meta[event.type] ?? meta.patient_registered
          const Icon = m.icon
          return (
            <div key={event.id} className="relative flex gap-4 pb-8 last:pb-0">
              {i < sorted.length - 1 && (
                <div className="absolute left-5 top-10 h-[calc(100%-8px)] w-px bg-border" />
              )}
              <div
                className={cn(
                  'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm',
                  m.color
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{event.title}</p>
                  <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {m.category}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{event.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(event.timestamp.split('T')[0])}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
