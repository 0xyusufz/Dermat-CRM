import { Pill, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { PrescriptionStatusBadge } from '@/components/shared/StatusBadge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  doctors,
  getActivePrescriptions,
  getCompletedPrescriptions,
  getDoctorById,
  getPatientById,
} from '@/data/mockData'
import { formatDate } from '@/lib/utils'

interface PrescriptionsPageProps {
  completed?: boolean
}

export function PrescriptionsPage({ completed = false }: PrescriptionsPageProps) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [doctorFilter, setDoctorFilter] = useState('all')

  const prescriptions = completed ? getCompletedPrescriptions() : getActivePrescriptions()

  const filtered = useMemo(() => {
    let list = [...prescriptions]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((rx) => {
        const patient = getPatientById(rx.patientId)
        return (
          rx.medicineName.toLowerCase().includes(q) ||
          patient?.name.toLowerCase().includes(q) ||
          rx.id.toLowerCase().includes(q)
        )
      })
    }
    if (doctorFilter !== 'all') {
      list = list.filter((rx) => rx.doctorId === doctorFilter)
    }
    return list
  }, [prescriptions, search, doctorFilter])

  return (
    <div>
      <PageHeader
        title={completed ? 'Completed Prescriptions' : 'Active Prescriptions'}
        description={`${filtered.length} prescriptions`}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.slice(0, 4).map((rx) => {
          const patient = getPatientById(rx.patientId)
          return (
            <Card key={rx.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950">
                    <Pill className="h-5 w-5 text-purple-600" />
                  </div>
                  <PrescriptionStatusBadge status={rx.status} />
                </div>
                <p className="mt-3 font-semibold">{rx.medicineName}</p>
                <p className="text-sm text-muted-foreground">{patient?.name}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatDate(rx.startDate)} — {formatDate(rx.endDate)}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medicine or patient..."
              className="pl-10"
            />
          </div>
          <Select value={doctorFilter} onValueChange={setDoctorFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Doctor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Doctors</SelectItem>
              {doctors.map((d) => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left text-muted-foreground">
                  <th className="px-6 py-4 font-medium">Medicine Name</th>
                  <th className="px-6 py-4 font-medium">Patient</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">Doctor</th>
                  <th className="px-6 py-4 font-medium">Start Date</th>
                  <th className="px-6 py-4 font-medium">End Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((rx) => {
                  const patient = getPatientById(rx.patientId)
                  return (
                    <tr
                      key={rx.id}
                      className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => patient && navigate(`/patients/${patient.id}`)}
                    >
                      <td className="px-6 py-4 font-medium">{rx.medicineName}</td>
                      <td className="px-6 py-4">{patient?.name}</td>
                      <td className="px-6 py-4 hidden md:table-cell text-muted-foreground">
                        {getDoctorById(rx.doctorId)?.name}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{formatDate(rx.startDate)}</td>
                      <td className="px-6 py-4 text-muted-foreground">{formatDate(rx.endDate)}</td>
                      <td className="px-6 py-4"><PrescriptionStatusBadge status={rx.status} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
