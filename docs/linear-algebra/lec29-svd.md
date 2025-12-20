---
title: 第29讲：奇异值分解（SVD）
date: 2025-12-22
---

# MIT 18.06 线性代数 第29讲：奇异值分解（SVD）

> **Lecture 29: Singular Value Decomposition**
>
> **主线逻辑**：
> 1. **目标**：为“任意矩阵”找到一个像对角化那样好用的分解，但不要求矩阵必须对称、可对角化。
> 2. **核心结论**：任何矩阵都能写成 **正交 × 对角 × 正交**：$A = U\Sigma V^T$。
> 3. **来源**：把“好矩阵” $A^TA \succeq 0$ 与 $AA^T \succeq 0$ 的特征分解拼起来。
> 4. **几何意义**：线性变换把单位球映射成椭球；SVD 给出椭球主轴方向（$U,V$）与轴长（$\sigma_i$）。
> 5. **与四大子空间**：$V$ 的列向量自然分解 $\mathbb R^n$ 的行空间与零空间；$U$ 的列向量自然分解 $\mathbb R^m$ 的列空间与左零空间。

---

## 0. 本讲解决了哪些问题（结论先行）

1. **SVD 是什么？**
   对任意 $A\in\mathbb R^{m\times n}$，存在正交矩阵 $U\in\mathbb R^{m\times m},\ V\in\mathbb R^{n\times n}$ 与“对角”矩阵 $\Sigma\in\mathbb R^{m\times n}$，使得
   $$
   A = U\Sigma V^T
   $$
   其中 $\Sigma$ 只有主对角线可能非零，这些非零值 $\sigma_1\ge \sigma_2\ge \cdots \ge \sigma_r>0$ 称为 **奇异值（singular values）**，$r=\mathrm{rank}(A)$。

2. **为什么它比特征分解更强？**
   - 特征分解要求方阵、并且“最好”还要可对角化；对称矩阵才有正交特征向量。
   - SVD 不挑矩阵：长方形、非对称、秩亏都可以分解成“最好的三件套”——正交、对角、正交。

3. **SVD 直接带来哪些“可计算”的好处？**
   - 计算 $A^TA$、$AA^T$ 的结构变透明（它们的特征值就是 $\sigma_i^2$）。
   - 最小二乘、伪逆、降维、压缩都能用同一套工具统一处理（后续讲会专门展开）。

---

## 1. 从“好矩阵”出发：$A^TA$ 与 $AA^T$ 必然半正定

### 1.1 两个关键观察
对任意 $A\in\mathbb R^{m\times n}$：

1) $A^TA$ 一定是对称半正定：
$$
x^T(A^TA)x = (Ax)^T(Ax)=\|Ax\|^2 \ge 0 \quad\Rightarrow\quad A^TA \succeq 0
$$

2) $AA^T$ 同理也是对称半正定：
$$
y^T(AA^T)y = (A^Ty)^T(A^Ty)=\|A^Ty\|^2 \ge 0 \quad\Rightarrow\quad AA^T \succeq 0
$$

> 这一步把我们带回“上一讲的好世界”：对称、（半）正定矩阵有实特征值，且可正交对角化。

---

## 2. SVD 的“构造性推导”（本讲第一核心）

这一节的目标是：不“先假设” $A=U\Sigma V^T$，而是从 $A^TA$ 的谱分解出发，把 $U,\Sigma,V$ 逐个“逼出来”。

### 2.1 先对角化 $A^TA$
因为 $A^TA \succeq 0$ 且对称，所以存在正交矩阵 $V$ 使
$$
A^TA = V\Lambda V^T
$$
其中
$$
\Lambda=\mathrm{diag}(\lambda_1,\lambda_2,\dots,\lambda_n),\quad \lambda_i\ge 0
$$

把 $\lambda_i$ 写成平方更自然：令
$$
\sigma_i=\sqrt{\lambda_i}\ge 0
$$
并把它们按从大到小排列。

### 2.2 定义右奇异向量 $v_i$ 与对应的“像” $u_i$
设 $v_i$ 是 $A^TA$ 的单位特征向量：
$$
A^TA v_i = \lambda_i v_i = \sigma_i^2 v_i
$$

对 $\sigma_i>0$ 的那些（即前 $r$ 个），定义
$$
u_i = \frac{1}{\sigma_i} A v_i
$$

