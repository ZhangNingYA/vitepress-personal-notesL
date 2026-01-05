# 作业 1：交互式实验

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { mat4 } from 'gl-matrix';
import { Pane } from 'tweakpane'; // 引入 UI 库

// ==========================================
// 1. 定义 Shader (不变)
// ==========================================
const vsSource = `
  attribute vec4 aVertexPosition;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  }
`;
const fsSource = `
  void main() {
    gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0);
  }
`;

// ==========================================
// 2. 定义可调节参数 (你的控制台)
// ==========================================
const params = {
  fov: 45,        // 视野角度
  zNear: 0.1,     // 近裁剪面
  zFar: 100.0,    // 远裁剪面
  modelZ: -6.0,   // 物体距离
  rotateSpeed: 1.0 // 旋转速度
};

// 用来存储 UI 面板实例，以便销毁
let pane: Pane | null = null;

// ==========================================
// 3. 初始化 WebGL & UI
// ==========================================
let program: WebGLProgram;
let positionBuffer: WebGLBuffer;
let programInfo: any;

const initJob = (gl: WebGLRenderingContext) => {
  // --- A. 初始化 UI 面板 ---
  // 必须在这里或者 onMounted 里初始化，不能在最外层
  if (!pane) {
    pane = new Pane({ title: '相机参数实验室' });
    
    // 绑定 FOV：范围 10 到 170 度
    pane.addBinding(params, 'fov', { min: 10, max: 170 });
    
    // 绑定物体距离：范围 -1 到 -20
    pane.addBinding(params, 'modelZ', { min: -20, max: -0.1 });
    
    // 绑定近裁剪面 (小心调节，太大会切掉物体)
    pane.addBinding(params, 'zNear', { min: 0.1, max: 10.0 });

    // 绑定旋转速度
    pane.addBinding(params, 'rotateSpeed', { min: 0, max: 5 });
  }

  // --- B. WebGL 常规初始化 (跟之前一样) ---
  const loadShader = (type, source) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  };
  const programInstance = gl.createProgram()!;
  gl.attachShader(programInstance, loadShader(gl.VERTEX_SHADER, vsSource));
  gl.attachShader(programInstance, loadShader(gl.FRAGMENT_SHADER, fsSource));
  gl.linkProgram(programInstance);
  program = programInstance;

  programInfo = {
    attribLocations: { vertexPosition: gl.getAttribLocation(program, 'aVertexPosition') },
    uniformLocations: { 
      projectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(program, 'uModelViewMatrix') 
    },
  };

  const positions = [0.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0];
  positionBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
};

// ==========================================
// 4. 绘制循环 (每一帧读取 params)
// ==========================================
const drawJob = (gl: WebGLRenderingContext, time: number) => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  
  // 绑定数据...
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  gl.useProgram(program);

  // --- 关键点：使用 params 计算矩阵 ---

  // 1. 计算 Projection 矩阵
  const projectionMatrix = mat4.create();
  // 注意：gl-matrix 需要弧度，UI 上我们显示角度，所以要转换
  const fovRadians = (params.fov * Math.PI) / 180; 
  
  mat4.perspective(
    projectionMatrix, 
    fovRadians, 
    gl.canvas.width / gl.canvas.height, 
    params.zNear, 
    params.zFar
  );

  // 2. 计算 ModelView 矩阵
  const modelViewMatrix = mat4.create();
  
  // 使用 params.modelZ 控制距离
  mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, params.modelZ]);
  
  // 使用 params.rotateSpeed 控制速度
  mat4.rotate(modelViewMatrix, modelViewMatrix, time * 0.001 * params.rotateSpeed, [0, 0, 1]);

  // 传给 Shader
  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

  gl.drawArrays(gl.TRIANGLES, 0, 3);
};

// 组件卸载时，一定要清理面板！否则它会一直浮在网页右上角
onUnmounted(() => {
  if (pane) {
    pane.dispose();
    pane = null;
  }
});
</script>

<div class="hw-container">
  <GameCanvas :init="initJob" :draw="drawJob" />
</div>