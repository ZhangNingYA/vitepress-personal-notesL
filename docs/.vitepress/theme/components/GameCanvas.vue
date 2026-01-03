<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// 定义 props，让每个作业可以传入具体的绘制逻辑
const props = defineProps<{
  // 这是一个回调函数，把 gl 上下文交出去给具体的作业逻辑使用
  init: (gl: WebGLRenderingContext, canvas: HTMLCanvasElement) => void;
  draw?: (gl: WebGLRenderingContext, time: number) => void;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationId: number;

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  // 设置画布大小（可以根据需要改为动态）
  canvas.width = 600;
  canvas.height = 400;

  const gl = canvas.getContext('webgl');
  if (!gl) {
    alert("浏览器不支持 WebGL");
    return;
  }

  // 1. 初始化（编译 Shader、绑定 Buffer 等）
  // 调用父组件传进来的初始化逻辑
  try {
    props.init(gl, canvas);
  } catch (e) {
    console.error("初始化作业失败:", e);
    return;
  }

  // 2. 渲染循环
  const render = (time: number) => {
    if (props.draw) {
      props.draw(gl, time);
    }
    animationId = requestAnimationFrame(render);
  };
  
  render(0);
});

onUnmounted(() => {
  cancelAnimationFrame(animationId);
});
</script>

<template>
  <div class="canvas-wrapper">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
.canvas-wrapper {
  border: 1px solid #3c3c3c;
  border-radius: 8px;
  background: #000;
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
</style>