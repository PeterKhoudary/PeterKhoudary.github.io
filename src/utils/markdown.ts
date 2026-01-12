import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import { katex } from '@mdit/plugin-katex'
import hljs from 'highlight.js'

export interface Heading {
  id: string
  text: string
  level: number
}

export interface ParseResult {
  html: string
  headings: Heading[]
}

export function parseMarkdown(content: string): ParseResult {
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

  const html = md.render(content)
  return { html, headings }
}
