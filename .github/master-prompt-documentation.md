# Master Prompt for System Documentation

> **Purpose**: This document contains the master prompt used to generate or update `docs/system-overview.md`.  
> **Usage**: Use this prompt when creating comprehensive system documentation or when major architectural changes require documentation updates.  
> **Last Updated**: `2026-01-06`

---

## Philosophy

**Documentation should explain WHY the system is built as it is, not catalog every implementation detail.**

- Focus on architectural decisions and trade-offs
- Document flows and interactions, not exact implementations
- Keep concepts stable, let code be the source of truth for details
- Reference code files for specifics (versions, schemas, configurations)

---

## Overview

You are tasked with creating high-level system documentation for **NettoFrontend**.  
Generate or update a `docs/system-overview.md` file that remains stable over time by focusing on architectural concepts rather than implementation details.

---

## Required Sections

### 1. System Overview
- Brief description of the system's purpose and core functionality
- Target users and primary use cases
- Key business value propositions

### 2. Architecture Overview
- High-level architecture diagram (Mermaid)
- Architectural pattern used (Clean Architecture, Onion Architecture, etc.)
- Layer descriptions and responsibilities
- Separation of concerns explanation

### 3. Technology Stack
**Focus on choices and rationale, not versions**
- Core framework and UI technology (e.g., ".NET + Blazor Server")
- Database technology and why
- Authentication approach (Windows Auth, OAuth, etc.)
- Key architectural libraries (ORM, DI container, etc.)
- **Note**: For specific versions, reference `.csproj` files

**What to include:**
- Technology choices and their rationale
- Major trade-offs (e.g., Blazor Server vs WebAssembly)
- External service integrations

**What to avoid:**
- Exact version numbers (these change frequently)
- Exhaustive package lists (`.csproj` is source of truth)
- Configuration details (reference `appsettings.json` instead)

### 4. Core Components
**Focus on responsibilities and relationships, not implementations**

For each major component:
- Component name and purpose
- Responsibilities and boundaries
- Key interfaces and contracts (conceptually, not full signatures)
- Dependencies and relationships
- Mermaid diagram showing component structure

**What to include:**
- High-level service responsibilities (e.g., "PatientService manages patient CRUD and search")
- Component interactions and dependencies
- Separation of concerns between layers

**What to avoid:**
- Exact method signatures (these change with refactoring)
- Implementation details (algorithm specifics, data structures)
- Property lists from entities (code is source of truth)

### 5. Data Flow & Key Scenarios
**Focus on interactions and business flows, not implementation**

- Authentication and authorization flow (Mermaid sequence diagram)
- Key business process flows (e.g., "Patient search with treatment filters")
- Integration points with external systems
- Error handling approach

**What to include:**
- Sequence diagrams for critical user journeys
- How layers interact for key scenarios
- Decision points and branching logic

**What to avoid:**
- Line-by-line code walkthroughs
- Every possible edge case
- Implementation-specific error handling (try-catch blocks)

### 6. Domain Model
**Focus on concepts and relationships, not exact structure**

- Core entities and their relationships (Mermaid ER diagram)
- Key domain concepts (e.g., "Treatment lifecycle with 4 steps")
- Business rules that drive design
- Aggregates and boundaries

**What to include:**
- ER diagram showing entity relationships
- Domain concepts and their meaning
- Critical business rules (e.g., "cascade delete behavior")

**What to avoid:**
- Complete entity property lists (code is source of truth)
- Validation rules (these belong in validators)
- Data annotations and constraints (check entity files)

### 7. Security & Authorization
**Focus on approach and mechanisms, not configurations**

- Authentication mechanisms (e.g., "Windows Authentication via AD")
- Authorization approach (role-based, claims-based)
- Key security decisions and trade-offs
- Data protection approach

**What to include:**
- How users are authenticated
- Authorization model (roles, policies)
- Integration with external identity providers

