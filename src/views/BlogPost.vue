<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import { katex } from '@mdit/plugin-katex'
import hljs from 'highlight.js'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github-dark.min.css'
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { post } from '@/utils/types'

const route = useRoute()
const content = ref('')

const posts: post[] = [
  {
    slug: 'long-post',
    title: 'The Infinite Scroll of Consciousness',
    createdAt: new Date('2025-10-28T14:30'),
  },
  { slug: 'intro', title: 'Introduction', createdAt: new Date('2025-10-27T10:27') },
]

const currentPost = computed(() => {
  const slug = route.params.slug as string
  return posts.find((p) => p.slug === slug)
})

const md = new MarkdownIt({
  highlight: function (str, lang): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
      } catch {
        // Ignore highlighting errors
      }
    }

    return md.utils.escapeHtml(str)
  },
}).use(katex)

const htmlOutput = computed(() => md.render(content.value))

onMounted(async () => {
  const slug = route.params.slug as string
  try {
    const response = await fetch(`/assets/posts/${slug}.md`)
    if (!response.ok) throw new Error('Post not found')
    content.value = await response.text()
  } catch (error) {
    content.value = `# Error\n\nPost not found: ${error}`
  }
})
</script>

<template>
  <div>
    <div class="post-title" v-if="currentPost">
      <h1>{{ currentPost.title }}</h1>
    </div>
    <div class="blog-post" v-html="htmlOutput" />
  </div>
</template>

<style scoped>
.post-title {
  border-bottom: 2px solid black;
}

:deep(h1) {
  font-size: clamp(1rem, 4vw, 2rem);
}

:deep(h2) {
  font-size: clamp(0.75rem, 3vw, 1.5rem);
}

:deep(h3) {
  font-size: clamp(0.585rem, 2.34vw, 1.17rem);
}

:deep(p),
:deep(li) {
  font-size: clamp(0.6rem, 4vw, 1.2rem);
}

:deep(ul) {
  margin-top: 0;
}

:deep(code) {
  font-size: clamp(1rem, 4vw, 1.25rem);
  font-family: 'Courier New', monospace;
}

:deep(pre) {
  margin: 1.5rem 0;
  overflow-x: auto;
}

:deep(.katex-display) {
  overflow-x: auto;
  padding: 0.5rem 0;
}

:deep(.katex) {
  font-size: clamp(1xrem, 4vw, 1.25rem);
}
</style>
