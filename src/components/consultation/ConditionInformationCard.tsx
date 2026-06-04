import { Stethoscope } from 'lucide-react'
import type { InfectionType } from '@/components/consultation/types'
import { INFECTION_TYPES } from '@/components/consultation/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface ConditionInformationCardProps {
  skinProblem: string
  onSkinProblemChange: (value: string) => void
  infectionType: InfectionType
  onInfectionTypeChange: (value: InfectionType) => void
  diagnosisDate: string
  onDiagnosisDateChange: (value: string) => void
  doctorNotes: string
  onDoctorNotesChange: (value: string) => void
}

export function ConditionInformationCard({
  skinProblem,
  onSkinProblemChange,
  infectionType,
  onInfectionTypeChange,
  diagnosisDate,
  onDiagnosisDateChange,
  doctorNotes,
  onDoctorNotesChange,
}: ConditionInformationCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Stethoscope className="h-5 w-5 text-primary" />
          Condition Information
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="skin-problem">Skin Problem</Label>
          <Input
            id="skin-problem"
            className="mt-1.5"
            placeholder="e.g. Acne Vulgaris"
            value={skinProblem}
            onChange={(e) => onSkinProblemChange(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Infection Type</Label>
          <Select value={infectionType} onValueChange={(v) => onInfectionTypeChange(v as InfectionType)}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INFECTION_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="diagnosis-date">Diagnosis Date</Label>
          <Input
            id="diagnosis-date"
            type="date"
            className="mt-1.5"
            value={diagnosisDate}
            onChange={(e) => onDiagnosisDateChange(e.target.value)}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="doctor-notes">Clinical Notes</Label>
          <Textarea
            id="doctor-notes"
            className="mt-1.5 min-h-[88px]"
            placeholder="Examination findings, severity, treatment goals..."
            value={doctorNotes}
            onChange={(e) => onDoctorNotesChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