**What to avoid:**
- Specific domain names or server addresses
- Detailed configuration snippets (reference config files)
- Token lifetimes and cache durations

### 8. Key Design Decisions & Trade-offs
**Document WHY choices were made**

For major decisions, document:
- The decision that was made
- Alternatives considered
- Rationale for the choice
- Trade-offs and limitations

**Examples:**
- "Why Blazor Server instead of WebAssembly?"
- "Why separate PatientSearchService from PatientService?"
- "Why use SemaphoreSlim for delete operations?"
- "Why is TreatmentStep UI-only and not persisted?"

**What to include:**
- Context for the decision
- Pros and cons of the chosen approach
- Known limitations

**What to avoid:**
- Justifying every small implementation detail
- Defending decisions without acknowledging trade-offs

### 9. Integration Points
**Document external dependencies and how they're used**

- External services (AD, APIs, databases)
- Integration approach (direct calls, message queues, etc.)
- Authentication with external systems
- Error handling and resilience

**What to include:**
- What external systems are integrated
- Purpose of each integration
- Communication patterns

**What to avoid:**
- Connection strings and endpoints (reference config)
- API keys or credentials
- Detailed protocol specifications

### 10. Known Limitations & Technical Debt
**Be honest about current state**

- Current architectural limitations
- Known technical debt
- Planned improvements
- Trade-offs that affect functionality

**What to include:**
- Limitations users should be aware of
- Technical debt that affects maintainability
- Future improvements planned

**What to avoid:**
- Blaming previous developers
- Excessive detail on minor issues
- Promises without concrete plans

### 11. Glossary
**Define domain and technical terms**

- Domain-specific terms (e.g., "Treatment step", "Queue date")
- Technical abbreviations (e.g., "DTO", "EF Core")
- Business concepts unique to this system

**What to include:**
-- Terms that are non-obvious to new team members
- Acronyms used throughout documentation
- Domain concepts with specific meaning in this context

**What to avoid:**
- Common software terms everyone knows
- Over-explaining basic concepts

---

## Sections NOT Required

The following sections are **NOT needed** as they create maintenance burden without adding value:

- ❌ **Detailed Database Schema** - Code and migrations are source of truth
- ❌ **Testing Strategy Details** - Test code shows the approach
- ❌ **Deployment Pipeline Steps** - CI/CD configs are source of truth
- ❌ **Environment Setup** - README.md handles this
- ❌ **API Endpoint Lists** - Code and Swagger are source of truth
- ❌ **Configuration Examples** - Config files are source of truth

**Instead, reference the actual files** where this information lives.

---

## Documentation Guidelines

### Content Quality
- **Use Mermaid diagrams extensively** for visual clarity
- **Keep language clear and concise** - avoid jargon when possible
- **Focus on "why" decisions were made**, not just "what" exists
- **Include conceptual examples**, not production code
- **Reference actual code files** for implementation details
- **Update the "Last Updated" date** at the top
- **Add a changelog** for tracking major updates

### The "Stability Test"
Before adding detail, ask: **"Will this still be true in 6 months?"**

- ✅ **Stable**: "Uses Composition API with composables for shared logic"
- ✅ **Stable**: "Pinia chosen for global state management"
- ❌ **Unstable**: "PrimeVue version 4.5.4 for UI components"
- ❌ **Unstable**: "useTaxCalculation has 4 public methods"

### When to Update Documentation

**Do update when:**
- ✅ Architectural pattern changes (e.g., switching to CQRS)
- ✅ Major technology changes (e.g., moving from Blazor Server to MAUI)
- ✅ New integration points added (e.g., adding message queue)
- ✅ Significant design decisions made (e.g., "why we chose X over Y")
- ✅ Domain concepts evolve (e.g., treatment lifecycle changes)

**Don't update when:**
- ❌ Package versions change
- ❌ Method signatures change
- ❌ Database columns added
- ❌ Configuration values change
- ❌ Minor refactoring occurs

### Tone and Audience

