import { Calendar, CalendarPlus, Phone, Settings2, Stethoscope } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PatientStatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { PatientProfileOverview } from '@/data/patientProfileTypes'
import { formatDate } from '@/lib/utils'

interface PatientProfileHeaderProps {
  overview: PatientProfileOverview
  onFollowUpAction: () => void
}

export function PatientProfileHeader({
  overview,
  onFollowUpAction,
}: PatientProfileHeaderProps) {
  const { patient, doctorName, activeFollowUp } = overview
  const initials = patient.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)

  const hasActiveFollowUp = !!activeFollowUp

  return (
    <Card className="overflow-hidden">
      <div className="h-20 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/5" />
      <CardContent className="relative px-6 pb-6">
        <div className="-mt-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-end gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-background bg-gradient-to-br from-primary to-accent text-xl font-bold text-white shadow-lg">
              {initials}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{patient.name}</h1>
                <PatientStatusBadge status={patient.status} />
              </div>
              <p className="font-mono text-sm text-primary">{patient.id}</p>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {patient.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Stethoscope className="h-3.5 w-3.5" />
                  {doctorName}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Registered {formatDate(patient.registrationDate)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
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
              <Link to={`/consultation?patient=${patient.id}`}>New Consultation</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
