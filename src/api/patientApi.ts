import { ApiError, API_BASE_URL } from './client'
import type { PatientApiResponse } from './patientTypes'

export async function fetchPatient(patientId: string): Promise<PatientApiResponse> {
  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}/patient/${encodeURIComponent(patientId)}`, {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    throw new ApiError('Network request failed', 0)
  }

  let json: PatientApiResponse & { success?: boolean; error?: string }

  try {
    json = await response.json()
  } catch {
    throw new ApiError('Invalid response from server', response.status || 500)
  }

  if (!response.ok || json.success === false) {
    throw new ApiError(json.error ?? 'Request failed', response.status)
  }

  if (!json.patientId || !json.patient) {
    throw new ApiError('Invalid patient data', 500)
  }

  return json
}
