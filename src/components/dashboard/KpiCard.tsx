import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SparklineProps {
  data: number[]
  color?: string
  className?: string
}

export function Sparkline({ data, color = '#6366f1', className }: SparklineProps) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const width = 80
  const height = 32
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((v - min) / range) * (height - 4) - 2
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width={width} height={height} className={cn('overflow-visible', className)}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        opacity={0.8}
      />
    </svg>
  )
}

interface KpiCardProps {
  label: string
  value: number
  trend: number
  sparkline: number[]
  icon: ReactNode
  iconBg: string
  delay?: number
}

export function KpiCard({ label, value, trend, sparkline, icon, iconBg, delay = 0 }: KpiCardProps) {
  const isPositive = trend >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="rounded-2xl border border-border bg-card p-5 card-shadow transition-shadow hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', iconBg)}>
          {icon}
        </div>
        <Sparkline data={sparkline} />
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="mt-1 flex items-end gap-2">
          <span className="text-3xl font-bold tracking-tight">{value}</span>
          <span
            className={cn(
              'mb-1 flex items-center gap-0.5 text-xs font-medium',
              isPositive ? 'text-emerald-600' : 'text-red-500'
            )}
          >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(trend)}%
          </span>
        </div>
      </div>
    </motion.div>
  )
}
