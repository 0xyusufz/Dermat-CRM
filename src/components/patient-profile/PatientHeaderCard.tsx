import { Calendar, CalendarPlus, ClipboardList, Phone, Settings2, Stethoscope } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProfileStatusBadge } from '@/components/patient-profile/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { PatientProfileOverview } from '@/data/patientProfileTypes'
import {
  formatDisplayName,
  formatLastVisitLabel,
} from '@/lib/patientDisplayFormat'
import { formatDate } from '@/lib/utils'

interface PatientHeaderCardProps {
  overview: PatientProfileOverview
  onFollowUpAction: () => void
}

export function PatientHeaderCard({ overview, onFollowUpAction }: PatientHeaderCardProps) {
  const { patient, doctorName, activeFollowUp, lastVisitDate } = overview
  const displayName = formatDisplayName(patient.name)
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)

  const hasActiveFollowUp = !!activeFollowUp
  const lastVisitMissing = !lastVisitDate

  const metadataItems = [
    {
      icon: Phone,
      label: patient.phone || patient.whatsapp,
    },
    {
      icon: Stethoscope,
      label: doctorName,
    },
    {
      icon: Calendar,
      label: `Registered ${formatDate(patient.registrationDate)}`,
    },
    {
      icon: ClipboardList,
      label: lastVisitMissing
        ? formatLastVisitLabel(lastVisitDate)
        : `Last Visit ${formatDate(lastVisitDate)}`,
      muted: lastVisitMissing,
    },
  ]

  return (
    <Card className="overflow-hidden">
      <div className="h-20 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/5" />
      <CardContent className="relative px-6 pb-6">
        <div className="-mt-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex min-w-0 flex-col items-start sm:flex-row sm:items-end gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-4 border-background bg-gradient-to-br from-primary to-accent text-xl font-bold text-white shadow-lg">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{displayName}</h1>
                <ProfileStatusBadge category="patient" status={patient.status} />
              </div>
              <p className="mt-1 font-mono text-sm text-primary">{patient.id}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                {metadataItems.map(({ icon: Icon, label, muted }) => (
                  <span
                    key={label}
                    className={`inline-flex items-center gap-1.5 ${
                      muted ? 'text-muted-foreground/80 italic' : 'text-muted-foreground'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="whitespace-nowrap">{label}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button variant="gradient" onClick={onFollowUpAction}>
              {hasActiveFollowUp ? (
                <>
                  <Settings2 className="h-4 w-4" />
                  Manage Active Follow-Up
                </>
              ) : (
                <>
                  <CalendarPlus className="h-4 w-4" />
                  Create Follow-Up
                </>
              )}
            </Button>
            <Button variant="outline" asChild>
              <Link to={`/consultation/${patient.id}`}>New Consultation</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
