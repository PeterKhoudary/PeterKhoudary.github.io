export type post = {
  title: string
  slug: string
  createdAt: Date
  updatedAt?: Date
}

export const posts: post[] = [
  {
    slug: 'long-post',
    title: 'The Infinite Scroll of Consciousness',
    createdAt: new Date('2025-10-28'),
  },
  {
    slug: 'intro',
    title: "Reader's Guide",
    createdAt: new Date('2025-10-27'),
  },
]
