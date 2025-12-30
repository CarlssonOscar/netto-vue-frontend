<script setup lang="ts">
import { watch } from 'vue'
import Select from 'primevue/select'
import { useMunicipalityStore } from '@/stores/municipalityStore'

const modelValue = defineModel<string | null>({ default: null })

const store = useMunicipalityStore()

// Sync with store
watch(
  modelValue,
  (newValue) => {
    store.setSelectedRegion(newValue)
  },
  { immediate: true }
)
</script>

<template>
  <Select
    v-model="modelValue"
    :options="store.regions"
    optionLabel="name"
    optionValue="id"
    placeholder="Alla regioner"
    showClear
    filter
    filterPlaceholder="Sök region..."
    class="w-full"
  />
</template>
