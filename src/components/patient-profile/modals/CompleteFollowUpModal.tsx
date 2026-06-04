import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { PatientFollowUpRecord } from '@/data/patientProfileTypes'
import { formatDate } from '@/lib/utils'

interface CompleteFollowUpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  followUp: PatientFollowUpRecord | null
  onConfirm: () => void
}

export function CompleteFollowUpModal({
  open,
  onOpenChange,
  followUp,
  onConfirm,
}: CompleteFollowUpModalProps) {
  if (!followUp) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Follow-Up</DialogTitle>
          <DialogDescription>
            Mark the follow-up on <strong>{formatDate(followUp.date)}</strong> (
            {followUp.timeSlot}) as completed?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="gradient"
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            Confirm Complete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
