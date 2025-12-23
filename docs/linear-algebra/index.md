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

# 线性代数

<div class="hero">
  <div class="hero-badge">Linear Algebra</div>
  <div class="hero-title">线性代数目录</div>
  <div class="hero-sub">
    用于学习与复习的章节索引。
  </div>

  <div class="hero-row">
    <div class="stat">
      <div class="stat-k">总计</div>
      <div class="stat-v">{{ total }}</div>
    </div>
    <div class="stat">
      <div class="stat-k">当前显示</div>
      <div class="stat-v">{{ shown }}</div>
    </div>
  </div>
</div>

## 目录

<div v-if="list.length" class="grid">
  <a
    v-for="(p, i) in list"
    :key="p.link"
    class="card"
    :href="withBase(p.link)"
  >
    <div class="card-top">
      <span class="num">{{ idx(i) }}</span>
      <span class="title">{{ p.title }}</span>
    </div>

<div v-if="p.desc" class="desc">{{ p.desc }}</div>

<div v-if="p.tags && p.tags.length" class="chips">
    <span v-for="t in p.tags" :key="t" class="chip">{{ t }}</span>
</div>

<div class="path">{{ p.link }}</div>
  </a>
</div>

<div v-else class="empty">
  <div class="empty-title">没有匹配结果</div>
  <div class="empty-sub">换个关键词试试，或点击“清除”。</div>
</div>

<style scoped>
/* 顶部 */
.hero {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  padding: 18px;
  margin: 12px 0 18px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  font-size: 12px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.hero-title {
  margin-top: 10px;
  font-size: 26px;
  font-weight: 900;
  line-height: 1.2;
  color: var(--vp-c-text-1);
}

.hero-sub {
  margin-top: 6px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.7;
}

.hero-row {
  margin-top: 12px;
  display: grid;
  grid-template-columns: auto auto 1fr;
  gap: 10px;
  align-items: center;
}

@media (max-width: 820px) {
  .hero-row {
    grid-template-columns: 1fr;
  }
}

/* 统计 */
.stat {
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
}

.stat-k {
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.stat-v {
  color: var(--vp-c-text-1);
  font-weight: 900;
  font-size: 16px;
}

/* 搜索 */
.search {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
}

.search-input {
  flex: 1;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  border-radius: 10px;
  padding: 9px 10px;
  outline: none;
  color: var(--vp-c-text-1);
}

.search-input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent 82%);
}

.search-clear {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  border-radius: 10px;
  padding: 9px 10px;
  cursor: pointer;
  color: var(--vp-c-text-1);
}

.search-clear:hover {
  border-color: var(--vp-c-brand-1);
}

/* 卡片网格 */
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 12px;
  margin-top: 10px;
}

.card {
  grid-column: span 6;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  color: inherit;
  transition: transform 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease;
}

@media (max-width: 860px) {
  .card { grid-column: span 12; }
}

.card:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}

.card-top {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
}

.num {
  min-width: 44px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  font-weight: 900;
  font-size: 12px;
}

.title {
  font-weight: 900;
  font-size: 15px;
  line-height: 1.35;
}

.desc {
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.6;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.path {
  margin-top: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 12px;
  color: var(--vp-c-text-3);
  word-break: break-all;
}

/* 空态 */
.empty {
  border: 1px dashed var(--vp-c-divider);
  border-radius: 16px;
  padding: 16px;
  background: var(--vp-c-bg-soft);
  margin-top: 10px;
}

.empty-title {
  font-weight: 900;
  margin-bottom: 6px;
}

.empty-sub {
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.6;
}
</style>
