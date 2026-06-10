import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '@/api/client'
import { fetchPatient } from '@/api/patientApi'
import type {
  AddMedicineInput,
  DiscontinueReason,
  PatientProfileOverview,
  PatientProfileSnapshot,
  RescheduleFollowUpInput,
  UpdateMedicineInput,
  UpsertFollowUpInput,
} from '@/data/patientProfileTypes'
import { mapPatientApiResponse } from '@/lib/mapPatientApiResponse'
import { mockPatientProfileService } from '@/services/patientProfile/mockPatientProfileService'

export const patientQueryKey = (patientId: string) => ['patient', patientId] as const

const PATIENT_QUERY_OPTIONS = {
  staleTime: 300_000,
  gcTime: 600_000,
  retry: 1,
  refetchOnWindowFocus: false,
} as const

export function prefetchPatient(queryClient: ReturnType<typeof useQueryClient>, patientId: string) {
  return queryClient.prefetchQuery({
    queryKey: patientQueryKey(patientId),
    queryFn: async () => {
      const data = await fetchPatient(patientId)
      return mapPatientApiResponse(data)
    },
    ...PATIENT_QUERY_OPTIONS,
  })
}

export function usePatientProfile(patientId: string | undefined) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: patientQueryKey(patientId ?? ''),
    queryFn: async () => {
      if (!patientId) throw new Error('Patient ID is required')
      const data = await fetchPatient(patientId)
      return mapPatientApiResponse(data)
    },
    enabled: !!patientId,
    ...PATIENT_QUERY_OPTIONS,
  })

  const snapshot: PatientProfileSnapshot | null = query.data ?? null
  const overview: PatientProfileOverview | null = snapshot?.overview ?? null
  const patient = snapshot?.patient

  const invalidate = () => {
    if (patientId) {
      queryClient.invalidateQueries({ queryKey: patientQueryKey(patientId) })
    }
  }

  return {
    patient,
    snapshot,
    overview,
    loading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    isError: query.isError,
    isNotFound: query.error instanceof ApiError && query.error.status === 404,
    isNetworkError: query.error instanceof ApiError && query.error.status === 0,
    reload: query.refetch,
    addMedicine: async (input: AddMedicineInput) => {
      if (!patientId) return
      await mockPatientProfileService.addMedicine(patientId, input)
      invalidate()
    },
    updateMedicine: async (
      conditionId: string,
      medicineId: string,
      input: UpdateMedicineInput
    ) => {
      if (!patientId) return
      await mockPatientProfileService.updateMedicine(patientId, conditionId, medicineId, input)
      invalidate()
    },
    discontinueMedicine: async (
      conditionId: string,
      medicineId: string,
      reason: DiscontinueReason
    ) => {
      if (!patientId) return
      await mockPatientProfileService.discontinueMedicine(
        patientId,
        conditionId,
        medicineId,
        reason
      )
      invalidate()
    },
    addFollowUp: async (input: UpsertFollowUpInput) => {
      if (!patientId) return
      await mockPatientProfileService.upsertActiveFollowUp(patientId, input)
      invalidate()
    },
    completeFollowUp: async (followUpId: string) => {
      if (!patientId) return
      await mockPatientProfileService.completeFollowUp(patientId, followUpId)
      invalidate()
    },
    rescheduleFollowUp: async (followUpId: string, input: RescheduleFollowUpInput) => {
      if (!patientId) return
      await mockPatientProfileService.rescheduleFollowUp(patientId, followUpId, input)
      invalidate()
    },
  }
}
