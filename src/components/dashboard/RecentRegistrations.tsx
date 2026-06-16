import { useNavigate } from 'react-router-dom'
import type { PatientStatus } from '@/data/types'
import type { RecentRegistration } from '@/api/types'
import { PatientStatusBadge } from '@/components/shared/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

const PATIENT_STATUSES: PatientStatus[] = [
  'Registered',
  'Consultation Pending',
  'Active Treatment',
  'Follow-Up Due',
  'Completed',
]

function mapPatientStatus(status: string): PatientStatus | null {
  if (status === 'Active') return 'Active Treatment'
  if (PATIENT_STATUSES.includes(status as PatientStatus)) return status as PatientStatus
  return null
}

function RegistrationStatusBadge({ status }: { status: string }) {
  const mapped = mapPatientStatus(status)
  if (mapped) return <PatientStatusBadge status={mapped} />
  return <Badge variant="secondary">{status}</Badge>
}

interface RecentRegistrationsProps {
  registrations: RecentRegistration[]
}

export function RecentRegistrations({ registrations }: RecentRegistrationsProps) {
  const navigate = useNavigate()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Registrations</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => navigate('/patients')}>
          View all
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-sm">
            <colgroup>
              <col className="w-[15%]" />
              <col className="w-[20%]" />
              <col className="w-[22%] hidden lg:table-column" />
              <col className="w-[15%]" />
              <col className="w-[15%]" />
              <col className="w-[13%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-3 pb-3 font-medium">Patient ID</th>
                <th className="px-3 pb-3 font-medium">Name</th>
                <th className="px-3 pb-3 font-medium hidden lg:table-cell">Doctor</th>
                <th className="px-3 pb-3 font-medium">Date</th>
                <th className="px-3 pb-3 font-medium text-center">Status</th>
                <th className="px-3 pb-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((patient) => (
                <tr key={patient.patientId} className="border-b border-border/50 last:border-0">
                  <td className="px-3 py-3 font-mono text-xs text-primary whitespace-nowrap">{patient.patientId}</td>
                  <td className="px-3 py-3 font-medium truncate">{patient.name}</td>
                  <td className="px-3 py-3 hidden lg:table-cell text-muted-foreground whitespace-nowrap">{patient.doctor}</td>
                  <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">{formatDate(patient.date)}</td>
                  <td className="px-3 py-3 text-center">
                    <RegistrationStatusBadge status={patient.status} />
                  </td>
                  <td className="px-3 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="group transition-all hover:border-primary hover:bg-primary/5"
                      onClick={() => navigate(`/patients/${patient.patientId}`)}
                    >
                      Profile <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
