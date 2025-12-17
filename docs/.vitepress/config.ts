import { defineConfig } from 'vitepress'
import { getBlogSidebarItems } from './utils/blog'

const repoName = 'my-notes' // TODO: 改成你的 GitHub 仓库名，例如 'my-notes'
const base = process.env.NODE_ENV === 'production' ? `/${repoName}/` : '/' // 本地开发使用 '/'，生产构建使用 '/repo/'

export default defineConfig({
  lang: 'zh-CN',
  title: '个人笔记',
  description: '线性代数 / 计算机图形学 / 日更博客',
  base :'/my-notes/',

  cleanUrls: true,
  lastUpdated: true,

  markdown: {
    // 数学公式：需要安装 markdown-it-mathjax3
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

    sidebar: {
      '/linear-algebra/': [
        {
          text: '线性代数',
          items: [
            { text: '概览', link: '/linear-algebra/' },
            { text: '向量与内积', link: '/linear-algebra/01-vectors' },
            { text: '矩阵与线性变换', link: '/linear-algebra/02-matrices' }
          ]
        }
      ],
      '/computer-graphics/': [
        {
          text: '计算机图形学',
          items: [
            { text: '概览', link: '/computer-graphics/' },
            { text: '渲染管线与坐标变换', link: '/computer-graphics/01-pipeline' }
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
