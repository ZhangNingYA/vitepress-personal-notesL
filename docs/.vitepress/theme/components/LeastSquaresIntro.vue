<script setup lang="ts">
import { ref, computed } from 'vue'
import katex from 'katex'
import 'katex/dist/katex.min.css'

// 三个点的数据：(1,1), (2,2), (3,2)
const points = [
  { x: 1, y: 1 },
  { x: 2, y: 2 },
  { x: 3, y: 2 }
]

// 直线 y = C + D t（这里用 slope/intercept 表示 D/C）
const slope = ref(0.5)      // D
const intercept = ref(1.0)  // C

// KaTeX 渲染（在 Vue 组件里不要直接写 $...$，需要手动渲染或用你封装的 MathFormula）
function tex(formula: string, displayMode = false) {
  try {
    return katex.renderToString(formula, {
      throwOnError: false,
      displayMode,
      strict: false
    })
  } catch {
    return formula
  }
}

const axbHtml = computed(() => tex('Ax=b'))
const lineHtml = computed(() => tex('y = C + Dt'))
const errNameHtml = computed(() => tex('\\|e\\|^2'))
const objectiveHtml = computed(() =>
  tex('\\min_{C,D}\\;\\sum_{i=1}^{3} \\bigl(b_i - (C + D t_i)\\bigr)^2', true)
)

// 误差平方和
const errorSum = computed(() => {
  let sum = 0
  for (const p of points) {
    const yLine = intercept.value + slope.value * p.x
    const err = p.y - yLine
    sum += err * err
  }
  return sum
})

const isNearBest = computed(() => errorSum.value < 0.7)

// 坐标映射
const scale = 50
const offsetX = 50
const offsetY = 250
const mapX = (x: number) => offsetX + x * scale
const mapY = (y: number) => offsetY - y * scale
</script>

<template>
  <div class="card">
    <div class="header">
      <h3 class="title">
        📈 为什么 <span class="math" v-html="axbHtml"></span> 可能无解？
      </h3>
      <p class="desc">
        试图让 <span class="math" v-html="lineHtml"></span> 同时穿过三点：
        <code>(1,1)</code>、<code>(2,2)</code>、<code>(3,2)</code>。
        由于未知数只有 <code>C</code> 和 <code>D</code> 两个，但约束有三个，通常无法“全都满足”，只能做最小二乘拟合。
      </p>

      <div class="objective" v-html="objectiveHtml"></div>
    </div>

    <div class="chart-container">
      <svg width="300" height="300" viewBox="0 0 300 300" class="chart">
        <defs>
          <!-- ✅ 修复：原来引用了 url(#arrow) 但没定义 marker -->
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" class="axis-fill" />
          </marker>
        </defs>

        <!-- 坐标轴 -->
        <line x1="50" y1="250" x2="280" y2="250" class="axis" marker-end="url(#arrow)" />
        <line x1="50" y1="250" x2="50" y2="20" class="axis" marker-end="url(#arrow)" />
        <text x="280" y="270" font-size="12" class="axis-text">t</text>
        <text x="20" y="30" font-size="12" class="axis-text">b</text>

        <!-- 拟合直线 -->
        <line
          :x1="mapX(0)"
          :y1="mapY(intercept)"
          :x2="mapX(4)"
          :y2="mapY(intercept + slope * 4)"
          class="fit-line"
        />

        <!-- 点 + 残差 -->
        <g v-for="(p, i) in points" :key="i">
          <line
            :x1="mapX(p.x)"
            :y1="mapY(p.y)"
            :x2="mapX(p.x)"
            :y2="mapY(intercept + slope * p.x)"
            class="residual"
          />
          <circle :cx="mapX(p.x)" :cy="mapY(p.y)" r="4" class="point" />
        </g>
      </svg>

      <div v-if="isNearBest" class="badge">
        ✅ 接近最优（最小二乘）
      </div>
    </div>

    <div class="sliders">
      <div class="slider-row">
        <label>截距 C（{{ intercept.toFixed(1) }}）</label>
        <input type="range" min="0" max="3" step="0.1" v-model.number="intercept" />
      </div>
      <div class="slider-row">
        <label>斜率 D（{{ slope.toFixed(1) }}）</label>
        <input type="range" min="-1" max="2" step="0.1" v-model.number="slope" />
      </div>
    </div>

    <div class="score" :class="{ best: isNearBest }">
      误差平方和 <span class="math" v-html="errNameHtml"></span> =
      <strong>{{ errorSum.toFixed(2) }}</strong>
      <div v-if="isNearBest" class="msg ok">继续微调可以观察误差如何变化。</div>
      <div v-else class="msg hint">试着调整 C 和 D，让误差更小。</div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  padding: 1.25rem;
  border-radius: 14px;
  margin: 1rem 0;
}

.header {
  text-align: center;
  margin-bottom: 0.75rem;
}

.title {
  font-weight: 900;
  margin: 0 0 0.5rem;
}

.desc {
  margin: 0 auto 0.75rem;
  max-width: 720px;
  font-size: 0.92em;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

.objective {
  display: inline-block;
  text-align: left;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  overflow-x: auto;
}

/* KaTeX 容器（轻微放大，且不破坏主题） */
.math :deep(.katex) {
  font-size: 1.05em;
}

.chart-container {
  position: relative;
  display: flex;
  justify-content: center;
  background: var(--vp-c-bg);
  border-radius: 14px;
  margin: 0.75rem 0 1rem;
  border: 1px solid var(--vp-c-divider);
  padding: 10px;
}

.chart {
  width: 300px;
  height: 300px;
}

.axis {
  stroke: var(--vp-c-text-2);
  stroke-width: 1.5;
}

.axis-fill {
  fill: var(--vp-c-text-2);
}

.axis-text {
  fill: var(--vp-c-text-2);
}

.fit-line {
  stroke: var(--vp-c-brand-1);
  stroke-width: 2.5;
}

.residual {
  stroke: var(--vp-c-danger-1, #ef4444);
  stroke-width: 2;
  stroke-dasharray: 4;
}

.point {
  fill: var(--vp-c-text-1);
}

.badge {
  position: absolute;
  top: 10px;
  right: 10px;
  border: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg) 70%, var(--vp-c-brand-1) 30%);
  color: var(--vp-c-text-1);
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
}

.sliders {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  max-width: 360px;
  margin: 0 auto;
}

.slider-row {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 10px;
  align-items: center;
  font-size: 0.92rem;
}

input[type='range'] {
  width: 100%;
}

.score {
  margin-top: 1rem;
  text-align: center;
  padding: 12px;
  background: var(--vp-c-bg-mute);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.score.best {
  background: color-mix(in srgb, #dcfce7 70%, var(--vp-c-bg) 30%);
  border-color: color-mix(in srgb, #16a34a 45%, var(--vp-c-divider) 55%);
}

.msg {
  margin-top: 6px;
  font-size: 0.85em;
  color: var(--vp-c-text-2);
}

.msg.ok {
  color: #166534;
  font-weight: 700;
}

.msg.hint {
  color: var(--vp-c-text-2);
}
</style>
