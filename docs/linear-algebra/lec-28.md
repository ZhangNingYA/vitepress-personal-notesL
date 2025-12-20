---
title: 第28讲：相似矩阵与 Jordan 形式
date: 2025-12-22
---

# MIT 18.06 线性代数 第28讲：相似矩阵与 Jordan 形式

> **Lecture 28: Similar matrices and Jordan form**
>
> **主线逻辑**：
> 1. **“同一个线性变换”的两种表示**：换基只会改变矩阵的外观，不会改变线性变换的本质。
> 2. **相似变换是换基公式**：若 $B=S^{-1}AS$，则 $A,B$ 表示同一线性变换在不同基下的矩阵。
> 3. **相似不变量**：特征值、行列式、迹、特征多项式等保持不变。
> 4. **最理想的相似代表**：能对角化则相似于对角矩阵；不能对角化则相似于 Jordan 标准形（用 Jordan 块刻画“缺少的特征向量”）。

---

## 0. 本讲解决了哪些问题（结论先行）

1. **什么叫相似（Similarity）？**
   两个 $n\times n$ 矩阵 $A,B$ 若存在可逆矩阵 $S$ 使
   $$
   B = S^{-1} A S,
   $$
   则称 $A$ 与 $B$ **相似**，记作 $A \sim B$。

2. **相似的意义是什么？**
   相似不是“把矩阵改成另一个矩阵”这么简单，它本质是**换基**：同一个线性变换 $T$，在基 $E$ 下的矩阵是 $A$，在基 $F$ 下的矩阵是 $B$。因此相似矩阵描述的是同一件事的不同坐标表达。

3. **哪些量在相似下不变（相似不变量）？**
   - 特征值（以及特征多项式）不变
   - 行列式 $\det(\cdot)$ 不变
   - 迹 $\mathrm{tr}(\cdot)$ 不变
   - 秩、零空间维数、最小多项式等也保持一致（更深入的结构不变量）

4. **Jordan 形式想解决什么？**
   当矩阵缺少足够的特征向量、无法对角化时，Jordan 形式用一组 Jordan 块把“缺失的信息”显式编码出来，使得计算 $A^k$、$e^{At}$ 等仍然可控。

---

## 1. 相似矩阵的定义与“换基”推导（本讲第一核心）

### 1.1 线性变换与矩阵：为什么会有多个矩阵表示？
设 $T:\mathbb R^n\to\mathbb R^n$ 是线性变换。
- 选择一组基 $E=(e_1,\dots,e_n)$，就能用矩阵 $A=[T]_E$ 表示 $T$。
- 选择另一组基 $F=(f_1,\dots,f_n)$，就能用矩阵 $B=[T]_F$ 表示同一个 $T$。

关键：**变换 $T$ 没变，变的是坐标系（基）。**

### 1.2 换基矩阵 $S$ 与相似公式从何而来？
令 $S$ 表示从 $F$ 坐标到 $E$ 坐标的换基矩阵：对任意向量 $x$，
- $[x]_F$ 是 $x$ 在基 $F$ 下的坐标列向量
- $[x]_E$ 是 $x$ 在基 $E$ 下的坐标列向量
- 两者满足
  $$
  [x]_E = S [x]_F.
  $$

现在看 $T(x)$：
- 在 $E$ 基下：$[T(x)]_E = A[x]_E$
- 在 $F$ 基下：$[T(x)]_F = B[x]_F$

把它们连起来：
$$
[T(x)]_E = S [T(x)]_F = S B [x]_F,
$$
但同时
$$
[T(x)]_E = A [x]_E = A S [x]_F.
$$
对任意 $[x]_F$ 都成立，故
$$
A S = S B
\quad\Rightarrow\quad
B = S^{-1} A S.
$$

> **结论**：相似变换公式不是“技巧”，而是严格的换基推导结果。

---

## 2. 相似不变量：哪些东西“换基也不会变”（本讲第二核心）

相似的直觉：**换坐标不应改变变换本质**。因此某些量必须不变。

### 2.1 行列式在相似下不变
$$
\det(B)
= \det(S^{-1}AS)
= \det(S^{-1})\det(A)\det(S)
= \det(A).
$$

### 2.2 迹在相似下不变（利用循环性质）
迹的循环性质：对同型矩阵 $X,Y$，
$$
\mathrm{tr}(XY)=\mathrm{tr}(YX).
$$
于是
$$
\mathrm{tr}(B)
= \mathrm{tr}(S^{-1}AS)
= \mathrm{tr}(AS S^{-1})
= \mathrm{tr}(A).
$$

