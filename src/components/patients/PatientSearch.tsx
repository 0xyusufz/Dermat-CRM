import { Search } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import type { PatientListRow } from '@/data/patientsWorkspace'
import { cn } from '@/lib/utils'

interface PatientSearchProps {
  value: string
  onChange: (value: string) => void
  suggestions: PatientListRow[]
  onSelectSuggestion?: (row: PatientListRow) => void
}

export function PatientSearch({
  value,
  onChange,
  suggestions,
  onSelectSuggestion,
}: PatientSearchProps) {
  const [focused, setFocused] = useState(false)
  const showSuggestions = focused && value.trim().length > 0 && suggestions.length > 0

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => window.setTimeout(() => setFocused(false), 180)}
        placeholder="Search by Patient ID, Name, or Phone Number"
        className={cn(
          'h-12 rounded-xl border-border bg-background pl-11 text-base shadow-sm transition-shadow',
          'focus-visible:ring-2 focus-visible:ring-primary/20'
        )}
        autoComplete="off"
        role="combobox"
        aria-expanded={showSuggestions}
        aria-autocomplete="list"
      />
      {showSuggestions && (
        <div
          className="absolute top-full z-30 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-lg"
          role="listbox"
        >
          {suggestions.map((row) => (
            <button
              key={row.id}
              type="button"
              role="option"
              className="flex w-full items-center justify-between gap-3 border-b border-border/60 px-4 py-3 text-left text-sm last:border-0 hover:bg-muted/60"
              onMouseDown={() => {
                onChange(row.name)
                onSelectSuggestion?.(row)
                setFocused(false)
              }}
            >
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-xs text-muted-foreground">
                  {row.id} · {row.phone}
                </p>
              </div>
            </button>
          ))}
          <p className="px-4 py-2 text-[11px] text-muted-foreground">
            Autocomplete ready for future GET /patients/search
          </p>
        </div>
      )}
    </div>
  )
}
