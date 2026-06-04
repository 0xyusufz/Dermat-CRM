import { User } from 'lucide-react'
import { PatientStatusBadge } from '@/components/shared/StatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Patient } from '@/data/types'
import { getDoctorById } from '@/data/mockData'
import { formatDate } from '@/lib/utils'

interface PatientSummaryCardProps {
  patient: Patient
}

export function PatientSummaryCard({ patient }: PatientSummaryCardProps) {
  const doctor = getDoctorById(patient.doctorId)

  return (
    <Card className="overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-primary to-accent" />
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Patient Summary</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">{patient.name}</h3>
              <p className="font-mono text-sm text-primary">{patient.id}</p>
            </div>
          </div>
          <PatientStatusBadge status={patient.status} />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: 'Age', value: `${patient.age} years` },
            { label: 'Gender', value: patient.gender },
            { label: 'Phone', value: patient.phone },
            { label: 'Doctor', value: doctor?.name ?? '—' },
            { label: 'Registered', value: formatDate(patient.registrationDate) },
            { label: 'WhatsApp', value: patient.whatsapp },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border/60 bg-muted/30 px-3 py-2.5">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {item.label}
              </p>
              <p className="mt-0.5 truncate text-sm font-medium">{item.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
