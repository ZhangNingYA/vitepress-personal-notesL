# my-notes (VitePress)

个人笔记 / 博客站点，基于 VitePress，适配手机与电脑浏览，支持 LaTeX。

## 开始使用

```bash
npm install
npm run docs:dev
```

## 构建与预览

```bash
npm run docs:build
npm run docs:preview
```

## 部署到 GitHub Pages

1. 将仓库名（repo name）写入 `docs/.vitepress/config.ts` 的 `repoName` / `base`。
2. 仓库 Settings → Pages → **Build and deployment → Source** 选择 **GitHub Actions**。
3. 推送到 `main` 分支后自动部署。

> 访问地址通常是：`https://<username>.github.io/<repo>/`
