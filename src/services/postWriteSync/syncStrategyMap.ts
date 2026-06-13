import type { SyncActionType, SyncTarget } from './types'

export function getSyncTargetsForAction(actionType: SyncActionType): SyncTarget[] {
  switch (actionType) {
    case 'REGISTER_PATIENT':
      return ['dashboard', 'patient']
    case 'CREATE_CONSULTATION':
    case 'SCHEDULE_FOLLOW_UP':
    case 'RESCHEDULE_FOLLOW_UP':
    case 'COMPLETE_FOLLOW_UP':
    case 'CREATE_PRESCRIPTION':
    case 'UPDATE_PRESCRIPTION':
    case 'DISCONTINUE_PRESCRIPTION':
      return ['patient']
    default:
      return []
  }
}
