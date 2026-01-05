# GitHub Copilot Instructions - Vue Frontend

> **Vue 3 + TypeScript + PrimeVue Project**  
> Last Updated: 2025-12-30

---

## 📋 Quick Navigation

**Primary Documentation:**
- 📖 [`docs/frontend-integration-guide.md`](../docs/frontend-integration-guide.md) - API integration guide
- 🏗️ [Architecture & Design Principles](architecture-principles.md) - Vue patterns, component design
- 📐 [Code Quality Standards](code-standards.md) - TypeScript, Vue, naming conventions
- 🐛 [Debugging Guide](debugging-guide.md) - Frontend troubleshooting approach

---

## ⚠️ CRITICAL RULES - Always Apply

### 1. Always Re-read Files
- **Never assume** that a previously shown file is still up to date
- **When modifying a file**: re-read it first, then show the new version with changes
- **Don't rely on memory** or earlier context for file contents

### 2. Think Before Claiming Correctness
- **If told you are wrong**: re-evaluate your answer critically
- **Check** against code, documentation, and established patterns
- **Respond** with facts and reasoning, not assumptions
- **Acknowledge mistakes** when wrong; explain reasoning when correct

### 3. Compare Solutions
- **Analyze** your own answers vs. previous solutions
- **If the old solution is better**: explicitly suggest reverting to it
- **Don't assume** newer is always better

### 4. Composables and Reactivity
**Use Vue Composition API patterns consistently.**

✅ **DO**:
- Use composables for shared logic
- Keep components focused and small
- Use `ref()` and `reactive()` properly
- Extract API calls to composables

❌ **DON'T**:
- Mix Options API and Composition API
- Put business logic directly in components
- Mutate props directly
- Forget to use `.value` for refs

```vue
<!-- ❌ WRONG - Logic in component -->
<script setup lang="ts">
import { ref } from 'vue'

const data = ref(null)
fetch('/api/data').then(r => r.json()).then(d => data.value = d)
</script>

<!-- ✅ CORRECT - Use composable -->
<script setup lang="ts">
import { useTaxCalculation } from '@/composables/useTaxCalculation'

const { result, loading, error, calculate } = useTaxCalculation()
</script>
```

---

## 🎯 Core Principles (Quick Reference)

### Architecture
- **Component-Based**: Small, focused, reusable components
- **Composable Pattern**: Extract shared logic to composables
- **State Management**: Use Pinia for global state
- **Full details**: See [architecture-principles.md](architecture-principles.md)

### Code Quality
- **Single Responsibility**: One concern per component/composable
- **Intention-Revealing Names**: Clear over clever
- **TypeScript**: Use types, avoid `any`
- **Full standards**: See [code-standards.md](code-standards.md)

### Debugging
- **Top-Down Approach**: Network → Data → Reactivity → UI
- **Use Vue DevTools**: Inspect component state and props
- **Full guide**: See [debugging-guide.md](debugging-guide.md)

---

## 🤖 AI Behavior Rules

### General Behavior
- **Explain why** for architectural choices, not only how
- **Challenge violations** of Vue best practices politely (composables, reactivity, component design)
- **Ask for clarification** instead of guessing when requirements are ambiguous
- **Stay focused**: Implement only what has been requested

### Working with Files
- **For large changes**: Describe what changed and why
- **For refactoring**: Explain before/after and reasoning
- **For big changes**: Explain differences clearly

### What NOT to Do (Unless Asked)
- ❌ Extra refactorings
- ❌ Additional logging
- ❌ "Nice to have" improvements
- ❌ Unrelated fixes

---

## 📚 Documentation Standards

### API Integration Reference
**Primary Documentation**: [`docs/frontend-integration-guide.md`](../docs/frontend-integration-guide.md)  
*(API endpoints, request/response formats, Vue integration examples)*

### When to Update Documentation
| **Priority** | **Trigger** |
|--------------|-------------|
| **MUST** | New API endpoints, new components, state management changes, routing changes |
| **SHOULD** | New composables, significant refactoring, new PrimeVue patterns |

### Documentation Awareness
- **For API questions**: Use `docs/frontend-integration-guide.md` as primary reference
- **Propose updates**: If your suggestions add new API integrations or patterns
- **Follow patterns**: Established in the documentation unless strong reason to deviate

---

## 🔧 Code Standards (Quick Reference)

### Naming Conventions
```typescript
// TypeScript / Vue
UserService                    // Classes: PascalCase
getUserById()                  // Functions: camelCase
useTaxCalculation()            // Composables: use + PascalCase
userData                       // Variables: camelCase
MAX_RETRY_COUNT               // Constants: UPPER_SNAKE_CASE
UserListComponent.vue         // Components: PascalCase
```

### Essential Rules
- **Comments**: English only, 1-2 lines, explain "why" not "what"
- **Async/Await**: Use async/await for API calls
- **Components**: Small and focused, extract logic to composables
- **TypeScript**: Avoid `any`, use proper types and interfaces
- **PrimeVue**: Use built-in components, customize via pass-through

**Full standards**: See [code-standards.md](code-standards.md)

---

## 🐛 Debugging (Quick Reference)

### Before Diving Into Code - Check:
1. ✅ Is the API responding? (Network tab)
2. ✅ Is data loaded correctly? (Vue DevTools)
3. ✅ Are reactive references updated? (Check `.value`)
4. ✅ Are props passed correctly to child components?
5. ✅ Are there console errors or warnings?

### Hierarchy (Top → Down)
```
1. Network Level (API calls, CORS, status codes)
2. Data Level (Composables, stores, data fetching)
3. Reactivity Level (ref/reactive, computed, watchers)
4. UI Level (Component rendering, props, events)
```

**Full guide**: See [debugging-guide.md](debugging-guide.md)

---

## 📝 Change Management

### For Every Code Change
- Implement only what was explicitly requested
- For large changes: explain what, why, and potential side effects
- For architectural changes: reference relevant principles and propose doc updates

### Code Review Mindset
- Challenge violations of component separation, composable patterns, and Vue best practices
- If old solution is better: say so clearly and suggest reverting
- Prefer refactoring over rewriting unless component is truly broken

---

## Version Information

**Project Type**: `Vue 3 + TypeScript + PrimeVue`  
**Copilot Instructions Version**: `2.0`  
**Last Updated**: `2025-12-30`  
**Maintained By**: `RegVastOscar`

---

*This instruction file must be followed by both developers and AI assistants. It is a central tool for maintaining architecture, code quality, and living documentation in this project.*