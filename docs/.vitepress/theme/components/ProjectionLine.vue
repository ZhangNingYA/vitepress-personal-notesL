<script setup lang="ts">
import { ref, computed } from 'vue'
import MathFormula from './Math.vue' // ✅ 若你已全局注册，可删除这一行（路径按你项目实际调整）

// 简单的 SVG 坐标映射中心
const CENTER = 150
const SCALE = 30

interface Vec2 { x: number; y: number }

const b = ref<Vec2>({ x: 2, y: 3 })
const a = ref<Vec2>({ x: 4, y: 1 })

// 投影：x_hat = (a·b)/(a·a), p = a * x_hat, e = b - p
const projection = computed(() => {
  const dotAB = a.value.x * b.value.x + a.value.y * b.value.y
  const dotAA = a.value.x * a.value.x + a.value.y * a.value.y

  if (dotAA === 0) return { p: { x: 0, y: 0 }, e: { ...b.value }, x_hat: 0 }

  const x_hat = dotAB / dotAA
  const p = { x: a.value.x * x_hat, y: a.value.y * x_hat }
  const e = { x: b.value.x - p.x, y: b.value.y - p.y }

  return { p, e, x_hat }
})

const mapX = (val: number) => CENTER + val * SCALE
const mapY = (val: number) => CENTER - val * SCALE

// 动态生成直线端点
const lineEndPoints = computed(() => ({
  x1: mapX(-a.value.x * 10),
  y1: mapY(-a.value.y * 10),
  x2: mapX(a.value.x * 10),
  y2: mapY(a.value.y * 10)
}))

// ✅ 计算 e·a（用于“正交”判断）
const eDotA = computed(() => projection.value.e.x * a.value.x + projection.value.e.y * a.value.y)
const isOrthogonal = computed(() => Math.abs(eDotA.value) < 1e-2)

// ✅ 动态公式（交给 MathFormula 渲染）
const xHatLatex = computed(() => `\\hat{x} = ${projection.value.x_hat.toFixed(2)}`)
const eDotALatex = computed(() => `e\\cdot a = ${eDotA.value.toFixed(4)}`)

// 可选：展示更完整的一行（想短一点就不用这个）
const pLatex = computed(() => `p = a\\hat{x} = (${projection.value.p.x.toFixed(2)},\\;${projection.value.p.y.toFixed(2)})`)
const eLatex = computed(() => `e = b - p = (${projection.value.e.x.toFixed(2)},\\;${projection.value.e.y.toFixed(2)})`)
</script>

<template>
  <div class="card">
    <h3 class="title">🔦 投影实验：把 b 投射到 a 上</h3>

    <div class="controls">
      <div class="control-group">
        <span class="label text-blue">向量 b:</span>
        (
        <input type="number" v-model.number="b.x" class="input">,
        <input type="number" v-model.number="b.y" class="input">
        )
      </div>

      <div class="control-group">
        <span class="label text-black">向量 a:</span>
        (
        <input type="number" v-model.number="a.x" class="input">,
        <input type="number" v-model.number="a.y" class="input">
        )
      </div>
    </div>

    <div class="svg-wrapper">
      <svg width="300" height="300" viewBox="0 0 300 300">
        <defs>
          <marker id="arrow-b" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
          </marker>
          <marker id="arrow-p" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#22c55e" />
          </marker>
        </defs>

        <line x1="150" y1="0" x2="150" y2="300" stroke="var(--vp-c-divider)" />
        <line x1="0" y1="150" x2="300" y2="150" stroke="var(--vp-c-divider)" />

        <line
          :x1="lineEndPoints.x1" :y1="lineEndPoints.y1"
          :x2="lineEndPoints.x2" :y2="lineEndPoints.y2"
          stroke="#94a3b8" stroke-dasharray="4" stroke-width="1"
        />
        <text :x="mapX(a.x) + 10" :y="mapY(a.y)" fill="#666" font-size="12">Line a</text>

        <!-- p -->
        <line
          :x1="CENTER" :y1="CENTER"
          :x2="mapX(projection.p.x)" :y2="mapY(projection.p.y)"
          stroke="#22c55e" stroke-width="4" marker-end="url(#arrow-p)"
        />

        <!-- b -->
        <line
          :x1="CENTER" :y1="CENTER"
          :x2="mapX(b.x)" :y2="mapY(b.y)"
          stroke="#3b82f6" stroke-width="2" marker-end="url(#arrow-b)"
        />

        <!-- e (b -> p) -->
        <line
          :x1="mapX(b.x)" :y1="mapY(b.y)"
          :x2="mapX(projection.p.x)" :y2="mapY(projection.p.y)"
          stroke="#ef4444" stroke-width="2" stroke-dasharray="5,5"
        />

        <text :x="mapX(b.x)" :y="mapY(b.y) - 10" fill="#3b82f6" font-weight="bold">b</text>
        <text :x="mapX(projection.p.x)" :y="mapY(projection.p.y) + 20" fill="#22c55e" font-weight="bold">p</text>
        <text
          :x="(mapX(b.x) + mapX(projection.p.x))/2 + 5"
          :y="(mapY(b.y) + mapY(projection.p.y))/2"
          fill="#ef4444" font-size="12"
        >
          e
        </text>
      </svg>
    </div>

    <div class="result-box">
      <p class="row">
        投影系数：
        <MathFormula :formula="xHatLatex" />
      </p>

      <p class="row">
        <MathFormula :formula="pLatex" />
      </p>

      <p class="row">
        <MathFormula :formula="eLatex" />
      </p>

      <p class="row">
        点积：
        <MathFormula :formula="eDotALatex" />
        <span v-if="isOrthogonal" class="ok">（✅ 正交）</span>
        <span v-else class="hint">（未正交）</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1rem 0;
}

.title {
  text-align: center;
  font-weight: 900;
  margin-bottom: 1rem;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.label {
  font-weight: 800;
  margin-right: 5px;
}

.text-blue { color: #3b82f6; }
.text-black { color: var(--vp-c-text-1); }

.input {
  width: 56px;
  padding: 4px;
  text-align: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.svg-wrapper {
  display: flex;
  justify-content: center;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  margin-bottom: 1rem;
  overflow: hidden;
  padding: 10px;
}

.result-box {
  background: var(--vp-c-bg-mute);
  border: 1px solid var(--vp-c-divider);
  padding: 12px;
  border-radius: 10px;
  text-align: center;
}

.row {
  margin: 8px 0;
  color: var(--vp-c-text-1);
}

.ok {
  margin-left: 6px;
  color: #16a34a;
  font-weight: 800;
}

.hint {
  margin-left: 6px;
  color: var(--vp-c-text-2);
}

/* 给 MathFormula 的 KaTeX 稍微加一点可读性（不会影响主题） */
:deep(.katex) {
  font-size: 1.06em;
}
</style>
