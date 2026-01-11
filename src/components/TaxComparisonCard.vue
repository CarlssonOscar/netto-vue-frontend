<script setup lang="ts">
import Card from 'primevue/card'
import Divider from 'primevue/divider'
import type { TaxResult } from '@/types/tax'
import { formatPercent, formatCurrency, getDiff } from '@/utils/formatters'

const props = defineProps<{
  primaryResult: TaxResult
  compareResult: TaxResult
}>()

// For net salary: positive diff is good (green)
// For taxes: negative diff is good (green, means paying less)
const getNetSalaryClass = (diff: number) => diff >= 0 ? 'diff-positive' : 'diff-negative'
const getTaxClass = (diff: number) => diff <= 0 ? 'diff-positive' : 'diff-negative'

// Get sign character for a diff value
const getSign = (diff: number) => diff >= 0 ? '+' : '−'
</script>

<template>
  <Card class="calc-card calc-card-diff">
    <template #title>Skillnad per månad</template>
    <template #content>
      <div class="result-content">
        <div class="result-highlight">
          <span>Nettoinkomst</span>
          <span class="highlight-value">
            <span class="sign">{{ getSign(getDiff(primaryResult.netMonthlySalary, compareResult.netMonthlySalary)) }}</span>{{ formatCurrency(Math.abs(getDiff(primaryResult.netMonthlySalary, compareResult.netMonthlySalary))) }} kr
          </span>
        </div>
        <div class="result-row">
          <span>Kommunalskatt</span>
          <span :class="getTaxClass(getDiff(primaryResult.yearlyMunicipalTax, compareResult.yearlyMunicipalTax))">
            <span class="sign">{{ getSign(-getDiff(primaryResult.yearlyMunicipalTax / 12, compareResult.yearlyMunicipalTax / 12)) }}</span>{{ formatCurrency(Math.abs(getDiff(primaryResult.yearlyMunicipalTax / 12, compareResult.yearlyMunicipalTax / 12))) }} kr
          </span>
        </div>
        <div class="result-row">
          <span>Regionskatt</span>
          <span :class="getTaxClass(getDiff(primaryResult.yearlyRegionalTax, compareResult.yearlyRegionalTax))">
            <span class="sign">{{ getSign(-getDiff(primaryResult.yearlyRegionalTax / 12, compareResult.yearlyRegionalTax / 12)) }}</span>{{ formatCurrency(Math.abs(getDiff(primaryResult.yearlyRegionalTax / 12, compareResult.yearlyRegionalTax / 12))) }} kr
          </span>
        </div>
        <div class="result-row">
          <span>Total skatt</span>
          <span :class="getTaxClass(getDiff(primaryResult.monthlyTotalTax, compareResult.monthlyTotalTax))">
            <span class="sign">{{ getSign(-getDiff(primaryResult.monthlyTotalTax, compareResult.monthlyTotalTax)) }}</span>{{ formatCurrency(Math.abs(getDiff(primaryResult.monthlyTotalTax, compareResult.monthlyTotalTax))) }} kr
          </span>
        </div>
        <Divider />
        <div class="result-row">
          <span>Effektiv skatt</span>
          <span :class="getTaxClass(getDiff(primaryResult.effectiveTaxRate, compareResult.effectiveTaxRate))">
            <span class="sign">{{ getSign(getDiff(primaryResult.effectiveTaxRate, compareResult.effectiveTaxRate)) }}</span>{{ formatPercent(Math.abs(getDiff(primaryResult.effectiveTaxRate, compareResult.effectiveTaxRate)) * 100) }}%
          </span>
        </div>
        <div class="result-row yearly-note">
          <span>Skillnad per år</span>
          <span :class="getNetSalaryClass(getDiff(primaryResult.netMonthlySalary, compareResult.netMonthlySalary))">
            <span class="sign">{{ getSign(getDiff(primaryResult.netMonthlySalary, compareResult.netMonthlySalary) * 12) }}</span>{{ formatCurrency(Math.abs(getDiff(primaryResult.netMonthlySalary, compareResult.netMonthlySalary) * 12)) }} kr
          </span>
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

.calc-card-diff {
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

.diff-positive {
  color: var(--p-green-500) !important;
  font-weight: 600;
}

.diff-negative {
  color: var(--p-red-500) !important;
  font-weight: 600;
}

.sign {
  display: inline-block;
  position: relative;
  top: 2px;
  margin-right: 3px;
}

.yearly-note {
  margin-top: 0.25rem;
  font-weight: 600;
}

.yearly-note span:first-child {
  color: #333333 !important;
}
</style>
