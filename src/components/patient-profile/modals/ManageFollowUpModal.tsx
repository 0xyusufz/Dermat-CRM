import { useEffect, useState } from 'react'
import { FollowUpTimeChipSelect } from '@/components/consultation/FollowUpTimeChipSelect'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type {
  FollowUpTimeSlot,
  PatientFollowUpRecord,
  UpsertFollowUpInput,
} from '@/data/patientProfileTypes'

interface ManageFollowUpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'manage'
  activeFollowUp: PatientFollowUpRecord | null
  onSubmit: (input: UpsertFollowUpInput) => void
}

export function ManageFollowUpModal({
  open,
  onOpenChange,
  mode,
  activeFollowUp,
  onSubmit,
}: ManageFollowUpModalProps) {
  const [date, setDate] = useState('')
  const [timeSlot, setTimeSlot] = useState<FollowUpTimeSlot>('Morning')

  useEffect(() => {
    if (!open) return
    if (mode === 'manage' && activeFollowUp) {
      setDate(activeFollowUp.date)
      setTimeSlot(activeFollowUp.timeSlot)
    } else {
      setDate('')
      setTimeSlot('Morning')
    }
  }, [open, mode, activeFollowUp])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ date, timeSlot, source: 'Manual' })
    onOpenChange(false)
  }

  const isManage = mode === 'manage'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isManage ? 'Manage Active Follow-Up' : 'Create Follow-Up'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {isManage
              ? 'Updates the existing active follow-up. A second active follow-up will not be created.'
              : 'Schedule a patient-level follow-up. Only one active follow-up is allowed at a time.'}
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Follow-Up Date</Label>
            <Input
              type="date"
              className="mt-1.5"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <FollowUpTimeChipSelect value={timeSlot} onChange={setTimeSlot} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              {isManage ? 'Save Changes' : 'Schedule Follow-Up'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
