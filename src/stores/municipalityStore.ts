import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Municipality, Region } from '@/types/tax'

const API_BASE_URL = '/api/v1'

export const useMunicipalityStore = defineStore('municipality', () => {
  // State
  const municipalities = ref<Municipality[]>([])
  const selectedRegionId = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const hasFetched = ref(false)

  // Getters
  const regions = computed<Region[]>(() => {
    const regionMap = new Map<string, Region>()
    municipalities.value.forEach((m) => {
      if (!regionMap.has(m.region.id)) {
        regionMap.set(m.region.id, m.region)
      }
    })
    return [...regionMap.values()].sort((a, b) => a.name.localeCompare(b.name, 'sv'))
  })

  const filteredMunicipalities = computed(() => {
    let filtered = municipalities.value
    if (selectedRegionId.value) {
      filtered = filtered.filter((m) => m.region.id === selectedRegionId.value)
    }
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'sv'))
  })

  const sortedMunicipalities = computed(() =>
    [...municipalities.value].sort((a, b) => a.name.localeCompare(b.name, 'sv'))
  )

  const getMunicipalityById = (id: string) =>
    municipalities.value.find((m) => m.id === id)

  // Actions
  const setSelectedRegion = (regionId: string | null) => {
    selectedRegionId.value = regionId
  }

  const fetchMunicipalities = async () => {
    if (hasFetched.value && municipalities.value.length > 0) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_BASE_URL}/municipalities`)

      if (!response.ok) {
        throw new Error('Kunde inte hämta kommuner')
      }

      municipalities.value = await response.json()
      hasFetched.value = true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ett oväntat fel uppstod'
    } finally {
      loading.value = false
    }
  }

  return {
    municipalities,
    regions,
    filteredMunicipalities,
    sortedMunicipalities,
    selectedRegionId,
    loading,
    error,
    hasFetched,
    fetchMunicipalities,
    getMunicipalityById,
    setSelectedRegion
  }
})
