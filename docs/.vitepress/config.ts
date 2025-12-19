import { defineConfig } from 'vitepress'
import { getBlogSidebarItems } from './utils/blog'

const repoName = 'my-notes' // TODO: 改成你的 GitHub 仓库名，例如 'my-notes'
const base = process.env.NODE_ENV === 'production' ? `/${repoName}/` : '/' // 本地开发使用 '/'，生产构建使用 '/repo/'

// ✅ 新增：用于自动生成侧边栏（不需要额外依赖）
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** config.ts 所在目录：docs/.vitepress */
const __dirname = path.dirname(fileURLToPath(import.meta.url))
/** docs 根目录 */
const DOCS_ROOT = path.resolve(__dirname, '..')

type SidebarItem = { text: string; link: string }
type SidebarGroup = { text: string; items: SidebarItem[] }

function parseDateMaybe(v: unknown): number | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) {
    // 兼容秒级/毫秒级时间戳
    return v < 1e12 ? v * 1000 : v
  }
  if (typeof v === 'string' && v.trim()) {
    const ms = Date.parse(v.trim())
    if (Number.isFinite(ms)) return ms
  }
  return undefined
}

function tryReadFrontmatterMeta(filePath: string): { title?: string; order?: number; dateMs?: number } {
  try {
    const s = readFileSync(filePath, 'utf-8')
    const m = s.match(/^---\s*\n([\s\S]*?)\n---\s*\n/)
    if (!m) return {}
    const fm = m[1]

    const titleMatch = fm.match(/^\s*title\s*:\s*(.+)\s*$/m)
    const orderMatch = fm.match(/^\s*order\s*:\s*(.+)\s*$/m)

    // date 优先级：date > updated > lastUpdated
    const dateMatch = fm.match(/^\s*date\s*:\s*(.+)\s*$/m)
    const updatedMatch = fm.match(/^\s*updated\s*:\s*(.+)\s*$/m)
    const lastUpdatedMatch = fm.match(/^\s*lastUpdated\s*:\s*(.+)\s*$/m)

    const title = titleMatch ? titleMatch[1].trim().replace(/^['"]|['"]$/g, '') : undefined

    const orderRaw = orderMatch ? orderMatch[1].trim().replace(/^['"]|['"]$/g, '') : undefined
    const order = orderRaw != null && orderRaw !== '' && Number.isFinite(Number(orderRaw)) ? Number(orderRaw) : undefined

    const dateRaw =
      (dateMatch ? dateMatch[1] : undefined) ??
      (updatedMatch ? updatedMatch[1] : undefined) ??
      (lastUpdatedMatch ? lastUpdatedMatch[1] : undefined)

    const dateMs = dateRaw ? parseDateMaybe(dateRaw.trim().replace(/^['"]|['"]$/g, '')) : undefined

    return { title, order, dateMs }
  } catch {
    return {}
  }
}

function titleFromFilename(nameNoExt: string): string {
  return nameNoExt.replace(/[-_]/g, ' ')
}

function numberPrefix(nameNoExt: string): number | undefined {
  const m = nameNoExt.match(/(\d+)/)
  if (!m) return undefined
  const n = Number(m[1])
  return Number.isFinite(n) ? n : undefined
}

/** 确保以 / 开头、以 / 结尾（用于 baseLink，不要把站点 base 拼进去） */
function normalizeBaseLink(baseLink: string): string {
  let s = baseLink.trim()
  if (!s.startsWith('/')) s = `/${s}`
  if (!s.endsWith('/')) s = `${s}/`
  return s
}

/**
 * 递归收集某目录下全部 Markdown 文件（返回相对路径，使用 POSIX 分隔符 /）
 */
function collectMarkdownFiles(absDir: string): string[] {
  const out: string[] = []

  const shouldIgnoreDir = (name: string) =>
    name === 'node_modules' || name === '.git' || name === '.vitepress' || name.startsWith('.')

  const walk = (relDirPosix: string) => {
    const abs = relDirPosix ? path.join(absDir, ...relDirPosix.split('/')) : absDir
    let entries: ReturnType<typeof readdirSync>
    try {
      entries = readdirSync(abs, { withFileTypes: true })
    } catch {
      return
    }

    for (const ent of entries) {
      if (ent.isDirectory()) {
        if (shouldIgnoreDir(ent.name)) continue
        const nextRel = relDirPosix ? `${relDirPosix}/${ent.name}` : ent.name
        walk(nextRel)
        continue
      }

      if (!ent.isFile()) continue
      if (!/\.md$/i.test(ent.name)) continue // ✅ 兼容 .md / .MD

      const relFile = relDirPosix ? `${relDirPosix}/${ent.name}` : ent.name
      out.push(relFile)
    }
  }

  walk('')
  return out
}

/**
 * 自动生成某目录的 sidebar items（✅ 默认按时间由新到旧）
 * @param dirName   docs 下的目录名，例如 'linear-algebra'
 * @param baseLink  侧边栏链接前缀，例如 '/linear-algebra/'
 */
function autoSidebarItems(dirName: string, baseLink: string): SidebarItem[] {
  const absDir = path.join(DOCS_ROOT, dirName)
  const baseLinkNorm = normalizeBaseLink(baseLink)

  // ✅ 递归拿到所有 md（保留子目录 index.md，仅排除目录根 index.md）
  const files = collectMarkdownFiles(absDir).filter(rel => rel.toLowerCase() !== 'index.md')

  const items = files.map((relPosix) => {
    const filePath = path.join(absDir, ...relPosix.split('/'))
    const meta = tryReadFrontmatterMeta(filePath)

    // ✅ 没有 frontmatter.date/updated 的情况下，用文件修改时间兜底
    const mtimeMs = statSync(filePath).mtimeMs
    const timeMs = meta.dateMs ?? mtimeMs

    const isDirIndex = /\/index\.md$/i.test(relPosix)

    // ✅ 生成路由：子目录 index.md -> /dir/；普通 md -> /dir/file
    const link = (() => {
      if (isDirIndex) {
        const dirRoute = relPosix.replace(/\/index\.md$/i, '/') // 保留尾部 /
        return encodeURI(path.posix.join(baseLinkNorm, dirRoute))
      }
      const routeNoExt = relPosix.replace(/\.md$/i, '')
      return encodeURI(path.posix.join(baseLinkNorm, routeNoExt))
    })()

    // ✅ 文本：优先 frontmatter.title；子目录 index 默认用文件夹名；否则用文件名
    const fileBaseNoExt = path.posix.basename(relPosix).replace(/\.md$/i, '')
    const folderName = path.posix.basename(path.posix.dirname(relPosix))
    const text =
      meta.title ||
      (isDirIndex ? titleFromFilename(folderName) : titleFromFilename(fileBaseNoExt))

    const num = numberPrefix(isDirIndex ? folderName : fileBaseNoExt)

    return {
      text,
      link,
      __time: timeMs,
      __order: meta.order,
      __num: num,
      __name: relPosix
    } as SidebarItem & { __time: number; __order?: number; __num?: number; __name: string }
  })

  // ✅ 核心：由新到旧（降序）
  items.sort((a, b) => {
    const at = (a as any).__time
    const bt = (b as any).__time
    if (at !== bt) return bt - at

    const ao = (a as any).__order
    const bo = (b as any).__order
    if (typeof ao === 'number' && typeof bo === 'number') return ao - bo
    if (typeof ao === 'number') return -1
    if (typeof bo === 'number') return 1

    const an = (a as any).__num
    const bn = (b as any).__num
    if (typeof an === 'number' && typeof bn === 'number') return bn - an // 同时间下数字更大更靠前
    if (typeof an === 'number') return -1
    if (typeof bn === 'number') return 1

    return String((a as any).__name).localeCompare(String((b as any).__name), undefined, { numeric: true })
  })

  return items.map(({ text, link }) => ({ text, link }))
}

export default defineConfig({
  lang: 'zh-CN',
  title: '个人笔记',
  description: '线性代数 / 计算机图形学 / 日更博客',
  base :'/vitepress-personal-notesL/',

  cleanUrls: true,
  lastUpdated: true,

  markdown: {
    // 数学公式：需要安装 markdown-it-mathjax3
      // html: true,
    math: true,
    lineNumbers: false
  },

  themeConfig: {
    siteTitle: 'Notes',
    outline: 'deep',

    nav: [
      { text: '首页', link: '/' },
      { text: '线性代数', link: '/linear-algebra/' },
      { text: '计算机图形学', link: '/computer-graphics/' },
      { text: '博客', link: '/blog/' }
    ],

    // ✅ 侧边栏：线代/图形学自动读取并按时间倒序；博客保持原逻辑
    sidebar: {
      '/linear-algebra/': [
        {
          text: '线性代数',
          items: [
            { text: '概览', link: '/linear-algebra/' },
            ...autoSidebarItems('linear-algebra', '/linear-algebra/')
          ]
        }
      ],
      '/computer-graphics/': [
        {
          text: '计算机图形学',
          items: [
            { text: '概览', link: '/computer-graphics/' },
            ...autoSidebarItems('computer-graphics', '/computer-graphics/')
          ]
        }
      ],
      '/blog/': [
        {
          text: '博客（按日期倒序）',
          items: getBlogSidebarItems()
        }
      ]
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: `https://github.com/<USERNAME>/${repoName}/edit/main/docs/:path`,
      text: '在 GitHub 上编辑此页'
    },

    socialLinks: [
      { icon: 'github', link: `https://github.com/zhangningYa/${repoName}` }
    ],

    footer: {
      message: 'Built with VitePress',
      copyright: `Copyright © ${new Date().getFullYear()}`
    }
  }
})
