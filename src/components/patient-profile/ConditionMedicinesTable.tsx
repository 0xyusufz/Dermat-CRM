import { Pencil, StopCircle } from 'lucide-react'
import { MedicineStatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import type { ConditionMedicine } from '@/data/patientProfileTypes'
import { formatTiming } from '@/data/patientProfileTypes'
import { formatDate } from '@/lib/utils'

export interface ConditionMedicineRow extends ConditionMedicine {
  conditionId: string
}

interface ConditionMedicinesTableProps {
  medicines: ConditionMedicine[]
  conditionId: string
  onEdit: (medicine: ConditionMedicineRow) => void
  onDiscontinue: (medicine: ConditionMedicineRow) => void
}

export function ConditionMedicinesTable({
  medicines,
  conditionId,
  onEdit,
  onDiscontinue,
}: ConditionMedicinesTableProps) {
  if (medicines.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
        No medicines for this condition. Add a medicine to start treatment.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <th className="px-3 py-2.5">Medicine Name</th>
            <th className="px-3 py-2.5">Dosage</th>
            <th className="px-3 py-2.5">Timing</th>
            <th className="px-3 py-2.5">Frequency</th>
            <th className="px-3 py-2.5">Start Date</th>
            <th className="px-3 py-2.5">Duration</th>
            <th className="px-3 py-2.5">Status</th>
            <th className="px-3 py-2.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((m) => {
            const row: ConditionMedicineRow = { ...m, conditionId }
            return (
              <tr key={m.id} className="border-b border-border/80 last:border-0 hover:bg-muted/25">
                <td className="px-3 py-2.5 font-medium">{m.medicineName}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{m.dosage || '—'}</td>
                <td className="px-3 py-2.5">{formatTiming(m.timing)}</td>
                <td className="px-3 py-2.5">{m.frequency}</td>
                <td className="px-3 py-2.5">{formatDate(m.startDate)}</td>
                <td className="px-3 py-2.5">{m.durationDays} days</td>
                <td className="px-3 py-2.5">
                  <MedicineStatusBadge status={m.status} />
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex justify-end gap-0.5">
                    {m.status === 'Active' && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2"
                          onClick={() => onEdit(row)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2 text-danger hover:text-danger"
                          onClick={() => onDiscontinue(row)}
                        >
                          <StopCircle className="h-3.5 w-3.5" />
                          Discontinue
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
