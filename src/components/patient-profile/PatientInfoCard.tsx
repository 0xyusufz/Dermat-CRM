import { ProfileStatusBadge } from '@/components/patient-profile/StatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PatientProfileOverview } from '@/data/patientProfileTypes'
import { formatDate } from '@/lib/utils'

interface PatientInfoCardProps {
  overview: PatientProfileOverview
}

export function PatientInfoCard({ overview }: PatientInfoCardProps) {
  const { patient, doctorName } = overview

  return (
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
          <ProfileStatusBadge category="patient" status={patient.status} />
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
              <ProfileStatusBadge category="patient" status={patient.status} />
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Age
            </dt>
            <dd className="mt-1 font-medium">{patient.age}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Gender
            </dt>
            <dd className="mt-1 font-medium">{patient.gender}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Registration Date
            </dt>
            <dd className="mt-1 font-medium">{formatDate(patient.registrationDate)}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
