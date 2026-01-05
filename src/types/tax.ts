export interface TaxRequest {
  municipalityId: string
  grossMonthlySalary: number
  churchMember?: boolean
  isPensioner?: boolean
}

export interface TaxResult {
  // Identifiering
  municipalityId: string
  municipalityName: string
  regionName: string

  // Inkomst
  grossMonthlySalary: number
  grossYearlySalary: number

  // Skattesatser (decimal, t.ex. 0.228 = 22.8%)
  municipalTaxRate: number
  regionalTaxRate: number
  stateTaxRate: number
  burialFeeRate: number
  churchFeeRate: number

  // Avdrag (årsvärden)
  yearlyBasicDeduction: number
  yearlyJobTaxCredit: number

  // Beräknade skatter (årsvärden)
  yearlyTaxableIncome: number
  yearlyMunicipalTax: number
  yearlyRegionalTax: number
  yearlyStateTax: number
  yearlyBurialFee: number
  yearlyChurchFee: number
  yearlyTotalTax: number

  // Månadsvärden
  monthlyTotalTax: number
  netMonthlySalary: number

  // Summering
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
