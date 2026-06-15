import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { WorkspacePatientStatusBadge } from '@/components/patients/PatientStatusBadge'
import { Button } from '@/components/ui/button'
import type { PatientRecord } from '@/api/types'
import { formatDate } from '@/lib/utils'

interface PatientRowProps {
  row: PatientRecord
}

export function PatientRow({ row }: PatientRowProps) {
  const navigate = useNavigate()

  const displayValue = (val: string | null | undefined) => {
    if (!val || val.trim() === '') return '-'
    return val
  }

  return (
    <tr
      className="group cursor-pointer border-b border-border/60 transition-colors hover:bg-muted/30"
      onClick={() => navigate(`/patients/${row.patientId}`)}
    >
      <td className="px-4 py-3.5 font-mono text-xs font-medium text-primary">{row.patientId}</td>
      <td className="px-4 py-3.5">
        <p className="font-medium">{row.patientName}</p>
      </td>
      <td className="hidden px-4 py-3.5 text-muted-foreground md:table-cell">
        {displayValue(row.phone)}
      </td>
      <td className="hidden px-4 py-3.5 text-muted-foreground lg:table-cell">
        {displayValue(row.assignedDoctor)}
      </td>
      <td className="px-4 py-3.5">
        {row.activeMedicineCount > 0 ? (
          <span className="text-sm font-medium">
            {row.activeMedicineCount} {row.activeMedicineCount === 1 ? 'Active Medicine' : 'Active Medicines'}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">No Active Medicines</span>
        )}
      </td>
      <td className="hidden px-4 py-3.5 sm:table-cell">
        {row.nextFollowupDate ? (
          <span className="text-sm font-medium">
            {formatDate(row.nextFollowupDate)} {row.nextFollowupTime ? `· ${row.nextFollowupTime}` : ''}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )}
      </td>
      <td className="px-4 py-3.5">
        <WorkspacePatientStatusBadge status={row.status} />
      </td>
      <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
        <Button
          size="sm"
          variant="ghost"
          className="gap-1 opacity-80 group-hover:opacity-100"
          onClick={() => navigate(`/patients/${row.patientId}`)}
        >
          Open Profile
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </td>
    </tr>
  )
}
