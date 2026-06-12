import { apiPost } from './api'

export interface ManualFollowUpRequest {
  Patient: string
  'Follow-Up Date': string
  'Follow-Up Time': string
  'Follow-Up Reason'?: string
  'Clinic Notes'?: string
}

export interface ManualFollowUpResponseData {
  patient: {
    code: string
    name: string
  }
  followup: {
    date: string
    time: string
  }
}

export function createManualFollowUp(payload: ManualFollowUpRequest) {
  return apiPost<ManualFollowUpResponseData>('/followups/manual', payload)
}
