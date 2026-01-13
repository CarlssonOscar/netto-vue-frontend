# Architecture & Design Principles - Vue Frontend

> **Reference document** - linked from main copilot-instructions.md  
> Consult this when making architectural decisions or designing Vue components

---

## Vue Architecture Patterns

### Component-Based Architecture

**Core Principles:**
- Build UI from small, reusable components
- Each component has a single responsibility
- Components communicate via props (down) and events (up)
- Shared state managed by Pinia stores

**Benefits:**
- Reusability: Components can be used across the application
- Testability: Small components are easier to test
- Maintainability: Changes are isolated to specific components

### Composition API Pattern

**Use Composition API (`<script setup>`) for all components:**
- Better TypeScript support
- More flexible code organization
- Easier to extract and reuse logic
- Clearer dependency tracking

```vue
<!-- ✅ GOOD - Composition API -->
<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>

<!-- ❌ AVOID - Options API (legacy) -->
<script>
export default {
  data() {
    return { count: 0 }
  },
  computed: {
    doubled() { return this.count * 2 }
  }
}
</script>
```

---

## Project Structure

### Recommended Folder Structure

```
src/
├── assets/           # Static assets (images, fonts)
├── components/       # Reusable UI components
│   ├── common/       # Generic components (Button, Input)
│   └── tax/          # Feature-specific components
├── composables/      # Reusable composition functions
├── router/           # Vue Router configuration
├── stores/           # Pinia stores
├── types/            # TypeScript interfaces/types
├── utils/            # Utility functions
└── views/            # Page-level components
```

### File Responsibilities

| **Folder** | **Contains** | **Example** |
|------------|-------------|-------------|
| `components/` | Reusable UI pieces | `MunicipalitySelect.vue` |
| `composables/` | Shared reactive logic | `useTaxCalculation.ts` |
| `stores/` | Global state | `municipalityStore.ts` |
| `types/` | TypeScript definitions | `tax.ts` |
| `views/` | Route-level pages | `CalculatorView.vue` |
| `utils/` | Pure helper functions | `formatCurrency.ts` |

---

## Component Design Principles

### Single Responsibility

Each component should do ONE thing well:

```vue
<!-- ❌ BAD - Component does too much -->
<template>
  <div>
    <input v-model="salary" />
    <select v-model="municipality"><!-- options --></select>
    <button @click="calculate">Calculate</button>
    <div v-if="result"><!-- result display --></div>
  </div>
</template>

<!-- ✅ GOOD - Split into focused components -->
<template>
  <SalaryInput v-model="salary" />
  <MunicipalitySelect v-model="municipality" />
  <CalculateButton @click="calculate" :loading="loading" />
  <TaxResultDisplay v-if="result" :result="result" />
</template>
```

### Smart vs Dumb Components

**Smart Components (Containers):**
- Manage state and data fetching
- Use composables and stores
- Pass data to child components
- Usually views/pages

**Dumb Components (Presentational):**
- Receive data via props
- Emit events for interactions
- No direct API calls or store access
- Highly reusable

```vue
<!-- Smart Component (View) -->
<script setup lang="ts">
import { useTaxCalculation } from '@/composables/useTaxCalculation'
const { calculate, result, loading } = useTaxCalculation()
</script>

<template>
  <TaxForm @submit="calculate" />
  <TaxResult :result="result" :loading="loading" />
</template>

<!-- Dumb Component -->
<script setup lang="ts">
defineProps<{ result: TaxResult; loading: boolean }>()
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else>{{ result.monthlyNetSalary }}</div>
</template>
```

---

## State Management

### When to Use What

| **State Type** | **Solution** | **Example** |
|----------------|-------------|-------------|
| Component-local | `ref()`, `reactive()` | Form inputs, UI toggles |
| Parent-child | Props + Events | Selected item, form data |
| Sibling/distant | Pinia store | User session, cached data |
| Server data | Composables | API responses |

### Pinia Store Pattern

