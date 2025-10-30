<script setup lang="ts">
import type { post } from '@/utils/types'

const posts: post[] = [
  // {
  //   slug: 'long-post',
  //   title: 'The Infinite Scroll of Consciousness',
  //   createdAt: new Date('2025-10-28'),
  // },
  { slug: 'intro', title: 'Introduction', createdAt: new Date('2025-10-27') },
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
      <div class="post-box">
        <div class="post-title">{{ post.title }}</div>
        <span class="date"
          >{{ post.createdAt.getMonth() + 1 }}/{{ post.createdAt.getDate() }}/{{
            post.createdAt.getFullYear()
          }}</span
        >
      </div>
    </RouterLink>
  </div>
</template>

<style scoped>
.posts {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-link {
  display: block;
}

.post-box {
  border: 1px solid black;
  border-radius: 8px;
  padding: 0.75rem 0.75rem;
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-box:hover {
  border-color: #999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.post-title {
  font-size: clamp(1.25rem, 4vw, 2rem);
}

.date {
  font-size: clamp(0.875rem, 2vw, 1rem);
}
</style>
