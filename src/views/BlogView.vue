<template>
  <div class="blog-view py-5">
    <div class="container">
      <h1 class="mb-5">Blog</h1>
      
      <div class="row g-4">
        <div class="col-md-6 col-lg-4" v-for="post in blogPosts" :key="post.id">
          <article class="card h-100">
            <div class="card-body">
              <h3 class="card-title h5">{{ post.title }}</h3>
              <p class="text-muted small">{{ formatDate(post.date) }}</p>
              <p class="card-text">{{ post.excerpt }}</p>
              <a href="#" class="btn btn-primary">Read More</a>
            </div>
          </article>
        </div>
      </div>
      
      <div v-if="blogPosts.length === 0" class="text-center py-5">
        <p class="text-muted">No blog posts yet. Check back soon!</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface BlogPost {
  id: number
  title: string
  date: Date
  excerpt: string
  content?: string
  media?: {
    type: 'image' | 'video'
    url: string
  }
}

// Sample blog posts - replace with your actual content
const blogPosts = ref<BlogPost[]>([
  {
    id: 1,
    title: "First Blog Post",
    date: new Date('2024-01-01'),
    excerpt: "This is a sample excerpt for the first blog post. It gives a brief overview of what the post is about."
  },
  // Add more posts here
])

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}
</script>

<style scoped>
.blog-view {
  min-height: calc(100vh - 80px);
}

.card {
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}
</style>