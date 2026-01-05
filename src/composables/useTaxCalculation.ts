import { ref, readonly } from 'vue'
import type { TaxRequest, TaxResult } from '@/types/tax'
import { apiConfig } from '@/config/api'

export function useTaxCalculation() {
  const result = ref<TaxResult | null>(null)
  const compareResult = ref<TaxResult | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const calculateSingle = async (request: TaxRequest): Promise<TaxResult> => {
    const response = await fetch(apiConfig.endpoints.taxCalculate, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.messages?.join(', ') || 'Beräkningen misslyckades')
    }

    return response.json()
  }

  const calculate = async (request: TaxRequest, compareRequest?: TaxRequest) => {
    loading.value = true
    error.value = null

    try {
      const data = await calculateSingle(request)
      console.log('Tax calculation result:', data)
      result.value = data

      if (compareRequest) {
        const compareData = await calculateSingle(compareRequest)
        console.log('Compare calculation result:', compareData)
        compareResult.value = compareData
      } else {
        compareResult.value = null
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ett oväntat fel uppstod'
      result.value = null
      compareResult.value = null
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    result.value = null
    compareResult.value = null
    error.value = null
  }

  return {
    result: readonly(result),
    compareResult: readonly(compareResult),
    loading: readonly(loading),
    error: readonly(error),
    calculate,
    reset
  }
}
