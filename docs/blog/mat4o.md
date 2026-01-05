---
title： gemini
date： 2026-1-2
---
# WebGL 核心库 gl-matrix: `mat4` 详解

在 WebGL 开发中，**`gl-matrix`** 库是事实上的标准，而其中的 `mat4`（4x4 矩阵）模块是核心中的核心。在 3D 图形学中，几乎所有的位置变换、旋转、缩放以及摄像机视角的模拟，最终都是通过 4x4 矩阵运算完成的。

为了让你直观理解，我们可以把 `mat4` 看作是一个 **“时空变形器”**。它负责把一个物体从原始状态（模型空间），搬运到世界里（世界空间），再通过摄像机观察（观察空间），最后压扁到屏幕上（裁剪空间）。

以下是 `mat4` 中最核心、使用频率最高的函数详解。

---

## 1. 初始化与重置：`create` & `identity`

一切的起点。在 WebGL 中，你需要先有一个容器来存放矩阵数据。

### `mat4.create()`
* **生动解释：** 就像拿出了一张**白纸**。它在内存中创建了一个新的 Float32Array (长度16)，默认初始化为“单位矩阵”（即对角线为1，其余为0）。
* **返回值：** 一个新的 4x4 矩阵（`Float32Array`）。
* **使用场景：** 每一帧开始前，或者初始化物体时，用来存储变换数据。

### `mat4.identity(out)`
* **生动解释：** **“归零”按钮**。不管这个矩阵之前经历了什么沧桑（旋转、位移），一按这个，它就变回了初始状态（单位矩阵）。物体会回到原点，没有旋转，没有缩放。
* **参数：**
    * `out`: `mat4` - 需要被重置的矩阵。
* **使用场景：** 在每一帧渲染循环开始时，重置模型矩阵，准备进行新的变换。

---

## 2. 三维世界的透镜：`perspective` (投影矩阵)

这是让 3D 看起来像 3D 的关键。它模拟了人眼或相机的原理：**近大远小**。

### `mat4.perspective(out, fovy, aspect, near, far)`
* **生动解释：** 给你的 WebGL 世界装上一个**广角镜头**或**长焦镜头**。它定义了一个“视锥体”（Frustum），只有在这个锥体里的东西才会被看见。
* **参数详解：**
    * `out`: `mat4` - 接收结果的矩阵（通常叫 `projectionMatrix`）。
    * `fovy`: `Number` - **视野角度** (Field of View)，通常是 45度 (用弧度表示，即 $\pi/4$)。角度越大，看到的范围越广（广角），物体越小。
    * `aspect`: `Number` - **宽高比**。通常是 `canvas.width / canvas.height`。防止画面被拉伸变形。
    * `near`: `Number` - **近裁剪面**。眼睛能看到的最近距离（不能是0，通常是 0.1）。
    * `far`: `Number` - **远裁剪面**。眼睛能看到的最远距离（比如 1000.0）。
* **使用场景：** 初始化渲染循环时，或者当窗口大小改变时调用。

---

## 3. 摄像机的摆放：`lookAt` (视图矩阵)

在 WebGL 里没有真正的“摄像机”对象，我们需要通过移动整个世界来模拟摄像机的移动。`lookAt` 就是帮我们计算这个复杂变换的神器。

### `mat4.lookAt(out, eye, center, up)`
* **生动解释：** 想象你是一个摄影师。
    1.  你站在哪？(`eye`)
    2.  你镜头对准谁？(`center`)
    3.  你的头顶朝向哪？(`up`)
* **参数详解：**
    * `out`: `mat4` - 接收结果的矩阵（通常叫 `viewMatrix`）。
    * `eye`: `vec3` - **摄像机位置**。例如 `[0, 0, 10]`（站在 Z 轴 10 的位置）。
    * `center`: `vec3` - **观察目标点**。例如 `[0, 0, 0]`（看着原点）。
    * `up`: `vec3` - **上方向**。通常是 `[0, 1, 0]`（Y 轴向上），除非你在做飞行模拟器（可以倒着飞）。
