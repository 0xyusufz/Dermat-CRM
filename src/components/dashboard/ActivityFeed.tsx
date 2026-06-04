import { motion } from 'framer-motion'
import {
  Bell,
  CalendarCheck,
  ClipboardList,
  Pill,
  UserPlus,
} from 'lucide-react'
import type { ActivityItem } from '@/data/types'
import { cn, formatDate } from '@/lib/utils'

const iconMap: Record<ActivityItem['type'], { icon: typeof UserPlus; color: string }> = {
  patient_registered: { icon: UserPlus, color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400' },
  consultation_created: { icon: ClipboardList, color: 'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400' },
  consultation_completed: { icon: ClipboardList, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' },
  prescription_activated: { icon: Pill, color: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400' },
  follow_up_scheduled: { icon: CalendarCheck, color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' },
  follow_up_completed: { icon: CalendarCheck, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' },
  reminder_sent: { icon: Bell, color: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400' },
}

function formatRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return formatDate(timestamp)
}

export function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="space-y-0">
      {activities.map((activity, index) => {
        const config = iconMap[activity.type]
        const Icon = config.icon
        const isLast = index === activities.length - 1

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative flex gap-4 pb-6"
          >
            {!isLast && (
              <div className="absolute left-[19px] top-10 h-[calc(100%-16px)] w-px bg-border" />
            )}
            <div className={cn('relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', config.color)}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium">{activity.title}</p>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatRelativeTime(activity.timestamp)}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">{activity.description}</p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
