<script setup lang="ts">
import { ref, computed } from 'vue'
import InputNumber from 'primevue/inputnumber'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Message from 'primevue/message'
import SelectButton from 'primevue/selectbutton'
import RegionSelect from './RegionSelect.vue'
import MunicipalitySelect from './MunicipalitySelect.vue'
import { useTaxCalculation } from '@/composables/useTaxCalculation'
import type { TaxRequest } from '@/types/tax'

const { result, loading, error, calculate } = useTaxCalculation()

const selectedRegionId = ref<string | null>(null)
const municipalityId = ref('')
const grossMonthlySalary = ref<number | null>(null)
const churchMember = ref(false)
const isPensioner = ref(false)

const viewOptions = [
  { label: 'Månad', value: 'month' },
  { label: 'År', value: 'year' }
]
const selectedViews = ref(['month', 'year'])

const isValid = computed(() => {
  return municipalityId.value && grossMonthlySalary.value && grossMonthlySalary.value > 0
})

const handleSubmit = () => {
  if (!isValid.value || !grossMonthlySalary.value) return

  calculate({
    municipalityId: municipalityId.value,
    grossMonthlySalary: grossMonthlySalary.value,
    churchMember: churchMember.value,
    isPensioner: isPensioner.value
  })
}

const formatCurrency = (value: number | undefined) => {
  if (value === undefined || value === null) return '0'
  return value.toLocaleString('sv-SE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

const formatPercent = (value: number | undefined) => {
  if (value === undefined || value === null) return '0,00'
  return value.toLocaleString('sv-SE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
</script>

<template>
  <div class="calculator-container">
    <!-- Input Card -->
    <Card class="calc-card">
      <template #title>Beräkna nettolön</template>
      <template #content>
        <form @submit.prevent="handleSubmit" class="form-content">
          <RegionSelect v-model="selectedRegionId" />

          <MunicipalitySelect v-model="municipalityId" :region-id="selectedRegionId" />

          <InputNumber
            v-model="grossMonthlySalary"
            :min="0"
            :max="10000000"
            placeholder="Bruttolön per månad (SEK)"
            class="w-full"
            locale="sv-SE"
            :maxFractionDigits="0"
          />

          <div class="checkbox-group">
            <div class="checkbox-item">
              <Checkbox v-model="churchMember" :binary="true" inputId="churchMember" />
              <label for="churchMember">Medlem i Svenska kyrkan</label>
            </div>
            <div class="checkbox-item">
              <Checkbox v-model="isPensioner" :binary="true" inputId="isPensioner" />
              <label for="isPensioner">Pensionär</label>
            </div>
          </div>

          <Message v-if="error" severity="error" :closable="false">{{ error }}</Message>

          <Button
            type="submit"
            label="Beräkna nettolön"
            :loading="loading"
            :disabled="!isValid"
            class="submit-btn"
          />
        </form>
      </template>
    </Card>

    <!-- Result Cards -->
    <template v-if="result">
      <Card class="calc-card">
        <template #title>Per månad</template>
        <template #content>
          <div class="result-content">
            <div class="result-highlight">
              <span>Nettolön</span>
              <span class="highlight-value">{{ formatCurrency(result.monthlyNetSalary) }} kr</span>
            </div>
            <Divider />
            <div class="result-row">
              <span>Bruttolön</span>
              <span>{{ formatCurrency(result.grossMonthlySalary) }} kr</span>
            </div>
            <div class="result-row">
              <span>Kommunalskatt</span>
              <span class="deduction">-{{ formatCurrency(result.municipalTax / 12) }} kr</span>
            </div>
            <div class="result-row">
              <span>Regionskatt</span>
              <span class="deduction">-{{ formatCurrency(result.regionalTax / 12) }} kr</span>
            </div>
            <div v-if="result.stateTax > 0" class="result-row">
              <span>Statlig skatt</span>
              <span class="deduction">-{{ formatCurrency(result.stateTax / 12) }} kr</span>
            </div>
            <div class="result-row">
              <span>Begravningsavgift</span>
              <span class="deduction">-{{ formatCurrency(result.burialFee / 12) }} kr</span>
            </div>
            <div v-if="result.churchFee > 0" class="result-row">
              <span>Kyrkoavgift</span>
              <span class="deduction">-{{ formatCurrency(result.churchFee / 12) }} kr</span>
            </div>
            <div class="result-row">
              <span>Jobbskatteavdrag</span>
              <span class="addition">+{{ formatCurrency(result.jobTaxCredit / 12) }} kr</span>
            </div>
            <Divider />
            <div class="result-row">
              <span>Effektiv skatt</span>
              <span>{{ formatPercent(result.effectiveTaxRate) }}%</span>
            </div>
          </div>
        </template>
      </Card>

      <Card class="calc-card">
        <template #title>Per år</template>
        <template #content>
          <div class="result-content">
            <div class="result-highlight">
              <span>Nettolön</span>
              <span class="highlight-value">{{ formatCurrency(result.yearlyNetSalary) }} kr</span>
            </div>
            <Divider />
            <div class="result-row">
              <span>Bruttolön</span>
              <span>{{ formatCurrency(result.grossYearlySalary) }} kr</span>
            </div>
            <div class="result-row">
              <span>Kommunalskatt ({{ formatPercent(result.municipalTaxRate) }}%)</span>
              <span class="deduction">-{{ formatCurrency(result.municipalTax) }} kr</span>
            </div>
            <div class="result-row">
              <span>Regionskatt ({{ formatPercent(result.regionalTaxRate) }}%)</span>
              <span class="deduction">-{{ formatCurrency(result.regionalTax) }} kr</span>
            </div>
            <div v-if="result.stateTax > 0" class="result-row">
              <span>Statlig skatt</span>
              <span class="deduction">-{{ formatCurrency(result.stateTax) }} kr</span>
            </div>
            <div class="result-row">
              <span>Begravningsavgift</span>
              <span class="deduction">-{{ formatCurrency(result.burialFee) }} kr</span>
            </div>
            <div v-if="result.churchFee > 0" class="result-row">
              <span>Kyrkoavgift</span>
              <span class="deduction">-{{ formatCurrency(result.churchFee) }} kr</span>
            </div>
            <div class="result-row">
              <span>Grundavdrag</span>
              <span>{{ formatCurrency(result.basicDeduction) }} kr</span>
            </div>
            <div class="result-row">
              <span>Jobbskatteavdrag</span>
              <span class="addition">+{{ formatCurrency(result.jobTaxCredit) }} kr</span>
            </div>
            <Divider />
            <div class="result-row">
              <span>Total skatt</span>
              <span>{{ formatCurrency(result.totalTaxAfterCredit) }} kr</span>
            </div>
            <div class="result-row">
              <span>Effektiv skatt</span>
              <span>{{ formatPercent(result.effectiveTaxRate) }}%</span>
            </div>
          </div>
        </template>
      </Card>
    </template>
  </div>
</template>

<style scoped>
.calculator-container {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  align-items: stretch;
}

.calc-card {
  width: 380px;
  height: 380px;
  flex-shrink: 0;
  border-radius: 20px !important;
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
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

/* Underline style for inputs */
.form-content :deep(.p-inputtext),
.form-content :deep(.p-select),
.form-content :deep(.p-autocomplete-input) {
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0;
  padding: 0.5rem 0;
  color: #333333;
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
  transition: transform 0.3s ease;
}

.form-content :deep(.p-autocomplete-dropdown[aria-expanded='true'] .p-icon) {
  transform: rotate(180deg);
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

.form-content :deep(.p-inputtext:hover),
.form-content :deep(.p-select:hover),
.form-content :deep(.p-autocomplete:hover .p-inputtext) {
  border-bottom-color: rgba(0, 0, 0, 0.4);
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

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

.submit-btn {
  margin-top: 0.5rem;
  align-self: center;
  background: #f5b800 !important;
  border-color: #f5b800 !important;
}

.submit-btn:hover:not(:disabled) {
  background: #daa600 !important;
  border-color: #daa600 !important;
}

.submit-btn:disabled {
  background: #f5b800 !important;
  border-color: #f5b800 !important;
  opacity: 0.9;
}

.view-toggle {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.result-highlight {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 2px solid #f5b800;
  margin-bottom: 0.25rem;
  color: #f5b800;
  opacity: 1;
}

.highlight-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #f5b800;
}

.result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.1rem 0;
  font-size: 0.9rem;
}

.result-row span:first-child {
  color: rgba(0, 0, 0, 0.6);
}

.result-row span:last-child {
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.deduction {
  color: #ef4444;
}

.addition {
  color: #22c55e;
}

@media (max-width: 1100px) {
  .calculator-container {
    flex-wrap: wrap;
  }

  .calc-card {
    width: 320px;
  }
}

@media (max-width: 700px) {
  .calculator-container {
    flex-direction: column;
    align-items: center;
  }

  .calc-card {
    width: 100%;
    max-width: 400px;
  }
}
</style>