```typescript
// stores/municipalityStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Municipality } from '@/types/municipality'

export const useMunicipalityStore = defineStore('municipality', () => {
  // State
  const municipalities = ref<Municipality[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  const fetchMunicipalities = async () => {
    if (municipalities.value.length > 0) return // Cache hit
    
    loading.value = true
    try {
      const response = await fetch('/api/municipalities')
      municipalities.value = await response.json()
    } catch (e) {
      error.value = 'Failed to load municipalities'
    } finally {
      loading.value = false
    }
  }

  // Getters
  const getMunicipalityById = (id: string) => 
    municipalities.value.find(m => m.id === id)

  return {
    municipalities,
    loading,
    error,
    fetchMunicipalities,
    getMunicipalityById
  }
})
```

---

## Composables Design

### When to Create a Composable

✅ **Good reasons:**
- Logic is used by multiple components
- Complex reactive logic that clutters components
- API integration that needs loading/error states
- Encapsulating third-party library usage

❌ **Bad reasons:**
- Simple one-liner computations
- Logic used by only one component (keep it local)
- Non-reactive utility functions (use `utils/` instead)

### Composable Structure

```typescript
// composables/useTaxCalculation.ts
export function useTaxCalculation() {
  // 1. Reactive state
  const result = ref<TaxResult | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 2. Computed properties
  const hasResult = computed(() => result.value !== null)

  // 3. Methods
  const calculate = async (request: TaxRequest) => {
    // implementation
  }

  const reset = () => {
    result.value = null
    error.value = null
  }

  // 4. Lifecycle hooks (if needed)
  onUnmounted(() => {
    // cleanup
  })

  // 5. Return public API
  return {
    result: readonly(result),
    loading: readonly(loading),
    error: readonly(error),
    hasResult,
    calculate,
    reset
  }
}
```

---

## API Integration

### API Client Pattern

```typescript
// api/taxApi.ts
const BASE_URL = 'http://localhost:8081/gateway'

export const taxApi = {
  async calculate(request: TaxRequest): Promise<TaxResult> {
    const response = await fetch(`${BASE_URL}/tax/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.messages?.join(', ') || 'Calculation failed')
    }
    
    return response.json()
  },

  async getMunicipalities(): Promise<Municipality[]> {
    const response = await fetch(`${BASE_URL}/municipalities`)
    return response.json()
  }
}
```

### Use in Composables

```typescript
// composables/useTaxCalculation.ts
import { taxApi } from '@/api/taxApi'

export function useTaxCalculation() {
  const result = ref<TaxResult | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const calculate = async (request: TaxRequest) => {
    loading.value = true
    error.value = null
    
    try {
      result.value = await taxApi.calculate(request)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  return { result, loading, error, calculate }
}
```

---

## Anti-Patterns to Avoid

❌ **God Components**: Components with 500+ lines of code  
❌ **Prop Drilling**: Passing props through many layers (use provide/inject or stores)  
❌ **Direct Prop Mutation**: Always emit events to parent  
❌ **Business Logic in Templates**: Keep templates declarative  
❌ **Mixing Options and Composition API**: Choose one pattern  
❌ **Forgetting `.value`**: Common source of reactivity bugs  
❌ **Inline Styles Everywhere**: Use CSS classes or PrimeVue styling  
❌ **Ignoring TypeScript Errors**: Fix types, don't use `any`  

---

## PrimeVue Integration

### Component Usage

- Use PrimeVue components for all standard UI elements
- Customize via pass-through (PT) props, not CSS overrides
- Follow PrimeVue naming conventions

### Theme Customization

```typescript
// main.ts
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark-mode'
    }
  }
})
```

---

## When to Deviate

These principles are guidelines, not laws. Deviate when:
- **Performance is critical** (e.g., virtualization for large lists)
- **Simple solutions** don't benefit from added abstraction
- **Prototype/MVP** where speed matters more than architecture

**But:**
- Document why you're deviating
- Plan to refactor when the codebase grows
- Revisit decisions during code review

---

*Last Updated: 2025-12-30*

