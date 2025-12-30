<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import SelectButton from 'primevue/selectbutton'
import Divider from 'primevue/divider'
import type { TaxResult } from '@/types/tax'

defineProps<{
  result: TaxResult
}>()

const viewOptions = [
  { label: 'Månad', value: 'month' },
  { label: 'År', value: 'year' }
]

const selectedViews = ref(['month', 'year'])

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
  <div class="result-container">
    <div class="view-toggle">
      <SelectButton
        v-model="selectedViews"
        :options="viewOptions"
        optionLabel="label"
        optionValue="value"
        multiple
        aria-label="Välj visning"
      />
    </div>

    <div class="result-grid">
      <!-- Monthly View -->
      <Card v-if="selectedViews.includes('month')" class="result-card">
        <template #title>
          <span>Per månad</span>
        </template>
        <template #content>
          <div class="result-content">
            <div class="result-highlight">
              <span class="result-label">Nettolön</span>
              <span class="result-value highlight">{{ formatCurrency(result.monthlyNetSalary) }} kr</span>
            </div>

            <Divider />

            <div class="result-row">
              <span class="result-label">Bruttolön</span>
              <span class="result-value">{{ formatCurrency(result.grossMonthlySalary) }} kr</span>
            </div>

            <div class="result-row">
              <span class="result-label">Kommunalskatt</span>
              <span class="result-value deduction">-{{ formatCurrency(result.municipalTax / 12) }} kr</span>
            </div>

            <div class="result-row">
              <span class="result-label">Regionskatt</span>
              <span class="result-value deduction">-{{ formatCurrency(result.regionalTax / 12) }} kr</span>
            </div>

            <div v-if="result.stateTax > 0" class="result-row">
              <span class="result-label">Statlig skatt</span>
              <span class="result-value deduction">-{{ formatCurrency(result.stateTax / 12) }} kr</span>
            </div>

            <div class="result-row">
              <span class="result-label">Begravningsavgift</span>
              <span class="result-value deduction">-{{ formatCurrency(result.burialFee / 12) }} kr</span>
            </div>

            <div v-if="result.churchFee > 0" class="result-row">
              <span class="result-label">Kyrkoavgift</span>
              <span class="result-value deduction">-{{ formatCurrency(result.churchFee / 12) }} kr</span>
            </div>

            <div class="result-row">
              <span class="result-label">Jobbskatteavdrag</span>
              <span class="result-value addition">+{{ formatCurrency(result.jobTaxCredit / 12) }} kr</span>
            </div>

            <Divider />

            <div class="result-row">
              <span class="result-label">Effektiv skatt</span>
              <span class="result-value">{{ formatPercent(result.effectiveTaxRate) }}%</span>
            </div>
          </div>
        </template>
      </Card>

      <!-- Yearly View -->
      <Card v-if="selectedViews.includes('year')" class="result-card">
        <template #title>
          <span>Per år</span>
        </template>
        <template #content>
          <div class="result-content">
            <div class="result-highlight">
              <span class="result-label">Nettolön</span>
              <span class="result-value highlight">{{ formatCurrency(result.yearlyNetSalary) }} kr</span>
            </div>

            <Divider />

            <div class="result-row">
              <span class="result-label">Bruttolön</span>
              <span class="result-value">{{ formatCurrency(result.grossYearlySalary) }} kr</span>
            </div>

            <div class="result-row">
              <span class="result-label">Kommunalskatt ({{ formatPercent(result.municipalTaxRate) }}%)</span>
              <span class="result-value deduction">-{{ formatCurrency(result.municipalTax) }} kr</span>
            </div>

            <div class="result-row">
              <span class="result-label">Regionskatt ({{ formatPercent(result.regionalTaxRate) }}%)</span>
              <span class="result-value deduction">-{{ formatCurrency(result.regionalTax) }} kr</span>
            </div>

            <div v-if="result.stateTax > 0" class="result-row">
              <span class="result-label">Statlig skatt</span>
              <span class="result-value deduction">-{{ formatCurrency(result.stateTax) }} kr</span>
            </div>

            <div class="result-row">
              <span class="result-label">Begravningsavgift</span>
              <span class="result-value deduction">-{{ formatCurrency(result.burialFee) }} kr</span>
            </div>

            <div v-if="result.churchFee > 0" class="result-row">
              <span class="result-label">Kyrkoavgift</span>
              <span class="result-value deduction">-{{ formatCurrency(result.churchFee) }} kr</span>
            </div>

            <div class="result-row">
              <span class="result-label">Grundavdrag</span>
              <span class="result-value">{{ formatCurrency(result.basicDeduction) }} kr</span>
            </div>

            <div class="result-row">
              <span class="result-label">Jobbskatteavdrag</span>
              <span class="result-value addition">+{{ formatCurrency(result.jobTaxCredit) }} kr</span>
            </div>

            <Divider />

            <div class="result-row">
              <span class="result-label">Total skatt</span>
              <span class="result-value">{{ formatCurrency(result.totalTaxAfterCredit) }} kr</span>
            </div>

            <div class="result-row">
              <span class="result-label">Effektiv skatt</span>
              <span class="result-value">{{ formatPercent(result.effectiveTaxRate) }}%</span>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <div class="result-meta">
      <span class="text-surface-500">
        {{ result.municipalityName }}, {{ result.regionName }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.result-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.view-toggle {
  display: flex;
  justify-content: center;
}

.result-grid {
  display: flex;
  gap: 1rem;
}

.result-card {
  flex: 1;
  min-width: 0;
  border-radius: 1.5rem;
  overflow: hidden;
  background: #2d2d2d;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.result-card :deep(.p-card-body) {
  padding: 1rem;
  background: #2d2d2d;
}

.result-card :deep(.p-card-title) {
  font-size: 1rem;
  color: #f5f5f5;
}

.result-card :deep(.p-card-content) {
  color: #f5f5f5;
  padding-top: 0.5rem;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.result-highlight {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--p-primary-50);
  border-radius: var(--p-border-radius);
}

:root.dark .result-highlight {
  background: var(--p-primary-900);
}

.result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
}

.result-label {
  color: var(--p-text-muted-color);
}

.result-value {
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.result-value.highlight {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--p-primary-color);
}

.result-value.deduction {
  color: var(--p-red-500);
}

.result-value.addition {
  color: var(--p-green-500);
}

.result-meta {
  text-align: center;
  font-size: 0.875rem;
}
</style>
