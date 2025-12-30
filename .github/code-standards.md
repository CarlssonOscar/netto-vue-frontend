# Code Quality Standards - Vue Frontend

> **Reference document** - linked from main copilot-instructions.md  
> Follow these standards for all Vue/TypeScript code contributions

---

## Naming Conventions

### TypeScript / Vue

| **Type** | **Convention** | **Example** |
|----------|---------------|-------------|
| Components | `PascalCase` | `UserList.vue`, `SalaryCalculator.vue` |
| Composables | `use` + `PascalCase` | `useTaxCalculation`, `useMunicipalities` |
| Functions | `camelCase` | `getUserById`, `formatCurrency` |
| Variables | `camelCase` | `userId`, `taxResult` |
| Refs | `camelCase` | `isLoading`, `userData` |
| Constants | `UPPER_SNAKE_CASE` | `API_BASE_URL`, `MAX_RETRY_COUNT` |
| Interfaces/Types | `PascalCase` | `TaxResult`, `Municipality` |
| Enums | `PascalCase` | `LoadingState`, `TaxType` |
| Props | `camelCase` | `municipalityId`, `isDisabled` |
| Events | `camelCase` | `update:modelValue`, `submit` |

### File Naming

| **Type** | **Convention** | **Example** |
|----------|---------------|-------------|
| Components | `PascalCase.vue` | `SalaryCalculator.vue` |
| Composables | `usePascalCase.ts` | `useTaxCalculation.ts` |
| Stores | `camelCase.ts` | `taxStore.ts` |
| Types | `camelCase.ts` | `taxTypes.ts` |
| Utils | `camelCase.ts` | `formatters.ts` |

### General Naming Principles

✅ **DO:**
- Use intention-revealing names
- Prefix composables with `use`
- Prefix boolean refs with `is`, `has`, `can`
- Use descriptive component names

❌ **DON'T:**
- Use single-letter names (except loop counters)
- Use abbreviations unless universally understood
- Use generic names like `data`, `info`, `item`

**Examples:**

```typescript
// ❌ BAD
const d = ref(null)
const x = useFetch()
const comp = defineComponent({})

// ✅ GOOD
const taxResult = ref<TaxResult | null>(null)
const { data, loading, error } = useTaxCalculation()
const SalaryCalculator = defineComponent({})
```

---

## Component Structure

### Script Setup Order

Follow this order in `<script setup>`:

```vue
<script setup lang="ts">
// 1. Imports
import { ref, computed, onMounted } from 'vue'
import { useTaxCalculation } from '@/composables/useTaxCalculation'
import type { TaxResult } from '@/types/tax'

// 2. Props & Emits
const props = defineProps<{
  municipalityId: string
  initialSalary?: number
}>()

const emit = defineEmits<{
  calculated: [result: TaxResult]
}>()

// 3. Composables
const { calculate, loading, result } = useTaxCalculation()

// 4. Reactive State
const salary = ref(props.initialSalary ?? 0)
const churchMember = ref(false)

// 5. Computed Properties
const isValid = computed(() => salary.value > 0 && props.municipalityId)

// 6. Methods
const handleSubmit = async () => {
  await calculate({ /* ... */ })
  if (result.value) {
    emit('calculated', result.value)
  }
}

// 7. Lifecycle Hooks
onMounted(() => {
  // initialization
})
</script>
```

### Component Size

**Keep components small and focused:**

- Target: < 100 lines in `<script setup>`
- Warning: 100-200 lines (consider extracting)
- Red flag: 200+ lines (must split or extract to composable)

**Extraction strategies:**

```vue
<!-- ❌ BAD - Too much logic in component -->
<script setup lang="ts">
// 150 lines of tax calculation logic
// 50 lines of form validation
// 30 lines of API calls
</script>

<!-- ✅ GOOD - Logic extracted to composables -->
<script setup lang="ts">
import { useTaxCalculation } from '@/composables/useTaxCalculation'
import { useTaxForm } from '@/composables/useTaxForm'

const { calculate, result, loading } = useTaxCalculation()
const { form, validate, isValid } = useTaxForm()
</script>
```

---

## Composables - Best Practices

### Structure

```typescript
// composables/useTaxCalculation.ts
import { ref, readonly } from 'vue'
import type { TaxRequest, TaxResult } from '@/types/tax'

export function useTaxCalculation() {
  // Private state
  const _result = ref<TaxResult | null>(null)
  const _loading = ref(false)
  const _error = ref<string | null>(null)

  // Methods
  const calculate = async (request: TaxRequest) => {
    _loading.value = true
    _error.value = null

    try {
      const response = await fetch('/api/tax/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        throw new Error('Calculation failed')
      }

      _result.value = await response.json()
    } catch (e) {
      _error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      _loading.value = false
    }
  }

  const reset = () => {
    _result.value = null
    _error.value = null
  }

  // Return readonly refs for state, writable for methods
  return {
    result: readonly(_result),
    loading: readonly(_loading),
    error: readonly(_error),
    calculate,
    reset
  }
}
```

### Rules

✅ **DO:**
- Return `readonly()` refs when consumers shouldn't modify state
- Handle loading and error states
- Clean up side effects in `onUnmounted`
- Use TypeScript for all composables

❌ **DON'T:**
- Mutate state directly from components
- Forget error handling
- Create composables that do too many things
- Use `any` types

---

## TypeScript Standards

### Use Proper Types

```typescript
// ❌ BAD - Using any
const result: any = await fetch('/api/data')
const handleClick = (event: any) => {}

// ✅ GOOD - Proper types
const result: TaxResult = await fetch('/api/data').then(r => r.json())
const handleClick = (event: MouseEvent) => {}
```

