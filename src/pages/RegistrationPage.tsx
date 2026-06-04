import { motion } from 'framer-motion'
import { CheckCircle2, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
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
import { cn } from '@/lib/utils'

interface FormData {
  fullName: string
  age: string
  gender: string
  whatsapp: string
  address: string
  doctorId: string
}

interface FormErrors {
  fullName?: string
  age?: string
  gender?: string
  whatsapp?: string
  address?: string
  doctorId?: string
}

export function RegistrationPage() {
  const [form, setForm] = useState<FormData>({
    fullName: '',
    age: '',
    gender: '',
    whatsapp: '',
    address: '',
    doctorId: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    if (!form.fullName.trim()) e.fullName = 'Full name is required'
    if (!form.age || parseInt(form.age) < 1 || parseInt(form.age) > 120) e.age = 'Enter a valid age (1-120)'
    if (!form.gender) e.gender = 'Please select gender'
    if (!form.whatsapp.trim() || form.whatsapp.length < 10) e.whatsapp = 'Enter a valid WhatsApp number'
    if (!form.address.trim()) e.address = 'Address is required'
    if (!form.doctorId) e.doctorId = 'Please assign a doctor'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    setTouched({ fullName: true, age: true, gender: true, whatsapp: true, address: true, doctorId: true })
    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true)
    }
  }

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (touched[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-lg pt-12 text-center"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <h2 className="mt-6 text-2xl font-bold">Registration Successful</h2>
        <p className="mt-2 text-muted-foreground">
          {form.fullName} has been registered successfully. Patient ID: DERM-{Math.floor(Math.random() * 9000 + 1000)}
        </p>
        <Button className="mt-8" onClick={() => { setSubmitted(false); setForm({ fullName: '', age: '', gender: '', whatsapp: '', address: '', doctorId: '' }); setTouched({}) }}>
          Register Another Patient
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="New Registration"
        description="Register a new patient to the clinic management system."
      />

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
                onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
                error={!!errors.fullName}
                placeholder="Enter patient's full name"
                className="mt-1.5"
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
                onBlur={() => setTouched((t) => ({ ...t, age: true }))}
                error={!!errors.age}
                placeholder="Age"
                className="mt-1.5"
              />
              {errors.age && <p className="mt-1 text-xs text-danger">{errors.age}</p>}
            </div>
            <div>
              <Label>Gender</Label>
              <Select value={form.gender} onValueChange={(v) => updateField('gender', v)}>
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
                onBlur={() => setTouched((t) => ({ ...t, whatsapp: true }))}
                error={!!errors.whatsapp}
                placeholder="+91 XXXXXXXXXX"
                className="mt-1.5"
              />
              {errors.whatsapp && <p className="mt-1 text-xs text-danger">{errors.whatsapp}</p>}
            </div>
            <div>
              <Label>Assigned Doctor</Label>
              <Select value={form.doctorId} onValueChange={(v) => updateField('doctorId', v)}>
                <SelectTrigger className={cn('mt-1.5', errors.doctorId && 'border-danger')}>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.doctorId && <p className="mt-1 text-xs text-danger">{errors.doctorId}</p>}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, address: true }))}
                error={!!errors.address}
                placeholder="Full address"
                className="mt-1.5"
              />
              {errors.address && <p className="mt-1 text-xs text-danger">{errors.address}</p>}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="submit" variant="gradient" size="lg">
            Register Patient
          </Button>
        </div>
      </form>
    </div>
  )
}
