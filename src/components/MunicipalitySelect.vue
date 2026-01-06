<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import AutoComplete from 'primevue/autocomplete'
import { useMunicipalityStore } from '@/stores/municipalityStore'
import { formatName } from '@/utils/formatters'
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

// Use local filtering based on prop regionId, not store's global selectedRegionId
const availableMunicipalities = computed(() => {
  let filtered = store.municipalities
  if (props.regionId) {
    filtered = filtered.filter((m) => m.region.id === props.regionId)
  }
  return [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'sv'))
})

watch(
  () => props.regionId,
  () => {
    modelValue.value = ''
    selectedMunicipality.value = null
  }
)

watch(
  () => modelValue.value,
  (newId) => {
    if (!newId) {
      selectedMunicipality.value = null
    } else {
      const found = availableMunicipalities.value.find(m => m.id === newId)
      if (found && selectedMunicipality.value?.id !== found.id) {
        selectedMunicipality.value = found
      }
    }
  }
)

const search = (event: { query: string }) => {
  const query = event.query.toLowerCase()
  filteredSuggestions.value = availableMunicipalities.value.filter(m =>
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
