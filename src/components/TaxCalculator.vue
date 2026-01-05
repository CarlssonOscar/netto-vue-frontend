<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import InputNumber from 'primevue/inputnumber'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Message from 'primevue/message'
import Divider from 'primevue/divider'
import RegionSelect from './RegionSelect.vue'
import MunicipalitySelect from './MunicipalitySelect.vue'
import { useTaxCalculation } from '@/composables/useTaxCalculation'

const { result, compareResult, loading, error, calculate, reset } = useTaxCalculation()

const selectedRegionId = ref<string | null>(null)
const municipalityId = ref('')
const grossMonthlySalary = ref<number | null>(null)
const churchMember = ref(false)
const isPensioner = ref(false)

// Jämförelse-läge
const compareMode = ref(false)
const compareRegionId = ref<string | null>(null)
const compareMunicipalityId = ref('')

// Återställ jämförelsekommun när compareMode stängs av
watch(compareMode, (enabled) => {
  if (!enabled) {
    compareRegionId.value = null
    compareMunicipalityId.value = ''
  }
})

// Spårar om användaren har försökt skicka formuläret
const submitted = ref(false)

// Valideringsmeddelanden
const validationErrors = computed(() => ({
  municipality: !municipalityId.value ? 'Obligatoriskt fält' : null,
  salary: !grossMonthlySalary.value || grossMonthlySalary.value <= 0 
    ? 'Obligatoriskt fält' 
    : null,
  compareMunicipality: compareMode.value && !compareMunicipalityId.value ? 'Obligatoriskt fält' : null
}))

const isValid = computed(() => {
  const baseValid = municipalityId.value && grossMonthlySalary.value && grossMonthlySalary.value > 0
  if (compareMode.value) {
    return baseValid && compareMunicipalityId.value
  }
  return baseValid
})

const handleReset = () => {
  reset()
  submitted.value = false
  // Rensa alla formulärfält
  selectedRegionId.value = null
  municipalityId.value = ''
  grossMonthlySalary.value = null
  churchMember.value = false
  isPensioner.value = false
  compareMode.value = false
  compareRegionId.value = null
  compareMunicipalityId.value = ''
}

const handleSubmit = () => {
  submitted.value = true
  
  if (!isValid.value || !grossMonthlySalary.value) return

  const baseRequest = {
    municipalityId: municipalityId.value,
    grossMonthlySalary: grossMonthlySalary.value,
    churchMember: churchMember.value,
    isPensioner: isPensioner.value
  }

  if (compareMode.value && compareMunicipalityId.value) {
    calculate(baseRequest, {
      ...baseRequest,
      municipalityId: compareMunicipalityId.value
    })
  } else {
    calculate(baseRequest)
  }
}

// Beräkna skillnad mellan två värden
const getDiff = (val1: number, val2: number) => val1 - val2

