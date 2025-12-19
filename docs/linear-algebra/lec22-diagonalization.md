---
title: MIT 18.06 第22讲：对角化与 A 的幂
date: 2025-12-19
description: 用特征值/特征向量把矩阵变成更好算的形式，并用它解决差分方程（含斐波那契）。
outline: deep
---



# 第22讲：对角化与 A 的幂（Diagonalization & Powers of A）

:::tip 本讲目标（读完你应当能做到）
- 判断一个矩阵何时**可对角化**，并能写出 $A=S\Lambda S^{-1}$。
- 通过 $A^k = S\Lambda^k S^{-1}$ 快速计算矩阵幂。
- 用特征值解释迭代系统 $u_{k+1}=Au_k$ 的**长期行为**（增长/衰减/振荡）。
- 把二阶递推（斐波那契）转化为一阶矩阵迭代并给出增长率解释。
:::

---

## 0. 一张“路线图”

你可以把本讲浓缩成一句话：

> **若 $A$ 有足够多的线性无关特征向量，则把坐标系换到特征向量基底上，$A$ 就变成对角矩阵 $\Lambda$，从而 $A^k$ 变得几乎“逐元素”可算。**

核心等式是：

$$
A = S\Lambda S^{-1}
\quad\Longrightarrow\quad
A^k = S\Lambda^k S^{-1}.
$$

---

## 1. 复盘：特征值与特征向量在表达什么？

特征对 $(\lambda, x)$ 满足

$$
Ax=\lambda x.
$$

直觉层面：

- **$x$** 是“模式/方向”：在 $A$ 作用下方向不变（只缩放或翻转）。
- **$\lambda$** 是“倍率”：该模式每作用一次乘以 $\lambda$。

如果你把任意初始状态分解到这些模式上，每个模式会**独立**演化，这就是对角化能解决很多“迭代/递推”问题的根本原因。

---

## 2. 对角化：把 $A$ 变成 $\Lambda$

### 2.1 从 $AS=S\Lambda$ 到 $A=S\Lambda S^{-1}$

设 $A$ 有 $n$ 个线性无关特征向量 $x_1,\dots,x_n$，对应特征值 $\lambda_1,\dots,\lambda_n$。令

$$
S=\begin{bmatrix}x_1&x_2&\cdots&x_n\end{bmatrix},\qquad
\Lambda=\mathrm{diag}(\lambda_1,\dots,\lambda_n).
$$

逐列看等式 $Ax_i=\lambda_i x_i$，把它们并在一起就是

$$
AS=S\Lambda.
$$

如果这些特征向量线性无关，则 $S$ 可逆，于是

$$
S^{-1}AS=\Lambda
\quad\Longleftrightarrow\quad
A=S\Lambda S^{-1}.
$$

:::info 直觉（非常关键）
- $S$ 是“换基矩阵”：把向量从标准基换到“特征向量基”。
- 在特征向量基底里，$A$ 的作用就是对每个坐标轴分别乘以 $\lambda_i$，因此是对角矩阵 $\Lambda$。
:::

### 2.2 什么时候可对角化？

**定义/判据（最实用版本）**：

> $A$ 可对角化 $\Longleftrightarrow$ $A$ 有 $n$ 个线性无关特征向量  
> $\Longleftrightarrow$ 能找到可逆的 $S$ 使 $S^{-1}AS$ 是对角矩阵。

常用充分条件：

- **特征值两两不同** $\Rightarrow$ 一定可对角化。

常见误区澄清：

- “特征值重复”并不等于“不可对角化”。关键是**独立特征向量数量**是否足够。
- 例如 $I$ 的特征值全是 $1$，但任何非零向量都是特征向量，因此可对角化。

---

## 3. 为什么对角化值钱：矩阵幂 $A^k$

从

$$
A=S\Lambda S^{-1}
$$

出发：

$$
A^k=(S\Lambda S^{-1})^k
= S\Lambda \underbrace{(S^{-1}S)}_{I}\Lambda \underbrace{(S^{-1}S)}_{I}\cdots \Lambda S^{-1}
= S\Lambda^k S^{-1}.
$$

而

$$
\Lambda^k=\mathrm{diag}(\lambda_1^k,\dots,\lambda_n^k).
$$

