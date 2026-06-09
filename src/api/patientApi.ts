import { apiClient } from './client'

export async function fetchPatient(patientId: string) {
  const response = await apiClient.get<{ success: boolean; data: unknown }>(
    `/patient/${patientId}`
  )
  return response.data
}
