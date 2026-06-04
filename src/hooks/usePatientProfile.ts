import { useCallback, useEffect, useMemo, useState } from 'react'
import { doctors, patients } from '@/data/mockData'
import type {
  PatientProfileBundle,
  PatientProfileOverview,
  AddMedicineInput,
  UpdateMedicineInput,
  UpsertFollowUpInput,
  RescheduleFollowUpInput,
  DiscontinueReason,
} from '@/data/patientProfileTypes'
import {
  countActiveConditions,
  countActiveMedicines,
  getActiveFollowUp,
  getActiveFollowUpStatusLabel,
} from '@/data/patientProfileTypes'
import { mockPatientProfileService } from '@/services/patientProfile/mockPatientProfileService'

export function usePatientProfile(patientId: string | undefined) {
  const [bundle, setBundle] = useState<PatientProfileBundle | null>(null)
  const [loading, setLoading] = useState(true)

  const patient = patientId ? patients.find((p) => p.id === patientId) : undefined
  const doctor = patient ? doctors.find((d) => d.id === patient.doctorId) : undefined

  const load = useCallback(async () => {
    if (!patientId) {
      setBundle(null)
      setLoading(false)
      return
    }
    setLoading(true)
    const data = await mockPatientProfileService.getBundle(patientId)
    setBundle(data)
    setLoading(false)
  }, [patientId])

  useEffect(() => {
    load()
  }, [load])

  const apply = useCallback(async (next: PatientProfileBundle) => {
    setBundle(next)
  }, [])

  const overview: PatientProfileOverview | null = useMemo(() => {
    if (!patient || !bundle) return null
    const activeFollowUp = getActiveFollowUp(bundle.followUps)
    return {
      patient,
      doctorName: doctor?.name ?? '—',
      activeConditionsCount: countActiveConditions(bundle.conditions),
      activeMedicinesCount: countActiveMedicines(bundle.conditions),
      activeFollowUp,
      activeFollowUpStatusLabel: getActiveFollowUpStatusLabel(activeFollowUp),
      nextFollowUpDateLabel: activeFollowUp
        ? activeFollowUp.date
        : '—',
    }
  }, [patient, bundle, doctor])

  return {
    patient,
    bundle,
    overview,
    loading,
    reload: load,
    addMedicine: async (input: AddMedicineInput) => {
      if (!patientId) return
      apply(await mockPatientProfileService.addMedicine(patientId, input))
    },
    updateMedicine: async (
      conditionId: string,
      medicineId: string,
      input: UpdateMedicineInput
    ) => {
      if (!patientId) return
      apply(
        await mockPatientProfileService.updateMedicine(
          patientId,
          conditionId,
          medicineId,
          input
        )
      )
    },
    discontinueMedicine: async (
      conditionId: string,
      medicineId: string,
      reason: DiscontinueReason
    ) => {
      if (!patientId) return
      apply(
        await mockPatientProfileService.discontinueMedicine(
          patientId,
          conditionId,
          medicineId,
          reason
        )
      )
    },
    addFollowUp: async (input: UpsertFollowUpInput) => {
      if (!patientId) return
      apply(await mockPatientProfileService.upsertActiveFollowUp(patientId, input))
    },
    completeFollowUp: async (followUpId: string) => {
      if (!patientId) return
      apply(await mockPatientProfileService.completeFollowUp(patientId, followUpId))
    },
    rescheduleFollowUp: async (followUpId: string, input: RescheduleFollowUpInput) => {
      if (!patientId) return
      apply(
        await mockPatientProfileService.rescheduleFollowUp(patientId, followUpId, input)
      )
    },
  }
}
