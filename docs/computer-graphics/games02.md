---
title: homework 02 rotate and translate
data: 2026-1-2
---

# 作业 1：旋转与投影

<script setup lang="ts">
import { ref } from 'vue';
import { mat4 } from 'gl-matrix';

// ==========================================
// 1. 定义 Shader (着色器代码)
// ==========================================

// 顶点着色器：负责处理位置 + 矩阵变换
const vsSource = `
  attribute vec4 aVertexPosition; // 输入：顶点坐标
  uniform mat4 uModelViewMatrix;  // 输入：模型视图矩阵
  uniform mat4 uProjectionMatrix; // 输入：投影矩阵

  void main() {
    // 核心公式：P * V * M * pos
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  }
`;

// 片元着色器：负责上色
const fsSource = `
  void main() {
    gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0); // 输出纯橙色
  }
`;

// ==========================================
// 2. 辅助变量
// ==========================================
let program: WebGLProgram;
let positionBuffer: WebGLBuffer;
// 存储 Shader 里的变量位置（指针）
let programInfo = {
  attribLocations: { vertexPosition: 0 },
  uniformLocations: { projectionMatrix: null, modelViewMatrix: null },
};

// ==========================================
// 3. 初始化阶段 (init)
// ==========================================
const initJob = (gl: WebGLRenderingContext) => {
  // --- A. 编译 Shader (这是简单的样板代码，以后可以封装) ---
  const loadShader = (type, source) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };
  const vertexShader = loadShader(gl.VERTEX_SHADER, vsSource)!;
  const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSource)!;
  
  program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  // --- B. 获取变量在 GPU 中的地址 ---
  programInfo.attribLocations.vertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
  programInfo.uniformLocations.projectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
  programInfo.uniformLocations.modelViewMatrix = gl.getUniformLocation(program, 'uModelViewMatrix');

  // --- C. 创建三角形数据 (VBO) ---
  // 定义三个点 (x, y, z)，这是一个简单的等腰三角形
  const positions = [
     0.0,  1.0, 0.0, // 顶点
    -1.0, -1.0, 0.0, // 左下
     1.0, -1.0, 0.0, // 右下
  ];

  positionBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
  // 设置背景色为黑色
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
};

// ==========================================
// 4. 绘制阶段 (draw) - 每一帧都跑
// ==========================================
const drawJob = (gl: WebGLRenderingContext, time: number) => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // 深度测试 (让近的物体遮住远的)
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  // --- A. 告诉 WebGL 怎么从 Buffer 取数据 ---
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    3,        // 每次取3个数组 (x, y, z)
    gl.FLOAT, // 数据类型
    false,    // 不归一化
    0,        //步长
    0         // 偏移量
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

  // --- B. 使用 Shader ---
  gl.useProgram(program);

  // --- C. 计算矩阵 (作业的核心在这里！) ---
  
  // 1. 投影矩阵 (Projection) - 模拟相机的镜头参数
  const fieldOfView = (45 * Math.PI) / 180; // 45度 FOV
  const aspect = gl.canvas.width / gl.canvas.height;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();
  
  // 【关键点】这里目前用了 gl-matrix 的库函数
  // 你的任务是理解透视投影公式，甚至手写这个函数替代它
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // 2. 模型视图矩阵 (Model View) - 决定物体在哪、怎么转
  const modelViewMatrix = mat4.create();
  
  // 先把物体往屏幕里推一点 (z = -6.0)，否则就在相机脸上看不见
  mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
  
  // 旋转！让它随时间转动 (time 是毫秒)
  // time * 0.001 变成秒
  mat4.rotate(
    modelViewMatrix,  // 目标矩阵
    modelViewMatrix,  // 源矩阵
    time * 0.001,     // 旋转弧度
    [0, 0, 1]         // 旋转轴 (0,0,1) 代表绕 Z 轴转
  );

  // --- D. 把算好的矩阵传给 Shader ---
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  );

  // --- E. 画出来！ ---
  // 从第0个点开始，画3个点
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};
</script>

<div class="hw-container">
  <GameCanvas :init="initJob" :draw="drawJob" />
</div>

<style scoped>
.hw-container {
  display: flex;
  justify-content: center;
}
</style>