现在检查 $u_i$ 的长度：
$$
\|u_i\|^2 = \frac{1}{\sigma_i^2}\|Av_i\|^2 = \frac{1}{\sigma_i^2} v_i^T A^T A v_i = \frac{1}{\sigma_i^2} v_i^T(\sigma_i^2 v_i) = 1
$$
所以 $u_i$ 也是单位向量，并且满足关键关系：
$$
A v_i = \sigma_i u_i
$$

> 这句话是 SVD 的“原子公式”：每个 $v_i$（右边基向量）被 $A$ 映射到 $u_i$（左边基向量），长度被缩放 $\sigma_i$。

### 2.3 证明 $u_i$ 之间正交
对 $i\neq j$ 且 $\sigma_i,\sigma_j>0$：
$$
u_i^T u_j = \frac{1}{\sigma_i\sigma_j} (Av_i)^T(Av_j) = \frac{1}{\sigma_i\sigma_j} v_i^T A^T A v_j = \frac{1}{\sigma_i\sigma_j} v_i^T(\sigma_j^2 v_j) = \frac{\sigma_j}{\sigma_i} v_i^T v_j = 0
$$
因为 $V$ 是正交矩阵，其列向量 $v_i$ 两两正交。

于是：$\{u_1,\dots,u_r\}$ 构成列空间中的一组正交单位向量。

### 2.4 把 $u_i$ 补全成 $U$，得到完整分解
- 把 $u_1,\dots,u_r$ 在 $\mathbb R^m$ 中补全为正交基 $u_1,\dots,u_m$，组成正交矩阵
  $$
  U=\begin{bmatrix}
  | & & | \\
  u_1 & \cdots & u_m \\
  | & & |
  \end{bmatrix}
  $$
- $V$ 由 $A^TA$ 的正交特征向量组成：
  $$
  V=\begin{bmatrix}
  | & & | \\
  v_1 & \cdots & v_n \\
  | & & |
  \end{bmatrix}
  $$
- $\Sigma$ 的对角线上放入奇异值：
  $$
  \Sigma=
  \begin{bmatrix}
  \sigma_1 & 0 & \cdots & 0 \\
  0 & \sigma_2 & \cdots & 0 \\
  \vdots & \vdots & \ddots & \vdots \\
  0 & 0 & \cdots & \sigma_r \\
  \vdots & \vdots & & \vdots \\
  0 & 0 & \cdots & 0
  \end{bmatrix}_{m\times n}
  $$

此时由 $Av_i=\sigma_i u_i$ 把所有列“打包”起来，就得到：
$$
A V = U \Sigma \quad\Rightarrow\quad A = U\Sigma V^T
$$

---

## 3. “长 SVD”与“薄 SVD”（计算与理解都更清晰）

设 $r=\mathrm{rank}(A)$。

### 3.1 长（full/long）SVD
$$
A = U\Sigma V^T
$$
其中
- $U\in\mathbb R^{m\times m}$ 正交
- $V\in\mathbb R^{n\times n}$ 正交
- $\Sigma\in\mathbb R^{m\times n}$ 主对角线非负递减

### 3.2 薄（thin/compact）SVD（只保留非零奇异值部分）
记
- $U_r=[u_1,\dots,u_r]\in\mathbb R^{m\times r}$
- $V_r=[v_1,\dots,v_r]\in\mathbb R^{n\times r}$
- $\Sigma_r=\mathrm{diag}(\sigma_1,\dots,\sigma_r)\in\mathbb R^{r\times r}$

则
$$
A = U_r \Sigma_r V_r^T
$$

> 薄 SVD 是“信息无冗余”的版本：它只保留 $A$ 的秩所允许的有效方向。

---

## 4. 与特征分解的关系：$A^TA$ 和 $AA^T$ 的谱就是 $\sigma_i^2$

从 $A=U\Sigma V^T$ 直接推出：

### 4.1 右侧：$A^TA$
$$
A^TA = (U\Sigma V^T)^T(U\Sigma V^T) = V\Sigma^T U^T U\Sigma V^T = V(\Sigma^T\Sigma)V^T
$$

而 $\Sigma^T\Sigma=\mathrm{diag}(\sigma_1^2,\dots,\sigma_r^2,0,\dots,0)$，
因此 $A^TA$ 的特征值就是 $\sigma_i^2$。

### 4.2 左侧：$AA^T$
同理
$$
AA^T = U(\Sigma\Sigma^T)U^T
$$
其非零特征值也同样是 $\sigma_i^2$。

> 重要推论：$A^TA$ 与 $AA^T$ 的**非零特征值完全一致**（只是维度不同、零特征值个数可能不同）。

---

## 5. 几何解释：单位球被映射成椭球（本讲第二核心）

