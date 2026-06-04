import type { PatientStatus, PrescriptionStatus, FollowUpStatus } from '@/data/types'
import type { ConditionStatus, MedicineStatus } from '@/data/patientProfileTypes'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const patientStatusConfig: Record<
  PatientStatus,
  { variant: 'default' | 'warning' | 'success' | 'danger' | 'purple' | 'secondary'; label: string }
> = {
  Registered: { variant: 'secondary', label: 'Registered' },
  'Consultation Pending': { variant: 'warning', label: 'Consultation Pending' },
  'Active Treatment': { variant: 'success', label: 'Active Treatment' },
  'Follow-Up Due': { variant: 'purple', label: 'Follow-Up Due' },
  Completed: { variant: 'default', label: 'Completed' },
}

const prescriptionStatusConfig: Record<
  PrescriptionStatus,
  { variant: 'success' | 'default' | 'danger'; label: string }
> = {
  Active: { variant: 'success', label: 'Active' },
  Completed: { variant: 'default', label: 'Completed' },
  Discontinued: { variant: 'danger', label: 'Discontinued' },
}

const followUpStatusConfig: Record<
  FollowUpStatus,
  { variant: 'default' | 'success' | 'danger' | 'warning' | 'secondary'; label: string }
> = {
  Scheduled: { variant: 'default', label: 'Scheduled' },
  Completed: { variant: 'success', label: 'Completed' },
  Missed: { variant: 'danger', label: 'Missed' },
  Rescheduled: { variant: 'warning', label: 'Rescheduled' },
  Cancelled: { variant: 'secondary', label: 'Cancelled' },
  Superseded: { variant: 'secondary', label: 'Superseded' },
}

const conditionStatusConfig: Record<
  ConditionStatus,
  { variant: 'success' | 'default' | 'warning'; label: string }
> = {
  Active: { variant: 'success', label: 'Active' },
  Resolved: { variant: 'default', label: 'Resolved' },
  Monitoring: { variant: 'warning', label: 'Monitoring' },
}

const medicineStatusConfig: Record<
  MedicineStatus,
  { variant: 'success' | 'default' | 'danger'; label: string }
> = {
  Active: { variant: 'success', label: 'Active' },
  Completed: { variant: 'default', label: 'Completed' },
  Discontinued: { variant: 'danger', label: 'Discontinued' },
}

export function PatientStatusBadge({ status, className }: { status: PatientStatus; className?: string }) {
  const config = patientStatusConfig[status]
  return <Badge variant={config.variant} className={cn(className)}>{config.label}</Badge>
}

export function PrescriptionStatusBadge({
  status,
  className,
}: {
  status: PrescriptionStatus
  className?: string
}) {
  const config = prescriptionStatusConfig[status]
  return <Badge variant={config.variant} className={cn(className)}>{config.label}</Badge>
}

export function FollowUpStatusBadge({ status, className }: { status: FollowUpStatus; className?: string }) {
  const config = followUpStatusConfig[status]
  return <Badge variant={config.variant} className={cn(className)}>{config.label}</Badge>
}

export function ConditionStatusBadge({ status, className }: { status: ConditionStatus; className?: string }) {
  const config = conditionStatusConfig[status]
  return <Badge variant={config.variant} className={cn(className)}>{config.label}</Badge>
}

export function MedicineStatusBadge({ status, className }: { status: MedicineStatus; className?: string }) {
  const config = medicineStatusConfig[status]
  return <Badge variant={config.variant} className={cn(className)}>{config.label}</Badge>
}
