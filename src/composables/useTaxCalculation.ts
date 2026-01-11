import { ref, readonly } from 'vue'
import type { TaxRequest, TaxResult } from '@/types/tax'
import { apiConfig } from '@/config/api'

export function useTaxCalculation() {
  const result = ref<TaxResult | null>(null)
  const compareResult = ref<TaxResult | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const calculateSingle = async (request: TaxRequest): Promise<TaxResult> => {
    // Build query parameters for GET request
    const params = new URLSearchParams({
      municipalityId: request.municipalityId,
      grossSalary: request.grossMonthlySalary.toString(),
      churchMember: (request.churchMember ?? false).toString(),
      isPensioner: (request.isPensioner ?? false).toString()
    })

    const response = await fetch(`${apiConfig.endpoints.taxCalculate}?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.messages?.join(', ') || err.message || 'Calculation failed')
    }

    return response.json()
  }

  const calculate = async (request: TaxRequest, compareRequest?: TaxRequest) => {
    loading.value = true
    error.value = null

    try {
      if (compareRequest) {
        // Run both calculations in parallel, then update state together
        const [primaryData, compareData] = await Promise.all([
          calculateSingle(request),
          calculateSingle(compareRequest)
        ])
        result.value = primaryData
        compareResult.value = compareData
      } else {
        // Single calculation
        const data = await calculateSingle(request)
        result.value = data
        compareResult.value = null
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'An unexpected error occurred'
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
