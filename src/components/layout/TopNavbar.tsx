import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Bell, Menu, Moon, Plus, Sun, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { GlobalPatientSearch } from '@/components/search/GlobalPatientSearch'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/contexts/ThemeContext'
import { useDashboard } from '@/hooks/useDashboard'

const notifications = [
  { id: 1, title: 'Follow-up reminder', message: '5 follow-ups scheduled for today', time: '2m ago' },
  { id: 2, title: 'New registration', message: 'Md Yusuf Fatah registered', time: '15m ago' },
  { id: 3, title: 'Prescription expiring', message: 'RX-3012 expires in 3 days', time: '1h ago' },
]

export function TopNavbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const { data, isLoading } = useDashboard()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border glass px-4 sm:gap-4 sm:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden shrink-0" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      <GlobalPatientSearch
        patientSearchIndex={data?.patientSearchIndex}
        isIndexLoading={isLoading}
      />

      <div className="flex items-center gap-2">
        <Button
          variant="gradient"
          size="sm"
          className="hidden sm:inline-flex"
          onClick={() => navigate('/registration')}
        >
          <Plus className="h-4 w-4" />
          Quick Action
        </Button>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 w-80 rounded-2xl border border-border bg-card p-2 shadow-xl"
            >
              <div className="px-3 py-2">
                <p className="text-sm font-semibold">Notifications</p>
                <p className="text-xs text-muted-foreground">You have 3 unread notifications</p>
              </div>
              {notifications.map((n) => (
                <DropdownMenu.Item
                  key={n.id}
                  className="flex cursor-pointer flex-col gap-0.5 rounded-xl px-3 py-2.5 outline-none hover:bg-muted/60"
                >
                  <span className="text-sm font-medium">{n.title}</span>
                  <span className="text-xs text-muted-foreground">{n.message}</span>
                  <span className="text-[10px] text-muted-foreground">{n.time}</span>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <div className="hidden items-center gap-2 rounded-xl border border-border px-3 py-1.5 sm:flex">
          {isDark ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
          <Switch checked={isDark} onCheckedChange={toggleTheme} />
        </div>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-muted/60 transition-colors cursor-pointer">
              <Avatar className="h-8 w-8">
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium leading-none">Admin Manager</p>
                <p className="text-xs text-muted-foreground">Clinic Manager</p>
              </div>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 w-48 rounded-2xl border border-border bg-card p-1 shadow-xl"
            >
              <DropdownMenu.Item className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none hover:bg-muted/60">
                <User className="h-4 w-4" /> Profile
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none hover:bg-muted/60"
                onClick={() => navigate('/settings')}
              >
                Settings
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  )
}
