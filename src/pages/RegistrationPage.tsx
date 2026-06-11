import { UserPlus } from 'lucide-react'
import { WorkflowProgress } from '@/components/WorkflowProgress'
import { PageHeader } from '@/components/shared/PageHeader'
import { TransactionResultCard } from '@/components/shared/TransactionResultCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { doctors } from '@/data/mockData'
import { REGISTRATION_WORKFLOW_STEPS, useRegistration } from '@/hooks/useRegistration'
import { cn } from '@/lib/utils'

export function RegistrationPage() {
  const {
    form,
    errors,
    isValid,
    doctorNames,
    updateField,
    markTouched,
    setTouchedAll,
    submit,
    resetForm,
    isRunning,
    success,
    error,
    timeoutNotice,
  } = useRegistration()

  const allDoctorNames = [
    ...new Set([...doctorNames, ...doctors.map((d) => d.name)]),
  ].sort((a, b) => a.localeCompare(b))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouchedAll()
    submit()
  }

  if (success) {
    return (
      <TransactionResultCard
        variant="success"
        title={success.title}
        lines={success.lines}
        primaryAction={{ label: 'Register Another Patient', onClick: resetForm }}
      />
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="New Registration"
        description="Register a new patient to the clinic management system."
      />

      {error && !error.isTimeout && (
        <div className="mb-6 rounded-2xl border border-danger/30 bg-danger/5 p-4">
          <p className="font-semibold text-danger">{error.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
        </div>
      )}

      {timeoutNotice && (
        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
          <p className="font-semibold text-amber-700 dark:text-amber-400">
            Processing Taking Longer Than Expected
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            We&apos;ll notify you if the workflow completes.
          </p>
        </div>
      )}

      {isRunning && (
        <div className="mb-6">
          <WorkflowProgress steps={[...REGISTRATION_WORKFLOW_STEPS]} title="Registering Patient" />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                onBlur={() => markTouched('fullName')}
                error={!!errors.fullName}
                placeholder="Enter patient's full name"
                className="mt-1.5"
                disabled={isRunning}
              />
              {errors.fullName && <p className="mt-1 text-xs text-danger">{errors.fullName}</p>}
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={form.age}
                onChange={(e) => updateField('age', e.target.value)}
                onBlur={() => markTouched('age')}
                error={!!errors.age}
                placeholder="Age"
                className="mt-1.5"
                disabled={isRunning}
              />
              {errors.age && <p className="mt-1 text-xs text-danger">{errors.age}</p>}
            </div>
            <div>
              <Label>Gender</Label>
              <Select
                value={form.gender}
                onValueChange={(v) => updateField('gender', v)}
                disabled={isRunning}
              >
                <SelectTrigger className={cn('mt-1.5', errors.gender && 'border-danger')}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="mt-1 text-xs text-danger">{errors.gender}</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contact & Assignment</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input
                id="whatsapp"
                value={form.whatsapp}
                onChange={(e) => updateField('whatsapp', e.target.value)}
                onBlur={() => markTouched('whatsapp')}
                error={!!errors.whatsapp}
                placeholder="10-digit number"
                className="mt-1.5"
                disabled={isRunning}
              />
              {errors.whatsapp && <p className="mt-1 text-xs text-danger">{errors.whatsapp}</p>}
            </div>
            <div>
              <Label>Assigned Doctor</Label>
              <Select
                value={form.doctorName}
                onValueChange={(v) => updateField('doctorName', v)}
                disabled={isRunning}
              >
                <SelectTrigger className={cn('mt-1.5', errors.doctorName && 'border-danger')}>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {allDoctorNames.map((name) => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.doctorName && (
                <p className="mt-1 text-xs text-danger">{errors.doctorName}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
                onBlur={() => markTouched('address')}
                error={!!errors.address}
                placeholder="Full address"
                className="mt-1.5"
                disabled={isRunning}
              />
              {errors.address && <p className="mt-1 text-xs text-danger">{errors.address}</p>}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" disabled={isRunning}>Cancel</Button>
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            disabled={!isValid || isRunning}
          >
            Register Patient
          </Button>
        </div>
      </form>
    </div>
  )
}
