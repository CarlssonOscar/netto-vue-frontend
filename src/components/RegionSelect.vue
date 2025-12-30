<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AutoComplete from 'primevue/autocomplete'
import { useMunicipalityStore } from '@/stores/municipalityStore'
import type { Region } from '@/types/tax'

const modelValue = defineModel<string | null>({ default: null })

const store = useMunicipalityStore()
const selectedRegion = ref<Region | null>(null)
const filteredSuggestions = ref<Region[]>([])

// Sync with store
watch(
  () => selectedRegion.value,
  (newValue) => {
    const id = newValue?.id ?? null
    modelValue.value = id
    store.setSelectedRegion(id)
  }
)

const search = (event: { query: string }) => {
  const query = event.query.toLowerCase()
  filteredSuggestions.value = store.regions.filter(r =>
    r.name.toLowerCase().includes(query)
  )
}

const onClear = () => {
  modelValue.value = null
  store.setSelectedRegion(null)
}
</script>

<template>
  <AutoComplete
    v-model="selectedRegion"
    :suggestions="filteredSuggestions"
    optionLabel="name"
    placeholder="Alla regioner"
    @complete="search"
    @clear="onClear"
    dropdown
    class="w-full"
  />
</template>
