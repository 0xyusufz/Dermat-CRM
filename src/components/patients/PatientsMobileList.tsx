import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { FollowUpStatusBadge } from '@/components/shared/StatusBadge'
import { WorkspacePatientStatusBadge } from '@/components/patients/PatientStatusBadge'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { PatientListRow } from '@/data/patientsWorkspace'
import { formatDate } from '@/lib/utils'

export function PatientsMobileList({ rows }: { rows: PatientListRow[] }) {
  const navigate = useNavigate()

  return (
    <div className="space-y-3 md:hidden">
      {rows.map((row) => (
        <Card
          key={row.id}
          className="cursor-pointer border-border/80 shadow-sm transition-shadow active:scale-[0.99]"
          onClick={() => navigate(`/patients/${row.id}`)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{row.name}</p>
                <p className="font-mono text-xs text-primary">{row.id}</p>
              </div>
              <WorkspacePatientStatusBadge status={row.workspaceStatus} />
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {row.conditionNames.slice(0, 2).map((c) => (
                <Badge key={c} variant="secondary" className="text-[10px] font-normal">
                  {c}
                </Badge>
              ))}
              {row.conditionNames.length > 2 && (
                <Badge variant="outline" className="text-[10px]">
                  +{row.conditionNames.length - 2}
                </Badge>
              )}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <span>{row.activeMedicinesCount} active medicines</span>
              <span>{row.doctorName}</span>
              <span className="col-span-2">
                Follow-up:{' '}
                {row.activeFollowUpDate ? (
                  <>
                    {formatDate(row.activeFollowUpDate)} · {row.activeFollowUpTime}{' '}
                    {row.activeFollowUpStatus && (
                      <FollowUpStatusBadge status={row.activeFollowUpStatus} className="ml-1" />
                    )}
                  </>
                ) : (
                  'None'
                )}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-end text-xs font-medium text-primary">
              Open Profile
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
