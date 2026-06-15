import { useNavigate } from 'react-router-dom'
import type { ConsultationPendingItem } from '@/api/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

interface ConsultationPendingProps {
  patients: ConsultationPendingItem[]
}

export function ConsultationPending({ patients }: ConsultationPendingProps) {
  const navigate = useNavigate()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consultation Pending</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 font-medium">Patient</th>
                <th className="pb-3 font-medium">Doctor</th>
                <th className="pb-3 font-medium">Registration Date</th>
                <th className="pb-3 font-medium">Waiting Days</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.patientId} className="border-b border-border/50 last:border-0">
                  <td className="py-3">
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">{patient.patientId}</p>
                  </td>
                  <td className="py-3 text-muted-foreground">{patient.doctor}</td>
                  <td className="py-3 text-muted-foreground">
                    {formatDate(patient.registrationDate)}
                  </td>
                  <td className="py-3">
                    <span className="rounded-lg bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                      {patient.daysWaiting} days
                    </span>
                  </td>
                  <td className="py-3">
                    <Button 
                      variant="gradient" 
                      size="sm" 
                      className="shadow-sm"
                      onClick={() => navigate(`/consultation/${patient.patientId}`)}
                    >
                      Start Consultation
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
