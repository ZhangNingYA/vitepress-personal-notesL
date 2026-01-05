---
title： openai
date： 2026-1-2
---
# mat4（glMatrix）核心函数：WebGL 实战向详解（含参数/返回值/场景/坑点）

> 适用对象：正在学习 WebGL、使用 **gl-matrix**（或等价 API 风格）的 `mat4` 进行 3D 变换与相机/投影计算。  
> 目标：只讲 WebGL 最常用、最核心的函数，但把每个函数讲透——你能立刻在项目里用起来。

---

## 目录

- [0. 你在 WebGL 里到底为什么离不开 mat4](#0-你在-webgl-里到底为什么离不开-mat4)
- [1. mat4 的“数据长相”与两条最重要的心智模型](#1-mat4-的数据长相与两条最重要的心智模型)
  - [1.1 mat4 是什么类型](#11-mat4-是什么类型)
  - [1.2 列主序（column-major）与索引速查](#12-列主序column-major与索引速查)
  - [1.3 “后乘”（post-multiplication）导致的顺序反转](#13-后乘post-multiplication导致的顺序反转)
- [2. WebGL 最常见的三大矩阵：Model / View / Projection](#2-webgl-最常见的三大矩阵model--view--projection)
- [3. 核心函数详解（按 WebGL 真实工作流组织）](#3-核心函数详解按-webgl-真实工作流组织)
  - [3.1 创建与重置：create / identity / copy / clone](#31-创建与重置create--identity--copy--clone)
  - [3.2 组合变换：multiply（mul）](#32-组合变换multiplymul)
  - [3.3 增量变换：translate / rotate / rotateX|Y|Z / scale](#33-增量变换translate--rotate--rotatexyz--scale)
  - [3.4 一步到位构建模型矩阵：fromRotationTranslationScale](#34-一步到位构建模型矩阵fromrotationtranslationscale)
  - [3.5 相机视图矩阵：lookAt](#35-相机视图矩阵lookat)
  - [3.6 投影矩阵：perspective / ortho](#36-投影矩阵perspective--ortho)
  - [3.7 逆矩阵与转置：invert / transpose](#37-逆矩阵与转置invert--transpose)
- [4. 一段完整 WebGL 管线示例：从 TRS 到 MVP 再到 uniformMatrix4fv](#4-一段完整-webgl-管线示例从-trs-到-mvp-再到-uniformmatrix4fv)
- [5. 常见坑点清单（强烈建议对照自查）](#5-常见坑点清单强烈建议对照自查)
- [6. 附：推荐的“最少对象分配”写法（性能习惯）](#6-附推荐的最少对象分配写法性能习惯)

---

## 0. 你在 WebGL 里到底为什么离不开 mat4

在 WebGL 的顶点着色器里，你几乎总是会做类似这样的事：

```glsl
gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
```

这里的 `uProjection/uView/uModel` 都是 **4x4 矩阵**（mat4），原因很现实：

- 3D 的平移需要齐次坐标（homogeneous coordinate），所以用 4x4 才能把“平移”也塞进一个矩阵里。
- 旋转/缩放/错切/坐标系转换（世界→相机→裁剪空间）都能统一用矩阵乘法表达。
- GPU 最擅长做向量与矩阵运算，传一个 mat4 uniform 是经典路径。

你可以把 mat4 想成一条“流水线的配方”，把顶点从“模型局部坐标”一路加工到屏幕上。

---

## 1. mat4 的“数据长相”与两条最重要的心智模型

### 1.1 mat4 是什么类型

在 gl-matrix 生态里（尤其 WebGL 场景），`mat4` 通常是：

- `Float32Array(16)` 或者普通长度为 16 的数组（但实践中多用 Float32Array）
- 内部存 16 个浮点数，对应 4x4 矩阵

特点：

- **函数大多使用 `out` 参数**接收结果，避免频繁 new，适合动画循环。
- 绝大多数函数**返回值就是 out**（便于链式/复用），少数返回 number/bool/null（如 determinant、equals、invert）。

---

### 1.2 列主序（column-major）与索引速查

列主序的意思是：数组是按“列”依次存的，而不是按“行”。

mat4 里 16 个元素的索引通常可以这样理解（`m[col][row]`）：

```
索引:  0   4   8  12
      1   5   9  13
      2   6  10  14
      3   7  11  15
```

也就是说：

- 第 0 列（x 基向量）在索引 0,1,2,3
- 第 1 列（y 基向量）在索引 4,5,6,7
- 第 2 列（z 基向量）在索引 8,9,10,11
- 第 3 列（平移项 + 齐次项）在索引 12,13,14,15

你在调试时常用的“平移分量”通常就是：

```js
tx = m[12]; ty = m[13]; tz = m[14];
```

---

### 1.3 “后乘”（post-multiplication）导致的顺序反转

这是新手最容易栽坑的一点，也是在 WebGL 里最重要的一点：

- glMatrix 的 mat4 变换通常是“后乘”：把新的变换矩阵**乘在右边**。
- 顶点实际应用变换时是 `v' = M * v`（列向量），因此**右边的变换先发生**。

直观记忆法：

> **矩阵从左到右写出来**：`M = T * R * S`  
> **顶点从右到左被处理**：先 S（缩放）→ 再 R（旋转）→ 最后 T（平移）

所以当你写这种代码：

```js
mat4.identity(model);
mat4.translate(model, model, pos);
mat4.rotateY(model, model, yaw);
mat4.scale(model, model, scl);
```

得到的是：

- `model = I * T * R * S`
- 顶点应用顺序：**S → R → T**（非常常见，也很符合“先在本地缩放旋转，再搬到世界位置”）

---

## 2. WebGL 最常见的三大矩阵：Model / View / Projection

### Model（模型矩阵）
把顶点从“模型局部坐标系”放到“世界坐标系”。

典型内容：平移（物体位置）、旋转（朝向）、缩放（大小）——也就是 TRS。

### View（视图矩阵）
把世界坐标变成相机坐标（也可理解为“把世界整体移动/旋转到相机前”）。

常见来源：
- `mat4.lookAt(...)` 直接生成（最常见）
- 或者先算“相机的世界矩阵”，再 `invert` 得到 view

### Projection（投影矩阵）
把相机坐标映射到裁剪空间（clip space），再走 GPU 的透视除法进入 NDC。

常见：
- 透视投影：`mat4.perspective(...)`
- 正交投影：`mat4.ortho(...)`

---

## 3. 核心函数详解（按 WebGL 真实工作流组织）

> 说明：下面统一使用 gl-matrix 的典型签名风格：
> - `out`：输出矩阵（mat4），同时也是返回值
> - `a/b`：输入矩阵（ReadonlyMat4）
> - `v`：vec3（长度 3 的数组或 Float32Array）
> - `rad`：弧度（radians），不是角度（degrees）

---

### 3.1 创建与重置：create / identity / copy / clone

#### `mat4.create() -> mat4`
**作用：**创建一个新的 4x4 单位矩阵（identity matrix）。

- **参数：**无
- **返回值：**新的 `mat4`（通常是 `Float32Array(16)`）
- **典型场景：**
  - 初始化 model/view/projection 矩阵对象
  - 初始化临时矩阵（例如每帧复用一个 tmp）

```js
const model = mat4.create(); // 默认就是单位矩阵
```

---

#### `mat4.identity(out) -> mat4`
**作用：**把 `out` 重置为单位矩阵。

- **参数：**
  - `out: mat4`：要被重置的矩阵
- **返回值：**`out`
- **典型场景：**
  - 每帧重置（动画循环里非常常见）
  - 复用同一个 mat4，避免 new

```js
mat4.identity(model); // model 变回单位矩阵
```

---

#### `mat4.copy(out, a) -> mat4`
**作用：**把矩阵 `a` 的 16 个值复制到 `out`。

- **参数：**
  - `out: mat4`：接收结果
  - `a: ReadonlyMat4`：被复制的源矩阵
- **返回值：**`out`
- **典型场景：**
  - 你需要“保存一个快照”，但不想 new 太多对象
  - 例如把当前 model 保存到栈里做层级变换（scene graph）

```js
mat4.copy(tmp, model);
```

---

#### `mat4.clone(a) -> mat4`
**作用：**创建一个新的矩阵，并拷贝 `a` 的值。

- **参数：**
  - `a: ReadonlyMat4`：要克隆的矩阵
- **返回值：**新的 `mat4`
- **典型场景：**
  - 明确要得到一个“新对象”而不是复用 out
  - 调试或保存历史状态（但动画循环里不建议频繁用）

```js
const backup = mat4.clone(model);
```

---

### 3.2 组合变换：multiply（mul）

#### `mat4.multiply(out, a, b) -> mat4`
（别名：`mat4.mul`）

**作用：**矩阵乘法：`out = a * b`

- **参数：**
  - `out: mat4`：接收结果
  - `a: ReadonlyMat4`：左操作数
  - `b: ReadonlyMat4`：右操作数
- **返回值：**`out`
- **WebGL 典型场景：**
  - 计算 MVP：`MVP = P * V * M`
  - 组合父子节点变换：`world = parentWorld * local`

**示例：计算 MVP 并上传**

```js
mat4.multiply(mv, view, model);      // mv = V * M
mat4.multiply(mvp, proj, mv);        // mvp = P * (V * M)
gl.uniformMatrix4fv(uMVP, false, mvp);
```

**注意：不要写错顺序。**  
如果你交换了 `a` 和 `b`，效果往往是“看起来像完全错的世界”。

---

### 3.3 增量变换：translate / rotate / rotateX|Y|Z / scale

这一组函数的共同点：

- 都是 **“在现有矩阵 a 的基础上追加一个变换”**
- 通常效果是：`out = a * Transform(...)`（后乘 / 右乘）
- 在 WebGL 里最常见的写法是 `out === a`（原地修改）

---

#### `mat4.translate(out, a, v) -> mat4`
**作用：**给矩阵追加平移：把物体搬到某个位置。

- **参数：**
  - `out: mat4`：接收结果
  - `a: ReadonlyMat4`：被平移的矩阵
  - `v: ReadonlyVec3`：位移向量 `[x, y, z]`
- **返回值：**`out`
- **典型场景：**
  - 物体位置（model matrix）
  - 相机轨道（camera world matrix）等

```js
mat4.translate(model, model, [px, py, pz]);
```

---

#### `mat4.rotate(out, a, rad, axis) -> mat4`
**作用：**绕任意轴旋转（axis-angle）。

- **参数：**
  - `out: mat4`
  - `a: ReadonlyMat4`
  - `rad: Number`：弧度
  - `axis: ReadonlyVec3`：旋转轴（最好是单位向量）
- **返回值：**`out`
- **典型场景：**
  - 自由旋转（比如轨迹球控制器、任意朝向）
  - 绕某个法线旋转等

```js
const axis = vec3.normalize(vec3.create(), [1, 1, 0]);
mat4.rotate(model, model, rad, axis);
```

---

#### `mat4.rotateX(out, a, rad) -> mat4`（以及 rotateY/rotateZ）
**作用：**绕 X/Y/Z 轴旋转（更快、更直观）。

- **参数：**
  - `out: mat4`
  - `a: ReadonlyMat4`
  - `rad: Number`
- **返回值：**`out`
- **典型场景：**
  - FPS 相机：yaw（Y 轴）+ pitch（X 轴）
  - 简单动画（转盘、门轴）

```js
mat4.rotateY(model, model, yaw);
mat4.rotateX(model, model, pitch);
```

---

#### `mat4.scale(out, a, v) -> mat4`
**作用：**按 xyz 三个方向缩放。

- **参数：**
  - `out: mat4`
  - `a: ReadonlyMat4`
  - `v: ReadonlyVec3`：缩放系数 `[sx, sy, sz]`
- **返回值：**`out`
- **典型场景：**
  - 物体尺寸
  - 非等比缩放（例如拉长某个轴）

```js
mat4.scale(model, model, [sx, sy, sz]);
```

---

#### 变换“顺序”最容易错：给你一个实战判定法

你最终想要的矩阵一般写成：`M = T * R * S`

- 表示：先 S（缩放）→ 再 R（旋转）→ 最后 T（平移）
- 在 glMatrix 后乘模型下，通常对应的代码顺序是：

```js
mat4.identity(model);
mat4.translate(model, model, T);
mat4.rotateY(model, model, RY);
mat4.rotateX(model, model, RX);
mat4.scale(model, model, S);
```

如果你的物体“绕着世界原点转”，而不是“绕自己中心转”，80% 的原因是：你把 translate/rotate 的顺序写反了。

---

### 3.4 一步到位构建模型矩阵：fromRotationTranslationScale

当你的模型变换天然就是 TRS（位置 + 朝向 + 缩放）时，**优先使用这一类函数**：

#### `mat4.fromRotationTranslationScale(out, q, v, s) -> mat4`

**作用：**用 **四元数旋转 q + 平移 v + 缩放 s** 直接构建一个变换矩阵。

- **参数：**
  - `out: mat4`
  - `q: quat`：旋转四元数（通常应为单位四元数）
  - `v: ReadonlyVec3`：平移向量
  - `s: ReadonlyVec3`：缩放向量
- **返回值：**`out`
- **典型场景：**
  - 你从物理/动画/引擎系统里拿到 TRS（特别是旋转是 quat）
  - 你不想担心 translate/rotate/scale 的调用顺序
  - 你想要更稳定、可控（尤其在插值旋转时）

```js
mat4.fromRotationTranslationScale(model, rotationQuat, position, scale);
```

**为什么强烈推荐：**
- 四元数更适合插值（slerp），避免欧拉角万向节锁（gimbal lock）。
- TRS 一步生成，逻辑更清晰，也更利于调试。

---

### 3.5 相机视图矩阵：lookAt

#### `mat4.lookAt(out, eye, center, up) -> mat4`

**作用：**生成一个“看向目标”的视图矩阵（view matrix）。

- **参数：**
  - `out: mat4`
  - `eye: ReadonlyVec3`：相机位置
  - `center: ReadonlyVec3`：相机看向的目标点
  - `up: ReadonlyVec3`：相机的“上方向”参考（常用 `[0, 1, 0]`）
- **返回值：**`out`
- **WebGL 典型场景：**
  - 最常用的相机方式：给定 eye 和 center，快速得到 view
  - 轨道相机、观察相机、第三人称相机等

```js
mat4.lookAt(view, eye, center, [0, 1, 0]);
```

**关键提醒：lookAt 是“相机用”的，不是“让物体看向某物”的。**  
如果你要让一个物体朝向目标（比如炮台对准玩家），通常用 `targetTo` 或自己算朝向再生成 model。

---

### 3.6 投影矩阵：perspective / ortho

投影矩阵决定了“远近透视感”和“裁剪空间范围”。

#### `mat4.perspective(out, fovy, aspect, near, far) -> mat4`
（在部分版本中它是 `perspectiveNO` 的别名；WebGL 对应 NDC Z 范围常为 [-1, 1]）

- **参数：**
  - `out: mat4`
  - `fovy: number`：垂直视野角（弧度）
  - `aspect: number`：宽高比 `viewportWidth / viewportHeight`
  - `near: number`：近裁剪面（必须 > 0）
  - `far: number`：远裁剪面（可以是 Infinity 或 null 生成无限远投影，视版本而定）
- **返回值：**`out`
- **典型场景：**
  - 绝大多数 3D 场景（第一人称、第三人称、一般 3D 展示）

```js
mat4.perspective(proj, fovyRad, canvas.width / canvas.height, 0.1, 1000.0);
```

**经验值：**
- near 不要太小（例如 0.001），否则深度缓冲精度会更差，容易 Z-fighting。
- far 不要太大（例如 1e9），同样会挤压深度精度。

---

#### `mat4.ortho(out, left, right, bottom, top, near, far) -> mat4`
（通常是 `orthoNO` 的别名，WebGL NDC Z 范围 [-1, 1]）

- **参数：**
  - `out: mat4`
  - `left/right/bottom/top: number`：定义一个长方体裁剪体
  - `near/far: number`：近远裁剪面
- **返回值：**`out`
- **典型场景：**
  - 2D UI（屏幕空间投影）
  - CAD/等距视图/不需要透视的工程视图
  - 阴影贴图的光源正交投影（常见）

```js
mat4.ortho(proj, -w, w, -h, h, 0.1, 100.0);
```

---

### 3.7 逆矩阵与转置：invert / transpose

这两个看起来“数学味”很重，但在 WebGL 里非常实用。

#### `mat4.invert(out, a) -> mat4 | null`

**作用：**求逆矩阵（`out = inverse(a)`）。

- **参数：**
  - `out: mat4`
  - `a: ReadonlyMat4`
- **返回值：**
  - 成功：`out`
  - 失败：`null`（当矩阵不可逆）
- **WebGL 典型场景：**
  1) **从相机世界矩阵得到 view：** `view = inverse(cameraWorld)`
  2) 计算“从世界到局部”的变换（拾取/碰撞/局部空间计算）
  3) 法线矩阵（normal matrix）计算的中间步骤（通常还要 mat3）

```js
const inv = mat4.invert(view, cameraWorld);
if (!inv) {
  // 相机矩阵不可逆（比如缩放为 0）——需要兜底
}
```

---

#### `mat4.transpose(out, a) -> mat4`

**作用：**转置矩阵。

- **参数：**
  - `out: mat4`
  - `a: ReadonlyMat4`
- **返回值：**`out`
- **WebGL 场景：**
  - 某些数学推导或与外部库交换矩阵格式时使用
  - **注意：WebGL 的 uniformMatrix4fv 里 transpose 参数必须为 false**，所以通常不在上传前手动 transpose（更常见是统一约定 column-major）。

---

## 4. 一段完整 WebGL 管线示例：从 TRS 到 MVP 再到 uniformMatrix4fv

下面这段代码尽量贴近真实项目的“每帧渲染”逻辑，并体现 **复用矩阵对象**的习惯。

```js
import { mat4, vec3, quat } from "gl-matrix";

// ===== 预分配：避免每帧 new =====
const model = mat4.create();
const view  = mat4.create();
const proj  = mat4.create();
const mv    = mat4.create();
const mvp   = mat4.create();

// 物体 TRS
const position = vec3.fromValues(1, 0, -5);
const scale    = vec3.fromValues(1, 1, 1);
const rotation = quat.create(); // 单位四元数

// 相机
const eye    = vec3.fromValues(0, 2, 6);
const center = vec3.fromValues(0, 0, 0);
const up     = vec3.fromValues(0, 1, 0);

function render(gl, canvas, uMVP) {
  // 1) Projection
  const aspect = canvas.width / canvas.height;
  mat4.perspective(proj, Math.PI / 3, aspect, 0.1, 100.0);

  // 2) View
  mat4.lookAt(view, eye, center, up);

  // 3) Model（推荐：TRS 一步到位）
  mat4.fromRotationTranslationScale(model, rotation, position, scale);

  // 4) MVP = P * V * M
  mat4.multiply(mv, view, model);
  mat4.multiply(mvp, proj, mv);

  // 5) 上传到 GPU
  gl.uniformMatrix4fv(uMVP, false, mvp);

  // ...draw calls
}
```

**你应该注意到的三个细节：**

1. 绝大多数 mat4 函数都把结果写进 `out`，并返回 `out`（方便复用）。
2. `MVP = P * V * M` 的顺序是固定的（对应着色器里的写法）。
3. `uniformMatrix4fv` 的 `transpose` 参数传 `false`（WebGL 规定如此）。

---

## 5. 常见坑点清单（强烈建议对照自查）

1. **角度/弧度搞反**  
   `rotate/rotateX...` 需要弧度。角度要先 `deg * Math.PI / 180`。

2. **translate/rotate/scale 顺序导致“绕世界原点转”**  
   你以为“先 rotate 再 translate”，但写成了 `R * T`，结果右边先发生。

3. **MVP 乘法顺序写错**  
   正确通常是：`mvp = proj * view * model`。别写成 `model * view * proj`。

4. **直接 new mat4/vec3 在动画循环里**  
   会产生大量 GC 抖动。尽量预分配复用。

5. **near 太小 / far 太大导致深度精度问题（Z-fighting）**  
   深度缓冲不是无限精度。调整 near/far 是“工程手段”，不是数学洁癖。

6. **invert 返回 null 没处理**  
   例如缩放某轴为 0 的矩阵不可逆。要有兜底策略。

7. **uniformMatrix4fv 的 transpose 不是“你想转置就转置”**  
   在 WebGL 里必须传 false，并确保你传的数组就是 column-major 约定。

---

## 6. 附：推荐的“最少对象分配”写法（性能习惯）

### 6.1 预分配 + 每帧重置

```js
const model = mat4.create();

function frame() {
  mat4.identity(model);
  mat4.translate(model, model, pos);
  mat4.rotateY(model, model, yaw);
  mat4.scale(model, model, scl);

  requestAnimationFrame(frame);
}
```

### 6.2 用 tmp 矩阵做中间结果

```js
const tmp = mat4.create();

mat4.multiply(tmp, view, model);
mat4.multiply(mvp, proj, tmp);
```

### 6.3 需要“保存状态”时用 copy，而不是 clone

```js
const stack = [];
const tmp = mat4.create();

function push(m) {
  const saved = mat4.create();
  mat4.copy(saved, m);
  stack.push(saved);
}

function pop() {
  return stack.pop();
}
```

---

## 结语：如何把这些函数“学成肌肉记忆”

如果只记一个套路，请记这条：

> **模型矩阵：** `model = T * R * S`  
> **视图矩阵：** `view = lookAt(eye, center, up)`（或 `inverse(cameraWorld)`）  
> **投影矩阵：** `proj = perspective(fovy, aspect, near, far)`  
> **合成：** `mvp = proj * view * model`  
> **上传：** `gl.uniformMatrix4fv(loc, false, mvp)`

把这条跑通，你基本就能在 WebGL 里把 80% 的 3D 场景正确地“放到屏幕上”。

