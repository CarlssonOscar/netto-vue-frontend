<script setup lang="ts">
import TaxCalculatorForm from './TaxCalculatorForm.vue'
import TaxResultCard from './TaxResultCard.vue'
import TaxComparisonCard from './TaxComparisonCard.vue'
import { useTaxCalculation } from '@/composables/useTaxCalculation'
import { formatName } from '@/utils/formatters'
import type { TaxRequest } from '@/types/tax'

const { result, compareResult, loading, error, calculate, reset } = useTaxCalculation()

const handleSubmit = (request: TaxRequest, compareRequest?: TaxRequest) => {
  calculate(request, compareRequest)
}
</script>

<template>
  <div class="calculator-container">
    <!-- Input Form -->
    <TaxCalculatorForm 
      :loading="loading"
      :error="error"
      :has-result="!!result"
      @submit="handleSubmit"
      @reset="reset"
    />

    <!-- Result Cards -->
    <template v-if="result">
      <!-- Single result mode -->
      <template v-if="!compareResult">
        <TaxResultCard 
          :result="result" 
          title="Per månad" 
        />
        <TaxResultCard 
          :result="result" 
          title="Per år" 
          :yearly="true" 
        />
      </template>

      <!-- Compare mode -->
      <template v-else>
        <TaxResultCard 
          :result="result" 
          :title="formatName(result.municipalityName)" 
        />
        <TaxResultCard 
          :result="compareResult" 
          :title="formatName(compareResult.municipalityName)" 
        />
        <TaxComparisonCard 
          :primary-result="result" 
          :compare-result="compareResult" 
        />
      </template>
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

@media (max-width: 1500px) {
  .calculator-container {
    flex-wrap: wrap;
    max-width: 900px;
  }
}

@media (max-width: 750px) {
  .calculator-container {
    flex-direction: column;
    align-items: center;
    max-width: 100%;
  }
}
</style>
