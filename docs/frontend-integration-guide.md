# NettoApi - Frontend Integration Guide

> **Purpose**: API integration reference for Vue 3 + TypeScript + PrimeVue  
> **Backend**: Spring Boot 3.x, Java 21  
> **Tax Year**: 2026 (SKV 433)  
> **Last Updated**: 2026-01-11

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/regions` | All regions (21 total) |
| `GET` | `/api/v1/municipalities` | All municipalities (290 total) |
| `GET` | `/api/v1/municipalities/by-region/{regionId}` | Municipalities in selected region |
| `GET` | `/api/v1/tax/calculate` | Calculate net income (with UUID as query param) |
| `GET` | `/api/v1/tax/calculate-by-code` | Calculate net income (with municipality code) |
| `POST` | `/api/v1/tax/calculate` | Calculate net income (with JSON body) |

**Base URL**: `http://localhost:8080/api/v1`

> ⚠️ **NOTE**: All communication goes through the API Gateway on port 8080. The backend service runs internally on port 8181 but should never be called directly from frontend.

**OpenAPI**: `GET /api/v1/api-docs`

---

## TypeScript Types

```typescript
// src/types/index.ts

export interface Region {
  id: string;        // UUID
  code: string;      // "24"
  name: string;      // "Västerbotten"
}

export interface Municipality {
  id: string;        // UUID
  code: string;      // "2480"
  name: string;      // "Umeå"
  regionId: string;
}

export interface TaxCalculationRequest {
  municipalityId: string;       // Required (UUID)
  grossMonthlyIncome: number;   // Required, positive
  churchMember?: boolean;       // Default: false
  isPensioner?: boolean;        // Default: false (affects job tax credit)
}

// NOTE: When isPensioner = true:
// - yearlyJobTaxCredit will be 0 (pensioners do not receive job tax credit)
// - Job tax credit (jobbskatteavdrag) only applies to earned income, not pension income
// - See SKV 433 §7.5 for details

// Alternative for calculate-by-code endpoint
export interface TaxCalculationByCodeParams {
  municipalityCode: string;     // Required, e.g. "2480"
  grossIncome: number;          // Required, positive
  churchMember?: boolean;       // Default: false
  isPensioner?: boolean;        // Default: false
}

export interface TaxCalculationResponse {
  // Identification
  municipalityId: string;
  municipalityName: string;
  regionName: string;
  
  // Income
  grossMonthlyIncome: number;
  grossYearlyIncome: number;
  
  // Tax rates (decimal, e.g. 0.228 = 22.8%)
  municipalTaxRate: number;
  regionalTaxRate: number;
  stateTaxRate: number;
  burialFeeRate: number;
  churchFeeRate: number;
  
  // Deductions (yearly values)
  yearlyBasicDeduction: number;
  yearlyJobTaxCredit: number;
  
  // Calculated taxes (yearly values)
  yearlyTaxableIncome: number;
  yearlyMunicipalTax: number;
  yearlyRegionalTax: number;
  yearlyStateTax: number;
  yearlyBurialFee: number;
  yearlyChurchFee: number;
  yearlyTotalTax: number;
  
  // Monthly values
  monthlyTotalTax: number;
  netMonthlyIncome: number;
  
  // Summary
  effectiveTaxRate: number;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message?: string;
  messages?: string[];  // Validation errors
}
```

---

## API Services

```typescript
// src/services/api.ts
import axios from 'axios';

// API Gateway URL - all requests go through port 8080
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});
```

```typescript
// src/services/municipalityService.ts
export const municipalityService = {
  getRegions: () => api.get<Region[]>('/regions'),
  getMunicipalitiesByRegion: (regionId: string) => 
    api.get<Municipality[]>(`/municipalities/by-region/${regionId}`),
  getAllMunicipalities: () => api.get<Municipality[]>('/municipalities'),
};
```

```typescript
// src/services/taxService.ts
export const taxService = {
  // Calculate with UUID (GET) - query parameters
  calculate: (params: {
    municipalityId: string;
    grossIncome: number;
    churchMember?: boolean;
    isPensioner?: boolean;
  }) => api.get<TaxCalculationResponse>('/tax/calculate', { params }),
  
  // Calculate with UUID (POST) - JSON body
  calculatePost: (request: TaxCalculationRequest) => 
    api.post<TaxCalculationResponse>('/tax/calculate', request),
  
  // Calculate with municipality code (GET) - simpler for quick links
  calculateByCode: (params: TaxCalculationByCodeParams) => 
    api.get<TaxCalculationResponse>('/tax/calculate-by-code', { params }),
};
```

### Example: GET /tax/calculate (recommended)

