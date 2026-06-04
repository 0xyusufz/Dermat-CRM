import { motion } from 'framer-motion'
import {
  AlertCircle,
  CalendarCheck,
  ClipboardList,
  Pill,
  Search,
  Stethoscope,
  UserPlus,
  Users,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { PageHeader } from '@/components/shared/PageHeader'
import {
  activities,
  getConsultationPendingPatients,
  getDashboardStats,
  getDoctorById,
  getPatientById,
  getRecentRegistrations,
  getTodaysFollowUps,
  kpiSparklines,
} from '@/data/mockData'
import { FollowUpStatusBadge, PatientStatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, formatTime, getWaitingDays } from '@/lib/utils'

export function DashboardPage() {
  const navigate = useNavigate()
  const stats = getDashboardStats()
  const recentRegistrations = getRecentRegistrations(6)
  const pendingConsultations = getConsultationPendingPatients().slice(0, 5)
  const todaysFollowUps = getTodaysFollowUps()

  const kpis = [
    {
      label: 'Total Patients',
      value: stats.totalPatients,
      trend: 12,
      sparkline: kpiSparklines.totalPatients,
      icon: <Users className="h-5 w-5 text-blue-600" />,
      iconBg: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      label: 'Consultation Pending',
      value: stats.consultationPending,
      trend: -5,
      sparkline: kpiSparklines.consultationPending,
      icon: <ClipboardList className="h-5 w-5 text-amber-600" />,
      iconBg: 'bg-amber-50 dark:bg-amber-950',
    },
    {
      label: 'Active Patients',
      value: stats.activePatients,
      trend: 8,
      sparkline: kpiSparklines.activePatients,
      icon: <Stethoscope className="h-5 w-5 text-emerald-600" />,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
      label: "Today's Follow-Ups",
      value: stats.todaysFollowUps,
      trend: 15,
      sparkline: kpiSparklines.todaysFollowUps,
      icon: <CalendarCheck className="h-5 w-5 text-indigo-600" />,
      iconBg: 'bg-indigo-50 dark:bg-indigo-950',
    },
    {
      label: 'Missed Follow-Ups',
      value: stats.missedFollowUps,
      trend: -3,
      sparkline: kpiSparklines.missedFollowUps,
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      iconBg: 'bg-red-50 dark:bg-red-950',
    },
    {
      label: 'Active Prescriptions',
      value: stats.activePrescriptions,
      trend: 6,
      sparkline: kpiSparklines.activePrescriptions,
      icon: <Pill className="h-5 w-5 text-purple-600" />,
      iconBg: 'bg-purple-50 dark:bg-purple-950',
    },
  ]

  const quickActions = [
    {
      title: 'New Registration',
      description: 'Register a new patient',
      icon: UserPlus,
      path: '/registration',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'New Consultation',
      description: 'Start patient consultation',
      icon: Stethoscope,
      path: '/consultation',
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      title: 'Search Patient',
      description: 'Find patient records',
      icon: Search,
      path: '/patients',
      gradient: 'from-emerald-500 to-teal-600',
    },
  ]

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Clinic overview — understand your clinic status at a glance."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 mb-8">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.label} {...kpi} delay={i * 0.05} />
        ))}
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {quickActions.map((action, i) => {
          const Icon = action.icon
          return (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              whileHover={{ y: -2 }}
            >
              <Link
                to={action.path}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 card-shadow transition-all hover:shadow-lg"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-sm`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold group-hover:text-primary transition-colors">{action.title}</p>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Registrations</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/patients')}>
                View all
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="pb-3 font-medium">Patient ID</th>
                      <th className="pb-3 font-medium">Name</th>
                      <th className="pb-3 font-medium hidden md:table-cell">Phone</th>
                      <th className="pb-3 font-medium hidden lg:table-cell">Doctor</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRegistrations.map((patient) => (
                      <tr key={patient.id} className="border-b border-border/50 last:border-0">
                        <td className="py-3 font-mono text-xs text-primary">{patient.id}</td>
                        <td className="py-3 font-medium">{patient.name}</td>
                        <td className="py-3 hidden md:table-cell text-muted-foreground">{patient.phone}</td>
                        <td className="py-3 hidden lg:table-cell text-muted-foreground">
                          {getDoctorById(patient.doctorId)?.name}
                        </td>
                        <td className="py-3 text-muted-foreground">{formatDate(patient.registrationDate)}</td>
                        <td className="py-3"><PatientStatusBadge status={patient.status} /></td>
                        <td className="py-3">
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/patients/${patient.id}`)}>
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Consultation Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="pb-3 font-medium">Patient</th>
                      <th className="pb-3 font-medium">Doctor</th>
                      <th className="pb-3 font-medium">Registration Date</th>
                      <th className="pb-3 font-medium">Waiting Days</th>
                      <th className="pb-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingConsultations.map((patient) => (
                      <tr key={patient.id} className="border-b border-border/50 last:border-0">
                        <td className="py-3">
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">{patient.id}</p>
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {getDoctorById(patient.doctorId)?.name}
                        </td>
                        <td className="py-3 text-muted-foreground">{formatDate(patient.registrationDate)}</td>
                        <td className="py-3">
                          <span className="rounded-lg bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                            {getWaitingDays(patient.registrationDate)} days
                          </span>
                        </td>
                        <td className="py-3">
                          <Button size="sm" onClick={() => navigate('/consultation')}>
                            Start Consultation
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Follow-Ups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="pb-3 font-medium">Patient</th>
                      <th className="pb-3 font-medium">Doctor</th>
                      <th className="pb-3 font-medium">Time</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todaysFollowUps.map((fu) => {
                      const patient = getPatientById(fu.patientId)
                      return (
                        <tr key={fu.id} className="border-b border-border/50 last:border-0">
                          <td className="py-3 font-medium">{patient?.name}</td>
                          <td className="py-3 text-muted-foreground">
                            {getDoctorById(fu.doctorId)?.name}
                          </td>
                          <td className="py-3">{formatTime(fu.time)}</td>
                          <td className="py-3"><FollowUpStatusBadge status={fu.status} /></td>
                          <td className="py-3">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">Complete</Button>
                              <Button variant="outline" size="sm">Reschedule</Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed activities={activities} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
