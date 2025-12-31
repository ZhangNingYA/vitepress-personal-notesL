---
title: 文件管理部分
date: 2025-12-31
---



<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress' // 👈 核心：自动处理 /novel/ 路径
import { data as rawFiles } from './files.data.ts'

// 定义分类规则
const categories = [
  { title: '📊 演示文稿 / Slides', exts: ['.pptx', '.ppt', '.key'] },
  { title: '📝 文档资料 / Docs', exts: ['.docx', '.doc', '.pdf', '.md'] },
  { title: '📦 源码打包 / Assets', exts: ['.zip', '.rar', '.7z'] }
]

// 处理数据：分类 + 修正路径
const groupedFiles = computed(() => {
  return categories.map(category => {
    return {
      title: category.title,
      files: rawFiles.filter(file => {
        return category.exts.some(ext => file.url.toLowerCase().endsWith(ext))
      }).map(file => ({
        ...file,
        // 👇 这一步会自动把 url 变成 /novel/downloads/xxx
        url: withBase(file.url) 
      }))
    }
  }).filter(group => group.files.length > 0)
})
</script>

# 📥 资源下载中心

<div v-for="group in groupedFiles" :key="group.title" class="section-group">
  <h2 class="section-title">{{ group.title }}</h2>
  <div class="card-grid">
    <File 
      v-for="file in group.files" 
      :key="file.url" 
      v-bind="file"
    />
  </div>
</div>

<style scoped>
.section-group { margin-bottom: 40px; }

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px dashed var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.card-grid {
  display: grid;
  /* 响应式网格：最小240px，自动换行 */
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
</style>