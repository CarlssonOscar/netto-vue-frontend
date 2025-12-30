export interface TaxRequest {
  municipalityId: string
  grossMonthlySalary: number
  churchMember?: boolean
  isPensioner?: boolean
}

export interface TaxResult {
  grossMonthlySalary: number
  grossYearlySalary: number
  municipalityName: string
  regionName: string
  taxableIncome: number
  basicDeduction: number
  municipalTax: number
  regionalTax: number
  stateTax: number
  burialFee: number
  churchFee: number
  totalTaxBeforeCredit: number
  jobTaxCredit: number
  totalTaxAfterCredit: number
  yearlyNetSalary: number
  monthlyNetSalary: number
  effectiveTaxRate: number
  municipalTaxRate: number
  regionalTaxRate: number
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
