<script setup lang="ts">
import type { post } from '@/utils/types'

const posts: post[] = [
  { slug: 'intro', title: 'Introduction', createdAt: new Date('2025-10-27T10:27') },
]
</script>

<template>
  <div class="posts">
    <RouterLink
      v-for="post in posts"
      :key="post.slug"
      :to="`/writing/${post.slug}`"
      class="post-link"
    >
      <h2>{{ post.title }}</h2>
      <span class="date">{{ post.createdAt }}</span>
    </RouterLink>
  </div>
</template>

<style scoped>
.posts {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.post-link {
  display: block;
}

h2 {
  margin: 0;
  font-size: clamp(1.5rem, 4vw, 2rem);
}

.date {
  font-size: clamp(0.875rem, 2vw, 1rem);
  color: #666;
}
</style>
