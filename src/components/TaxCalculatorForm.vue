<script setup lang="ts">
import { ref, computed } from 'vue'
import InputNumber from 'primevue/inputnumber'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Message from 'primevue/message'
import Divider from 'primevue/divider'
import RegionSelect from './RegionSelect.vue'
import MunicipalitySelect from './MunicipalitySelect.vue'
import type { TaxRequest } from '@/types/tax'

const props = defineProps<{
  loading?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  calculate: [request: TaxRequest]
}>()

const selectedRegionId = ref<string | null>(null)
const municipalityId = ref('')
const grossMonthlySalary = ref<number | null>(null)
const churchMember = ref(false)
const isPensioner = ref(false)

const isValid = computed(() => {
  return municipalityId.value && grossMonthlySalary.value && grossMonthlySalary.value > 0
})

const handleSubmit = () => {
  if (!isValid.value || !grossMonthlySalary.value) return

  emit('calculate', {
    municipalityId: municipalityId.value,
    grossMonthlySalary: grossMonthlySalary.value,
    churchMember: churchMember.value,
    isPensioner: isPensioner.value
  })
}
</script>

<template>
  <Card class="calculator-card">
    <template #title>
      <span class="card-title">Beräkna nettolön</span>
    </template>

    <template #content>
      <form @submit.prevent="handleSubmit" class="form-content">
        <!-- Region filter -->
        <div class="field">
          <label for="region">Region (valfritt)</label>
          <RegionSelect v-model="selectedRegionId" />
        </div>

        <!-- Municipality -->
        <div class="field">
          <label for="municipality">Kommun</label>
          <MunicipalitySelect v-model="municipalityId" :region-id="selectedRegionId" />
        </div>

        <Divider />

        <!-- Salary -->
        <div class="field">
          <label for="salary">Bruttolön per månad (SEK)</label>
          <InputNumber
            id="salary"
            v-model="grossMonthlySalary"
            :min="0"
            :max="10000000"
            placeholder="T.ex. 35000"
            class="w-full"
            locale="sv-SE"
            :maxFractionDigits="0"
          />
        </div>

        <!-- Checkboxes -->
        <div class="checkbox-group">
          <div class="checkbox-item">
            <Checkbox v-model="churchMember" :binary="true" inputId="churchMember" />
            <label for="churchMember">Medlem i Svenska kyrkan</label>
          </div>

          <div class="checkbox-item">
            <Checkbox v-model="isPensioner" :binary="true" inputId="isPensioner" />
            <label for="isPensioner">Pensionär (65+ år)</label>
          </div>
        </div>

        <!-- Error message -->
        <Message v-if="error" severity="error" :closable="false">
          {{ error }}
        </Message>

        <!-- Submit button -->
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
</template>

<style scoped>
.calculator-card {
  border-radius: 1.5rem;
  overflow: hidden;
  background: #2d2d2d;
  box-shadow: 
    0 -20px 60px rgba(45, 45, 45, 0.8),
    0 25px 50px -12px rgba(0, 0, 0, 0.4);
}

.calculator-card :deep(.p-card-body) {
  padding: 1.25rem;
  background: #2d2d2d;
}

.calculator-card :deep(.p-card-title) {
  font-size: 1.25rem;
}

.calculator-card :deep(.p-card-content) {
  color: #f5f5f5;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #f5f5f5;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  font-weight: 500;
  color: #f5f5f5;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-item label {
  color: rgba(245, 245, 245, 0.7);
  cursor: pointer;
}

.submit-btn {
  margin-top: 0.5rem;
  align-self: flex-start;
}
</style>
