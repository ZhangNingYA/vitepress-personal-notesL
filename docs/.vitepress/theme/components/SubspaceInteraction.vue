<script setup lang="ts">
import { ref } from 'vue'

type SpaceKey = 'row' | 'null' | 'col' | 'leftnull'

interface SpaceInfo {
  title: string
  desc: string
  perp: SpaceKey
  type: 'n' | 'm'
}

const activeSpace = ref<SpaceKey>('row')

// ⚠️ 注意：这里把 LaTeX 改成了 HTML 字符串
const spaces: Record<SpaceKey, SpaceInfo> = {
  row: { 
    title: 'Row Space C(A<sup>T</sup>)', 
    desc: 'A 的行向量张成的空间', 
    perp: 'null', 
    type: 'n' 
  },
  null: { 
    title: 'Null Space N(A)', 
    desc: 'Ax = 0 的解空间', 
    perp: 'row', 
    type: 'n' 
  },
  col: { 
    title: 'Column Space C(A)', 
    desc: 'A 的列向量张成的空间', 
    perp: 'leftnull', 
    type: 'm' 
  },
  leftnull: { 
    title: 'Left Null N(A<sup>T</sup>)', 
    desc: 'A<sup>T</sup>y = 0 的解空间', 
    perp: 'col', 
    type: 'm' 
  }
}

const select = (key: SpaceKey) => activeSpace.value = key

const getStatusClass = (key: SpaceKey) => {
  if (activeSpace.value === key) return 'is-active'
  if (spaces[activeSpace.value].perp === key) return 'is-perp'
  return 'is-inactive'
}
</script>

<template>
  <div class="subspace-container">
    <div class="domains-grid">
      <div class="domain-box">
        <div class="domain-label">ℝ<sup>n</sup> (输入空间)</div>
        
        <div 
          class="space-card row"
          :class="getStatusClass('row')"
          @click="select('row')"
        >
          <div class="card-header" v-html="spaces.row.title"></div>
          <div class="tags">
            <span v-if="activeSpace === 'row'" class="tag-eye">👀 选中</span>
            <span v-if="spaces[activeSpace].perp === 'row'" class="tag-perp">⛔ 正交于选中项</span>
          </div>
        </div>
        
        <div 
          class="space-card null"
          :class="getStatusClass('null')"
          @click="select('null')"
        >
          <div class="card-header" v-html="spaces.null.title"></div>
          <div class="tags">
            <span v-if="activeSpace === 'null'" class="tag-eye">👀 选中</span>
            <span v-if="spaces[activeSpace].perp === 'null'" class="tag-perp">⛔ 正交于选中项</span>
          </div>
        </div>
      </div>

      <div class="domain-box">
        <div class="domain-label">ℝ<sup>m</sup> (输出空间)</div>
        
        <div 
          class="space-card col"
          :class="getStatusClass('col')"
          @click="select('col')"
        >
          <div class="card-header" v-html="spaces.col.title"></div>
          <div class="tags">
            <span v-if="activeSpace === 'col'" class="tag-eye">👀 选中</span>
            <span v-if="spaces[activeSpace].perp === 'col'" class="tag-perp">⛔ 正交于选中项</span>
          </div>
        </div>
        
        <div 
          class="space-card leftnull"
          :class="getStatusClass('leftnull')"
          @click="select('leftnull')"
        >
          <div class="card-header" v-html="spaces.leftnull.title"></div>
          <div class="tags">
            <span v-if="activeSpace === 'leftnull'" class="tag-eye">👀 选中</span>
            <span v-if="spaces[activeSpace].perp === 'leftnull'" class="tag-perp">⛔ 正交于选中项</span>
          </div>
        </div>
      </div>
    </div>

    <div class="info-box">
      <h4 class="info-title">💡 核心关系解析</h4>
      <p class="info-text">
        当你在左侧 ℝ<sup>n</sup> 中，
        <span class="highlight" v-html="spaces[activeSpace].title"></span> 
        永远垂直于 
        <span class="highlight" v-html="spaces[spaces[activeSpace].perp].title"></span>。
        <br>
        它们的维度之和为 <i>r</i> + (<i>n</i> - <i>r</i>) = <i>n</i>。
        它们互为<b>正交补 (Orthogonal Complements)</b>。
      </p>
    </div>
  </div>
</template>

<style scoped>
/* 样式保持不变，为了节省篇幅我省略了 style 部分 */
/* 请保留你原有的 style 代码 */
.subspace-container { margin: 2rem 0; }
.domains-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
@media (max-width: 640px) { .domains-grid { grid-template-columns: 1fr; } }
.domain-box { border: 2px dashed var(--vp-c-divider); padding: 1.5rem; border-radius: 12px; position: relative; }
.domain-label { position: absolute; top: -12px; left: 1rem; background: var(--vp-c-bg); padding: 0 8px; font-size: 0.875rem; color: var(--vp-c-text-2); }
.space-card { padding: 1rem; margin-bottom: 0.5rem; border-radius: 6px; cursor: pointer; border-left: 4px solid transparent; transition: all 0.2s ease; background-color: var(--vp-c-bg-mute); }
.space-card:hover { transform: scale(1.02); }
.space-card.row { border-left-color: #3b82f6; }
.space-card.null { border-left-color: #22c55e; }
.space-card.col { border-left-color: #a855f7; }
.space-card.leftnull { border-left-color: #eab308; }
.is-active { background-color: var(--vp-c-brand-soft); font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.is-perp { background-color: rgba(239, 68, 68, 0.1); border-left-style: double; }
.is-inactive { opacity: 0.6; }
.tags { display: flex; gap: 8px; font-size: 0.75rem; margin-top: 4px; }
.tag-eye { color: var(--vp-c-brand); }
.tag-perp { color: #ef4444; font-weight: bold; }
.info-box { background-color: var(--vp-c-bg-alt); padding: 1rem; border-radius: 8px; border-left: 4px solid var(--vp-c-brand); }
.info-title { color: var(--vp-c-brand); font-weight: bold; margin-bottom: 0.5rem; }
.highlight { font-weight: bold; color: var(--vp-c-text-1); }
</style>