:::tip 立刻得到的推论
若 $Ax=\lambda x$，则
$$
A^k x = \lambda^k x.
$$
所以 $A$ 与 $A^k$ 共享同一组特征向量，特征值从 $\lambda$ 变为 $\lambda^k$。
:::

---

## 4. 迭代系统：$u_{k+1}=Au_k$ 的通解与长期行为

### 4.1 通解结构

从递推

$$
u_{k+1}=Au_k
$$

反复代入得

$$
u_k=A^k u_0.
$$

若 $A$ 可对角化，把初值分解到特征向量上：

$$
u_0 = c_1x_1+\cdots+c_nx_n,
$$

则

$$
u_k = A^k u_0 = \sum_{i=1}^n c_i \lambda_i^k x_i.
$$

这句话非常重要：**系统等价于若干个相互独立的模式，每个模式按 $\lambda_i^k$ 演化**。

### 4.2 “稳定/发散/振荡”如何一眼判断？

看 $|\lambda_i|$：

- 若对所有 $i$，$|\lambda_i|<1$，则 $\lambda_i^k\to 0$，因此
  $$
  A^k\to 0,\quad u_k\to 0.
  $$
- 若存在 $|\lambda_i|>1$，则对应模式指数增长，系统发散（沿该特征向量方向主导）。
- 若存在 $|\lambda_i|=1$，则该模式不衰减，可能保持或振荡（例如 $\lambda=-1$ 会产生符号交替）。

:::info 一句话总结（工程直觉）
长期行为由最大 $|\lambda|$ 的模式主导：增长最快或衰减最慢的模式“赢到最后”。
:::

---

## 5. Worked Example：2×2 矩阵的对角化与 $A^k$

设

$$
A=\begin{bmatrix}3&1\\0&1\end{bmatrix}.
$$

### 5.1 特征值

$$
\det(A-\lambda I)=\det\begin{bmatrix}3-\lambda&1\\0&1-\lambda\end{bmatrix}=(3-\lambda)(1-\lambda).
$$

因此 $\lambda_1=3,\ \lambda_2=1$（不同，必可对角化）。

### 5.2 特征向量

- 对 $\lambda_1=3$：解 $(A-3I)x=0$

$$
\begin{bmatrix}0&1\\0&-2\end{bmatrix}\begin{bmatrix}x\\y\end{bmatrix}=0 \Rightarrow y=0,
$$
取 $x_1=\begin{bmatrix}1\\0\end{bmatrix}$。

- 对 $\lambda_2=1$：解 $(A-I)x=0$

$$
\begin{bmatrix}2&1\\0&0\end{bmatrix}\begin{bmatrix}x\\y\end{bmatrix}=0 \Rightarrow 2x+y=0,
$$
取 $x_2=\begin{bmatrix}1\\-2\end{bmatrix}$。

于是

$$
S=\begin{bmatrix}1&1\\0&-2\end{bmatrix},\quad
\Lambda=\begin{bmatrix}3&0\\0&1\end{bmatrix}.
$$

$S$ 可逆，所以

$$
A^k=S\Lambda^k S^{-1}
= S\begin{bmatrix}3^k&0\\0&1\end{bmatrix}S^{-1}.
$$

你不必每次做 $k$ 次乘法，只需算 $3^k$ 和一次矩阵乘法即可。

---

## 6. 重复特征值：可对角化与“缺陷矩阵”

考虑

$$
A=\begin{bmatrix}2&1\\0&2\end{bmatrix}.
$$

特征值为 $\lambda=2$（重根）。对 $\lambda=2$：

$$
(A-2I)=\begin{bmatrix}0&1\\0&0\end{bmatrix},
\quad
\begin{bmatrix}0&1\\0&0\end{bmatrix}\begin{bmatrix}x\\y\end{bmatrix}=0
\Rightarrow y=0.
$$

因此特征向量只有形如 $\begin{bmatrix}x\\0\end{bmatrix}$ 的一条方向（独立特征向量只有 1 个），**不足以形成 2 维基底**，所以不可对角化。

:::warning 重要结论
重复特征值时，是否可对角化取决于“特征向量空间的维数”（几何重数）是否够大。
:::

（延伸）不可对角化时，仍可用 Jordan 形分析 $A^k$，但本讲主线是对角化，因此只点到为止。

