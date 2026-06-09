import {
  Bell,
  CalendarCheck,
  ClipboardList,
  Pill,
  Stethoscope,
  UserPlus,
} from 'lucide-react'
import { memo, useMemo } from 'react'
import { EmptyState } from '@/components/patient-profile/EmptyState'
import { ProfileStatusBadge } from '@/components/patient-profile/StatusBadge'
import type { PatientTimelineEvent } from '@/data/patientProfileTypes'
import { formatDate, formatTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

type TimelineMeta = {
  icon: typeof UserPlus
  color: string
  label: string
}

const TIMELINE_META: Record<string, TimelineMeta> = {
  patient_registered: {
    icon: UserPlus,
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    label: 'Registration',
  },
  registration: {
    icon: UserPlus,
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    label: 'Registration',
  },
  consultation_completed: {
    icon: ClipboardList,
    color: 'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400',
    label: 'Consultation',
  },
  consultation: {
    icon: ClipboardList,
    color: 'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400',
    label: 'Consultation',
  },
  condition_created: {
    icon: Stethoscope,
    color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400',
    label: 'Condition',
  },
  medicine_added: {
    icon: Pill,
    color: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
    label: 'Medicine Added',
  },
  medicine_updated: {
    icon: Pill,
    color: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
    label: 'Prescription Update',
  },
  medicine_discontinued: {
    icon: Pill,
    color: 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400',
    label: 'Medicine Discontinued',
  },
  follow_up_scheduled: {
    icon: CalendarCheck,
    color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400',
    label: 'Follow-Up',
  },
  follow_up_rescheduled: {
    icon: CalendarCheck,
    color: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
    label: 'Follow-Up Rescheduled',
  },
  follow_up_completed: {
    icon: CalendarCheck,
    color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
    label: 'Follow-Up Completed',
  },
  visit_completed: {
    icon: Bell,
    color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
    label: 'Visit',
  },
}

function normalizeTimelineType(type: string): string {
  return type.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_')
}

function getTimelineMeta(type: string): TimelineMeta {
  const normalized = normalizeTimelineType(type)
  if (TIMELINE_META[normalized]) return TIMELINE_META[normalized]

  const lower = type.toLowerCase()
  if (lower.includes('registration')) return TIMELINE_META.registration
  if (lower.includes('consultation')) return TIMELINE_META.consultation
  if (lower.includes('prescription')) return TIMELINE_META.medicine_updated
  if (lower.includes('medicine') && lower.includes('discontinu')) {
    return TIMELINE_META.medicine_discontinued
  }
  if (lower.includes('medicine')) return TIMELINE_META.medicine_added
  if (lower.includes('follow') && lower.includes('reschedul')) {
    return TIMELINE_META.follow_up_rescheduled
  }
  if (lower.includes('follow') && lower.includes('complet')) {
    return TIMELINE_META.follow_up_completed
  }
  if (lower.includes('follow')) return TIMELINE_META.follow_up_scheduled

  return {
    icon: ClipboardList,
    color: 'bg-muted text-muted-foreground',
    label: type,
  }
}

function formatTimelineDateTime(timestamp: string): string {
  const date = timestamp.split('T')[0]
  const timePart = timestamp.split('T')[1]
  if (!timePart) return formatDate(date)
  const time = timePart.slice(0, 5)
  if (time.includes(':')) return `${formatDate(date)} · ${formatTime(time)}`
  return formatDate(date)
}

const TimelineItem = memo(function TimelineItem({
  event,
  isLast,
}: {
  event: PatientTimelineEvent
  isLast: boolean
}) {
  const meta = getTimelineMeta(event.type)
  const Icon = meta.icon

  return (
    <div className="relative flex gap-4 pb-8 last:pb-0">
      {!isLast && (
        <div className="absolute left-5 top-10 h-[calc(100%-8px)] w-px bg-border" />
      )}
      <div
        className={cn(
          'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
          meta.color
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold">{event.title}</p>
          <ProfileStatusBadge category="timeline" status={meta.label} />
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">{event.description}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatTimelineDateTime(event.timestamp)}
        </p>
      </div>
    </div>
  )
})

interface PatientTimelineProps {
  events: PatientTimelineEvent[]
}

export function PatientTimeline({ events }: PatientTimelineProps) {
  const sorted = useMemo(
    () =>
      [...events].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    [events]
  )

  if (sorted.length === 0) {
    return <EmptyState title="No patient activity available yet." />
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="relative">
        {sorted.map((event, index) => (
          <TimelineItem
            key={event.id}
            event={event}
            isLast={index === sorted.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
