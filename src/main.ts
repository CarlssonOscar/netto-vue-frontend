import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import { definePreset } from '@primevue/themes'
import router from './router'
import App from './App.vue'

import 'primeicons/primeicons.css'
import './style.css'

// Custom theme with brand colors
const NettoTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#fef7e6',
      100: '#fdecc0',
      200: '#fbdf96',
      300: '#f4a030',
      400: '#eb8b10',
      500: '#eb8b10',
      600: '#eb8b10',
      700: '#c97400',
      800: '#a65f00',
      900: '#844b00',
      950: '#623700'
    }
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: NettoTheme,
    options: {
      darkModeSelector: false,
    },
  },
})

app.mount('#app')