---

## 7. 斐波那契：用矩阵与特征值解释增长率

斐波那契递推：

$$
F_{k+2}=F_{k+1}+F_k.
$$

把它变成一阶向量递推：令

$$
u_k=\begin{bmatrix}F_{k+1}\\F_k\end{bmatrix},\qquad
A=\begin{bmatrix}1&1\\1&0\end{bmatrix}.
$$

则

$$
u_{k+1}=Au_k,\quad\Rightarrow\quad u_k=A^k u_0.
$$

### 7.1 特征值（黄金比例出现）

$$
\det(A-\lambda I)=\det\begin{bmatrix}1-\lambda&1\\1&-\lambda\end{bmatrix}
=(1-\lambda)(-\lambda)-1=\lambda^2-\lambda-1.
$$

解得

$$
\lambda_{1,2}=\frac{1\pm\sqrt5}{2}.
$$

其中

$$
\lambda_1=\varphi=\frac{1+\sqrt5}{2}\approx 1.618,\qquad
\lambda_2=\psi=\frac{1-\sqrt5}{2}\approx -0.618.
$$

因为 $|\psi|<1$，所以 $\psi^k$ 很快衰减，而 $\varphi^k$ 主导增长，这解释了：

- $F_k$ 以大约 $\varphi^k$ 的速度增长；
- 比值 $F_{k+1}/F_k$ 收敛到 $\varphi$。

（可选）Binet 公式是

$$
F_k=\frac{\varphi^k-\psi^k}{\sqrt5}.
$$

---

## 8. 课堂常见“检查点”（自测）

:::details 自测 1：为什么 $A^k = S\Lambda^k S^{-1}$ 不需要展开到 $k$ 次乘法？
因为
$$
(S\Lambda S^{-1})^k
= S\Lambda(S^{-1}S)\Lambda\cdots\Lambda S^{-1}
= S\Lambda^k S^{-1},
$$
中间不断出现 $S^{-1}S=I$ 的消去。
:::

:::details 自测 2：判断 $A^k\to 0$ 的标准是什么？
在可对角化前提下，若且唯若所有特征值满足 $|\lambda_i|<1$，则
$$
A^k\to 0.
$$
若存在 $|\lambda|>1$，系统沿对应特征向量方向发散；若存在 $|\lambda|=1$，会有不衰减模式。
:::

:::details 自测 3：特征值重复时，为什么有时仍可对角化？
因为可对角化的关键是“特征向量是否能凑成一组基底”。例如 $A=2I$ 的所有非零向量都是特征向量，当然可对角化；但
$\begin{bmatrix}2&1\\0&2\end{bmatrix}$ 只有 1 个独立特征向量，因此不可对角化。
:::

---

## 9. 小练习（带答案）

### 练习 1：快速判断长期行为
给定
$$
A=\begin{bmatrix}0.5&0\\0&0.8\end{bmatrix},
$$
问：$A^k$ 是否趋于 0？$u_{k+1}=Au_k$ 是否稳定？

:::details 答案
这是对角矩阵，特征值就是对角线元素 $0.5,0.8$，都满足 $|\lambda|<1$，所以 $A^k\to 0$，迭代系统稳定并收敛到 0。
:::

### 练习 2：不可对角化识别
$$
A=\begin{bmatrix}1&1\\0&1\end{bmatrix}
$$
是否可对角化？为什么？

:::details 答案
特征值为 $1$（重根）。解 $(A-I)x=0$ 得
$\begin{bmatrix}0&1\\0&0\end{bmatrix}\begin{bmatrix}x\\y\end{bmatrix}=0\Rightarrow y=0$，只有 1 条独立特征向量方向，因此不可对角化。
:::

---

## 10. 本讲总结（可直接背诵）

- 若 $A$ 有 $n$ 个线性无关特征向量，则
  $$
  A=S\Lambda S^{-1},\quad A^k=S\Lambda^k S^{-1}.
  $$
- 迭代系统 $u_{k+1}=Au_k$ 的通解在特征向量分解下是
  $$
  u_k=\sum_i c_i\lambda_i^k x_i,
  $$
  长期行为由最大 $|\lambda|$ 主导。
- 斐波那契可写成矩阵迭代，黄金比例来自该矩阵的最大特征值。
