<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import AutoComplete from 'primevue/autocomplete'
import { useMunicipalityStore } from '@/stores/municipalityStore'
import type { Municipality } from '@/types/tax'

const modelValue = defineModel<string>({ required: true })

const props = defineProps<{
  regionId?: string | null
  placeholder?: string
  disabled?: boolean
  ariaLabel?: string
}>()

const store = useMunicipalityStore()
const selectedMunicipality = ref<Municipality | null>(null)
const filteredSuggestions = ref<Municipality[]>([])

// Reset municipality when region changes
watch(
  () => props.regionId,
  () => {
    modelValue.value = ''
    selectedMunicipality.value = null
  }
)

// Sync selectedMunicipality with modelValue
watch(
  () => modelValue.value,
  (newId) => {
    if (!newId) {
      selectedMunicipality.value = null
    } else {
      const found = store.filteredMunicipalities.find(m => m.id === newId)
      if (found && selectedMunicipality.value?.id !== found.id) {
        selectedMunicipality.value = found
      }
    }
  }
)

const search = (event: { query: string }) => {
  const query = event.query.toLowerCase()
  filteredSuggestions.value = store.filteredMunicipalities.filter(m =>
    m.name.toLowerCase().includes(query)
  )
}

const onSelect = (event: { value: Municipality }) => {
  modelValue.value = event.value.id
}

const onClear = () => {
  modelValue.value = ''
}

// Formatera kommunnamn till title case (första bokstaven stor, resten små)
const formatName = (name: string): string => {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

onMounted(() => {
  store.fetchMunicipalities()
})
</script>

<template>
  <AutoComplete
    v-model="selectedMunicipality"
    :suggestions="filteredSuggestions"
    :optionLabel="(m: Municipality) => formatName(m.name)"
    :placeholder="props.placeholder ?? 'Sök kommun...'"
    :loading="store.loading"
    @complete="search"
    @item-select="onSelect"
    @clear="onClear"
    dropdown
    forceSelection
    class="w-full"
    :disabled="props.disabled"
    :aria-label="props.ariaLabel"
  />
</template>