const formatCurrency = (value: number | undefined) => {
  if (value === undefined || value === null) return '0'
  return value.toLocaleString('sv-SE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

const formatDiff = (diff: number) => {
  const prefix = diff > 0 ? '+' : ''
  return prefix + formatCurrency(diff)
}

const formatPercent = (value: number | undefined) => {
  if (value === undefined || value === null) return '0,00'
  return value.toLocaleString('sv-SE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// Formatera kommunnamn till title case (första bokstaven stor, resten små)
const formatName = (name: string): string => {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>

<template>
  <div class="calculator-container">
    <!-- Input Card -->
    <Card class="calc-card" :class="{ 'calc-card-expanded': compareMode }">
      <template #title>Beräkna nettolön</template>
      <template #content>
        <form @submit.prevent="handleSubmit" class="form-content">
          <RegionSelect 
            v-model="selectedRegionId" 
            :disabled="!!result"
            aria-label="Välj region"
          />

          <MunicipalitySelect 
            v-model="municipalityId" 
            :region-id="selectedRegionId"
            :placeholder="submitted && validationErrors.municipality ? 'Sök kommun... - obligatoriskt fält' : 'Sök kommun...'"
            :class="{ 'p-invalid': submitted && validationErrors.municipality }"
            :disabled="!!result"
            aria-label="Välj kommun"
          />

          <InputNumber
            v-model="grossMonthlySalary"
            :min="0"
            :max="10000000"
            :placeholder="submitted && validationErrors.salary ? 'Bruttolön per månad (SEK) - obligatoriskt fält' : 'Bruttolön per månad (SEK)'"
            class="w-full"
            locale="sv-SE"
            :maxFractionDigits="0"
            :class="{ 'p-invalid': submitted && validationErrors.salary }"
            :disabled="!!result"
            aria-label="Bruttolön per månad i svenska kronor"
          />

          <div class="checkbox-group">
            <div class="checkbox-item">
              <Checkbox v-model="churchMember" :binary="true" inputId="churchMember" :disabled="!!result" />
              <label for="churchMember">Medlem i Svenska kyrkan</label>
            </div>
            <div class="checkbox-item">
              <Checkbox v-model="isPensioner" :binary="true" inputId="isPensioner" :disabled="!!result" />
              <label for="isPensioner">Pensionär</label>
            </div>
            <div class="checkbox-item">
              <Checkbox v-model="compareMode" :binary="true" inputId="compareMode" :disabled="!!result" />
              <label for="compareMode">Jämför med annan kommun</label>
            </div>
          </div>

          <!-- Jämförelse-sektion -->
          <template v-if="compareMode">
            <Divider />
            <div class="compare-section">
              <span class="compare-label">Jämför med:</span>
              <RegionSelect 
                v-model="compareRegionId" 
                :disabled="!!result"
                aria-label="Välj region för jämförelse"
              />
              <MunicipalitySelect 
                v-model="compareMunicipalityId" 
                :region-id="compareRegionId"
                :placeholder="submitted && validationErrors.compareMunicipality ? 'Sök kommun... - obligatoriskt fält' : 'Sök kommun att jämföra med...'"
                :class="{ 'p-invalid': submitted && validationErrors.compareMunicipality }"
                :disabled="!!result"
                aria-label="Välj kommun för jämförelse"
              />
            </div>
          </template>

          <Message v-if="error" severity="error" :closable="false">{{ error }}</Message>

          <Button
            v-if="!result"
            type="submit"
            label="Beräkna nettolön"
            :loading="loading"
            :class="['submit-btn', { 'submit-btn-disabled': !isValid }]"
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

    <!-- Result Cards -->
    <template v-if="result">
      <Card class="calc-card" :class="{ 'calc-card-compare': compareResult }">
        <template #title>{{ compareResult ? formatName(result.municipalityName) : 'Per månad' }}</template>
        <template #content>
          <div class="result-content">
            <div class="result-highlight">
              <span>Nettolön</span>
              <span class="highlight-value">{{ formatCurrency(result.netMonthlySalary) }} kr</span>
            </div>
            <div class="result-row">
              <span>Bruttolön</span>
              <span>{{ formatCurrency(result.grossMonthlySalary) }} kr</span>
            </div>
            <div class="result-row">
              <span>Kommunalskatt ({{ formatPercent(result.municipalTaxRate * 100) }}%)</span>
              <span class="deduction"><span class="sign">−</span>{{ formatCurrency(result.yearlyMunicipalTax / 12) }} kr</span>
            </div>
            <div class="result-row">
              <span>Regionskatt ({{ formatPercent(result.regionalTaxRate * 100) }}%)</span>
              <span class="deduction"><span class="sign">−</span>{{ formatCurrency(result.yearlyRegionalTax / 12) }} kr</span>
            </div>
            <div v-if="result.yearlyStateTax > 0" class="result-row">
              <span>Statlig skatt</span>
              <span class="deduction"><span class="sign">−</span>{{ formatCurrency(result.yearlyStateTax / 12) }} kr</span>
            </div>
            <div class="result-row">
              <span>Begravningsavgift</span>
              <span class="deduction"><span class="sign">−</span>{{ formatCurrency(result.yearlyBurialFee / 12) }} kr</span>
            </div>
            <div v-if="result.yearlyChurchFee > 0" class="result-row">
              <span>Kyrkoavgift</span>
              <span class="deduction"><span class="sign">−</span>{{ formatCurrency(result.yearlyChurchFee / 12) }} kr</span>
            </div>
            <div class="result-row">
              <span>Jobbskatteavdrag</span>
              <span class="addition"><span class="sign">+</span>{{ formatCurrency(result.yearlyJobTaxCredit / 12) }} kr</span>
            </div>
            <Divider />
            <div class="result-row">
              <span>Effektiv skatt</span>
              <span>{{ formatPercent(result.effectiveTaxRate * 100) }}%</span>
            </div>
          </div>
        </template>
      </Card>

      <!-- Jämförelse-kort eller årskort -->
      <Card v-if="compareResult" class="calc-card calc-card-compare">
        <template #title>{{ formatName(compareResult.municipalityName) }}</template>
        <template #content>
          <div class="result-content">
            <div class="result-highlight">
              <span>Nettolön</span>
              <span class="highlight-value">{{ formatCurrency(compareResult.netMonthlySalary) }} kr</span>
            </div>
            <div class="result-row">
              <span>Bruttolön</span>
              <span>{{ formatCurrency(compareResult.grossMonthlySalary) }} kr</span>
            </div>
            <div class="result-row">
              <span>Kommunalskatt ({{ formatPercent(compareResult.municipalTaxRate * 100) }}%)</span>
              <span class="deduction"><span class="sign">−</span>{{ formatCurrency(compareResult.yearlyMunicipalTax / 12) }} kr</span>
            </div>
            <div class="result-row">
              <span>Regionskatt ({{ formatPercent(compareResult.regionalTaxRate * 100) }}%)</span>
              <span class="deduction"><span class="sign">−</span>{{ formatCurrency(compareResult.yearlyRegionalTax / 12) }} kr</span>
            </div>
            <div v-if="compareResult.yearlyStateTax > 0" class="result-row">
              <span>Statlig skatt</span>
              <span class="deduction"><span class="sign">−</span>{{ formatCurrency(compareResult.yearlyStateTax / 12) }} kr</span>
            </div>
            <div class="result-row">
              <span>Begravningsavgift</span>
              <span class="deduction"><span class="sign">−</span>{{ formatCurrency(compareResult.yearlyBurialFee / 12) }} kr</span>
            </div>
            <div v-if="compareResult.yearlyChurchFee > 0" class="result-row">
              <span>Kyrkoavgift</span>
              <span class="deduction"><span class="sign">−</span>{{ formatCurrency(compareResult.yearlyChurchFee / 12) }} kr</span>
            </div>
            <div class="result-row">
              <span>Jobbskatteavdrag</span>
              <span class="addition"><span class="sign">+</span>{{ formatCurrency(compareResult.yearlyJobTaxCredit / 12) }} kr</span>
            </div>
            <Divider />
            <div class="result-row">
              <span>Effektiv skatt</span>
              <span>{{ formatPercent(compareResult.effectiveTaxRate * 100) }}%</span>
            </div>
          </div>
        </template>
      </Card>

      <!-- Skillnadskort vid jämförelse -->
      <Card v-if="compareResult" class="calc-card calc-card-diff">
        <template #title>Skillnad per månad</template>
        <template #content>
          <div class="result-content">
            <div class="result-highlight">
              <span>Nettolön</span>
              <span class="highlight-value" :class="getDiff(result.netMonthlySalary, compareResult.netMonthlySalary) >= 0 ? 'diff-positive' : 'diff-negative'">
                {{ formatDiff(getDiff(result.netMonthlySalary, compareResult.netMonthlySalary)) }} kr
              </span>
            </div>
            <div class="result-row">
              <span>Kommunalskatt</span>
              <span :class="getDiff(result.yearlyMunicipalTax, compareResult.yearlyMunicipalTax) <= 0 ? 'diff-positive' : 'diff-negative'">
                {{ formatDiff(-getDiff(result.yearlyMunicipalTax / 12, compareResult.yearlyMunicipalTax / 12)) }} kr
              </span>
            </div>
            <div class="result-row">
              <span>Regionskatt</span>
              <span :class="getDiff(result.yearlyRegionalTax, compareResult.yearlyRegionalTax) <= 0 ? 'diff-positive' : 'diff-negative'">
                {{ formatDiff(-getDiff(result.yearlyRegionalTax / 12, compareResult.yearlyRegionalTax / 12)) }} kr
              </span>
            </div>
            <div class="result-row">
              <span>Total skatt</span>
              <span :class="getDiff(result.monthlyTotalTax, compareResult.monthlyTotalTax) <= 0 ? 'diff-positive' : 'diff-negative'">
                {{ formatDiff(-getDiff(result.monthlyTotalTax, compareResult.monthlyTotalTax)) }} kr
              </span>
            </div>
            <Divider />
            <div class="result-row">
              <span>Effektiv skatt</span>
              <span :class="getDiff(result.effectiveTaxRate, compareResult.effectiveTaxRate) <= 0 ? 'diff-positive' : 'diff-negative'">
                {{ getDiff(result.effectiveTaxRate, compareResult.effectiveTaxRate) > 0 ? '+' : '' }}{{ formatPercent(getDiff(result.effectiveTaxRate, compareResult.effectiveTaxRate) * 100) }}%
              </span>
            </div>
            <div class="result-row yearly-note">
              <span>Skillnad per år</span>
              <span :class="getDiff(result.netMonthlySalary, compareResult.netMonthlySalary) >= 0 ? 'diff-positive' : 'diff-negative'">
                {{ formatDiff(getDiff(result.netMonthlySalary, compareResult.netMonthlySalary) * 12) }} kr
              </span>
            </div>
          </div>
        </template>
      </Card>

      <!-- Årskort (endast utan jämförelse) -->
      <Card v-if="!compareResult" class="calc-card">
        <template #title>Per år</template>
        <template #content>
          <div class="result-content">
            <div class="result-highlight">
              <span>Nettolön</span>
              <span class="highlight-value">{{ formatCurrency(result.grossYearlySalary - result.yearlyTotalTax) }} kr</span>
            </div>
            <div class="result-row">
              <span>Bruttolön</span>
              <span>{{ formatCurrency(result.grossYearlySalary) }} kr</span>
            </div>
            <div class="result-row">
              <span>Kommunalskatt ({{ formatPercent(result.municipalTaxRate * 100) }}%)</span>
              <span class="deduction"><span class="sign">−</span>{{ formatCurrency(result.yearlyMunicipalTax) }} kr</span>
            </div>
            <div class="result-row">
              <span>Regionskatt ({{ formatPercent(result.regionalTaxRate * 100) }}%)</span>
              <span class="deduction"><span class="sign">−</span>{{ formatCurrency(result.yearlyRegionalTax) }} kr</span>
            </div>
            <div v-if="result.yearlyStateTax > 0" class="result-row">
              <span>Statlig skatt</span>
              <span class="deduction"><span class="sign">−</span>{{ formatCurrency(result.yearlyStateTax) }} kr</span>
            </div>
            <div class="result-row">
              <span>Begravningsavgift</span>
              <span class="deduction"><span class="sign">−</span>{{ formatCurrency(result.yearlyBurialFee) }} kr</span>
            </div>
            <div v-if="result.yearlyChurchFee > 0" class="result-row">
              <span>Kyrkoavgift</span>
              <span class="deduction"><span class="sign">−</span>{{ formatCurrency(result.yearlyChurchFee) }} kr</span>
            </div>
            <div class="result-row">
              <span>Grundavdrag</span>
              <span>{{ formatCurrency(result.yearlyBasicDeduction) }} kr</span>
            </div>
            <div class="result-row">
              <span>Jobbskatteavdrag</span>
              <span class="addition"><span class="sign">+</span>{{ formatCurrency(result.yearlyJobTaxCredit) }} kr</span>
            </div>
            <Divider />
            <div class="result-row">
              <span>Total skatt</span>
              <span>{{ formatCurrency(result.yearlyTotalTax) }} kr</span>
            </div>
            <div class="result-row">
              <span>Effektiv skatt</span>
              <span>{{ formatPercent(result.effectiveTaxRate * 100) }}%</span>
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
  width: 360px;
  height: 410px;
  flex-shrink: 0;
  border-radius: 20px !important;
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Expanderat kort för jämförelseläge */
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

/* Ta bort blå bakgrund på InputNumber vid fokus */
.form-content :deep(.p-inputnumber-input) {
  background: transparent !important;
  background-color: transparent !important;
}

.form-content :deep(.p-inputnumber-input:enabled:focus) {
  background: transparent !important;
  background-color: transparent !important;
  box-shadow: none !important;
}

.form-content :deep(.p-inputnumber-input:enabled:hover) {
  background: transparent !important;
  background-color: transparent !important;
}

.form-content :deep(.p-inputnumber-input:focus) {
  background: transparent !important;
  background-color: transparent !important;
  box-shadow: none !important;
}

.form-content :deep(.p-inputnumber-input:hover) {
  background: transparent !important;
  background-color: transparent !important;
}

.form-content :deep(.p-inputnumber) {
  background: transparent !important;
  background-color: transparent !important;
}

.form-content :deep(.p-inputnumber .p-inputtext) {
  background: transparent !important;
  background-color: transparent !important;
}

.form-content :deep(.p-inputnumber .p-inputtext:focus) {
  background: transparent !important;
  background-color: transparent !important;
  box-shadow: none !important;
}

.form-content :deep(.p-inputnumber .p-inputtext:hover) {
  background: transparent !important;
  background-color: transparent !important;
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
  background: #f59e0b !important;
  border-color: #f59e0b !important;
  transition: all 0.2s ease;
  position: relative;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0);
  transition: all 0.2s ease;
  border-radius: inherit;
}

.submit-btn:hover::before {
  background: rgba(255, 255, 255, 0.2);
}

.submit-btn-disabled {
  background: #ffffff !important;
  border: 2px solid #f59e0b !important;
  color: #f59e0b !important;
  opacity: 1 !important;
}

.submit-btn-disabled:hover {
  background: #f59e0b !important;
  border-color: #f59e0b !important;
  color: #ffffff !important;
}

/* Validerings-stil för fel */
.form-content :deep(.p-invalid .p-inputtext),
.form-content :deep(.p-invalid .p-autocomplete-input) {
  border-bottom-color: #ef4444 !important;
}

/* Hela bordern röd för autocomplete med border */
.form-content :deep(.p-invalid.p-autocomplete > .p-inputtext),
.form-content :deep(.p-invalid .p-autocomplete > .p-inputtext) {
  border: 1px solid #ef4444 !important;
}

/* Dropdown-ikon röd vid fel */
.form-content :deep(.p-invalid .p-autocomplete-dropdown .p-icon) {
  color: #ef4444 !important;
}

.form-content :deep(.p-invalid .p-inputtext::placeholder),
.form-content :deep(.p-invalid .p-autocomplete-input::placeholder) {
  color: #ef4444 !important;
}

.view-toggle {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.result-highlight {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 0;
  border-bottom: 2px solid #eb8b10;
  margin-bottom: 0.75rem;
  color: #eb8b10;
  opacity: 1;
}

.highlight-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #eb8b10;
}

.result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.05rem 0;
  font-size: 0.85rem;
}

.result-row span:first-child {
  color: #333333;
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

.sign {
  display: inline-block;
  position: relative;
  top: 2px;
  margin-right: 3px;
}

/* Jämförelse-sektion */
.compare-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.compare-label {
  font-size: 0.9rem;
  color: #eb8b10;
  font-weight: 500;
}

/* Jämförelse-kort */
.calc-card-compare,
.calc-card-diff {
  height: auto;
  min-height: 320px;
}

/* Diff-färger */
.diff-positive {
  color: #22c55e !important;
  font-weight: 600;
}

.diff-negative {
  color: #ef4444 !important;
  font-weight: 600;
}

.diff-explanation {
  text-align: center;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #333333;
}

.yearly-note {
  margin-top: 0.25rem;
  font-weight: 600;
}

.yearly-note span:first-child {
  color: #333333 !important;
}

/* Orange checkboxar när disabled och CHECKED (efter beräkning) */
.checkbox-group :deep(.p-checkbox.p-disabled.p-checkbox-checked .p-checkbox-box) {
  background: #eb8b10 !important;
  border-color: #eb8b10 !important;
  opacity: 1 !important;
}

.checkbox-group :deep(.p-checkbox.p-disabled.p-checkbox-checked .p-checkbox-box .p-checkbox-icon) {
  color: #ffffff !important;
}

.checkbox-group :deep(.p-checkbox.p-disabled.p-checkbox-checked .p-checkbox-box svg) {
  color: #ffffff !important;
  fill: #ffffff !important;
  stroke: #ffffff !important;
}

.checkbox-group :deep(.p-checkbox.p-disabled.p-checkbox-checked .p-checkbox-box .p-icon) {
  color: #ffffff !important;
}

/* Unchecked disabled checkboxar - vita */
.checkbox-group :deep(.p-checkbox.p-disabled:not(.p-checkbox-checked) .p-checkbox-box) {
  background: #ffffff !important;
  border-color: rgba(0, 0, 0, 0.2) !important;
  opacity: 1 !important;
}

.checkbox-group :deep(.p-checkbox.p-disabled + label) {
  color: #333333 !important;
  opacity: 1 !important;
}

/* Responsive: 2x2 grid vid mellanstor skärm */
@media (max-width: 1500px) {
  .calculator-container {
    flex-wrap: wrap;
    max-width: 900px;
  }

  .calc-card,
  .calc-card-compare,
  .calc-card-diff {
    width: calc(50% - 0.75rem);
    min-width: 340px;
  }
}

@media (max-width: 750px) {
  .calculator-container {
    flex-direction: column;
    align-items: center;
    max-width: 100%;
  }

  .calc-card,
  .calc-card-compare,
  .calc-card-diff {
    width: 100%;
    max-width: 420px;
    min-width: unset;
  }
}
</style>
