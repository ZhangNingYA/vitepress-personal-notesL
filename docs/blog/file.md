---
title: 文件管理部分
date: 2025-12-31
---


<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as rawFiles } from './files.data.ts'

const categories = [
  { title: '📊 演示文稿 / Slides', exts: ['.pptx', '.ppt', '.key'] },
  { title: '📝 文档资料 / Docs', exts: ['.docx', '.doc', '.pdf', '.md', '.txt'] },
  { title: '📦 源码打包 / Assets', exts: ['.zip', '.rar', '.7z'] }
]

const groupedFiles = computed(() => {
  // 1. 创建一个 Set 用来记录“已经被分类的文件 URL”
  const usedFiles = new Set()
  
  // 2. 先处理已定义的分类
  const result = categories.map(category => {
    const matchedFiles = rawFiles.filter(file => {
      const isMatch = category.exts.some(ext => file.url.toLowerCase().endsWith(ext))
      if (isMatch) {
        usedFiles.add(file.url) // 标记为已使用
      }
      return isMatch
    }).map(processFile) // 处理路径

    return {
      title: category.title,
      files: matchedFiles
    }
  }).filter(group => group.files.length > 0)

  // 3. 处理“剩下的”文件 (兜底逻辑)
  const otherFiles = rawFiles
    .filter(file => !usedFiles.has(file.url)) // 筛选出没被标记过的
    .map(processFile)

  // 4. 如果有剩下的文件，追加一个“其他资源”分组
  if (otherFiles.length > 0) {
    result.push({
      title: '🌈 其他资源 / Others',
      files: otherFiles
    })
  }

  return result
})

// 辅助函数：统一给文件加上 base 路径
function processFile(file) {
  return {
    ...file,
    url: withBase(file.url)
  }
}
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
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
</style>