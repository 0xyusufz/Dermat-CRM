import { useQuery } from '@tanstack/react-query'
import { fetchDashboard } from '@/api/dashboardApi'

export const DASHBOARD_QUERY_KEY = ['dashboard'] as const

export function useDashboard() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: fetchDashboard,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 1,
  })
}