### Define Interfaces for API Data

```typescript
// types/tax.ts
export interface TaxRequest {
  municipalityId: string
  grossMonthlySalary: number
  churchMember?: boolean
  isPensioner?: boolean
}

export interface TaxResult {
  grossMonthlySalary: number
  monthlyNetSalary: number
  effectiveTaxRate: number
  municipalTax: number
  regionalTax: number
  stateTax: number
  jobTaxCredit: number
}

export interface Municipality {
  id: string
  code: string
  name: string
  municipalTaxRate: number
  regionId: string
  regionName: string
}
```

### Strict Null Checks

```typescript
// ❌ BAD - Ignoring null possibility
const name = user.value.name // Error if user is null

// ✅ GOOD - Handle null cases
const name = user.value?.name ?? 'Unknown'

// ✅ GOOD - Type guard
if (user.value) {
  const name = user.value.name
}
```

---

## Props and Events

### Define Props with Types

```vue
<script setup lang="ts">
// ❌ BAD - No types
const props = defineProps(['municipalityId', 'salary'])

// ✅ GOOD - TypeScript types
interface Props {
  municipalityId: string
  salary: number
  isDisabled?: boolean
}

const props = defineProps<Props>()

// ✅ GOOD - With defaults
const props = withDefaults(defineProps<Props>(), {
  isDisabled: false
})
</script>
```

### Define Emits with Types

```vue
<script setup lang="ts">
// ❌ BAD - No types
const emit = defineEmits(['update', 'submit'])

// ✅ GOOD - TypeScript types
const emit = defineEmits<{
  'update:modelValue': [value: string]
  submit: [data: FormData]
  cancel: []
}>()
</script>
```

---

## PrimeVue Standards

### Use PrimeVue Components

```vue
<!-- ✅ GOOD - Use PrimeVue components -->
<template>
  <InputNumber v-model="salary" :min="0" />
  <Select v-model="municipality" :options="municipalities" optionLabel="name" />
  <Button label="Calculate" @click="handleSubmit" :loading="loading" />
</template>
```

### Customize via Pass-through

```typescript
// main.ts - Global PT configuration
app.use(PrimeVue, {
  pt: {
    button: {
      root: { class: 'custom-button' }
    }
  }
})

// Or per-component
<Button :pt="{ root: { class: 'special-button' } }" />
```

### Loading States

```vue
<template>
  <div v-if="loading">
    <ProgressSpinner />
  </div>
  
  <div v-else-if="error">
    <Message severity="error">{{ error }}</Message>
  </div>
  
  <div v-else>
    <!-- Content -->
  </div>
</template>
```

---

## Reactivity Rules

### Use Refs Correctly

```typescript
// ❌ BAD - Forgetting .value
const count = ref(0)
count = count + 1 // Wrong!

// ✅ GOOD
count.value = count.value + 1

// ❌ BAD - Replacing reactive object
const state = reactive({ count: 0 })
state = { count: 1 } // Wrong! Breaks reactivity

// ✅ GOOD - Mutate properties
state.count = 1
```

### Don't Mutate Props

```vue
<script setup lang="ts">
const props = defineProps<{ value: string }>()

// ❌ BAD - Mutating prop
props.value = 'new value'

// ✅ GOOD - Emit event to parent
const emit = defineEmits<{ 'update:value': [value: string] }>()
emit('update:value', 'new value')
</script>
```

---

## Async/Await

### Use async/await for API Calls

```typescript
// ❌ BAD - Promise chains
fetch('/api/data')
  .then(response => response.json())
  .then(data => {
    result.value = data
  })
  .catch(error => {
    console.error(error)
  })

// ✅ GOOD - async/await
const fetchData = async () => {
  try {
    const response = await fetch('/api/data')
    result.value = await response.json()
  } catch (error) {
    console.error(error)
  }
}
```

### Handle Loading States

```typescript
const loading = ref(false)
const error = ref<string | null>(null)

const fetchData = async () => {
  loading.value = true
  error.value = null
  
  try {
    // ... fetch
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unknown error'
  } finally {
    loading.value = false
  }
}
```

---

## Comments & Documentation

### When to Comment

✅ **Good reasons to comment:**
- Explain **why** a decision was made
- Document complex computed logic
- Clarify non-obvious reactive behavior
- Note workarounds for library bugs

❌ **Bad reasons to comment:**
- Explain **what** the code does
- Leave commented-out code
- TODOs without context

### Examples

```typescript
// ❌ BAD - Restating the code
// Calculate the total
const total = computed(() => items.value.reduce((sum, i) => sum + i.price, 0))

// ✅ GOOD - Explaining why
// Using shallow ref to avoid deep reactivity on large dataset (performance)
const municipalities = shallowRef<Municipality[]>([])

// ✅ GOOD - Documenting workaround
// PrimeVue Select requires array even for single value (v4.5.4 bug)
const selectedItems = ref<string[]>([])
```

---

## Formatting

### Use Prettier

Project uses Prettier for consistent formatting. Run before committing:

```bash
npm run format
```

### Template Formatting

```vue
<!-- ✅ GOOD - Readable attribute formatting -->
<Button
  label="Calculate Net Salary"
  icon="pi pi-calculator"
  :loading="loading"
  :disabled="!isValid"
  @click="handleSubmit"
/>

<!-- ❌ BAD - Hard to read -->
<Button label="Calculate Net Salary" icon="pi pi-calculator" :loading="loading" :disabled="!isValid" @click="handleSubmit" />
```

---

*Last Updated: 2025-12-30*
