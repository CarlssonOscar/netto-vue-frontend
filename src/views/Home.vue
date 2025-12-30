<script setup lang="ts">
import { ref } from 'vue'
import { useCounterStore } from '../stores/counter'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'

const counterStore = useCounterStore()
const message = ref('')
</script>

<template>
  <div class="home-view">
    <Card class="welcome-card">
      <template #title>
        <i class="pi pi-home mr-2"></i>
        Welcome to Vue 3 + PrimeVue
      </template>
      <template #content>
        <p class="mb-4">This is a modern Vue 3 application built with TypeScript, featuring:</p>
        <ul class="feature-list mb-4">
          <li><i class="pi pi-check-circle text-green-500"></i> Vue 3 with Composition API</li>
          <li><i class="pi pi-check-circle text-green-500"></i> TypeScript for type safety</li>
          <li><i class="pi pi-check-circle text-green-500"></i> PrimeVue UI Components</li>
          <li><i class="pi pi-check-circle text-green-500"></i> Vue Router for navigation</li>
          <li><i class="pi pi-check-circle text-green-500"></i> Pinia for state management</li>
          <li><i class="pi pi-check-circle text-green-500"></i> Vite as build tool</li>
        </ul>
        <p>Navigate to the <router-link to="/about">About</router-link> page to see more.</p>
      </template>
    </Card>

    <Card class="demo-card mt-4">
      <template #title>
        <i class="pi pi-cog mr-2"></i>
        Pinia Store Demo
      </template>
      <template #content>
        <div class="counter-demo">
          <p class="mb-3">
            Store Name: <strong>{{ counterStore.name }}</strong>
          </p>
          <p class="mb-3">
            Count: <strong>{{ counterStore.count }}</strong>
          </p>
          <p class="mb-3">
            Double Count: <strong>{{ counterStore.doubleCount }}</strong>
          </p>

          <div class="button-group">
            <Button
              label="Increment"
              icon="pi pi-plus"
              severity="success"
              @click="counterStore.increment"
            />
            <Button
              label="Decrement"
              icon="pi pi-minus"
              severity="warning"
              @click="counterStore.decrement"
            />
            <Button
              label="Reset"
              icon="pi pi-refresh"
              severity="danger"
              @click="counterStore.reset"
            />
          </div>
        </div>
      </template>
    </Card>

    <Card class="demo-card mt-4">
      <template #title>
        <i class="pi pi-pencil mr-2"></i>
        PrimeVue Components Demo
      </template>
      <template #content>
        <div class="input-demo">
          <label for="message" class="block mb-2">Enter a message:</label>
          <InputText
            id="message"
            v-model="message"
            placeholder="Type something..."
            class="w-full mb-3"
          />
          <p v-if="message">
            You typed: <strong>{{ message }}</strong>
          </p>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.home-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.welcome-card,
.demo-card {
  margin-bottom: 1rem;
}

.feature-list {
  list-style: none;
  padding-left: 0;
}

.feature-list li {
  margin-bottom: 0.5rem;
}

.feature-list li i {
  margin-right: 0.5rem;
}

.counter-demo {
  text-align: center;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.input-demo {
  max-width: 400px;
  margin: 0 auto;
}

.mr-2 {
  margin-right: 0.5rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-3 {
  margin-bottom: 1rem;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.mt-4 {
  margin-top: 1.5rem;
}

.w-full {
  width: 100%;
}

.text-green-500 {
  color: #22c55e;
}
</style>
