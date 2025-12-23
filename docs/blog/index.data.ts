// docs/blog/index.data.ts
import { createContentLoader } from 'vitepress'

function clean(u: string) {
  return String(u || '').replace(/\.html$/, '')
}

function titleFromUrl(url: string) {
  const s = clean(url)
  const last = s.split('/').filter(Boolean).pop() || s
  return last.replace(/[-_]/g, ' ')
}

function normTags(v: any): string[] {
  if (Array.isArray(v)) return v.map(String).filter(Boolean)
  if (typeof v === 'string' && v.trim()) return [v.trim()]
  return []
}

export default createContentLoader('blog/**/*.md', {
  transform(raw) {
    return raw
      .filter(p => p.url)
      // 过滤目录页自身
      .filter(p => clean(p.url) !== '/blog/' && !String(p.url).endsWith('/index.html'))
      .map(p => {
        const fm = p.frontmatter || {}

        // ✅ 强制用 frontmatter.title（不是 H1）
        const fmTitle = fm.title
        const title =
          (fmTitle != null && String(fmTitle).trim())
            ? String(fmTitle).trim()
            : titleFromUrl(p.url)

        const descRaw = fm.description ?? fm.desc
        const desc = (typeof descRaw === 'string' && descRaw.trim()) ? descRaw.trim() : ''

        return {
          url: p.url,
          title,
          desc,
          tags: normTags(fm.tags)
        }
      })
  }
})
