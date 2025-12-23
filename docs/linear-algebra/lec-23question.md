---
title: 第23讲：原23讲答疑补充
date: 2025-12-20
---


## 1. 迭代系统为什么写成特征展开

给定离散迭代系统：
$$
u_{k+1}=Au_k,\quad u_0\ \text{已知}.
$$

若矩阵 $A$ 有一组特征对 $(\lambda_i,x_i)$，满足
$$
Ax_i=\lambda_i x_i,
$$
并且初始向量可以在特征向量张成的空间中展开为
$$
u_0=\sum_{i=1}^n c_i x_i,
$$
那么迭代 $k$ 次后：
$$
u_k=A^k u_0
=\sum_{i=1}^n c_i A^k x_i
=\sum_{i=1}^n c_i \lambda_i^{k} x_i.
$$

**核心原因**：在特征向量方向上，迭代“可解”为纯粹的标量放大/缩小：
$$
A^k x_i=\lambda_i^k x_i.
$$

---

## 2. 为什么“最大模特征值”主导迭代（幂法/长期行为）

若按模排序：
$$
|\lambda_1|>|\lambda_2|\ge\cdots\ge|\lambda_n|,
$$
则可将 $u_k$ 提取出主导因子：
$$
u_k=\lambda_1^k\left(
c_1 x_1
+\left(\frac{\lambda_2}{\lambda_1}\right)^k c_2 x_2
+\left(\frac{\lambda_3}{\lambda_1}\right)^k c_3 x_3
+\cdots
\right).
$$

若 $c_1\neq 0$，且 $|\lambda_2/\lambda_1|<1$，则随着 $k$ 增大：
$$
\left(\frac{\lambda_i}{\lambda_1}\right)^k\to 0\quad (i\ge 2),
$$
因此方向趋于 $x_1$（主特征向量），收敛速度由 $|\lambda_2/\lambda_1|$ 控制。

---

## 3. 斐波那契如何变成矩阵迭代系统

斐波那契递推：
$$
F_{k+1}=F_k+F_{k-1},\quad F_1=1,\ F_2=1.
$$

定义状态向量：
$$
u_k=\begin{bmatrix}F_{k+1}\\ F_k\end{bmatrix},
\quad
A=\begin{bmatrix}1&1\\ 1&0\end{bmatrix}.
$$

则：
$$
u_{k+1}=Au_k,
\quad
u_1=\begin{bmatrix}F_2\\ F_1\end{bmatrix}=\begin{bmatrix}1\\1\end{bmatrix}.
$$

并且：
$$
u_k=A^{k-1}u_1.
$$

---

## 4. 对斐波那契迭代矩阵做特征分解

特征方程：
$$
\det(A-\lambda I)=
\begin{vmatrix}1-\lambda&1\\1&-\lambda\end{vmatrix}
=\lambda^2-\lambda-1=0.
$$

两特征值：
$$
\lambda_1=\varphi=\frac{1+\sqrt5}{2},\qquad
\lambda_2=\psi=\frac{1-\sqrt5}{2}.
$$

可取对应特征向量：
$$
x_1=\begin{bmatrix}\varphi\\1\end{bmatrix},\qquad
x_2=\begin{bmatrix}\psi\\1\end{bmatrix}.
$$

---

## 5. “怎么得出来”：把初值向量用特征向量分解

设：
$$
u_1=c_1 x_1+c_2 x_2
=c_1\begin{bmatrix}\varphi\\1\end{bmatrix}
+c_2\begin{bmatrix}\psi\\1\end{bmatrix}
=
\begin{bmatrix}c_1\varphi+c_2\psi\\ c_1+c_2\end{bmatrix}
=
\begin{bmatrix}1\\1\end{bmatrix}.
$$

得到方程组：
$$
\begin{cases}
c_1\varphi+c_2\psi=1,\\
c_1+c_2=1.
\end{cases}
$$

解得（常见化简结果）：
$$
c_1=\frac{\varphi}{\sqrt5},\qquad
c_2=-\frac{\psi}{\sqrt5}.
$$

---

## 6. 特征展开得到闭式（Binet 公式）

由特征展开：
$$
u_k=c_1\varphi^{k-1}x_1+c_2\psi^{k-1}x_2.
$$

由于：
$$
u_k=\begin{bmatrix}F_{k+1}\\F_k\end{bmatrix},
$$
取第二个分量即得到：
$$
F_k=c_1\varphi^{k-1}+c_2\psi^{k-1}
=\frac{\varphi^k-\psi^k}{\sqrt5}.
$$

因此：
$$
F_{100}=\frac{\varphi^{100}-\psi^{100}}{\sqrt5}.
$$

**精确值**（按 $F_1=1,F_2=1$）：
$$
F_{100}=354224848179261915075.
$$

---

## 7. “$\lambda x$ 是向量，为什么会得到具体数值？”（关键解释）

- $x$ 是向量，$\lambda x$ 当然仍是向量；特征展开给出的 $u_k$ 始终是向量：
$$
u_k=\sum_i c_i\lambda_i^k x_i.
$$

- 斐波那契的“具体数值”来自于：我们关心的是向量的某个**分量**（线性投影），例如
$$
F_k=e_2^\top u_k,\quad e_2=\begin{bmatrix}0\\1\end{bmatrix}.
$$

- 将展开代入：
$$
F_k=e_2^\top\left(\sum_i c_i\lambda_i^{k-1}x_i\right)
=\sum_i c_i\lambda_i^{k-1}(e_2^\top x_i),
$$
其中 $e_2^\top x_i$ 是标量，因此最终得到标量 $F_k$。

- 为什么最终还是整数：因为本质上
$$
u_k=A^{k-1}u_1
$$
是“整数矩阵乘整数向量”，结果必为整数向量；特征分解只是换一种表达方式，无理数会在组合中精确抵消。
