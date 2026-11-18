import type { OnboardingErrors, OnboardingField, OnboardingFields } from '../../types/onboarding'

/** What every step of the form receives. */
export interface StepProps {
  fields: OnboardingFields
  errors: OnboardingErrors
  onChange: (key: OnboardingField, value: string) => void
}

/** Id of the input for a field, used to move focus to the first mistake. */
export const fieldId = (key: OnboardingField): string => `ob-${key}`
