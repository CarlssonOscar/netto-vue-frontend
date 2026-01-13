<script setup lang="ts">
import Card from 'primevue/card'
import Divider from 'primevue/divider'
import type { TaxResult } from '@/types/tax'
import { formatCurrency, formatPercent } from '@/utils/formatters'

const props = defineProps<{
  result: TaxResult
  title: string
  yearly?: boolean
}>()

// Divisor for converting yearly values to monthly
const divisor = props.yearly ? 1 : 12

// Calculate net income based on period
const getNetIncome = () => {
  if (props.yearly) {
    return props.result.grossYearlySalary - props.result.yearlyTotalTax
  }
  return props.result.netMonthlySalary
}

// Get gross income based on period
const getGrossIncome = () => {
  return props.yearly ? props.result.grossYearlySalary : props.result.grossMonthlySalary
}
</script>

<template>
  <Card class="calc-card" :class="{ 'calc-card-compare': !yearly }">
    <template #title>{{ title }}</template>
    <template #content>
      <div class="result-content">
        <div class="result-highlight">
          <span>Nettoinkomst</span>
          <span class="highlight-value">{{ formatCurrency(getNetIncome()) }} kr</span>
        </div>
        <div class="result-row">
          <span>Bruttoinkomst</span>
          <span>{{ formatCurrency(getGrossIncome()) }} kr</span>
        </div>
        <div class="result-row">
          <span>Kommunalskatt ({{ formatPercent(result.municipalTaxRate * 100) }}%)</span>
          <span class="deduction"><span class="sign">−</span>{{ formatCurrency(result.yearlyMunicipalTax / divisor) }} kr</span>
        </div>
        <div class="result-row">
          <span>Regionskatt ({{ formatPercent(result.regionalTaxRate * 100) }}%)</span>
          <span class="deduction"><span class="sign">−</span>{{ formatCurrency(result.yearlyRegionalTax / divisor) }} kr</span>
        </div>
        <div v-if="result.yearlyStateTax > 0" class="result-row">
          <span>Statlig skatt</span>
          <span class="deduction"><span class="sign">−</span>{{ formatCurrency(result.yearlyStateTax / divisor) }} kr</span>
        </div>
        <div class="result-row">
          <span>Begravningsavgift</span>
          <span class="deduction"><span class="sign">−</span>{{ formatCurrency(result.yearlyBurialFee / divisor) }} kr</span>
        </div>
        <div v-if="result.yearlyChurchFee > 0" class="result-row">
          <span>Kyrkoavgift</span>
          <span class="deduction"><span class="sign">−</span>{{ formatCurrency(result.yearlyChurchFee / divisor) }} kr</span>
        </div>
        <div v-if="yearly" class="result-row">
          <span>Grundavdrag</span>
          <span>{{ formatCurrency(result.yearlyBasicDeduction) }} kr</span>
        </div>
        <div v-if="result.yearlyJobTaxCredit > 0" class="result-row">
          <span>Jobbskatteavdrag</span>
          <span class="addition"><span class="sign">+</span>{{ formatCurrency(result.yearlyJobTaxCredit / divisor) }} kr</span>
        </div>
        <Divider />
        <div v-if="yearly" class="result-row">
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

<style scoped>
.calc-card {
  width: 360px;
  height: 410px;
  flex-shrink: 0;
  border-radius: 20px !important;
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.calc-card-compare {
  height: auto;
  min-height: 320px;
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
  border-bottom: 2px solid var(--p-primary-color);
  margin-bottom: 0.75rem;
  color: var(--p-primary-color);
  opacity: 1;
}

.highlight-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--p-primary-color);
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
  color: var(--p-red-500);
}

.addition {
  color: var(--p-green-500);
}

.sign {
  display: inline-block;
  position: relative;
  top: 2px;
  margin-right: 3px;
}
</style>
