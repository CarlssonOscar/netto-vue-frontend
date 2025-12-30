<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import AutoComplete from 'primevue/autocomplete'
import { useMunicipalityStore } from '@/stores/municipalityStore'
import type { Municipality } from '@/types/tax'

const modelValue = defineModel<string>({ required: true })

const props = defineProps<{
  regionId?: string | null
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

onMounted(() => {
  store.fetchMunicipalities()
})
</script>

<template>
  <AutoComplete
    v-model="selectedMunicipality"
    :suggestions="filteredSuggestions"
    optionLabel="name"
    placeholder="Sök kommun..."
    :loading="store.loading"
    @complete="search"
    @item-select="onSelect"
    @clear="onClear"
    dropdown
    forceSelection
    class="w-full"
  />
</template>
