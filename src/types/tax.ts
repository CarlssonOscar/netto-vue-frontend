export interface TaxRequest {
  municipalityId: string
  grossMonthlySalary: number
  churchMember?: boolean
  isPensioner?: boolean
}

export interface TaxResult {
  // Identification
  municipalityId: string
  municipalityName: string
  regionName: string

  // Income
  grossMonthlySalary: number
  grossYearlySalary: number

  // Tax rates (decimal, e.g. 0.228 = 22.8%)
  municipalTaxRate: number
  regionalTaxRate: number
  stateTaxRate: number
  burialFeeRate: number
  churchFeeRate: number

  // Deductions (yearly values)
  yearlyBasicDeduction: number
  yearlyJobTaxCredit: number

  // Calculated taxes (yearly values)
  yearlyTaxableIncome: number
  yearlyMunicipalTax: number
  yearlyRegionalTax: number
  yearlyStateTax: number
  yearlyBurialFee: number
  yearlyChurchFee: number
  yearlyTotalTax: number

  // Monthly values
  monthlyTotalTax: number
  netMonthlySalary: number

  // Summary
  effectiveTaxRate: number
}

export interface Region {
  id: string
  code: string
  name: string
  createdAt?: string
  updatedAt?: string
}

export interface Municipality {
  id: string
  code: string
  name: string
  region: Region
  municipalTaxRate?: number
  createdAt?: string
  updatedAt?: string
}