把 $A=U\Sigma V^T$ 看成三步：

1) $x \mapsto V^T x$：正交变换，只是旋转/反射，不改变长度 
2) $x \mapsto \Sigma x$：沿坐标轴缩放，把单位球变成主轴对齐的椭球（轴长为 $\sigma_i$） 
3) $x \mapsto Ux$：再旋转/反射到最终方向

因此，SVD 给出“椭球的全部几何参数”：
- 右奇异向量 $v_i$：输入空间中最重要的正交方向
- 左奇异向量 $u_i$：输出空间中对应的正交方向
- 奇异值 $\sigma_i$：沿该方向的放大倍数（轴长）

---

## 6. 四大子空间在 SVD 下“一眼看穿”

设 $A\in\mathbb R^{m\times n}$，秩为 $r$。薄 SVD：
$$
A = U_r\Sigma_r V_r^T
$$

### 6.1 列空间与左零空间（在 $\mathbb R^m$）
- 列空间 $\mathcal C(A)$ 由 $u_1,\dots,u_r$ 张成：
  $$
  \mathcal C(A)=\mathrm{span}\{u_1,\dots,u_r\}
  $$
- 左零空间 $\mathcal N(A^T)$ 由 $u_{r+1},\dots,u_m$ 张成：
  $$
  \mathcal N(A^T)=\mathrm{span}\{u_{r+1},\dots,u_m\}
  $$

### 6.2 行空间与零空间（在 $\mathbb R^n$）
- 行空间 $\mathcal C(A^T)$ 由 $v_1,\dots,v_r$ 张成：
  $$
  \mathcal C(A^T)=\mathrm{span}\{v_1,\dots,v_r\}
  $$
- 零空间 $\mathcal N(A)$ 由 $v_{r+1},\dots,v_n$ 张成：
  $$
  \mathcal N(A)=\mathrm{span}\{v_{r+1},\dots,v_n\}
  $$

> 这也是为什么 SVD 被称为“最终的分解”：它把四个基本子空间一次性给出正交基。

---

## 7. 一个必须会写的等价表述：秩 $r$ 的“秩一分解”

由薄 SVD：
$$
A = U_r\Sigma_r V_r^T = \sum_{i=1}^{r}\sigma_i u_i v_i^T
$$

每一项 $\sigma_i u_i v_i^T$ 都是秩 1 矩阵（外积），因此：
- $A$ 是 $r$ 个秩一矩阵的和
- 这为后续“截断近似”（只取前 $k$ 项）奠定基础（下一讲会用来做图像压缩/降维）

---

## 8. 与“对称正定”的特殊关系：为什么上一讲铺垫很关键？

如果 $A$ 本身就是对称正定（SPD）：
- 它既能特征分解 $A=Q\Lambda Q^T$（$Q$ 正交，$\Lambda$ 正对角）
- 也能 SVD $A=U\Sigma V^T$

并且在 SPD 情况下可以取 $U=V=Q$，奇异值就是特征值：
$$
A=Q\Lambda Q^T \quad\Rightarrow\quad \sigma_i=\lambda_i,\quad U=V=Q
$$

> 所以你可以把 SVD 理解为：把“对称矩阵最美的分解”推广到“任意矩阵”。

---

## 9. 一句话复盘

SVD 把任意矩阵写成 $A=U\Sigma V^T$：两个正交矩阵负责旋转坐标系，一个对角矩阵负责缩放。它来自对 $A^TA \succeq 0$ 与 $AA^T \succeq 0$ 的特征分解，给出奇异值 $\sigma_i$ 与左右奇异向量 $u_i,v_i$，并且把四大子空间的正交结构一次性揭示出来。

---

## 10. 自检题（建议先做再看答案）

1. 证明：$A^TA \succeq 0$ 且 $AA^T \succeq 0$。
2. 从 $A^TA v_i=\sigma_i^2 v_i$ 出发，定义 $u_i=\frac{1}{\sigma_i}Av_i$，证明 $\|u_i\|=1$ 且 $u_i$ 两两正交。
3. 推导：若 $A=U\Sigma V^T$，则 $A^TA=V(\Sigma^T\Sigma)V^T$ 与 $AA^T=U(\Sigma\Sigma^T)U^T$。
4. 证明秩一分解：$A=\sum_{i=1}^{r}\sigma_i u_i v_i^T$。
5. 用 SVD 解释：为什么 $\dim\mathcal C(A)=r$ 且 $\dim\mathcal N(A)=n-r$（提示：看 $v_{r+1},\dots,v_n$）。