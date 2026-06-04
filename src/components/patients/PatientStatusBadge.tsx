import type { WorkspacePatientStatus } from '@/data/patientsWorkspace'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const config: Record<
  WorkspacePatientStatus,
  { variant: 'default' | 'secondary' | 'success' | 'warning' | 'purple' | 'outline'; label: string }
> = {
  Registered: { variant: 'secondary', label: 'Registered' },
  'Under Treatment': { variant: 'success', label: 'Under Treatment' },
  'Follow-Up Scheduled': { variant: 'purple', label: 'Follow-Up Scheduled' },
  Completed: { variant: 'outline', label: 'Completed' },
  Inactive: { variant: 'default', label: 'Inactive' },
}

export function WorkspacePatientStatusBadge({
  status,
  className,
}: {
  status: WorkspacePatientStatus
  className?: string
}) {
  const c = config[status]
  return (
    <Badge variant={c.variant} className={cn('font-medium', className)}>
      {c.label}
    </Badge>
  )
}
