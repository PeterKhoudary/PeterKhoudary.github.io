<template>
  <div>
    <div class="blog-post" v-html="htmlOutput" />
    <nav class="toc-sidebar" v-if="headings.length > 0">
      <div class="toc-header" v-if="currentPost">{{ currentPost.title }}</div>
      <ul class="toc-list">
        <li
          v-for="heading in headings"
          :key="heading.id"
          :class="[
            'toc-item',
            `toc-level-${heading.level}`,
            { active: activeHeadingId === heading.id },
          ]"
        >
          <a :href="`#${heading.id}`" @click.prevent="scrollToHeading(heading.id)">
            {{ heading.text }}
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import { katex } from '@mdit/plugin-katex'
import hljs from 'highlight.js'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github-dark.min.css'
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import type { post } from '@/utils/types'

interface Heading {
  id: string
  text: string
  level: number
}

const route = useRoute()
const content = ref('')
const headings = ref<Heading[]>([])
const activeHeadingId = ref<string>('')

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

function extractHeadings() {
  headings.value = []
  const tokens = md.parse(content.value, {})
  let headingIndex = 0

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (token && token.type === 'heading_open') {
      const level = parseInt(token.tag.substring(1))
      const textToken = tokens[i + 1]
      if (textToken && textToken.type === 'inline') {
        const text = textToken.content
        const id = `heading-${headingIndex++}`
        headings.value.push({ id, text, level })
      }
    }
  }
}

function addIdsToHeadings() {
  nextTick(() => {
    const blogPost = document.querySelector('.blog-post')
    if (!blogPost) return

    const headingElements = blogPost.querySelectorAll('h1, h2, h3')
    headingElements.forEach((el, index) => {
      const heading = headings.value[index]
      if (heading) {
        el.id = heading.id
      }
    })

    setupIntersectionObserver()
  })
}

function scrollToHeading(id: string) {
  const element = document.getElementById(id)
  if (element) {
    activeHeadingId.value = id
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

let observer: IntersectionObserver | null = null

function setupIntersectionObserver() {
  if (observer) {
    observer.disconnect()
  }

  const headingElements = headings.value
    .map((h) => document.getElementById(h.id))
    .filter(Boolean) as HTMLElement[]

  if (headingElements.length === 0) return

  observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting)
      if (visibleEntries.length > 0) {
        const topEntry = visibleEntries.reduce((prev, curr) =>
          curr.boundingClientRect.top < prev.boundingClientRect.top ? curr : prev,
        )
        activeHeadingId.value = topEntry.target.id
      }
    },
    {
      rootMargin: '-10% 0px -80% 0px',
      threshold: 0,
    },
  )

  headingElements.forEach((el) => observer?.observe(el))
}

onMounted(async () => {
  const slug = route.params.slug as string
  try {
    const response = await fetch(`/assets/posts/${slug}.md`)
    if (!response.ok) throw new Error('Post not found')
    content.value = await response.text()
    extractHeadings()
    addIdsToHeadings()
  } catch (error) {
    content.value = `# Error\n\nPost not found: ${error}`
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}

.toc-sidebar {
  position: fixed;
  left: calc(50% + clamp(300px, 70%, 12000px) / 2 + 2rem);
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  max-width: 200px;
  max-height: 80vh;
  overflow-y: auto;
  border-left: 2px solid black;
  padding-left: 1rem;
}

@media (max-width: 1100px) {
  .toc-sidebar {
    display: none;
  }
}

.toc-header {
  font-weight: 600;
  font-size: 0.75rem;
  margin-bottom: 1rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  pointer-events: none;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  margin: 0.25rem 0;
}

.toc-item a {
  display: block;
  padding: 0.25rem 0;
  text-decoration: none;
  cursor: pointer;
  color: #666;
  font-size: 0.875rem;
  line-height: 1.4;
  transition: color 0.2s;
}

.toc-item a:hover {
  color: #000;
}

.toc-item.active a {
  color: #000;
  font-weight: 600;
}

.toc-level-1 {
  padding-left: 0;
}

.toc-level-2 {
  padding-left: 1rem;
}

.toc-level-3 {
  padding-left: 2rem;
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
