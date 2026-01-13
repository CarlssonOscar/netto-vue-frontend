# Getting Started - Netto Vue Frontend

> **Quick guide** to get up and running with the project  
> Vue 3 + TypeScript + PrimeVue  
> Last Updated: 2026-01-07

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Start Development Server](#start-development-server)
4. [Project Overview](#project-overview)
5. [API Configuration](#api-configuration)
6. [Common Commands](#common-commands)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure the following are installed:

| Tool | Version | Verify with |
|------|---------|-------------|
| **Node.js** | 18.x or higher | `node --version` |
| **npm** | 9.x or higher | `npm --version` |
| **Git** | Any | `git --version` |

> 💡 **Tip**: Use [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) to easily switch between Node versions.

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd netto-vue-frontend
```

### 2. Install dependencies

```bash
npm install
```

This installs all packages defined in `package.json`, including:

- **Vue 3** - Frontend framework
- **PrimeVue** - UI component library
- **Pinia** - State management
- **Vue Router** - Routing
- **TypeScript** - Type safety

### 3. Configure environment variables (optional)

Create a `.env.development` file in the project root for local development:

```env
# API Gateway URL (backend)
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

> ⚠️ **Note**: If you don't create this file, the default value `/api/v1` with Vite proxy will be used.

---

## Start Development Server

```bash
npm run dev
```

The application will start at: **http://localhost:5173**

You should now see the application in your browser. Hot Module Replacement (HMR) is enabled, so code changes update instantly in the browser.

### Verify everything works

1. ✅ Application loads without errors
2. ✅ No red error messages in browser console
3. ✅ Navigation between pages works (Home, About)

---

## Project Overview

```
src/
├── assets/           # Static files (images, fonts)
├── components/       # Reusable Vue components
│   ├── MunicipalitySelect.vue
│   ├── RegionSelect.vue
│   ├── TaxCalculator.vue
│   ├── TaxCalculatorForm.vue
│   ├── TaxComparisonCard.vue
│   └── TaxResultCard.vue
├── composables/      # Composition API logic
│   ├── useFormValidation.ts
│   └── useTaxCalculation.ts
├── config/           # Configuration files
│   └── api.ts
├── router/           # Vue Router configuration
│   └── index.ts
├── stores/           # Pinia stores
│   └── municipalityStore.ts
├── types/            # TypeScript types
│   └── tax.ts
├── utils/            # Helper functions
│   └── formatters.ts
├── views/            # Page components
│   ├── About.vue
│   └── Home.vue
├── App.vue           # Root component
├── main.ts           # Application entry point
└── style.css         # Global styles
```

### Key Concepts

| Folder | Purpose |
|--------|---------|
| `components/` | Reusable UI components |
| `composables/` | Shared reactive logic (use-prefix) |
| `stores/` | Global state with Pinia |
| `views/` | Page-level components linked to routes |
| `types/` | TypeScript interfaces and types |

---

## API Configuration

The application communicates with a Spring Boot backend via API Gateway on port **8080**.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/regions` | Fetch all regions |
| `GET` | `/api/v1/municipalities` | Fetch all municipalities |
| `GET` | `/api/v1/municipalities/by-region/{id}` | Municipalities by region |
| `POST` | `/api/v1/tax/calculate` | Calculate net income |

### Backend Requirements

For full functionality, the backend needs to run on `http://localhost:8080`. See separate backend documentation for starting the API.

> 📖 **More info**: See [frontend-integration-guide.md](frontend-integration-guide.md) for detailed API documentation.

---

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 5173) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code quality |
| `npm run lint:fix` | Fix lint errors automatically |
| `npm run format` | Format code with Prettier |

### Build for Production

```bash
npm run build
```

Built files are placed in the `dist/` folder and can be served by any static web server.

### Preview Production Build

```bash
npm run preview
```

Starts a local server to test the production build.

---

## Troubleshooting

### Problem: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Problem: Port 5173 is in use

**Solution:**
Vite automatically selects the next available port (e.g., 5174). Alternatively, close the process using the port:

```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Problem: API calls fail (CORS error)

**Check:**
1. Is the backend running on port 8080?
2. Is `VITE_API_BASE_URL` correct in `.env.development`?
3. Is CORS configured in the backend?

### Problem: TypeScript errors in VS Code

**Solution:**
```bash
# Restart TypeScript server in VS Code
Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Problem: Component changes don't appear

**Solution:**
1. Verify the dev server is running
2. Try stopping and restarting: `Ctrl+C` → `npm run dev`
3. Clear browser cache: `Ctrl+Shift+R`

---

## Next Steps

- 📖 Read [frontend-integration-guide.md](frontend-integration-guide.md) for API details
- 🏗️ See [architecture-principles.md](../.github/architecture-principles.md) for design patterns
- 📐 Follow [code-standards.md](../.github/code-standards.md) for code conventions

---

## Help and Support

If you encounter issues:

1. Check this guide
2. Read error messages carefully
3. Search the project documentation
4. Ask the team

---

*Last Updated: 2026-01-07*