```typescript
// Calculate with UUID as query parameter
const result = await taxService.calculate({
  municipalityId: 'bc208ea4-81dc-4ddb-be51-321e2ffc0f35',  // Umeå UUID
  grossIncome: 35000,
  churchMember: false,
  isPensioner: true  // ⚠️ IMPORTANT: Set to true for pensioners
});

console.log(result.data.yearlyJobTaxCredit);  // 0 (pensioners get no job tax credit)
console.log(result.data.netMonthlyIncome);    // ~30706
```

---

## Composables

### useMunicipalities

Handles region → municipality filtering.

```typescript
// src/composables/useMunicipalities.ts
export function useMunicipalities() {
  const regions = ref<Region[]>([]);
  const municipalities = ref<Municipality[]>([]);
  const selectedRegionId = ref<string | null>(null);
  const selectedMunicipalityId = ref<string | null>(null);
  const loading = ref(false);

  // Load regions on mount
  onMounted(async () => {
    const { data } = await municipalityService.getRegions();
    regions.value = data.sort((a, b) => a.name.localeCompare(b.name, 'sv'));
  });

  // When region changes → load municipalities
  watch(selectedRegionId, async (regionId) => {
    if (!regionId) {
      municipalities.value = [];
      selectedMunicipalityId.value = null;
      return;
    }
    loading.value = true;
    const { data } = await municipalityService.getMunicipalitiesByRegion(regionId);
    municipalities.value = data.sort((a, b) => a.name.localeCompare(b.name, 'sv'));
    selectedMunicipalityId.value = null;
    loading.value = false;
  });

  return { regions, municipalities, selectedRegionId, selectedMunicipalityId, loading };
}
```

### useTaxCalculator

Handles calculation and results.

```typescript
// src/composables/useTaxCalculator.ts
export function useTaxCalculator() {
  const result = ref<TaxCalculationResponse | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function calculate(request: TaxCalculationRequest) {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await taxService.calculate(request);
      result.value = data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Could not calculate';
    } finally {
      loading.value = false;
    }
  }

  return { result, loading, error, calculate };
}
```

---

## Component Structure

```
┌─────────────────────────────────────────────────────────┐
│                    TaxCalculatorPage                     │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐    │
│  │              TaxInputForm                        │    │
│  │  • Dropdown: Region                             │    │
│  │  • Dropdown: Municipality (filtered by region)  │    │
│  │  • InputNumber: Gross income                   │    │
│  │  • Checkbox: Church member, Pensioner           │    │
│  │  • Button: Calculate                            │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌──────────────────────┐  ┌──────────────────────┐    │
│  │   TaxResultCard      │  │   TaxResultCard      │    │
│  │   period="monthly"   │  │   period="yearly"    │    │
│  └──────────────────────┘  └──────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### TaxInputForm

| Prop | Type | Description |
|------|------|-------------|
| `loading` | `boolean` | Disable button during calculation |

| Emit | Payload | Description |
|------|---------|-------------|
| `submit` | `TaxCalculationRequest` | Form data on submit |

### TaxResultCard

| Prop | Type | Description |
|------|------|-------------|
| `result` | `TaxCalculationResponse` | Calculation result |
| `period` | `'monthly' \| 'yearly'` | Shows monthly or yearly values |

**Calculation logic for period:**
```typescript
const divisor = period === 'monthly' ? 12 : 1;

// Directly from API
const netIncome = period === 'monthly' 
  ? result.netMonthlyIncome 
  : result.grossYearlyIncome - result.yearlyTotalTax;

const grossIncome = period === 'monthly' 
  ? result.grossMonthlyIncome 
  : result.grossYearlyIncome;

const totalTax = period === 'monthly'
  ? result.monthlyTotalTax
  : result.yearlyTotalTax;

