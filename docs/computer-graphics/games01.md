---
title: homework 01 framework
date: 2026-1-3
---

## 搭建 WebGL

## 代码实现

<script setup lang="ts">

const onInit = (gl: WebGLRenderingContext, canvas: HTMLCanvasElement) => {
  console.log('WebGL 环境初始化成功', gl);
  gl.clearColor(1.0, 0.0, 0.0, 1.0);
};

// 3. 定义绘制函数 (每帧执行)
const onDraw = (gl: WebGLRenderingContext, time: number) => {
  gl.clear(gl.COLOR_BUFFER_BIT);
};
</script>

<div class="demo-container">
  <GameCanvas :init="onInit" :draw="onDraw" />
</div>
