/**
 * Shared formatting utilities for the tax calculator
 */

/**
 * Format a number as Swedish currency (without kr suffix)
 */
export const formatCurrency = (value: number | undefined): string => {
  if (value === undefined || value === null) return '0'
  return value.toLocaleString('sv-SE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

/**
 * Format a difference value with +/- prefix
 */
export const formatDiff = (diff: number): string => {
  const prefix = diff > 0 ? '+' : ''
  return prefix + formatCurrency(diff)
}

/**
 * Format a number as percentage with Swedish locale (2 decimals)
 */
export const formatPercent = (value: number | undefined): string => {
  if (value === undefined || value === null) return '0,00'
  return value.toLocaleString('sv-SE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

/**
 * Format a name to title case (capitalize first letter of each word)
 * Used for municipality and region names from API (which come as UPPERCASE)
 */
export const formatName = (name: string): string => {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Calculate difference between two values
 */
export const getDiff = (val1: number, val2: number): number => val1 - val2
