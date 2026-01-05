/**
 * API Configuration
 * 
 * Uses environment variables to determine the API base URL.
 * - Development: Uses Vite proxy to localhost:8080
 * - Production: Uses Railway hosted API
 * 
 * Environment variables are loaded from:
 * - .env.development (local dev)
 * - .env.production (production build)
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

export const apiConfig = {
  baseUrl: API_BASE_URL,
  endpoints: {
    municipalities: `${API_BASE_URL}/municipalities`,
    regions: `${API_BASE_URL}/regions`,
    taxCalculate: `${API_BASE_URL}/tax/calculate`,
    taxCalculateByCode: `${API_BASE_URL}/tax/calculate-by-code`
  }
}
