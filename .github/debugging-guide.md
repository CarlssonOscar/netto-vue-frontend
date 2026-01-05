# Systematic Debugging Guide - Frontend

> **Reference document** - linked from main copilot-instructions.md  
> Use this when troubleshooting unexpected behavior or bugs in Vue applications

---

## Core Philosophy

> **Always start from the highest level and move downward.**  
> Root causes are often in data flow or API integration, not component implementation.

**The Debugging Mantra:**
```
Network → Data → Reactivity → UI
```

**Never skip levels.** A "quick fix" at the UI level often masks a data or API-level root cause.

---

## Quick Reference Checklist

Before diving into code, ask yourself:

1. ✅ Is the API responding? (Check Network tab)
2. ✅ Is data loaded correctly? (Check Vue DevTools)
3. ✅ Are reactive references updated correctly? (Check `.value` usage)
4. ✅ Are props passed correctly? (Vue DevTools Props tab)
5. ✅ Are there console errors or warnings?

**Only after checking these** should you move to specific component implementations.

---

## The Debugging Hierarchy

### Level 1: Network & API (Check FIRST)

**What to inspect:**
- Network tab in browser DevTools
- API response status codes
- CORS errors
- Request/response payloads
- API endpoint availability

**Questions to ask:**
- Is the API responding? (200 OK?)
- Are CORS headers correct?
- Is the request payload correct?
- Is the response data in expected format?
- Are authentication headers included?

**When to investigate this level:**
- Multiple components show "No data"
- Inconsistent data display
- Loading states never complete
- 404, 500, or CORS errors in console

**Common issues:**
- Wrong API endpoint URL
- Missing authentication tokens
- CORS misconfiguration
- Network timeout
- Incorrect request body format

---

### Level 2: Data Management (Composables & Stores)

**What to inspect:**
- Composables returning data
- Pinia store state
- Data transformations
- API client functions

**Questions to ask:**
- Is data being fetched correctly?
- Are composables returning expected values?
- Is store state updating?
- Are data transformations correct?

**When to investigate this level:**
- API responds correctly but UI shows wrong data
- Data exists in network tab but not in component
- Store mutations don't trigger updates
- Composable values are undefined

**Common issues:**
- Forgetting to `return` values from composable
- Not updating store state correctly
- Incorrect data mapping/transformation
- Async timing issues

---

### Level 3: Reactivity (Vue's Reactive System)

**What to inspect:**
- `ref()` and `reactive()` usage
- `.value` access on refs
- Computed properties
- Watchers

**Questions to ask:**
- Are you using `.value` to access ref values?
- Are reactive objects being replaced instead of mutated?
- Are computed properties recalculating?
- Are watchers triggering?

**When to investigate this level:**
- Data exists but UI doesn't update
- Changes to variables don't reflect in template
- Computed values are stale
- Watchers not firing

**Common issues:**
- Missing `.value` when accessing refs
- Replacing reactive objects instead of mutating properties
- Using non-reactive data structures
- Mutating props directly

---

### Level 4: Component & UI (Check LAST)

**What to inspect:**
- Component props
- Event handlers
- Template rendering
- Conditional rendering (v-if, v-show)
- List rendering (v-for with :key)

**Questions to ask:**
- Are props passed correctly from parent?
- Are event handlers bound properly?
- Is conditional rendering logic correct?
- Are v-for keys unique and stable?

**When to investigate this level:**
- Higher levels are confirmed correct
- Issue is isolated to specific component
- UI rendering is incorrect
- Events not firing

**Common issues:**
- Incorrect prop types
- Missing or incorrect event bindings
- Wrong conditional logic in v-if
- Non-unique or unstable v-for keys
- Incorrect PrimeVue component usage

---

## Follow the Data Flow

Always trace the entire path:

```
API Request → Network Response → Composable/Store → Reactive State → Component → UI
```

**Example for missing data in UI:**

