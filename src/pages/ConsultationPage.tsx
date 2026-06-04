import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Search } from 'lucide-react'
import { useCallback, useState } from 'react'
import { ConditionInformationCard } from '@/components/consultation/ConditionInformationCard'
import { ConsultationSummaryCard } from '@/components/consultation/ConsultationSummaryCard'
import { FollowUpScheduleCard } from '@/components/consultation/FollowUpScheduleCard'
import { PatientSummaryCard } from '@/components/consultation/PatientSummaryCard'
import { PrescriptionBuilderSection } from '@/components/consultation/PrescriptionBuilderSection'
import { RemindersInfoCard } from '@/components/consultation/RemindersInfoCard'
import {
  createEmptyMedicine,
  type ConsultationMedicineDraft,
  type FollowUpTimeSlot,
  type InfectionType,
} from '@/components/consultation/types'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Patient } from '@/data/types'
import { searchPatients } from '@/data/mockData'
import { useDebounce } from '@/hooks/useDebounce'
import { cn } from '@/lib/utils'

export function ConsultationPage() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const debouncedQuery = useDebounce(query, 200)
  const suggestions = debouncedQuery.length >= 1 ? searchPatients(debouncedQuery) : []

  const [skinProblem, setSkinProblem] = useState('')
  const [infectionType, setInfectionType] = useState<InfectionType>('Acne')
  const [diagnosisDate, setDiagnosisDate] = useState(
    () => new Date().toISOString().split('T')[0]
  )
  const [doctorNotes, setDoctorNotes] = useState('')
  const [medicines, setMedicines] = useState<ConsultationMedicineDraft[]>(() => [
    createEmptyMedicine(),
  ])
  const [expandedMedicineId, setExpandedMedicineId] = useState<string | null>(
    () => medicines[0]?.id ?? null
  )
  const [followUpDate, setFollowUpDate] = useState('')
  const [followUpTime, setFollowUpTime] = useState<FollowUpTimeSlot>('Morning')

  const handleSelect = (patient: Patient) => {
    setSelectedPatient(patient)
    setQuery('')
    setFocused(false)
  }

  const resetForm = useCallback(() => {
    const first = createEmptyMedicine()
    setSkinProblem('')
    setInfectionType('Acne')
    setDiagnosisDate(new Date().toISOString().split('T')[0])
    setDoctorNotes('')
    setMedicines([first])
    setExpandedMedicineId(first.id)
    setFollowUpDate('')
    setFollowUpTime('Morning')
  }, [])

  const updateMedicine = (index: number, med: ConsultationMedicineDraft) => {
    setMedicines((prev) => prev.map((m, i) => (i === index ? med : m)))
  }

  const addMedicine = () => {
    const next = createEmptyMedicine()
    setMedicines((prev) => [...prev, next])
    setExpandedMedicineId(next.id)
  }

  const removeMedicine = (index: number) => {
    setMedicines((prev) => {
      const next = prev.filter((_, i) => i !== index)
      const removed = prev[index]
      if (expandedMedicineId === removed?.id) {
        setExpandedMedicineId(next[next.length - 1]?.id ?? null)
      }
      return next
    })
  }

  const toggleMedicine = (id: string) => {
    setExpandedMedicineId((current) => (current === id ? null : id))
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-lg pt-12 text-center"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <h2 className="mt-6 text-2xl font-bold tracking-tight">Consultation Saved</h2>
        <p className="mt-2 text-muted-foreground">
          Consultation record for {selectedPatient?.name} has been created successfully.
        </p>
        <Button
          className="mt-8"
          onClick={() => {
            setSubmitted(false)
            setSelectedPatient(null)
            resetForm()
          }}
        >
          New Consultation
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Consultation"
        description="Structured dermatology workflow — condition, per-medicine prescriptions, and follow-up."
      />

      <div className="relative mb-6">
        <div
          className={cn(
            'relative rounded-2xl border transition-all duration-200',
            focused
              ? 'border-primary/40 bg-card shadow-lg ring-4 ring-primary/10'
              : 'border-border bg-muted/30'
          )}
        >
          <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Search by Patient ID, Phone Number, or Name..."
            className="h-14 border-0 bg-transparent pl-14 pr-6 text-base shadow-none focus-visible:ring-0"
          />
        </div>

        <AnimatePresence>
          {focused && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute top-full left-0 right-0 z-20 mt-2 overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
            >
              {suggestions.map((patient) => (
                <button
                  key={patient.id}
                  type="button"
                  onMouseDown={() => handleSelect(patient)}
                  className="flex w-full cursor-pointer items-center gap-4 border-b border-border/50 px-5 py-3.5 text-left transition-colors last:border-0 hover:bg-muted/60"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-bold text-primary">
                    {patient.id.split('-')[1]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-mono">{patient.id}</span> · {patient.phone}
                    </p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selectedPatient && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setSubmitted(true)
            }}
          >
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
              <div className="space-y-5">
                <PatientSummaryCard patient={selectedPatient} />

                <ConditionInformationCard
                  skinProblem={skinProblem}
                  onSkinProblemChange={setSkinProblem}
                  infectionType={infectionType}
                  onInfectionTypeChange={setInfectionType}
                  diagnosisDate={diagnosisDate}
                  onDiagnosisDateChange={setDiagnosisDate}
                  doctorNotes={doctorNotes}
                  onDoctorNotesChange={setDoctorNotes}
                />

                <PrescriptionBuilderSection
                  medicines={medicines}
                  expandedMedicineId={expandedMedicineId}
                  onToggleMedicine={toggleMedicine}
                  onUpdateMedicine={updateMedicine}
                  onRemoveMedicine={removeMedicine}
                  onAddMedicine={addMedicine}
                />

                <div className="grid gap-5 lg:grid-cols-2">
                  <FollowUpScheduleCard
                    followUpDate={followUpDate}
                    onFollowUpDateChange={setFollowUpDate}
                    followUpTime={followUpTime}
                    onFollowUpTimeChange={setFollowUpTime}
                  />
                  <RemindersInfoCard />
                </div>

                <div className="xl:hidden">
                  <ConsultationSummaryCard
                    patientName={selectedPatient.name}
                    conditionType={infectionType}
                    skinProblem={skinProblem}
                    medicines={medicines}
                    followUpDate={followUpDate}
                    followUpTime={followUpTime}
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSelectedPatient(null)
                      resetForm()
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="gradient" size="lg">
                    Save Consultation
                  </Button>
                </div>
              </div>

              <aside className="hidden xl:block">
                <div className="sticky top-24 space-y-4">
                  <ConsultationSummaryCard
                    compact
                    patientName={selectedPatient.name}
                    conditionType={infectionType}
                    skinProblem={skinProblem}
                    medicines={medicines}
                    followUpDate={followUpDate}
                    followUpTime={followUpTime}
                  />
                </div>
              </aside>
            </div>
          </form>
        </motion.div>
      )}

      {!selectedPatient && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <Search className="h-11 w-11 text-muted-foreground/40" />
          <p className="mt-4 text-lg font-medium">Search for a patient to begin</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try DERM-1040, Md Yusuf Fatah, or a phone number
          </p>
        </div>
      )}
    </div>
  )
}