**Target audience:** 
- New team members needing system understanding
- Architects evaluating system design
- Future maintainers understanding decisions

**Tone:**
- Professional but conversational
- Honest about limitations
- Explain trade-offs, not just benefits
- Avoid marketing language ("powerful", "robust", "best-in-class")

### Mermaid Diagram Types to Use

**Use diagrams to show relationships and flows, not implementations**

#### 1. Architecture and Component Relationships
```mermaid
graph TD
    Browser[Browser] --> Vue[Vue App]
    Vue --> Components[Components]
    Vue --> Composables[Composables]
    Vue --> Stores[Pinia Stores]
    Composables --> API[API Gateway]
    API --> Backend[Backend Services]
```
**Purpose:** Show frontend architecture and API communication

#### 2. Data Model Relationships (Conceptual)
```mermaid
erDiagram
    REGION ||--o{ MUNICIPALITY : contains
    MUNICIPALITY ||--o{ TAX_CALCULATION : "used in"
```
**Purpose:** Show domain model relationships, not exact schema

#### 3. Sequence Diagrams for Key Flows
```mermaid
sequenceDiagram
    User->>Form: Enter salary & municipality
    Form->>Composable: calculate(request)
    Composable->>API Gateway: POST /tax/calculate
    API Gateway->>Backend: Forward request
    Backend-->>API Gateway: TaxResult
    API Gateway-->>Composable: Response
    Composable-->>ResultCard: Update result ref
    ResultCard-->>User: Display net salary
```
**Purpose:** Show interactions for critical scenarios

#### 4. Component Dependencies
```mermaid
graph LR
    TaxCalculator --> TaxCalculatorForm
    TaxCalculator --> TaxResultCard
    TaxCalculator --> TaxComparisonCard
    TaxCalculatorForm --> RegionSelect
    TaxCalculatorForm --> MunicipalitySelect
    TaxCalculator --> useTaxCalculation
    MunicipalitySelect --> municipalityStore
```
**Purpose:** Show component hierarchy and composable usage

**What to avoid in diagrams:**
- ❌ Every prop on every component
- ❌ CSS class names or styling details
- ❌ Complete TypeScript interfaces
- ❌ Implementation details (validation logic, error handling)

---

## Project-Specific Context

### Technology Stack for NettoFrontend
- **Framework**: Vue 3 with TypeScript
- **UI Framework**: PrimeVue component library
- **State Management**: Pinia stores
- **Build Tool**: Vite
- **Routing**: Vue Router
- **Architecture**: Component-based with Composition API and composables

**For specific package versions:** See `package.json`

### Project Structure
- `src/components/` - Reusable Vue components (TaxCalculator, TaxResultCard, etc.)
- `src/composables/` - Shared reactive logic (useTaxCalculation, useFormValidation)
- `src/stores/` - Pinia stores for global state (municipalityStore)
- `src/views/` - Page-level components (Home, About)
- `src/types/` - TypeScript interfaces and types
- `src/utils/` - Pure utility functions (formatters)
- `src/config/` - API configuration
- `src/router/` - Vue Router configuration

### Key Architectural Decisions to Document
1. **Why Vue 3 Composition API?** (vs Options API, React, etc.)
2. **Why PrimeVue?** (vs Vuetify, Element Plus, custom components)
3. **Why Pinia over Vuex?** (simpler API, better TypeScript support)
4. **Why composables pattern?** (reusability, separation of concerns)
5. **Why API Gateway pattern?** (single entry point, CORS handling)

### Key Domain Concepts
- **Region** - Swedish region (län), contains municipalities
- **Municipality** - Swedish municipality (kommun) with tax rates
- **Tax Calculation** - Core business logic: gross salary → net salary
- **Tax Components** - Municipal tax, regional tax, state tax, burial fee, church fee
- **Tax Deductions** - Basic deduction (grundavdrag), job tax credit (jobbskatteavdrag)
- **Compare Mode** - Feature to compare net salary between two municipalities

