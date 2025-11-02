<template>
  <div>
    <div class="blog-post" v-html="htmlOutput" />
    <nav class="toc-sidebar" v-if="headings.length > 0">
      <div class="toc-header" v-if="currentPost">{{ currentPost.title }}</div>
      <ul class="toc-list">
        <li
          v-for="heading in headings"
          :key="heading.id"
          :class="['toc-item', `toc-level-${heading.level}`, { active: activeId === heading.id }]"
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
import { computed, ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useActiveScroll } from 'vue-use-active-scroll'
import { posts } from '@/utils/posts'

interface Heading {
  id: string
  text: string
  level: number
}

const route = useRoute()
const content = ref('')
const headings = ref<Heading[]>([])

// Get heading IDs for vue-use-active-scroll
const headingIds = computed(() => headings.value.map((h) => h.id))

// Set up active scroll tracking
const { setActive, activeId } = useActiveScroll(headingIds, {
  jumpToFirst: true,
  jumpToLast: true,
  boundaryOffset: { toTop: 0.1, toBottom: 0.8 },
})

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
  })
}

function scrollToHeading(id: string) {
  setActive(id) // Tell vue-use-active-scroll about the click
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
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
</style>
