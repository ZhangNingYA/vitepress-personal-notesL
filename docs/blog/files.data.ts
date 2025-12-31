// docs/files.data.ts
import fs from 'node:fs'
import path from 'node:path'

const dir = 'docs/static'

export default {
  load() {
    const cwd = process.cwd()
    const fullDir = path.resolve(cwd, dir)

    if (!fs.existsSync(fullDir)) return []

    // 1. 修改这里：放宽过滤条件
    // 只要文件名不以 "." 开头（忽略 .DS_Store 等系统文件），就全部保留
    const files = fs.readdirSync(fullDir).filter(file => !file.startsWith('.'))

    return files.map(file => {
      const filePath = path.join(fullDir, file)
      const stats = fs.statSync(filePath)
      return {
        title: file,
        desc: formatSize(stats.size),
        url: `/static/${file}`,
        icon: getIcon(file)
      }
    })
  }
}

function formatSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getIcon(filename) {
  // 常用格式给特定图标
  if (/\.(pptx|ppt|key)$/i.test(filename)) return '📊'
  if (/\.(docx|doc|pdf|md|txt)$/i.test(filename)) return '📝'
  if (/\.(zip|rar|7z|tar|gz)$/i.test(filename)) return '📦'
  if (/\.(jpg|png|gif|svg)$/i.test(filename)) return '🖼️' // 新增图片
  if (/\.(mp4|mov)$/i.test(filename)) return '🎬'         // 新增视频
  // 兜底图标：未知的全部给回形针
  return '📎'
}