### Integration Points to Document
- **API Gateway** - Spring Boot gateway on port 8080 (handles CORS, routing)
- **Backend API** - Tax calculation service on port 8181 (never called directly)
- **REST endpoints**: `/regions`, `/municipalities`, `/tax/calculate`
- No authentication currently (public calculator)

---

## Usage Instructions

### When to Use This Prompt

**Use this prompt when:**
1. ✅ Major architectural changes occur (new patterns, technology switches)
2. ✅ New integration points are added (external APIs, message queues)
3. ✅ Domain model significantly evolves (new core concepts)
4. ✅ Design decisions are made that affect system structure
5. ✅ Onboarding feedback indicates documentation gaps

**Don't use this prompt for:**
1. ❌ Package version updates
2. ❌ Minor refactoring or code cleanup
3. ❌ Bug fixes
4. ❌ UI tweaks or styling changes
5. ❌ Adding new entity properties

### How to Use This Prompt

1. **Read this entire master prompt** to understand philosophy
2. **Identify what has changed** architecturally (not just code changes)
3. **Focus on the "why"** behind changes, not implementation details
4. **Update relevant sections** only (don't regenerate everything)
5. **Create/update diagrams** if relationships have changed
6. **Review for stability** - will this be true in 6 months?
7. **Reference code files** instead of duplicating information

### Output Format

Generate or update `docs/system-overview.md` that:
- ✅ Explains architectural decisions and trade-offs
- ✅ Uses Mermaid diagrams for flows and relationships
- ✅ Remains stable over time (focuses on concepts, not details)
- ✅ References code files for implementation specifics
- ✅ Is accessible to new team members
- ✅ Serves as "why" documentation, not "how" documentation

### Example Section Structure

```markdown
## API Integration

### Approach
All API calls go through a centralized API Gateway on port 8080.

### Why This Choice
- **Requirement**: CORS handling for browser-based SPA
- **Benefit**: Single entry point, easier to manage in development
- **Trade-off**: Extra network hop, but simplifies frontend configuration

### How It Works
1. Frontend makes request to API Gateway (port 8080)
2. Gateway routes to appropriate backend service
3. Response flows back through gateway
4. Frontend composables handle loading/error states

**For endpoint details:** See `docs/frontend-integration-guide.md`

### Composable Pattern
API calls are wrapped in composables for reusability.
- Loading and error states handled consistently
- Results are readonly refs to prevent accidental mutation
- Parallel requests via Promise.all for compare mode

**Design decision:** Composables over direct fetch calls for testability and reuse.
```

**Notice:**
- ✅ Explains WHY API Gateway pattern was chosen
- ✅ Documents trade-offs honestly
- ✅ Shows flow conceptually
- ✅ References config files instead of duplicating
- ✅ Focuses on design decisions
- ❌ Doesn't list all endpoints
- ❌ Doesn't show exact request/response formats
- ❌ Doesn't duplicate API documentation

---

## Maintenance Notes

### Review Schedule
- **Major architectural changes**: Update immediately
- **Quarterly reviews**: Check if key decisions are still accurate
- **Before releases**: Verify documentation matches current state
- **Onboarding feedback**: Update sections that caused confusion

### Red Flags That Documentation Needs Update
- New team members asking questions already "documented"
- Documentation contradicts actual code behavior
- Major architectural decisions not documented
- New integration points not mentioned
- Design trade-offs not explained

### What NOT to Update
- Package version changes (reference package.json instead)
- Method signature changes (code is source of truth)
- Configuration value changes (reference .env files)
- Minor refactoring (doesn't affect architecture)
- Bug fixes (unless they expose design issues)

### Version Control
- Version this file alongside code changes
- Update "Last Updated" date when master prompt changes
- Keep changelog of major documentation philosophy changes

---

**Version**: `2.1`  
**Last Updated**: `2026-01-06`  
**Maintained By**: `CarlssonOscar`  
**Philosophy Change**: Adapted for Vue 3 frontend project
