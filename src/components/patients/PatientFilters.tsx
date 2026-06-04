import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CONDITION_TYPE_OPTIONS,
  WORKSPACE_PATIENT_STATUSES,
  type PatientsWorkspaceFilters,
} from '@/data/patientsWorkspace'
import { doctors } from '@/data/mockData'

interface PatientFiltersProps {
  filters: PatientsWorkspaceFilters
  onChange: (filters: PatientsWorkspaceFilters) => void
  onClear: () => void
  hasActiveFilters: boolean
}

export function PatientFilters({
  filters,
  onChange,
  onClear,
  hasActiveFilters,
}: PatientFiltersProps) {
  const set = <K extends keyof PatientsWorkspaceFilters>(key: K, value: PatientsWorkspaceFilters[K]) =>
    onChange({ ...filters, [key]: value })

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Select value={filters.doctorId} onValueChange={(v) => set('doctorId', v)}>
          <SelectTrigger className="h-9 w-[160px] rounded-lg bg-background text-xs">
            <SelectValue placeholder="Doctor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Doctors</SelectItem>
            {doctors.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.workspaceStatus}
          onValueChange={(v) =>
            set('workspaceStatus', v as PatientsWorkspaceFilters['workspaceStatus'])
          }
        >
          <SelectTrigger className="h-9 w-[160px] rounded-lg bg-background text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {WORKSPACE_PATIENT_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.conditionType}
          onValueChange={(v) =>
            set('conditionType', v as PatientsWorkspaceFilters['conditionType'])
          }
        >
          <SelectTrigger className="h-9 w-[160px] rounded-lg bg-background text-xs">
            <SelectValue placeholder="Condition Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conditions</SelectItem>
            {CONDITION_TYPE_OPTIONS.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.hasActiveMedicines}
          onValueChange={(v) =>
            set('hasActiveMedicines', v as PatientsWorkspaceFilters['hasActiveMedicines'])
          }
        >
          <SelectTrigger className="h-9 w-[170px] rounded-lg bg-background text-xs">
            <SelectValue placeholder="Medicines" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Medicines</SelectItem>
            <SelectItem value="yes">Has Active Medicines</SelectItem>
            <SelectItem value="no">No Active Medicines</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.hasActiveFollowUp}
          onValueChange={(v) =>
            set('hasActiveFollowUp', v as PatientsWorkspaceFilters['hasActiveFollowUp'])
          }
        >
          <SelectTrigger className="h-9 w-[170px] rounded-lg bg-background text-xs">
            <SelectValue placeholder="Follow-Up" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Follow-Up</SelectItem>
            <SelectItem value="yes">Has Active Follow-Up</SelectItem>
            <SelectItem value="no">No Active Follow-Up</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.registrationRange}
          onValueChange={(v) =>
            set('registrationRange', v as PatientsWorkspaceFilters['registrationRange'])
          }
        >
          <SelectTrigger className="h-9 w-[160px] rounded-lg bg-background text-xs">
            <SelectValue placeholder="Registered" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" className="h-9 gap-1 text-xs" onClick={onClear}>
            <X className="h-3.5 w-3.5" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}
