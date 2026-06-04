import { Link, useNavigate } from 'react-router-dom'
import { ClipboardList, UserPlus } from 'lucide-react'
import { PatientFilters } from '@/components/patients/PatientFilters'
import { PatientKPICards } from '@/components/patients/PatientKPICards'
import { PatientSearch } from '@/components/patients/PatientSearch'
import { PatientTable } from '@/components/patients/PatientTable'
import { PatientsEmptyState } from '@/components/patients/PatientsEmptyState'
import { PatientsLoadingSkeleton } from '@/components/patients/PatientsLoadingSkeleton'
import { PatientsMobileList } from '@/components/patients/PatientsMobileList'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { usePatientsWorkspace } from '@/hooks/usePatientsWorkspace'

interface AllPatientsPageProps {
  filterActive?: boolean
}

export function AllPatientsPage({ filterActive = false }: AllPatientsPageProps) {
  const navigate = useNavigate()
  const {
    filters,
    setFilters,
    clearFilters,
    hasActiveFilters,
    rows,
    totalPatients,
    kpis,
    suggestions,
    loading,
  } = usePatientsWorkspace({ activeOnly: filterActive })

  if (loading) {
    return <PatientsLoadingSkeleton />
  }

  const isEmpty = totalPatients === 0
  const isFilteredEmpty = !isEmpty && rows.length === 0

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {filterActive ? 'Active Patients' : 'Patients'}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Manage registrations, consultations, conditions, medicines, and follow-ups from
            one place.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link to="/registration">
              <UserPlus className="h-4 w-4" />
              New Registration
            </Link>
          </Button>
          <Button variant="gradient" asChild>
            <Link to="/consultation">
              <ClipboardList className="h-4 w-4" />
              New Consultation
            </Link>
          </Button>
        </div>
      </div>

      <PatientKPICards kpis={kpis} />

      <Card className="border-border/80 shadow-sm">
        <CardContent className="space-y-4 p-4 sm:p-5">
          <PatientSearch
            value={filters.search}
            onChange={(search) => setFilters({ ...filters, search })}
            suggestions={suggestions}
            onSelectSuggestion={(row) => navigate(`/patients/${row.id}`)}
          />
          <PatientFilters
            filters={filters}
            onChange={setFilters}
            onClear={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-medium text-foreground">{rows.length}</span> of{' '}
            {totalPatients} patients
          </p>
        </CardContent>
      </Card>

      {isEmpty || isFilteredEmpty ? (
        <PatientsEmptyState filteredEmpty={isFilteredEmpty} />
      ) : (
        <>
          <PatientTable rows={rows} />
          <PatientsMobileList rows={rows} />
        </>
      )}
    </div>
  )
}
