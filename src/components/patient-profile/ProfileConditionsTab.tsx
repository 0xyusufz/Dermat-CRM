import { useState } from 'react'
import type { ConditionMedicineRow } from '@/components/patient-profile/ConditionMedicinesTable'
import { ConditionAccordionCard } from '@/components/patient-profile/ConditionAccordionCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PatientCondition } from '@/data/patientProfileTypes'

interface ProfileConditionsTabProps {
  conditions: PatientCondition[]
  onAddMedicine: (conditionId: string) => void
  onEditMedicine: (medicine: ConditionMedicineRow) => void
  onDiscontinueMedicine: (medicine: ConditionMedicineRow) => void
}

export function ProfileConditionsTab({
  conditions,
  onAddMedicine,
  onEditMedicine,
  onDiscontinueMedicine,
}: ProfileConditionsTabProps) {
  const [expandedId, setExpandedId] = useState<string | null>(conditions[0]?.id ?? null)

  if (conditions.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-sm font-medium">No conditions on record</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete a consultation to create a condition and prescribe medicines.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Conditions & Medicines</CardTitle>
        <p className="text-sm text-muted-foreground">
          Patient → Conditions → Medicines. Follow-ups are managed separately at patient level.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {conditions.map((condition) => (
          <ConditionAccordionCard
            key={condition.id}
            condition={condition}
            expanded={expandedId === condition.id}
            onToggle={() =>
              setExpandedId((id) => (id === condition.id ? null : condition.id))
            }
            onAddMedicine={() => onAddMedicine(condition.id)}
            onEditMedicine={onEditMedicine}
            onDiscontinueMedicine={onDiscontinueMedicine}
          />
        ))}
      </CardContent>
    </Card>
  )
}
