<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { data as raw } from './index.data.js'

type Page = Record<string, any>

const q = ref('')

function clean(u: string) {
  return String(u || '').replace(/\.html$/, '')
}

function titleOf(p: Page) {
  return p.title
}

function descOf(p: Page) {
  return p.desc || ''
}

function tagsOf(p: Page): string[] {
  return Array.isArray(p.tags) ? p.tags : []
}


const pages = computed(() => {
  const arr = Array.isArray(raw) ? raw : []
  return arr
    .filter(p => p?.url)
    .map((p) => ({
      ...p,
      link: clean(p.url),
      title: titleOf(p),
      desc: descOf(p),
      tags: tagsOf(p)
    }))
    // 过滤目录页自身
    .filter(p => p.link !== '/linear-algebra/' && !String(p.url).endsWith('/index.html'))
})

const list = computed(() => {
  const query = q.value.trim().toLowerCase()
  if (!query) return pages.value

  return pages.value.filter((p) => {
    const hay = [
      p.title,
      p.desc ?? '',
      p.link ?? '',
      (p.tags || []).join(' ')
    ].join(' ').toLowerCase()
    return hay.includes(query)
  })
})

const total = computed(() => pages.value.length)
const shown = computed(() => list.value.length)

function idx(n: number) {
  return String(n + 1).padStart(2, '0')
}
</script>

# 其他
