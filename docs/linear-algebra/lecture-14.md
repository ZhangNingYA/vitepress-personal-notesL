---
title: MIT Linear Algebra Lecture 14
date: 2025-12-17
outline: deep
---



# 📐 正交向量与子空间
<div style="color: var(--vp-c-text-2); font-size: 0.9em; margin-bottom: 2rem;">MIT 18.06 Linear Algebra - Lecture 14</div>

::: tip 🎯 本讲核心目标
这节课我们要把几何（垂直）和代数（点积为 0）完美结合。
最重要的结论是：**行空间与零空间是正交的。**
:::

## 1. 什么是正交 (Orthogonal)?

在几何上，我们说两个向量垂直（Perpendicular）；在代数线性代数中，我们用**正交（Orthogonal）**这个词。

### 1.1 定义与判定
对于两个向量 $x$ 和 $y$，如果它们的**点积（Dot Product）为零**，则它们正交。

$$x^T y = 0 \quad \Rightarrow \quad \sum_{i=1}^{n} x_i y_i = 0$$

为什么是这样？让我们回忆一下 **毕达哥拉斯定理（勾股定理）**。
如果 $x \perp y$，那么向量长度应该满足：

$$||x||^2 + ||y||^2 = ||x+y||^2$$

展开来看看：
$$(x^T x) + (y^T y) = (x+y)^T (x+y)$$
$$x^T x + y^T y = x^T x + y^T y + \underbrace{x^T y + y^T x}_{2x^T y}$$

只有当 $2x^T y = 0$ 时，等式才成立。

---

### 🎨 交互演示：寻找 $90^\circ$
如果在手机上，试着点击输入框修改数值，观察何时会出现绿色的“正交”提示。

<VectorOrthogonality />

::: warning 特例：零向量
**零向量**正交于任何向量。
因为 $0^T x = 0$ 恒成立。
:::

---

## 2. 子空间的正交 (Orthogonality of Subspaces)

我们把“垂直”的概念从**线（向量）**扩展到**面（子空间）**。

❌ **错误直觉**：
如果子空间 $S$ 和子空间 $T$ 正交，你可能以为它们只是简单的“相交于原点”。
*比如：这一面墙和地板是垂直的，但墙上的斜线和地板上的斜线并不一定垂直。*

✅ **正确定义**：
> 如果子空间 $S$ 中的 **每一个** 向量都正交于子空间 $T$ 中的 **每一个** 向量，那么这两个子空间正交。
> $$v \cdot w = 0 \quad (\forall v \in S, \forall w \in T)$$

**结论**：在 $\mathbb{R}^3$ 中，两个 2维平面（过原点）**永远不可能**正交。它们必须相交于一条线。正交的子空间仅仅在原点相交 ($0$ 向量)。

---

## 3. 零空间 vs 行空间
<span style="background: var(--vp-c-bg-mute); color: var(--vp-c-text-2); padding: 2px 6px; border-radius: 4px; font-size: 0.8em;">The Big Picture</span>

这是本节课最精彩的部分。让我们看看矩阵 $A$ 的四个基本子空间。

### 3.1 为什么 $Ax=0$ 意味着正交？

考虑方程 $Ax=0$。我们将 $A$ 看作由行向量组成的：

$$
\begin{bmatrix} 
\text{---} & \text{row } 1 & \text{---} \\ 
\text{---} & \text{row } 2 & \text{---} \\ 
& \vdots & \\ 
\text{---} & \text{row } m & \text{---} 
\end{bmatrix} 
\begin{bmatrix} x_1 \\ \vdots \\ x_n \end{bmatrix} 
= 
\begin{bmatrix} 0 \\ 0 \\ \vdots \\ 0 \end{bmatrix}
$$

这其实是在说：
1.  (Row 1) $\cdot x = 0$
2.  (Row 2) $\cdot x = 0$
3.  ...

**深刻含义**：
解向量 $x$ 必须**垂直于 $A$ 的每一行**。
如果 $x$ 垂直于每一行，它自然也垂直于这些行的线性组合（即行空间）。

::: tip 结论
**零空间 $N(A)$ 中的每一个向量，都垂直于行空间 $C(A^T)$ 中的每一个向量。**
:::

### 3.2 维度互补
不仅正交，它们还将整个 $\mathbb{R}^n$ 瓜分干净了。

* 行空间维数 = $r$
* 零空间维数 = $n - r$
* 总维数 = $n$

它们互为 **正交补 (Orthogonal Complements)**，记作 $S^\perp$。
$$N(A) = (C(A^T))^\perp$$

---

## 4. 全局图景：四个子空间
点击下方的卡片，查看 $\mathbb{R}^n$ 和 $\mathbb{R}^m$ 中的正交关系。

<SubspaceInteraction />

### 📝 总结
| 空间 | 所在世界 | 维数 | 正交补 |
| :--- | :---: | :---: | :--- |
| **行空间** $C(A^T)$ | $\mathbb{R}^n$ | $r$ | 零空间 $N(A)$ |
| **零空间** $N(A)$ | $\mathbb{R}^n$ | $n-r$ | 行空间 $C(A^T)$ |
| **列空间** $C(A)$ | $\mathbb{R}^m$ | $r$ | 左零空间 $N(A^T)$ |
| **左零空间** $N(A^T)$ | $\mathbb{R}^m$ | $m-r$ | 列空间 $C(A)$ |

---

## 5. 什么时候方程组无解？
::: danger 当 Ax=b 无解时
这意味着 $b$ 不在列空间 $C(A)$ 中。
:::

如果 $b$ 不在列空间里，肯定有一部分“分量”跑到了列空间的正交补空间里。
也就是跑到了 **左零空间 $N(A^T)$** 里。

这就是下一讲的核心：**投影 (Projection)** 与 **最小二乘法 (Least Squares)** 的基础。

> "Solving the unsolvable."

::: details 🧠 思考题：如果 $A$ 的行空间和零空间正交，那么它们的交集是什么？
答案：只有零向量 $\{0\}$。
因为如果一个非零向量 $v$ 既在行空间，又在零空间，那么它必须垂直于它自己。
$$v \cdot v = 0 \Rightarrow ||v||^2 = 0 \Rightarrow v = 0$$
:::