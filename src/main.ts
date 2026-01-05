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

// Swedish locale for PrimeVue components
const svLocale = {
  accept: 'Ja',
  reject: 'Nej',
  choose: 'Välj',
  cancel: 'Avbryt',
  clear: 'Rensa',
  apply: 'Tillämpa',
  dayNames: ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'],
  dayNamesShort: ['sön', 'mån', 'tis', 'ons', 'tor', 'fre', 'lör'],
  dayNamesMin: ['sö', 'må', 'ti', 'on', 'to', 'fr', 'lö'],
  monthNames: ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'],
  monthNamesShort: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
  today: 'Idag',
  weekHeader: 'V',
  firstDayOfWeek: 1,
  dateFormat: 'yy-mm-dd',
  weak: 'Svag',
  medium: 'Medium',
  strong: 'Stark',
  passwordPrompt: 'Ange lösenord',
  emptyFilterMessage: 'Inga resultat hittades',
  emptyMessage: 'Inga alternativ tillgängliga',
  emptySearchMessage: 'Inga resultat hittades',
  emptySelectionMessage: 'Inget valt',
  searchMessage: '{0} resultat tillgängliga',
  selectionMessage: '{0} alternativ valda',
  aria: {
    trueLabel: 'Sant',
    falseLabel: 'Falskt',
    nullLabel: 'Ej valt',
    star: '1 stjärna',
    stars: '{star} stjärnor',
    selectAll: 'Alla alternativ valda',
    unselectAll: 'Alla alternativ avmarkerade',
    close: 'Stäng',
    previous: 'Föregående',
    next: 'Nästa',
    navigation: 'Navigering',
    scrollTop: 'Scrolla upp',
    moveTop: 'Flytta överst',
    moveUp: 'Flytta upp',
    moveDown: 'Flytta ner',
    moveBottom: 'Flytta nederst',
    moveToTarget: 'Flytta till mål',
    moveToSource: 'Flytta till källa',
    moveAllToTarget: 'Flytta alla till mål',
    moveAllToSource: 'Flytta alla till källa',
    pageLabel: 'Sida {page}',
    firstPageLabel: 'Första sidan',
    lastPageLabel: 'Sista sidan',
    nextPageLabel: 'Nästa sida',
    previousPageLabel: 'Föregående sida',
    rowsPerPageLabel: 'Rader per sida',
    jumpToPageDropdownLabel: 'Hoppa till sidval',
    jumpToPageInputLabel: 'Hoppa till sidinmatning',
    selectRow: 'Rad vald',
    unselectRow: 'Rad avmarkerad',
    expandRow: 'Rad expanderad',
    collapseRow: 'Rad minimerad',
    showFilterMenu: 'Visa filtermeny',
    hideFilterMenu: 'Dölj filtermeny',
    filterOperator: 'Filteroperator',
    filterConstraint: 'Filtervillkor',
    editRow: 'Redigera rad',
    saveEdit: 'Spara ändringar',
    cancelEdit: 'Avbryt redigering',
    listView: 'Listvy',
    gridView: 'Rutnätsvy',
    slide: 'Bild',
    slideNumber: '{slideNumber}',
    zoomImage: 'Zooma bild',
    zoomIn: 'Zooma in',
    zoomOut: 'Zooma ut',
    rotateRight: 'Rotera höger',
    rotateLeft: 'Rotera vänster'
  }
}

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
  locale: svLocale,
})

app.mount('#app')
