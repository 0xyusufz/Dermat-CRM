import type { FollowUpTimeSlot } from '@/components/consultation/types'
import { FOLLOW_UP_TIME_OPTIONS } from '@/components/consultation/types'
import { cn } from '@/lib/utils'

interface FollowUpTimeChipSelectProps {
  value: FollowUpTimeSlot
  onChange: (value: FollowUpTimeSlot) => void
}

export function FollowUpTimeChipSelect({ value, onChange }: FollowUpTimeChipSelectProps) {
  return (
    <div>
      <p className="text-sm font-medium leading-none">Follow-Up Time</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {FOLLOW_UP_TIME_OPTIONS.map((option) => {
          const selected = value === option
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={cn(
                'rounded-xl border px-3.5 py-2 text-xs font-medium transition-all duration-200',
                selected
                  ? 'border-primary bg-primary/10 text-primary shadow-sm'
                  : 'border-border bg-background text-muted-foreground hover:border-primary/30 hover:bg-muted/50'
              )}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}
