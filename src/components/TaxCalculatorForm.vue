<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import InputText from 'primevue/inputtext'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Message from 'primevue/message'
import Divider from 'primevue/divider'
import RegionSelect from './RegionSelect.vue'
import MunicipalitySelect from './MunicipalitySelect.vue'
import { useFormValidation } from '@/composables/useFormValidation'
import type { TaxRequest } from '@/types/tax'

const props = defineProps<{
  loading?: boolean
  error?: string | null
  hasResult?: boolean
}>()

const emit = defineEmits<{
  submit: [request: TaxRequest, compareRequest?: TaxRequest]
  reset: []
}>()

// Form state
const selectedRegionId = ref<string | null>(null)
const municipalityId = ref('')
const salaryInput = ref('')
const churchMember = ref(false)
const isPensioner = ref(false)

// Format salary input with Swedish thousand separators
const formatSalaryInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  // Get cursor position before formatting
  const cursorPos = input.selectionStart || 0
  const oldLength = input.value.length
  
  // Remove all non-digits
  const digits = input.value.replace(/\D/g, '')
  
  // Format with thousand separators
  if (digits) {
    const formatted = parseInt(digits, 10).toLocaleString('sv-SE')
    salaryInput.value = formatted
    
    // Adjust cursor position after formatting
    const newLength = formatted.length
    const diff = newLength - oldLength
    const newCursorPos = Math.max(0, cursorPos + diff)
    
    // Set cursor position after Vue updates the DOM
    requestAnimationFrame(() => {
      input.setSelectionRange(newCursorPos, newCursorPos)
    })
  } else {
    salaryInput.value = ''
  }
}

// Prevent non-numeric input
const handleKeydown = (event: KeyboardEvent) => {
  // Allow: backspace, delete, tab, escape, enter, arrows, home, end
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
  if (allowedKeys.includes(event.key)) {
    return
  }
  // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
  if (event.ctrlKey && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) {
    return
  }
  // Block non-numeric keys
  if (!/^\d$/.test(event.key)) {
    event.preventDefault()
  }
}

// Get the numeric value for API calls
const grossMonthlySalary = computed(() => {
  const digits = salaryInput.value.replace(/\D/g, '')
  return digits ? parseInt(digits, 10) : null
})

// Compare mode state
const compareMode = ref(false)
const compareRegionId = ref<string | null>(null)
const compareMunicipalityId = ref('')

// Reset compare municipality when compareMode is disabled
watch(compareMode, (enabled) => {
  if (!enabled) {
    compareRegionId.value = null
    compareMunicipalityId.value = ''
  }
})

// Tracks if user has attempted form submission
const submitted = ref(false)

// Form validation
const { validationErrors, isValid } = useFormValidation({
  municipalityId,
  grossMonthlySalary,
  compareMode,
  compareMunicipalityId
})

const handleReset = () => {
  emit('reset')
  submitted.value = false
  // Clear all form fields
  selectedRegionId.value = null
  municipalityId.value = ''
  salaryInput.value = ''
  churchMember.value = false
  isPensioner.value = false
  compareMode.value = false
  compareRegionId.value = null
  compareMunicipalityId.value = ''
}

const handleSubmit = () => {
  submitted.value = true
  
  if (!isValid.value || !grossMonthlySalary.value) return

  const baseRequest: TaxRequest = {
    municipalityId: municipalityId.value,
    grossMonthlySalary: grossMonthlySalary.value,
    churchMember: churchMember.value,
    isPensioner: isPensioner.value
  }

  if (compareMode.value && compareMunicipalityId.value) {
    emit('submit', baseRequest, {
      ...baseRequest,
      municipalityId: compareMunicipalityId.value
    })
  } else {
    emit('submit', baseRequest)
  }
}
</script>

