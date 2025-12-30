<script setup lang="ts">
import { onMounted, watch } from 'vue'
import Select from 'primevue/select'
import { useMunicipalityStore } from '@/stores/municipalityStore'

const modelValue = defineModel<string>({ required: true })

const props = defineProps<{
  regionId?: string | null
}>()

const store = useMunicipalityStore()

// Reset municipality when region changes
watch(
  () => props.regionId,
  () => {
    modelValue.value = ''
  }
)

onMounted(() => {
  store.fetchMunicipalities()
})
</script>

<template>
  <Select
    v-model="modelValue"
    :options="store.filteredMunicipalities"
    optionLabel="name"
    optionValue="id"
    placeholder="Välj kommun..."
    :loading="store.loading"
    filter
    filterPlaceholder="Sök kommun..."
    class="w-full"
  />
</template>