### 2.3 特征多项式与特征值在相似下不变（最重要）
特征多项式：
$$
p_A(\lambda)=\det(A-\lambda I).
$$
对 $B=S^{-1}AS$：
$$
\det(B-\lambda I)
= \det(S^{-1}AS-\lambda I)
= \det\!\big(S^{-1}(A-\lambda I)S\big)
= \det(A-\lambda I).
$$
因此
$$
p_B(\lambda)=p_A(\lambda),
$$
所以 $A,B$ 的全部特征值（含代数重数）完全一致。

> **一句话**：相似矩阵“特征值相同”，这是对角化、Jordan 形式、以及后续 SVD/变换理论的基础入口。

---

## 3. 对角化是相似的“最佳情况”

### 3.1 如果有足够多的特征向量，就能对角化
若 $A$ 有 $n$ 个线性无关的特征向量 $v_1,\dots,v_n$，组成矩阵
$$
S=\begin{bmatrix}
| & & | \\
v_1 & \cdots & v_n \\
| & & |
\end{bmatrix},
\quad
\Lambda=\mathrm{diag}(\lambda_1,\dots,\lambda_n),
$$
那么
$$
A S = S \Lambda
\quad\Rightarrow\quad
S^{-1} A S = \Lambda.
$$

这就是对角化：
$$
A = S \Lambda S^{-1}.
$$

### 3.2 为什么对角化这么“值钱”？
因为任何函数/幂次都变简单：
- 幂次：
  $$
  A^k = S \Lambda^k S^{-1},
  \quad
  \Lambda^k=\mathrm{diag}(\lambda_1^k,\dots,\lambda_n^k).
  $$
- 指数（对应微分方程）：
  $$
  e^{At}=S e^{\Lambda t} S^{-1},
  \quad
  e^{\Lambda t}=\mathrm{diag}(e^{\lambda_1 t},\dots,e^{\lambda_n t}).
  $$

---

## 4. 对角化失败时发生了什么：Jordan 块登场

### 4.1 失败的根源：特征值重复但特征向量不够
当某特征值 $\lambda$ 的**代数重数**（在特征多项式中的重数）大于它的**几何重数**（特征子空间维数）时，特征向量不足，$A$ 无法对角化。

用线代语言：
$$
\dim\mathcal N(A-\lambda I) \;<\; \text{mult}(\lambda).
$$

### 4.2 Jordan 块的定义（最小但完备的“修补”）
一个大小为 $m$、特征值为 $\lambda$ 的 Jordan 块定义为
$$
J_m(\lambda)=
\begin{bmatrix}
\lambda & 1 & 0 & \cdots & 0 \\
0 & \lambda & 1 & \cdots & 0 \\
\vdots & & \ddots & \ddots & \vdots \\
0 & \cdots & 0 & \lambda & 1 \\
0 & \cdots & \cdots & 0 & \lambda
\end{bmatrix}.
$$

Jordan 标准形就是若干 Jordan 块的分块对角矩阵：
$$
J=\mathrm{diag}\big(J_{m_1}(\lambda_1),\dots,J_{m_r}(\lambda_r)\big),
$$
并且存在可逆 $S$ 使
$$
A = S J S^{-1}.
$$

> 直觉：对角矩阵只记录“特征值”；Jordan 块额外用上超对角线的 1 记录“缺少的特征向量导致的耦合”。

---

## 5. 关键例子：2×2 情况把一切讲透

### 5.1 例 1：特征值不同 ⇒ 必可对角化
设
$$
A=
\begin{bmatrix}
4 & 1 \\
0 & 2
\end{bmatrix}.
$$
特征值显然是 $4,2$（不同），因此一定有两个线性无关特征向量，$A$ 可对角化：
$$
A = S \Lambda S^{-1}.
$$

> 结论（二维常识）：$2\times 2$ 矩阵只要特征值不同，就自动对角化。

### 5.2 例 2：特征值重复，但仍可能对角化（“好重复”）
若
$$
A=
\begin{bmatrix}
1 & 0 \\
0 & 1
\end{bmatrix}
= I,
$$
则特征值 $1$ 的代数重数为 2，同时任意非零向量都是特征向量，几何重数也为 2，因此依然可对角化（实际上已经是对角的）。

### 5.3 例 3：特征值重复且缺少特征向量 ⇒ Jordan 块（“坏重复”）
经典例子：
$$
A=
\begin{bmatrix}
1 & 1 \\
0 & 1
\end{bmatrix}.
$$
它的特征多项式：
$$
p_A(\lambda)=\det(A-\lambda I)
=\det
\begin{bmatrix}
1-\lambda & 1 \\
0 & 1-\lambda
\end{bmatrix}
=(1-\lambda)^2,
$$
故唯一特征值 $\lambda=1$，代数重数为 2。