// Other yearly fields divided for monthly display
const municipalTax = result.yearlyMunicipalTax / divisor;
const regionalTax = result.yearlyRegionalTax / divisor;
const stateTax = result.yearlyStateTax / divisor;
const burialFee = result.yearlyBurialFee / divisor;
const churchFee = result.yearlyChurchFee / divisor;
const basicDeduction = result.yearlyBasicDeduction / divisor;
const jobTaxCredit = result.yearlyJobTaxCredit / divisor;
```

---

## Detail View - Calculation Flow

Display in expandable section ("Show details"):

| Section | Field | API Field | Formula |
|---------|-------|-----------|--------|
| **Income** | Gross income | `grossYearlyIncome` | |
| | Basic deduction | `yearlyBasicDeduction` | SKV 433 §6.1 |
| | Taxable income | `yearlyTaxableIncome` | gross - basic deduction |
| **Taxes** | Municipal tax | `yearlyMunicipalTax` | TI × `municipalTaxRate` |
| | Regional tax | `yearlyRegionalTax` | TI × `regionalTaxRate` |
| | State tax | `yearlyStateTax` | 20% above 643,000 SEK |
| **Fees** | Burial fee | `yearlyBurialFee` | TI × `burialFeeRate` |
| | Church fee | `yearlyChurchFee` | 0 if not member |
| **Reductions** | Job tax credit | `yearlyJobTaxCredit` | SKV 433 §7.5.2 ¹ |
| **Result** | Total tax | `yearlyTotalTax` | |
| | Monthly tax | `monthlyTotalTax` | total / 12 |
| | **Net income** | `netMonthlyIncome` | gross - monthly tax |
| | Effective tax rate | `effectiveTaxRate` | total / gross |

> ¹ **Note**: Job tax credit (jobbskatteavdrag) is **0 for pensioners**. This credit only applies to earned income (arbetsinkomst), not pension income. When `isPensioner = true`, the API returns `yearlyJobTaxCredit: 0`.

> **SKV 433**: Calculations follow the Swedish Tax Agency's technical description for tax tables 2026.
> Includes general pension contribution (7%), tax reductions, and public service fee.

---

## PrimeVue Components

Recommended components:

| Field | PrimeVue Component |
|-------|-------------------|
| Region/Municipality | `Dropdown` with `filter` |
| Gross income | `InputNumber` with `currency="SEK"` |
| Checkboxes | `Checkbox` |
| Calculate button | `Button` |
| Result card | `Card` |
| Details | `Accordion` or `Panel` |
| Table | `DataTable` (readonly) |

---

## CORS (Backend)

CORS is configured in the API Gateway on port 8080. Frontend applications on the following origins are allowed:

- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (alternative dev port)

> **Note**: Always call the API via port 8080 (API Gateway), never directly to backend on port 8181.

---

## Environment

```env
# .env.development
VITE_API_BASE_URL=http://localhost:8080/api/v1

# .env.production  
VITE_API_BASE_URL=https://api.example.com/api/v1
```

> ⚠️ **Important**: Always use the API Gateway URL, not the direct backend URL.

---

## Error Handling

| Status | Handling |
|--------|----------|
| `200` | Display result |
| `400` | Display `messages[]` array (validation errors) |
| `404` | "Municipality not found" |
| `500` | Generic error message |
| Network | "Could not connect to the server" |

---

## Example: Complete API Response

### Non-pensioner (35,000 SEK/month, Umeå)

```json
{
  "municipalityId": "bc208ea4-81dc-4ddb-be51-321e2ffc0f35",
  "municipalityName": "UMEÅ",
  "regionName": "Västerbottens län",
  "grossMonthlyIncome": 37500,
  "grossYearlyIncome": 450000,
  "municipalTaxRate": 0.228,
  "regionalTaxRate": 0.1185,
  "stateTaxRate": 0.2,
  "burialFeeRate": 0.00292,
  "churchFeeRate": 0,
  "yearlyBasicDeduction": 19000,
  "yearlyJobTaxCredit": 51285,
  "yearlyTaxableIncome": 431000,
  "yearlyMunicipalTax": 98268,
  "yearlyRegionalTax": 51073.5,
  "yearlyStateTax": 0,
  "yearlyBurialFee": 1258,
  "yearlyChurchFee": 0,
  "yearlyTotalTax": 98998.5,
  "monthlyTotalTax": 8249.88,
  "netMonthlyIncome": 29250.12,
  "effectiveTaxRate": 0.22
}
```

### Pensioner (35,000 SEK/month, Umeå)

```json
{
  "municipalityId": "bc208ea4-81dc-4ddb-be51-321e2ffc0f35",
  "municipalityName": "UMEÅ",
  "regionName": "Västerbottens län",
  "grossMonthlyIncome": 35000,
  "grossYearlyIncome": 420000,
  "municipalTaxRate": 0.228,
  "regionalTaxRate": 0.1185,
  "stateTaxRate": 0.2,
  "burialFeeRate": 0.00292,
  "churchFeeRate": 0,
  "yearlyBasicDeduction": 165000,
  "yearlyJobTaxCredit": 0,
  "yearlyTaxableIncome": 255000,
  "yearlyMunicipalTax": 58140,
  "yearlyRegionalTax": 30218,
  "yearlyStateTax": 0,
  "yearlyBurialFee": 744,
  "yearlyChurchFee": 0,
  "yearlyTotalTax": 51532,
  "monthlyTotalTax": 4294,
  "netMonthlyIncome": 30706,
  "effectiveTaxRate": 0.1227
}
```

> **Note**: Pensioners receive a higher basic deduction but **no job tax credit** (jobbskatteavdrag), as this credit only applies to earned income.

---

## Display Formatting

```typescript
// src/utils/formatters.ts

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  }).format(value);
};

// Examples:
// formatCurrency(29250.12)  → "29 250 kr"
// formatPercent(0.228)      → "22,8 %"
```
