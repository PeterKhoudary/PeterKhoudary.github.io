import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import { katex } from '@mdit/plugin-katex'
import hljs from 'highlight.js'
import fm from 'front-matter'

export interface Heading {
  id: string
  text: string
  level: number
}

export interface Frontmatter {
  slug?: string
  title?: string
  createdAt?: string
  updatedAt?: string
}

export interface ParseResult {
  html: string
  headings: Heading[]
  frontmatter: Frontmatter
}

export function parseMarkdown(content: string): ParseResult {
  const { attributes: frontmatter, body: markdownContent } = fm<Frontmatter>(content)
  const headings: Heading[] = []
  let headingIndex = 0

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
  })
    .use(katex)
    .use(anchor, {
      slugify: () => `heading-${headingIndex++}`,
      callback: (token, info) => {
        headings.push({
          id: info.slug,
          text: info.title,
          level: parseInt(token.tag.substring(1)),
        })
      },
    })

  const html = md.render(markdownContent)
  return { html, headings, frontmatter }
}
