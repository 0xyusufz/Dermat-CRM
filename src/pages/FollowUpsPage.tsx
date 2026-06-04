import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { FollowUpStatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { FollowUp } from '@/data/types'
import {
  getCompletedFollowUps,
  getDoctorById,
  getMissedFollowUpsList,
  getPatientById,
  getTodaysFollowUps,
  getUpcomingFollowUps,
} from '@/data/mockData'
import { formatDate, formatTime } from '@/lib/utils'

type FollowUpFilter = 'today' | 'upcoming' | 'missed' | 'completed'

interface FollowUpsPageProps {
  filter: FollowUpFilter
}

function getFollowUps(filter: FollowUpFilter): FollowUp[] {
  switch (filter) {
    case 'today': return getTodaysFollowUps()
    case 'upcoming': return getUpcomingFollowUps()
    case 'missed': return getMissedFollowUpsList()
    case 'completed': return getCompletedFollowUps()
  }
}

const titles: Record<FollowUpFilter, { title: string; description: string }> = {
  today: { title: "Today's Follow-Ups", description: "Today's follow-up queue" },
  upcoming: { title: 'Upcoming Follow-Ups', description: 'Scheduled follow-ups' },
  missed: { title: 'Missed Follow-Ups', description: 'Follow-ups that were missed' },
  completed: { title: 'Completed Follow-Ups', description: 'Successfully completed follow-ups' },
}

export function FollowUpsPage({ filter }: FollowUpsPageProps) {
  const navigate = useNavigate()
  const followUps = getFollowUps(filter)
  const { title, description } = titles[filter]

  return (
    <div>
      <PageHeader title={title} description={`${followUps.length} follow-ups · ${description}`} />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left text-muted-foreground">
                  <th className="px-6 py-4 font-medium">Patient</th>
                  <th className="px-6 py-4 font-medium">Doctor</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Time</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {followUps.length > 0 ? followUps.map((fu) => {
                  const patient = getPatientById(fu.patientId)
                  return (
                    <tr key={fu.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium">{patient?.name}</p>
                        <p className="text-xs text-muted-foreground">{patient?.id}</p>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {getDoctorById(fu.doctorId)?.name}
                      </td>
                      <td className="px-6 py-4">{formatDate(fu.date)}</td>
                      <td className="px-6 py-4">{formatTime(fu.time)}</td>
                      <td className="px-6 py-4"><FollowUpStatusBadge status={fu.status} /></td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {fu.status === 'Scheduled' && (
                            <>
                              <Button variant="ghost" size="sm">Complete</Button>
                              <Button variant="outline" size="sm">Reschedule</Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => patient && navigate(`/patients/${patient.id}`)}
                          >
                            View Patient
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No follow-ups found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
