// 位置：docs/files.data.ts (或者和你展示页md文件同级)
import fs from 'node:fs'
import path from 'node:path'

// 扫描目录配置
const dir = './docs/static'

export default {
  load() {
    const cwd = process.cwd()
    const fullDir = path.resolve(cwd, dir)

    // 安全检查：如果文件夹不存在，返回空数组，防止报错
    if (!fs.existsSync(fullDir)) {
      return []
    }

    const files = fs.readdirSync(fullDir).filter(file => {
      return !file.startsWith('.') && /\.(pptx|ppt|docx|doc|pdf|zip|rar|7z)$/i.test(file)
    })

    return files.map(file => {
      const filePath = path.join(fullDir, file)
      const stats = fs.statSync(filePath)
      return {
        title: file,
        desc: formatSize(stats.size),
        // 这里只返回 /downloads/xxx，后面由页面去拼接 base
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
  if (/\.(pptx|ppt|key)$/i.test(filename)) return '📊'
  if (/\.(docx|doc|pdf|md)$/i.test(filename)) return '📝'
  if (/\.(zip|rar|7z|tar)$/i.test(filename)) return '📦'
  return '📎'
}