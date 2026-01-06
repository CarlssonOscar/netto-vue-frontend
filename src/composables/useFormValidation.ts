import { computed, type Ref } from 'vue'

interface ValidationFields {
  municipalityId: Ref<string>
  grossMonthlySalary: Ref<number | null>
  compareMode: Ref<boolean>
  compareMunicipalityId: Ref<string>
}

export interface ValidationErrors {
  municipality: string | null
  salary: string | null
  compareMunicipality: string | null
}

/**
 * Composable for form validation in the tax calculator
 * Provides reactive validation state for required fields
 */
export function useFormValidation(fields: ValidationFields) {
  const validationErrors = computed<ValidationErrors>(() => ({
    municipality: !fields.municipalityId.value ? 'Required field' : null,
    salary: !fields.grossMonthlySalary.value || fields.grossMonthlySalary.value <= 0 
      ? 'Required field' 
      : null,
    compareMunicipality: fields.compareMode.value && !fields.compareMunicipalityId.value 
      ? 'Required field' 
      : null
  }))

  const isValid = computed(() => {
    const baseValid = fields.municipalityId.value && 
                      fields.grossMonthlySalary.value && 
                      fields.grossMonthlySalary.value > 0
    if (fields.compareMode.value) {
      return baseValid && !!fields.compareMunicipalityId.value
    }
    return !!baseValid
  })

  return { validationErrors, isValid }
}
