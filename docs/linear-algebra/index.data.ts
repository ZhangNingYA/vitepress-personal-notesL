// docs/linear-algebra/index.data.ts
import { createContentLoader } from 'vitepress'

type Frontmatter = Record<string, any>

function toNumberMaybe(v: unknown): number | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) return Number(v)
  return undefined
}

function toStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String).filter(Boolean)
  if (typeof v === 'string' && v.trim() !== '') return [v.trim()]
  return []
}

function fallbackTitleFromUrl(url: string): string {
  // /linear-algebra/lecture-01.html -> lecture-01
  const s = url.split('/').pop() || url
  return s.replace(/\.html$/, '').replace(/[-_]/g, ' ')
}

export interface LinearAlgebraIndexItem {
  url: string            // 真实路由（通常带 .html）
  path: string           // 展示用（去掉 .html）
  title: string
  description?: string
  order?: number
  tags: string[]
  difficulty?: string
}

export default createContentLoader('linear-algebra/**/*.md', {
  includeSrc: false,
  render: false,
  excerpt: false,

  transform(rawData) {
    const items: LinearAlgebraIndexItem[] = rawData
      // 过滤目录页自身（index.md）
      .filter((page) => page.url !== '/linear-algebra/')
      .filter((page) => !page.url.endsWith('/index.html'))

      // 只保留 linear-algebra 目录下的内容（双保险）
      .filter((page) => page.url.startsWith('/linear-algebra/'))

      .map((page) => {
        const fm: Frontmatter = page.frontmatter ?? {}

        const title =
          (typeof fm.title === 'string' && fm.title.trim()) ? fm.title.trim() : fallbackTitleFromUrl(page.url)

        const description =
          (typeof fm.description === 'string' && fm.description.trim())
            ? fm.description.trim()
            : (typeof fm.desc === 'string' && fm.desc.trim())
              ? fm.desc.trim()
              : undefined

        const order = toNumberMaybe(fm.order)
        const tags = toStringArray(fm.tags)
        const difficulty = typeof fm.difficulty === 'string' ? fm.difficulty.trim() : undefined

        return {
          url: page.url,
          path: page.url.replace(/\.html$/, ''),
          title,
          description,
          order,
          tags,
          difficulty
        }
      })

    // 排序：优先 frontmatter.order；否则按 path 自然排序（数字友好）
    return items.sort((a, b) => {
      const ao = a.order
      const bo = b.order
      if (typeof ao === 'number' && typeof bo === 'number') return ao - bo
      if (typeof ao === 'number') return -1
      if (typeof bo === 'number') return 1
      return a.path.localeCompare(b.path, undefined, { numeric: true })
    })
  }
})