<template>
  <Card class="calc-card" :class="{ 'calc-card-expanded': compareMode }">
    <template #title>Beräkna nettolön</template>
    <template #content>
      <form @submit.prevent="handleSubmit" class="form-content">
        <RegionSelect 
          v-model="selectedRegionId" 
          :disabled="hasResult"
          aria-label="Välj region"
        />

        <MunicipalitySelect 
          v-model="municipalityId" 
          :region-id="selectedRegionId"
          :placeholder="submitted && validationErrors.municipality ? 'Sök kommun *' : 'Sök kommun...'"
          :class="{ 'p-invalid': submitted && validationErrors.municipality }"
          :disabled="hasResult"
          aria-label="Välj kommun"
        />

        <InputText
          v-model="salaryInput"
          @input="formatSalaryInput"
          @keydown="handleKeydown"
          :placeholder="submitted && validationErrors.salary ? 'Bruttolön per månad (SEK) *' : 'Bruttolön per månad (SEK)'"
          class="w-full salary-input"
          :class="{ 'p-invalid': submitted && validationErrors.salary }"
          :disabled="hasResult"
          inputmode="numeric"
          aria-label="Bruttolön per månad i svenska kronor"
        />

        <div class="checkbox-group">
          <div class="checkbox-item">
            <Checkbox v-model="churchMember" :binary="true" inputId="churchMember" :disabled="hasResult" />
            <label for="churchMember">Medlem i Svenska kyrkan</label>
          </div>
          <div class="checkbox-item">
            <Checkbox v-model="isPensioner" :binary="true" inputId="isPensioner" :disabled="hasResult" />
            <label for="isPensioner">Pensionär</label>
          </div>
          <div class="checkbox-item">
            <Checkbox v-model="compareMode" :binary="true" inputId="compareMode" :disabled="hasResult" />
            <label for="compareMode">Jämför med annan kommun</label>
          </div>
        </div>

        <!-- Compare section -->
        <template v-if="compareMode">
          <Divider />
          <div class="compare-section">
            <span class="compare-label">Jämför med:</span>
            <RegionSelect 
              v-model="compareRegionId" 
              :disabled="hasResult"
              placeholder="Sök region..."
              aria-label="Välj region för jämförelse"
            />
            <MunicipalitySelect 
              v-model="compareMunicipalityId" 
              :region-id="compareRegionId"
              :placeholder="submitted && validationErrors.compareMunicipality ? 'Sök kommun *' : 'Sök kommun...'"
              :class="{ 'p-invalid': submitted && validationErrors.compareMunicipality }"
              :disabled="hasResult"
              aria-label="Välj kommun för jämförelse"
            />
          </div>
        </template>

        <Message v-if="error" severity="error" :closable="false">{{ error }}</Message>

        <Button
          v-if="!hasResult"
          type="submit"
          label="Beräkna nettolön"
          :loading="loading"
          :outlined="!isValid"
          class="submit-btn"
        />
        <Button
          v-else
          type="button"
          label="Beräkna ny nettolön"
          @click="handleReset"
          class="submit-btn"
        />
      </form>
    </template>
  </Card>
</template>

