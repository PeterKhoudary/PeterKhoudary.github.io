<template>
  <div class="links-view py-5">
    <div class="container">
      <h1 class="mb-5">Find Me Online</h1>
      
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="list-group">
            <a 
              v-for="link in externalLinks" 
              :key="link.name"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            >
              <span>{{ link.name }}</span>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface ExternalLink {
  name: string
  url: string
}

const externalLinks = ref<ExternalLink[]>([
  { name: 'GitHub', url: 'https://github.com/PeterKhoudary' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/your-profile' },
  { name: 'Twitter', url: 'https://twitter.com/your-handle' },
  // Add more links as needed
])
</script>

<style scoped>
.links-view {
  min-height: calc(100vh - 80px);
}

.list-group-item {
  background-color: var(--accent-green);
  border-color: var(--accent-green);
  color: var(--forest-green);
  font-weight: 600;
  padding: 1rem 1.5rem;
  margin-bottom: 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.list-group-item:hover {
  background-color: var(--text-secondary);
  border-color: var(--text-secondary);
  transform: translateY(-2px);
}
</style>