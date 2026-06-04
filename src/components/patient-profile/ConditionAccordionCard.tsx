import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Plus } from 'lucide-react'
import { ConditionMedicinesTable, type ConditionMedicineRow } from '@/components/patient-profile/ConditionMedicinesTable'
import { ConditionStatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import type { PatientCondition } from '@/data/patientProfileTypes'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ConditionAccordionCardProps {
  condition: PatientCondition
  expanded: boolean
  onToggle: () => void
  onAddMedicine: () => void
  onEditMedicine: (medicine: ConditionMedicineRow) => void
  onDiscontinueMedicine: (medicine: ConditionMedicineRow) => void
}

export function ConditionAccordionCard({
  condition,
  expanded,
  onToggle,
  onAddMedicine,
  onEditMedicine,
  onDiscontinueMedicine,
}: ConditionAccordionCardProps) {
  const activeMeds = condition.medicines.filter((m) => m.status === 'Active').length

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border bg-card transition-shadow',
        expanded ? 'border-primary/25 shadow-md' : 'border-border shadow-sm'
      )}
    >
      <button
        type="button"
        className="flex w-full items-center gap-4 px-4 py-4 text-left sm:px-5"
        onClick={onToggle}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold tracking-tight">{condition.conditionName}</h3>
            <ConditionStatusBadge status={condition.status} />
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground sm:text-sm">
            <span>{condition.infectionType}</span>
            <span>Diagnosed {formatDate(condition.diagnosisDate)}</span>
            <span>
              {condition.medicines.length} medicine{condition.medicines.length !== 1 ? 's' : ''}
              {activeMeds > 0 && ` (${activeMeds} active)`}
            </span>
          </div>
        </div>
        <ChevronDown
          className={cn(
            'h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200',
            expanded && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-t border-border bg-muted/10 px-4 pb-5 pt-4 sm:px-5">
              {condition.notes && (
                <p className="rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-muted-foreground">
                  {condition.notes}
                </p>
              )}
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">Medicines</p>
                <Button type="button" size="sm" variant="outline" onClick={onAddMedicine}>
                  <Plus className="h-3.5 w-3.5" />
                  Add Medicine
                </Button>
              </div>
              <ConditionMedicinesTable
                medicines={condition.medicines}
                conditionId={condition.id}
                onEdit={onEditMedicine}
                onDiscontinue={onDiscontinueMedicine}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
