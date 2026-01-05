import { ref, readonly } from 'vue'
import type { TaxRequest, TaxResult } from '@/types/tax'
import { apiConfig } from '@/config/api'

export function useTaxCalculation() {
  const result = ref<TaxResult | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const calculate = async (request: TaxRequest) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(apiConfig.endpoints.taxCalculate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.messages?.join(', ') || 'Beräkningen misslyckades')
      }

      const data = await response.json()
      console.log('Tax calculation result:', data)
      result.value = data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ett oväntat fel uppstod'
      result.value = null
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    result.value = null
    error.value = null
  }

  return {
    result: readonly(result),
    loading: readonly(loading),
    error: readonly(error),
    calculate,
    reset
  }
}
