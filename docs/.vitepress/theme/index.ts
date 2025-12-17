import DefaultTheme from 'vitepress/theme'
import './custom.css'
import type { Theme } from 'vitepress'

// 1. 引入你的组件
import VectorOrthogonality from './components/VectorOrthogonality.vue'
import SubspaceInteraction from './components/SubspaceInteraction.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 3. 在这里注册全局组件
    // 参数1：你在 md 里使用的标签名
    // 参数2：引入的组件变量
    app.component('VectorOrthogonality', VectorOrthogonality)
    app.component('SubspaceInteraction', SubspaceInteraction)
  }
} satisfies Theme