<style scoped>
/* Base card styling */
.calc-card {
  width: 360px;
  height: 410px;
  flex-shrink: 0;
  border-radius: 20px !important;
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.calc-card-expanded {
  height: auto;
  min-height: 410px;
}

.calc-card :deep(.p-card) {
  border-radius: 20px;
  overflow: hidden;
  background: #ffffff;
}

.calc-card :deep(.p-card-body) {
  height: 100%;
  background: #ffffff;
  padding: 1.5rem 2rem;
  border-radius: 20px;
}

.calc-card :deep(.p-card-title) {
  font-size: 1.25rem;
  color: #333333;
  margin-bottom: 1rem;
}

.calc-card :deep(.p-card-content) {
  color: #333333;
}

/* Form layout */
.form-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Underline style for inputs */
.form-content :deep(.p-inputtext:not(.salary-input)),
.form-content :deep(.p-select),
.form-content :deep(.p-autocomplete-input) {
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0;
  padding: 0.5rem 0;
  color: #333333;
}

/* Full border style for salary input */
.form-content :deep(.salary-input) {
  background: transparent !important;
  border: 1px solid rgba(0, 0, 0, 0.2) !important;
  border-radius: 6px !important;
  padding: 0.5rem !important;
  color: #333333;
}

.form-content :deep(.salary-input:focus),
.form-content :deep(.salary-input:hover) {
  background: transparent !important;
  box-shadow: none !important;
  outline: none !important;
  border-color: rgba(0, 0, 0, 0.4) !important;
}

.form-content :deep(.p-autocomplete) {
  background: transparent;
}

.form-content :deep(.p-autocomplete-dropdown) {
  background: transparent !important;
  background-color: transparent !important;
  border: none !important;
}

.form-content :deep(.p-autocomplete-dropdown .p-icon) {
  transform: rotate(90deg);
  transition: transform 0.3s ease;
}

.form-content :deep(.p-autocomplete-dropdown[aria-expanded='true'] .p-icon) {
  transform: rotate(0deg);
}

.form-content :deep(.p-autocomplete-dropdown:not(:disabled):active),
.form-content :deep(.p-autocomplete-dropdown:not(:disabled):hover),
.form-content :deep(.p-autocomplete-dropdown:not(:disabled):focus) {
  background: transparent !important;
  background-color: transparent !important;
}

.form-content :deep(.p-autocomplete-input-multiple),
.form-content :deep(.p-autocomplete > .p-inputtext) {
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  padding: 0.5rem;
}

.form-content :deep(.p-inputtext:not(.p-inputnumber-input):hover),
.form-content :deep(.p-select:hover),
.form-content :deep(.p-autocomplete:hover .p-inputtext) {
  border-bottom-color: rgba(0, 0, 0, 0.4);
}

/* Checkbox group */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-item label {
  color: rgba(0, 0, 0, 0.6);
  cursor: pointer;
  font-size: 0.9rem;
}

/* Submit button */
.submit-btn {
  margin-top: 0.5rem;
  align-self: center;
}

/* Filled button - same color as app bar title */
.submit-btn:deep(.p-button:not(.p-button-outlined)) {
  background: #eb8b10 !important;
  border-color: #eb8b10 !important;
}

/* Outlined button styling - same color as app bar title */
.submit-btn:deep(.p-button-outlined),
.form-content :deep(.p-button-outlined) {
  border-width: 2px !important;
  border-color: #eb8b10 !important;
  color: #eb8b10 !important;
  background: transparent !important;
}

/* Outlined button hover - becomes filled like regular button */
.submit-btn:deep(.p-button-outlined:hover),
.form-content :deep(.p-button-outlined:hover) {
  background: var(--p-primary-color) !important;
  border-color: var(--p-primary-color) !important;
  color: #ffffff !important;
}

/* Regular button hover - slightly lighter */
.submit-btn:deep(.p-button:not(.p-button-outlined):hover),
.form-content :deep(.p-button:not(.p-button-outlined):hover) {
  filter: brightness(1.1);
}

/* Validation error styles */
.form-content :deep(.p-invalid .p-inputtext),
.form-content :deep(.p-invalid .p-autocomplete-input) {
  border-bottom-color: var(--p-red-500) !important;
}

.form-content :deep(.p-invalid.p-autocomplete > .p-inputtext),
.form-content :deep(.p-invalid .p-autocomplete > .p-inputtext) {
  border-color: var(--p-red-500) !important;
}

.form-content :deep(.p-invalid .p-autocomplete-dropdown .p-icon) {
  color: var(--p-red-500) !important;
}

.form-content :deep(.p-invalid .p-inputtext::placeholder),
.form-content :deep(.p-invalid .p-autocomplete-input::placeholder) {
  color: var(--p-red-500) !important;
}

/* Compare section */
.compare-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.compare-label {
  font-size: 0.9rem;
  color: #333333;
  font-weight: 500;
}

/* Orange checkboxes when disabled and CHECKED */
.checkbox-group :deep(.p-checkbox.p-disabled.p-checkbox-checked .p-checkbox-box) {
  background: #eb8b10 !important;
  border-color: #eb8b10 !important;
  opacity: 1 !important;
}

.checkbox-group :deep(.p-checkbox.p-disabled.p-checkbox-checked .p-checkbox-box .p-checkbox-icon),
.checkbox-group :deep(.p-checkbox.p-disabled.p-checkbox-checked .p-checkbox-box svg),
.checkbox-group :deep(.p-checkbox.p-disabled.p-checkbox-checked .p-checkbox-box .p-icon) {
  color: #ffffff !important;
  fill: #ffffff !important;
  stroke: #ffffff !important;
}

/* Unchecked disabled checkboxes - white */
.checkbox-group :deep(.p-checkbox.p-disabled:not(.p-checkbox-checked) .p-checkbox-box) {
  background: #ffffff !important;
  border-color: rgba(0, 0, 0, 0.2) !important;
  opacity: 1 !important;
}

.checkbox-group :deep(.p-checkbox.p-disabled + label) {
  color: #333333 !important;
  opacity: 1 !important;
}
</style>