* **使用场景：** 每一帧更新摄像机位置时，或者制作第一人称控制器时。

---

## 4. 操纵物体：`translate`, `rotate`, `scale` (模型矩阵)

这三个函数赋予物体生命，让它们在空间中运动。

### `mat4.translate(out, a, v)`
* **生动解释：** **平移**。把物体从当前位置“搬运”一段距离。
* **参数：** `out` (输出), `a` (当前矩阵), `v` (位移向量 `[x, y, z]`)。
* **注意：** 如果 `out` 和 `a` 是同一个矩阵，就是直接修改该矩阵。

### `mat4.rotate(out, a, rad, axis)`
* **生动解释：** **旋转**。让物体像烤羊腿一样绕着一根签子转动。
* **参数：**
    * `rad`: `Number` - 旋转角度（弧度制）。
    * `axis`: `vec3` - 旋转轴。例如 `[0, 1, 0]` 是绕 Y 轴转（像陀螺）。
* **变体：** `rotateX`, `rotateY`, `rotateZ` 是针对特定轴的优化版本，更常用。

### `mat4.scale(out, a, v)`
* **生动解释：** **缩放**。像吹气球一样变大，或像压缩饼干一样变小。
* **参数：** `v` 是缩放向量。`[2, 2, 2]` 是整体放大两倍；`[1, 2, 1]` 是只把高度拉长两倍。

---

## 5. 组合技：`multiply`

### `mat4.multiply(out, a, b)`
* **生动解释：** **融合**。矩阵最神奇的地方在于，你可以把“平移”、“旋转”、“缩放”这三个动作，甚至“投影”和“视图”，全部乘在一起，压缩成**一个**矩阵。
* **公式：** $$Result = A \times B$$
* **关键点（坑）：** 矩阵乘法**不具备交换律**。
    * 在 WebGL (列主序) 中，通常顺序是：`投影矩阵 * 视图矩阵 * 模型矩阵`。
    * 这意味着顶点先被模型矩阵变换，再被视图矩阵变换，最后被投影。
* **使用场景：**
    * 组合 MVP 矩阵传给 Shader：`mat4.multiply(mvpMatrix, projectionMatrix, viewMatrix)` (然后再乘模型)。
    * 建立父子层级关系（如手臂连着身体，手臂动，手掌也要跟着动）。

---

## 6. WebGL 中的代码实战示例

下面是一段标准的 `gl-matrix` 使用流程，展示了如何配合 WebGL 使用这些函数。

```javascript
// 1. 引入库 (假设使用 ES6)
import { mat4 } from 'gl-matrix';

// 2. 准备数据容器
const projectionMatrix = mat4.create();
const modelViewMatrix = mat4.create();

// 3. 设置投影 (透视镜头)
// 45度视角, 屏幕宽高比, 最近看0.1, 最远看100
mat4.perspective(projectionMatrix, 45 * Math.PI / 180, canvas.width / canvas.height, 0.1, 100.0);

// 4. 设置模型视图 (重置 -> 移动 -> 旋转)
mat4.identity(modelViewMatrix); // 归位

// 把物体往屏幕里推 6 个单位 (z = -6)
mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6.0]);

// 绕着 Z 轴和 X 轴旋转
mat4.rotate(modelViewMatrix, modelViewMatrix, 0.78, [0, 0, 1]); // 旋转 45度
mat4.rotate(modelViewMatrix, modelViewMatrix, 0.50, [1, 0, 0]); 

// 5. 传给 WebGL Shader
// uProjectionMatrix 和 uModelViewMatrix 是你在 Shader 里定义的 uniform 变量位置
gl.uniformMatrix4fv(uProjectionMatrixLoc, false, projectionMatrix);
gl.uniformMatrix4fv(uModelViewMatrixLoc, false, modelViewMatrix);