1. **Network**: Is the API call being made? Check Network tab
2. **Response**: Is the response successful (200)? What's the payload?
3. **Composable**: Is data being extracted correctly from response?
4. **Reactivity**: Is the ref/reactive being updated?
5. **Component**: Is the component receiving the data via props?
6. **UI**: Is the template rendering the data correctly?

**Do not skip levels** - the root cause is often earlier in the chain than you think.

---

## Common Issue Patterns

| **Symptom** | **Likely Level** | **What to Check** |
|-------------|------------------|-------------------|
| No data showing | Network | API endpoint, CORS, authentication |
| Data in network tab but not UI | Data/Reactivity | Composable return values, ref `.value` |
| UI doesn't update on data change | Reactivity | Missing `.value`, non-reactive assignment |
| Component not receiving data | Component | Props passing, parent-child communication |
| Intermittent rendering issues | Reactivity | Computed dependencies, watcher triggers |
| PrimeVue component not working | Component | Component props, PrimeVue configuration |

---

## Domain-Specific Debugging Paths

### API Integration Issues
```
1. Network tab (request made?)
2. Request headers (Content-Type, auth tokens)
3. Response status and body
4. CORS configuration
5. Composable error handling
```

### Reactivity Issues
```
1. Check if using ref/reactive correctly
2. Verify `.value` usage in script
3. Check computed dependencies
4. Verify watcher triggers
5. Check for direct prop mutation
```

### Component Communication Issues
```
1. Props definition and types
2. Emits definition
3. v-model usage
4. Provide/inject setup
5. Event handler bindings
```

---

## Documentation Template

For each major bug, document:

```markdown
## Bug: [Brief Description]

### Symptoms
- What was observed?
- When did it occur?

### Investigation Path
1. **Network Level**: What was checked?
2. **Data Level**: What was inspected?
3. **Reactivity Level**: What was analyzed?
4. **UI Level**: What was examined?

### Root Cause
- What was the actual problem?
- At which level was it found?

### Fix Applied
- What was changed?
- Why does this fix the root cause?

### Lessons Learned
- What will prevent this in the future?
- What could have been caught earlier?
```

This creates institutional knowledge and prevents repeating the same debugging journey.

---

## Warning: Avoid "Quick Fixes"

❌ **Bad approach:**
```typescript
// Adding null checks everywhere without finding why data is missing
if (user.value === null) {
  user.value = { id: 0, name: 'Unknown' } // Hiding the real issue
}
```

✅ **Good approach:**
```
1. Investigate why user is null
2. Check API response in Network tab
3. Verify composable is fetching data correctly
4. Fix the root cause (API endpoint, data fetching logic)
5. Remove workarounds
```

**Band-aid solutions create technical debt.** Always address root causes.

---

## Red Flags - Stop and Check Network/API

🚩 **Immediate red flags that point to API/Network issues:**
- Multiple components show "No data"
- Console errors mentioning CORS or 404
- Intermittent failures with loading states
- Data that worked before suddenly doesn't
- Different behavior after page refresh
- Authentication errors in Network tab

**Don't waste time debugging components when the API isn't responding.**

---

## Tools and Techniques

### Vue DevTools
```
- Component tree inspection
- Component state and props
- Pinia store state
- Events timeline
- Performance profiling
```

### Browser DevTools
```javascript
// Network tab: Check all API calls
// Console: Look for errors and warnings
// Elements: Inspect rendered DOM
// Sources: Set breakpoints in component code
```

### Logging in Composables
```typescript
export function useData() {
  const data = ref(null)
  const loading = ref(false)
  
  const fetchData = async () => {
    console.log('Fetching data...') // Track execution
    loading.value = true
    
    try {
      const response = await fetch('/api/data')
      console.log('Response:', response.status) // Check status
      data.value = await response.json()
      console.log('Data loaded:', data.value) // Verify data
    } catch (error) {
      console.error('Fetch failed:', error) // Catch errors
    } finally {
      loading.value = false
    }
  }
  
  return { data, loading, fetchData }
}
```

---

*Last Updated: 2025-12-30*
