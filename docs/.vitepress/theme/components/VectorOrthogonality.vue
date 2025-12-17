<script setup lang="ts">
import { ref, computed } from 'vue'

interface Vector {
  x: number
  y: number
}

const v1 = ref<Vector>({ x: 3, y: 1 })
const v2 = ref<Vector>({ x: -1, y: 3 })

const dotProduct = computed(() => {
  return v1.value.x * v2.value.x + v1.value.y * v2.value.y
})

const isOrthogonal = computed(() => Math.abs(dotProduct.value) < 0.01)

const map = (val: number) => 150 + val * 30
const mapY = (val: number) => 150 - val * 30
</script>

<template>
  <div class="interactive-card">
    <h3 class="card-title">🖐️ 动手试一试：寻找 90°</h3>
    
    <div class="controls">
      <div class="input-group">
        <span class="label x-label">向量 x:</span>
        (<input type="number" v-model="v1.x" class="num-input">, 
         <input type="number" v-model="v1.y" class="num-input">)
      </div>
      <div class="input-group">
        <span class="label y-label">向量 y:</span>
        (<input type="number" v-model="v2.x" class="num-input">, 
         <input type="number" v-model="v2.y" class="num-input">)
      </div>
    </div>

    <div class="svg-container">
      <svg width="300" height="300" viewBox="0 0 300 300">
        <defs>
          <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
          </marker>
          <marker id="arrow-red" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
          </marker>
        </defs>
        <line x1="150" y1="0" x2="150" y2="300" stroke="var(--vp-c-divider)" />
        <line x1="0" y1="150" x2="300" y2="150" stroke="var(--vp-c-divider)" />
        <line :x1="150" :y1="150" :x2="map(v1.x)" :y2="mapY(v1.y)" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow-blue)" />
        <line :x1="150" :y1="150" :x2="map(v2.x)" :y2="mapY(v2.y)" stroke="#ef4444" stroke-width="3" marker-end="url(#arrow-red)" />
      </svg>
      
      <div v-if="isOrthogonal" class="feedback-badge">
        ✅ 正交 (Orthogonal)!
      </div>
    </div>

    <div class="result-box" :class="{ success: isOrthogonal }">
      <div class="math-result">
        <i>x</i><sup>T</sup><i>y</i> = 
        ({{v1.x}} · {{v2.x}}) + ({{v1.y}} · {{v2.y}}) = 
        <strong>{{dotProduct}}</strong>
      </div>
      <p class="hint" v-if="!isOrthogonal">试着修改数值，让结果变成 0</p>
    </div>
  </div>
</template>

<style scoped>
/* 样式保持不变，请保留原有的 style */
.interactive-card { padding: 1.5rem; border: 1px solid var(--vp-c-divider); border-radius: 8px; background-color: var(--vp-c-bg-soft); margin-bottom: 1rem; }
.card-title { font-size: 1.1rem; font-weight: bold; margin-bottom: 1rem; text-align: center; }
.controls { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; margin-bottom: 1rem; }
.label { font-weight: bold; margin-right: 4px; }
.x-label { color: #3b82f6; }
.y-label { color: #ef4444; }
.num-input { width: 50px; padding: 4px; border: 1px solid var(--vp-c-divider); border-radius: 4px; text-align: center; background: var(--vp-c-bg); color: var(--vp-c-text-1); }
.svg-container { position: relative; width: 100%; height: 300px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: 4px; display: flex; justify-content: center; align-items: center; overflow: hidden; }
.feedback-badge { position: absolute; top: 10px; right: 10px; background-color: #dcfce7; color: #166534; padding: 5px 12px; border-radius: 20px; font-size: 0.875rem; font-weight: bold; animation: bounce 1s infinite; }
.result-box { margin-top: 1rem; text-align: center; padding: 10px; border-radius: 4px; background-color: var(--vp-c-bg-mute); transition: background-color 0.3s; }
.result-box.success { background-color: rgba(34, 197, 94, 0.1); }
.math-result { font-family: monospace; font-size: 1.1rem; }
.hint { font-size: 0.875rem; color: var(--vp-c-text-2); margin-top: 4px; }
@keyframes bounce { 0%, 100% { transform: translateY(-5%); } 50% { transform: translateY(5%); } }
</style>