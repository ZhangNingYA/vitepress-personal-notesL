import fs from 'node:fs'
import path from 'node:path'

type SidebarItem = { text: string; link: string }

/**
 * 约定：
 * - 博客文章放在 docs/blog/
 * - 文件名建议：YYYY-MM-DD-title.md（便于排序）
 * - 文件内 frontmatter 建议包含：title、date（可选）
 */
export function getBlogSidebarItems(): SidebarItem[] {
  const blogDir = path.resolve(process.cwd(), 'docs', 'blog')
  if (!fs.existsSync(blogDir)) return []

  const files = fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith('.md') && f !== 'index.md' && !f.startsWith('_'))

  const items = files
    .map((filename) => {
      const full = path.join(blogDir, filename)
      const raw = fs.readFileSync(full, 'utf-8')

      const fm = parseFrontmatter(raw)
      const slug = filename.replace(/\.md$/, '')
      const date = fm.date ?? inferDateFromFilename(filename) ?? '0000-00-00'
      const title = fm.title ?? slug

      return {
        sortKey: date + ' ' + slug,
        // 🟢 新代码：只显示标题
        item: { text: title, link: `/blog/${slug}` }
        // item: { text: `${date} · ${title}`, link: `/blog/${slug}` }
      }
    })
    // 倒序：最新在前
    .sort((a, b) => (a.sortKey < b.sortKey ? 1 : -1))
    .map((x) => x.item)

  return items
}

function parseFrontmatter(md: string): Record<string, string> {
  // 仅做轻量解析：--- ... ---
  const m = md.match(/^---\s*([\s\S]*?)\s*---/m)
  if (!m) return {}

  const obj: Record<string, string> = {}
  const lines = m[1].split(/\r?\n/)
  for (const line of lines) {
    const kv = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)\s*$/)
    if (!kv) continue
    const key = kv[1]
    let val = kv[2].trim()
    val = val.replace(/^["']|["']$/g, '')
    obj[key] = val
  }
  return obj
}

function inferDateFromFilename(filename: string): string | null {
  const m = filename.match(/^(\d{4}-\d{2}-\d{2})/)
  return m?.[1] ?? null
}
