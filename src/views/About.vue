<script setup lang="ts">
import Card from 'primevue/card'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
</script>

<template>
  <div class="about-view">
    <Card>
      <template #title>
        <i class="pi pi-info-circle mr-2"></i>
        About This Application
      </template>
      <template #content>
        <p class="mb-4">
          This is a demonstration application showcasing a modern Vue 3 frontend setup with PrimeVue
          components.
        </p>

        <Accordion value="0" class="mt-4">
          <AccordionPanel value="0">
            <AccordionHeader>
              <i class="pi pi-code mr-2"></i>
              Technologies Used
            </AccordionHeader>
            <AccordionContent>
              <ul class="tech-list">
                <li>
                  <strong>Vue 3:</strong> Progressive JavaScript framework with Composition API
                </li>
                <li>
                  <strong>TypeScript:</strong> Typed superset of JavaScript for better development
                  experience
                </li>
                <li>
                  <strong>PrimeVue:</strong> Rich UI component library with extensive theming
                  options
                </li>
                <li><strong>Vue Router:</strong> Official routing library for Vue.js</li>
                <li><strong>Pinia:</strong> Intuitive state management for Vue</li>
                <li><strong>Vite:</strong> Next generation frontend tooling</li>
              </ul>
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel value="1">
            <AccordionHeader>
              <i class="pi pi-folder mr-2"></i>
              Project Structure
            </AccordionHeader>
            <AccordionContent>
              <ul class="tech-list">
                <li><code>/src/components</code> - Reusable Vue components</li>
                <li><code>/src/views</code> - Page-level components</li>
                <li><code>/src/router</code> - Vue Router configuration</li>
                <li><code>/src/stores</code> - Pinia stores for state management</li>
                <li><code>/src/assets</code> - Static assets like images and styles</li>
              </ul>
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel value="2">
            <AccordionHeader>
              <i class="pi pi-wrench mr-2"></i>
              Code Quality Tools
            </AccordionHeader>
            <AccordionContent>
              <ul class="tech-list">
                <li>
                  <strong>ESLint:</strong> Configured with Vue, TypeScript, and Prettier rules
                </li>
                <li><strong>Prettier:</strong> Code formatter for consistent style</li>
                <li><strong>TypeScript:</strong> Static type checking</li>
              </ul>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>

        <p class="mt-4">
          <router-link to="/">← Back to Home</router-link>
        </p>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.about-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.tech-list {
  list-style: none;
  padding-left: 0;
}

.tech-list li {
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
  position: relative;
}

.tech-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--primary-color);
}

code {
  background-color: var(--surface-100);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: monospace;
}

.mr-2 {
  margin-right: 0.5rem;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.mt-4 {
  margin-top: 1.5rem;
}
</style>
