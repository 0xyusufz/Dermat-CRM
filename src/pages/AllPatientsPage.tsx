import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { ClipboardList, UserPlus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { PatientFilters, type PatientFiltersState, defaultPatientFilters } from '@/components/patients/PatientFilters'
import { PatientKPICards } from '@/components/patients/PatientKPICards'
import { PatientSearch } from '@/components/patients/PatientSearch'
import { PatientTable } from '@/components/patients/PatientTable'
import { PatientsEmptyState } from '@/components/patients/PatientsEmptyState'
import { PatientsLoadingSkeleton } from '@/components/patients/PatientsLoadingSkeleton'
import { PatientsMobileList } from '@/components/patients/PatientsMobileList'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useDashboard } from '@/hooks/useDashboard'

interface AllPatientsPageProps {
  filterActive?: boolean
}

export function AllPatientsPage({ filterActive = false }: AllPatientsPageProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, isLoading } = useDashboard()

  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<PatientFiltersState>(defaultPatientFilters)

  const location = useLocation()

  // URL Param Hydration
  useEffect(() => {
    const statusParam = searchParams.get('status')
    const followupParam = searchParams.get('followup')
    
    // Completely reset search and filters on any route/param change
    setSearch('')
    setFilters({
      ...defaultPatientFilters,
      status: statusParam === 'Registered' ? 'Registered' : defaultPatientFilters.status,
      followup: followupParam === 'scheduled' || followupParam === 'Has Active Follow-Up' 
        ? 'Has Active Follow-Up' 
        : defaultPatientFilters.followup
    })
  }, [location.pathname, location.search])

  const handleSetFilters = (newFilters: PatientFiltersState) => {
    // Only update local state. Do not push to URL to prevent reset loop
    // and keep KPI routing distinct from manual filtering.
    setFilters(newFilters)
  }

  const clearFilters = () => {
    setSearch('')
    setFilters(defaultPatientFilters)
    setSearchParams(new URLSearchParams())
  }

  const hasActiveFilters = 
    search !== '' ||
    filters.doctor !== 'All Doctors' ||
    filters.status !== 'All Statuses' ||
    filters.medicine !== 'Any Medicines' ||
    filters.followup !== 'Any Follow-Up' ||
    filters.time !== 'All Time'

  const baseDataset = filterActive ? data?.totalActivePatients : data?.totalPatientsAvailable
  const summary = filterActive ? data?.activePatientSummary : data?.totalPatientSummary
  const totalPatients = baseDataset?.length || 0

  const filteredRows = useMemo(() => {
    if (!baseDataset) return []

    let result = baseDataset

    // 1. Search
    if (search.trim() !== '') {
      const query = search.trim().toLowerCase()
      result = result.filter(p => p.searchText.toLowerCase().includes(query))
    }

    // 2. Doctor
    if (filters.doctor !== 'All Doctors') {
      result = result.filter(p => p.assignedDoctor === filters.doctor)
    }

    // 3. Status
    if (filters.status !== 'All Statuses') {
      result = result.filter(p => p.status === filters.status)
    }

    // 4. Medicine
    if (filters.medicine !== 'Any Medicines') {
      if (filters.medicine === 'Has Active Medicines') {
        result = result.filter(p => p.activeMedicineCount > 0)
      } else if (filters.medicine === 'No Active Medicines') {
        result = result.filter(p => p.activeMedicineCount === 0)
      }
    }

    // 5. Follow-Up
    if (filters.followup !== 'Any Follow-Up') {
      if (filters.followup === 'Has Active Follow-Up') {
        result = result.filter(p => p.nextFollowupDate !== null && p.nextFollowupDate.trim() !== '')
      } else if (filters.followup === 'No Active Follow-Up') {
        result = result.filter(p => p.nextFollowupDate === null || p.nextFollowupDate.trim() === '')
      }
    }

    // 6. Time
    if (filters.time !== 'All Time') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      result = result.filter(p => {
        if (!p.registrationDate) return false
        
        const regParts = p.registrationDate.split('-')
        if (regParts.length !== 3) return false
        
        // Parse explicitly to avoid UTC/timezone shifting edge cases
        const regDate = new Date(parseInt(regParts[0], 10), parseInt(regParts[1], 10) - 1, parseInt(regParts[2], 10))
        regDate.setHours(0, 0, 0, 0)
        
        const diffTime = today.getTime() - regDate.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

        if (filters.time === 'Last 7 Days') return diffDays >= 0 && diffDays <= 7
        if (filters.time === 'Last 30 Days') return diffDays >= 0 && diffDays <= 30
        if (filters.time === 'Last 90 Days') return diffDays >= 0 && diffDays <= 90
        
        return true
      })
    }

    return result
  }, [baseDataset, search, filters])

  if (isLoading) {
    return <PatientsLoadingSkeleton />
  }

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

      <PatientKPICards summary={summary} />

      <Card className="border-border/80 shadow-sm">
        <CardContent className="space-y-4 p-4 sm:p-5">
          <PatientSearch
            value={search}
            onChange={setSearch}
          />
          <PatientFilters
            filters={filters}
            onChange={handleSetFilters}
            onClear={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredRows.length}</span> of{' '}
            {totalPatients} patients
          </p>
        </CardContent>
      </Card>

      {filteredRows.length === 0 ? (
        <PatientsEmptyState filteredEmpty={totalPatients > 0} />
      ) : (
        <>
          <PatientTable rows={filteredRows} />
          <PatientsMobileList rows={filteredRows} />
        </>
      )}
    </div>
  )
}
