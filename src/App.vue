<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Menubar from 'primevue/menubar'
import type { MenuItem } from 'primevue/menuitem'

const router = useRouter()

const items = ref<MenuItem[]>([
  {
    label: 'Home',
    icon: 'pi pi-home',
    command: () => router.push('/'),
  },
  {
    label: 'About',
    icon: 'pi pi-info-circle',
    command: () => router.push('/about'),
  },
])
</script>

<template>
  <div id="app">
    <header>
      <Menubar :model="items">
        <template #start>
          <div class="app-logo">
            <i class="pi pi-bolt" style="font-size: 1.5rem; color: var(--primary-color)"></i>
            <span class="app-title">Netto Vue Frontend</span>
          </div>
        </template>
      </Menubar>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  position: sticky;
  top: 0;
  z-index: 1000;
}

main {
  flex: 1;
  padding: 1rem;
}

.app-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
}

.app-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}
</style>