看特征向量：
$$
(A-I)x=0
\quad\Rightarrow\quad
\begin{bmatrix}
0 & 1 \\
0 & 0
\end{bmatrix}
\begin{bmatrix}
x \\
y
\end{bmatrix}
=
\begin{bmatrix}
y \\
0
\end{bmatrix}
=0
\quad\Rightarrow\quad
y=0.
$$
所以特征子空间是一条直线：
$$
\mathcal N(A-I)=\mathrm{span}\left\{
\begin{bmatrix}
1 \\
0
\end{bmatrix}
\right\},
$$
几何重数为 1，少于代数重数 2，因此 **不可对角化**。

此时 Jordan 形为（它本身就是 Jordan 块）：
$$
J=
\begin{bmatrix}
1 & 1 \\
0 & 1
\end{bmatrix}.
$$

---

## 6. 为什么 Jordan 形式仍然“好算”：幂次与指数的推导要点

Jordan 块可写成
$$
J=\lambda I + N,
$$
其中
$$
N=
\begin{bmatrix}
0 & 1 & 0 & \cdots & 0 \\
0 & 0 & 1 & \cdots & 0 \\
\vdots & & \ddots & \ddots & \vdots \\
0 & \cdots & 0 & 0 & 1 \\
0 & \cdots & \cdots & 0 & 0
\end{bmatrix},
$$
并且 $N$ 是幂零矩阵：$N^m=0$（大小为 $m$ 的 Jordan 块）。

### 6.1 幂次：二项式展开（因为 $N$ 会“截断”）
$$
J^k=(\lambda I+N)^k
=\sum_{j=0}^{k}\binom{k}{j}\lambda^{k-j}N^j.
$$
但当 $j\ge m$ 时 $N^j=0$，所以实际只到 $m-1$：
$$
J^k=\sum_{j=0}^{m-1}\binom{k}{j}\lambda^{k-j}N^j.
$$

> 这解释了一个重要现象：Jordan 块会带来 $k$ 的多项式因子（来自组合数），而不仅仅是 $\lambda^k$。

### 6.2 指数：$e^{Jt}$ 会出现 $t$ 的多项式因子
同理，
$$
e^{Jt}=e^{(\lambda I+N)t}=e^{\lambda t}e^{Nt}.
$$
又因为 $N^m=0$，指数级数截断：
$$
e^{Nt}=I+Nt+\frac{(Nt)^2}{2!}+\cdots+\frac{(Nt)^{m-1}}{(m-1)!}.
$$
因此
$$
e^{Jt}=e^{\lambda t}\left(I+Nt+\frac{(Nt)^2}{2!}+\cdots+\frac{(Nt)^{m-1}}{(m-1)!}\right).
$$

> 应用直觉：对角化对应“纯指数解”；Jordan 块对应“指数乘多项式”的解结构，这是常微分方程里重根情形的线性代数版本。

---

## 7. 与上一讲的衔接：正定矩阵的“相似 vs 合同”提醒

上一讲的正定性通常在对称矩阵中讨论，并且常用分解 $A=LDL^T$ 或 Cholesky $A=LL^T$。

在本讲框架下要注意两点：

1. **相似变换不保持对称性/正定性**
   一般的 $S^{-1}AS$ 并不保证对称，也不保证 $A \succ 0 \Rightarrow S^{-1}AS \succ 0$。

2. **保持二次型的变换叫“合同变换（congruence）”**
   如果关心的是二次型 $x^TAx$，自然出现的是
   $$
   A \mapsto S^T A S,
   $$
   这是另一类变换（在优化与几何里更常见），它与相似是不同概念。

> 这条提醒的意义：相似适合研究“线性变换的本质结构”（特征值等），合同适合研究“二次型/能量/正定性”。

---

## 8. 一句话复盘

相似矩阵就是换基后的同一线性变换：$B=S^{-1}AS$。换基不改变本质，所以特征值、迹、行列式等不变。最好情况是对角化 $A=S\Lambda S^{-1}$；当特征向量不足时，Jordan 形式用 Jordan 块记录“缺失的特征向量”，仍能高效计算 $A^k$ 与 $e^{At}$。

---

## 9. 自检题（建议先做再看参考思路）

1. 证明：若 $A\sim B$，则 $\det(A)=\det(B)$ 且 $\mathrm{tr}(A)=\mathrm{tr}(B)$。
2. 证明：若 $A\sim B$，则 $A,B$ 有相同特征多项式。
3. 给出一个 $2\times 2$ 的不可对角化矩阵例子，并说明其代数重数与几何重数。
4. 设 $J=\lambda I+N$ 为大小 $m$ 的 Jordan 块，证明 $N^m=0$ 且推导
   $$
   J^k=\sum_{j=0}^{m-1}\binom{k}{j}\lambda^{k-j}N^j.
   $$
5. 思考：为什么研究二次型 $x^TAx$ 时更自然的是 $S^TAS$ 而不是 $S^{-1}AS$？

<!-- END OF FILE -->
