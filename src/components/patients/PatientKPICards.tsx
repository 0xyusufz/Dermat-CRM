import { AlertTriangle, CalendarCheck, TrendingDown, TrendingUp, Users } from 'lucide-react'
import type { PatientsWorkspaceKpis } from '@/data/patientsWorkspace'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface PatientKPICardsProps {
  kpis: PatientsWorkspaceKpis
}

function TrendPill({ value }: { value: number }) {
  const up = value >= 0
  const Icon = up ? TrendingUp : TrendingDown
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium',
        up ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-muted text-muted-foreground'
      )}
    >
      <Icon className="h-3 w-3" />
      {up ? '+' : ''}
      {value}%
    </span>
  )
}

export function PatientKPICards({ kpis }: PatientKPICardsProps) {
  const cards = [
    {
      label: 'Total Patients',
      value: kpis.total,
      trend: kpis.trends.total,
      icon: Users,
      iconClass: 'text-slate-600 dark:text-slate-300',
      bg: 'bg-slate-100 dark:bg-slate-800',
    },
    {
      label: 'Active Patients',
      value: kpis.activePatients,
      trend: kpis.trends.activePatients,
      icon: Users,
      iconClass: 'text-emerald-700 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
      label: 'Patients With Active Follow-Up',
      value: kpis.withActiveFollowUp,
      trend: kpis.trends.withActiveFollowUp,
      icon: CalendarCheck,
      iconClass: 'text-indigo-700 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950',
    },
    {
      label: 'Patients Requiring Attention',
      value: kpis.requiringAttention,
      trend: kpis.trends.requiringAttention,
      icon: AlertTriangle,
      iconClass: 'text-amber-700 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.label} className="border-border/80 shadow-sm">
            <CardContent className="flex items-start justify-between gap-3 p-5">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {card.label}
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight tabular-nums">
                  {card.value}
                </p>
                <div className="mt-2">
                  <TrendPill value={card.trend} />
                </div>
              </div>
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                  card.bg
                )}
              >
                <Icon className={cn('h-5 w-5', card.iconClass)} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
