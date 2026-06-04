import { Activity, CalendarCheck, Pill } from 'lucide-react'
import { FollowUpStatusBadge, PatientStatusBadge } from '@/components/shared/StatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PatientProfileOverview } from '@/data/patientProfileTypes'
import { formatDate } from '@/lib/utils'

export function ProfileOverviewTab({ overview }: { overview: PatientProfileOverview }) {
  const {
    patient,
    doctorName,
    activeConditionsCount,
    activeMedicinesCount,
    activeFollowUp,
    activeFollowUpStatusLabel,
    nextFollowUpDateLabel,
  } = overview

  const summaryCards = [
    {
      label: 'Active Conditions',
      value: String(activeConditionsCount),
      icon: Activity,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      label: 'Active Medicines',
      value: String(activeMedicinesCount),
      icon: Pill,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      label: 'Active Follow-Up Status',
      value: activeFollowUpStatusLabel,
      icon: CalendarCheck,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 dark:bg-indigo-950',
      badge: activeFollowUp ? (
        <FollowUpStatusBadge status={activeFollowUp.status} className="mt-1" />
      ) : null,
    },
    {
      label: 'Next Follow-Up Date',
      value:
        nextFollowUpDateLabel !== '—'
          ? formatDate(nextFollowUpDateLabel)
          : 'Not scheduled',
      sub: activeFollowUp?.timeSlot,
      icon: CalendarCheck,
      color: 'text-violet-600',
      bg: 'bg-violet-50 dark:bg-violet-950',
    },
  ]

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Patient</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">{patient.name}</h2>
              <p className="font-mono text-sm text-primary">{patient.id}</p>
            </div>
            <PatientStatusBadge status={patient.status} />
          </div>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                WhatsApp Number
              </dt>
              <dd className="mt-1 font-medium">{patient.whatsapp}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Assigned Doctor
              </dt>
              <dd className="mt-1 font-medium">{doctorName}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Current Status
              </dt>
              <dd className="mt-1">
                <PatientStatusBadge status={patient.status} />
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.label}>
              <CardContent className="flex gap-4 p-5">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.bg}`}
                >
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {card.label}
                  </p>
                  <p className="mt-1 text-sm font-bold leading-snug">{card.value}</p>
                  {'badge' in card && card.badge}
                  {'sub' in card && card.sub && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{card.sub}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
