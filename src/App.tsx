import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AllPatientsPage } from '@/pages/AllPatientsPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { ConsultationPage } from '@/pages/ConsultationPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { FollowUpsPage } from '@/pages/FollowUpsPage'
import { PatientProfilePage } from '@/pages/PatientProfilePage'
import { PrescriptionsPage } from '@/pages/PrescriptionsPage'
import { RegistrationPage } from '@/pages/RegistrationPage'
import { SettingsPage } from '@/pages/SettingsPage'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="registration" element={<RegistrationPage />} />
            <Route path="consultation" element={<ConsultationPage />} />
            <Route path="consultation/:patientId" element={<ConsultationPage />} />
            <Route path="patients" element={<AllPatientsPage />} />
            <Route path="patients/active" element={<AllPatientsPage filterActive />} />
            <Route path="patients/:id" element={<PatientProfilePage />} />
            <Route path="prescriptions/active" element={<PrescriptionsPage />} />
            <Route path="prescriptions/completed" element={<PrescriptionsPage completed />} />
            <Route path="follow-ups/today" element={<FollowUpsPage filter="today" />} />
            <Route path="follow-ups/upcoming" element={<FollowUpsPage filter="upcoming" />} />
            <Route path="follow-ups/missed" element={<FollowUpsPage filter="missed" />} />
            <Route path="follow-ups/completed" element={<FollowUpsPage filter="completed" />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
