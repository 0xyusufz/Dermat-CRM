import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { FollowUpStatusBadge } from '@/components/shared/StatusBadge'
import { WorkspacePatientStatusBadge } from '@/components/patients/PatientStatusBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { PatientListRow } from '@/data/patientsWorkspace'
import { formatDate } from '@/lib/utils'

function ConditionBadges({ names }: { names: string[] }) {
  if (names.length === 0) {
    return <span className="text-xs text-muted-foreground">—</span>
  }

  const visible = names.slice(0, 2)
  const extra = names.length - visible.length

  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((name) => (
        <Badge key={name} variant="secondary" className="max-w-[120px] truncate text-[11px] font-normal">
          {name}
        </Badge>
      ))}
      {extra > 0 && (
        <Badge variant="outline" className="text-[11px] font-normal">
          +{extra} more
        </Badge>
      )}
    </div>
  )
}

interface PatientRowProps {
  row: PatientListRow
}

export function PatientRow({ row }: PatientRowProps) {
  const navigate = useNavigate()

  return (
    <tr
      className="group cursor-pointer border-b border-border/60 transition-colors hover:bg-muted/30"
      onClick={() => navigate(`/patients/${row.id}`)}
    >
      <td className="px-4 py-3.5 font-mono text-xs font-medium text-primary">{row.id}</td>
      <td className="px-4 py-3.5">
        <p className="font-medium">{row.name}</p>
        {row.requiresAttention && (
          <p className="mt-0.5 text-[11px] text-amber-700 dark:text-amber-400">
            {row.attentionReason}
          </p>
        )}
      </td>
      <td className="hidden px-4 py-3.5 text-muted-foreground md:table-cell">{row.phone}</td>
      <td className="hidden px-4 py-3.5 text-muted-foreground lg:table-cell">{row.doctorName}</td>
      <td className="hidden px-4 py-3.5 xl:table-cell">
        <ConditionBadges names={row.conditionNames} />
      </td>
      <td className="px-4 py-3.5">
        {row.activeMedicinesCount > 0 ? (
          <span className="text-sm font-medium">
            {row.activeMedicinesCount} Active{' '}
            {row.activeMedicinesCount === 1 ? 'Medicine' : 'Medicines'}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">None</span>
        )}
      </td>
      <td className="hidden px-4 py-3.5 sm:table-cell">
        {row.activeFollowUpDate ? (
          <div className="space-y-1">
            <p className="text-sm font-medium">{formatDate(row.activeFollowUpDate)}</p>
            <p className="text-xs text-muted-foreground">{row.activeFollowUpTime}</p>
            {row.activeFollowUpStatus && (
              <FollowUpStatusBadge status={row.activeFollowUpStatus} />
            )}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-4 py-3.5">
        <WorkspacePatientStatusBadge status={row.workspaceStatus} />
      </td>
      <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
        <Button
          size="sm"
          variant="ghost"
          className="gap-1 opacity-80 group-hover:opacity-100"
          onClick={() => navigate(`/patients/${row.id}`)}
        >
          Open Profile
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </td>
    </tr>
  )
}
