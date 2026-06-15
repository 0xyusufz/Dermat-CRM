import {
  AlertCircle,
  CalendarCheck,
  ClipboardList,
  Pill,
  Stethoscope,
  Users,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { kpiSparklines } from '@/data/mockData'
import type { DashboardCards } from '@/api/types'

interface StatsCardsProps {
  cards: DashboardCards
}

export function StatsCards({ cards }: StatsCardsProps) {
  const navigate = useNavigate()

  const kpis = [
    {
      label: 'Total Patients',
      value: cards.totalPatients,
      trend: 12,
      sparkline: kpiSparklines.totalPatients,
      icon: <Users className="h-5 w-5 text-blue-600" />,
      iconBg: 'bg-blue-50 dark:bg-blue-950',
      onClick: () => navigate('/patients'),
    },
    {
      label: 'Consultation Pending',
      value: cards.consultationPending,
      trend: -5,
      sparkline: kpiSparklines.consultationPending,
      icon: <ClipboardList className="h-5 w-5 text-amber-600" />,
      iconBg: 'bg-amber-50 dark:bg-amber-950',
      onClick: () => navigate('/patients?status=Registered'),
    },
    {
      label: 'Active Patients',
      value: cards.activePatients,
      trend: 8,
      sparkline: kpiSparklines.activePatients,
      icon: <Stethoscope className="h-5 w-5 text-emerald-600" />,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950',
      onClick: () => navigate('/patients/active'),
    },
    {
      label: "Today's Follow-Ups",
      value: cards.todayFollowups,
      trend: 15,
      sparkline: kpiSparklines.todaysFollowUps,
      icon: <CalendarCheck className="h-5 w-5 text-indigo-600" />,
      iconBg: 'bg-indigo-50 dark:bg-indigo-950',
      onClick: () => navigate('/follow-ups/today'),
    },
    {
      label: 'Missed Follow-Ups',
      value: cards.missedFollowups,
      trend: -3,
      sparkline: kpiSparklines.missedFollowUps,
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      iconBg: 'bg-red-50 dark:bg-red-950',
      onClick: () => navigate('/follow-ups/missed'),
    },
    {
      label: 'Active Prescriptions',
      value: cards.activePrescriptions,
      trend: 6,
      sparkline: kpiSparklines.activePrescriptions,
      icon: <Pill className="h-5 w-5 text-purple-600" />,
      iconBg: 'bg-purple-50 dark:bg-purple-950',
      onClick: () => navigate('/prescriptions/active'),
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 mb-8">
      {kpis.map((kpi, i) => (
        <KpiCard key={kpi.label} {...kpi} delay={i * 0.05} />
      ))}
    </div>
  )
}
