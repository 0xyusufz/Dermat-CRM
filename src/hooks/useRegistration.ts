import { useMemo, useState } from 'react'
import { useDashboard } from '@/hooks/useDashboard'
import { useWorkflowTransaction } from '@/hooks/useWorkflowTransaction'
import {
  registerPatient,
  type RegistrationRequest,
  type RegistrationResponseData,
} from '@/services/registrationApi'
import { formatDisplayName } from '@/lib/patientDisplayFormat'
import { formatRegistrationSuccessLines } from '@/utils/formatters'
import {
  isRegistrationFormValid,
  normalizeWhatsAppDigits,
  validateRegistrationForm,
  type RegistrationFormValues,
} from '@/utils/validators'

export const REGISTRATION_WORKFLOW_STEPS = [
  'Creating Patient Record',
  'Creating Timeline',
  'Sending WhatsApp',
  'Finalizing Registration',
] as const

const EMPTY_FORM: RegistrationFormValues = {
  fullName: '',
  age: '',
  gender: '',
  whatsapp: '',
  address: '',
  doctorName: '',
}

export function useRegistration() {
  const [form, setForm] = useState<RegistrationFormValues>(EMPTY_FORM)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const { data: dashboard } = useDashboard()
  const transaction = useWorkflowTransaction()

  const doctorNames = useMemo(() => {
    const fromIndex = dashboard?.patientSearchIndex?.map((p) => p.doctor) ?? []
    return [...new Set(fromIndex.filter(Boolean))].sort((a, b) => a.localeCompare(b))
  }, [dashboard?.patientSearchIndex])

  const errors = useMemo(() => {
    const all = validateRegistrationForm(form)
    const visible: ReturnType<typeof validateRegistrationForm> = {}
    for (const key of Object.keys(all) as Array<keyof RegistrationFormValues>) {
      if (touched[key]) visible[key] = all[key]
    }
    return visible
  }, [form, touched])

  const isValid = isRegistrationFormValid(form)

  const updateField = (field: keyof RegistrationFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const markTouched = (field: keyof RegistrationFormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const buildPayload = (): RegistrationRequest => ({
    'Full Name': form.fullName.trim(),
    Age: Number(form.age),
    Gender: form.gender,
    'Whatsapp Number': normalizeWhatsAppDigits(form.whatsapp),
    Address: form.address.trim(),
    'Doctor Name': form.doctorName,
  })

  const submit = async () => {
    const validationErrors = validateRegistrationForm(form)
    if (Object.keys(validationErrors).length > 0) return

    await transaction.execute<RegistrationResponseData>({
      steps: [...REGISTRATION_WORKFLOW_STEPS],
      apiCall: () => registerPatient(buildPayload()),
      buildSuccess: (data) => ({
        title: 'Patient Registered Successfully',
        lines: formatRegistrationSuccessLines(data),
      }),
      buildLateNotification: (data) => ({
        title: 'Recent Registration Completed',
        lines: [
          { label: 'Patient', value: data.patient.code },
          { label: 'Name', value: formatDisplayName(data.patient.name) },
        ],
      }),
    })
  }

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setTouched({})
    transaction.clearStates()
  }

  return {
    form,
    errors,
    touched,
    isValid,
    doctorNames,
    updateField,
    markTouched,
    setTouchedAll: () =>
      setTouched({
        fullName: true,
        age: true,
        gender: true,
        whatsapp: true,
        address: true,
        doctorName: true,
      }),
    submit,
    resetForm,
    ...transaction,
  }
}
