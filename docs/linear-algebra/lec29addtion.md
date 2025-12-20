---
title: 第29讲：SVD——线性代数的“巅峰” (Gilbert Strang 视角)
date: 2025-12-23
---

# MIT 18.06 线性代数 第29讲：奇异值分解 (SVD)

> **Lecture 29: Singular Value Decomposition**
>
> **Strang 教授的开场白**：
> "Ok, this is it. This is the highlight of the course. We have reached the main theorem of linear algebra."
>
> **授课核心逻辑**：
> 1.  **直觉先行**：线性变换将“圆”变成“椭圆”，SVD 就是在描述这个椭圆。
> 2.  **化繁为简**：$A$ 可能是长方形的、不可逆的、特征值很丑的，但 $A^TA$ 永远是完美的（对称正定）。
> 3.  **构造证明**：我们不直接寻找 $U$ 和 $V$，而是通过 $A^TA$ 把它们“逼”出来。
> 4.  **最终图景**：SVD 为四个基本子空间提供了“最佳基”。

---

## 1. 几何直觉：矩阵到底对向量做了什么？

Strang 教授不从公式开始，而是从几何开始。

### 1.1 圆与椭圆
想象在 $\mathbb{R}^n$ 空间中有一个单位球（或圆）。当我们用矩阵 $A$ 乘以这个球中的所有向量 $x$ 时，结果 $Ax$ 会变成什么形状？
* **结论**：它变成了一个 $\mathbb{R}^m$ 空间中的**椭球（Hyper-ellipse）**。

### 1.2 寻找“主轴”
SVD 的本质就是寻找这个椭球的轴：
1.  **方向**：椭球的长轴和短轴方向，就是左奇异向量 $u_i$。
2.  **长度**：轴的半长，就是奇异值 $\sigma_i$。
3.  **来源**：这些轴来自原空间中的一组正交向量 $v_i$。

### 1.3 核心方程 (The Key Equation)
如果我们能在输入空间找到一组正交基 $v_1, \dots, v_n$，使得它们经过 $A$ 变换后，在输出空间依然保持正交（方向为 $u_1, \dots, u_m$），只是长度变成了 $\sigma_i$。

用数学语言描述就是：
$$
A v_i = \sigma_i u_i
$$

把它们写成矩阵形式（假设 $A$ 是 $m \times n$）：
$$
A \begin{bmatrix} | & & | \\ v_1 & \cdots & v_n \\ | & & | \end{bmatrix} = \begin{bmatrix} | & & | \\ u_1 & \cdots & u_m \\ | & & | \end{bmatrix} \begin{bmatrix} \sigma_1 & & \\ & \ddots & \\ & & \sigma_n \end{bmatrix}
$$
即：
$$
AV = U\Sigma
$$
因为 $V$ 是正交矩阵，所以 $V^{-1}=V^T$，于是我们得到了 **SVD**：
$$
A = U \Sigma V^T
$$

---

## 2. 构造推导：如何处理“坏”矩阵？

Strang 教授：“$A$ 可能不是方阵，可能是奇异的，甚至特征值是复数。我们怎么找到 $U$ 和 $V$？我们求助于我们要的好朋友——**对称矩阵**。”

### 2.1 技巧：乘以转置 (The $A^TA$ Trick)
既然 $A$ 不好处理，我们就看 $A^TA$。把 $A = U\Sigma V^T$ 代入：

$$
A^TA = (U\Sigma V^T)^T (U\Sigma V^T) = V \Sigma^T U^T U \Sigma V^T
$$

注意中间的 $U^T U$。因为 $U$ 是正交矩阵，所以 $U^T U = I$。公式简化为：
$$
A^TA = V (\Sigma^T \Sigma) V^T
$$
即：
$$
A^TA = V \begin{bmatrix} \sigma_1^2 & & \\ & \ddots & \\ & & \end{bmatrix} V^T
$$

### 2.2 惊人的发现
这正是 $A^TA$ 的**特征值分解**（Spectral Theorem）！
1.  $V$ 的列向量 $\to$ 是 $A^TA$ 的**特征向量**。
2.  $\sigma_i^2$ $\to$ 是 $A^TA$ 的**特征值**。

> **Strang 的点评**：“看，即使 $A$ 很糟糕，$A^TA$ 也是对称半正定的。它的特征值非负，所以我们可以开根号得到 $\sigma_i$。一切都非常完美。”

同理，计算 $AA^T$ 可以得到 $U$：
$$
AA^T = U (\Sigma \Sigma^T) U^T
$$

---

## 3. 经典例题：Strang 最喜欢的 $2 \times 2$ 矩阵

让我们用一个非对称、特征值很丑的矩阵，来看看 SVD 如何让它变得“漂亮”。

**矩阵 $A$**：
$$
A = \begin{bmatrix} 4 & 4 \\ -3 & 3 \end{bmatrix}
$$

### 步骤 1：构造 $A^TA$
$$
A^TA = \begin{bmatrix} 4 & -3 \\ 4 & 3 \end{bmatrix} \begin{bmatrix} 4 & 4 \\ -3 & 3 \end{bmatrix} = \begin{bmatrix} 25 & 7 \\ 7 & 25 \end{bmatrix}
$$
这是一个对称矩阵。

### 步骤 2：求特征值和奇异值
求解 $\det(A^TA - \lambda I) = 0$：
$$
\lambda_1 = 32, \quad \lambda_2 = 18
$$
所以，**奇异值**是：
$$
\sigma_1 = \sqrt{32} = 4\sqrt{2}, \quad \sigma_2 = \sqrt{18} = 3\sqrt{2}
$$

### 步骤 3：求 $V$ (右奇异向量)
对应 $\lambda=32$ 的特征向量是 $\begin{bmatrix} 1 \\ 1 \end{bmatrix}$，归一化：
$$
v_1 = \begin{bmatrix} \frac{1}{\sqrt{2}} \\ \frac{1}{\sqrt{2}} \end{bmatrix}
$$
对应 $\lambda=18$ 的特征向量是 $\begin{bmatrix} 1 \\ -1 \end{bmatrix}$，归一化：
$$
v_2 = \begin{bmatrix} \frac{1}{\sqrt{2}} \\ -\frac{1}{\sqrt{2}} \end{bmatrix}
$$
所以：
$$
V = \begin{bmatrix} \frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \\ \frac{1}{\sqrt{2}} & -\frac{1}{\sqrt{2}} \end{bmatrix}
$$

### 步骤 4：求 $U$ (左奇异向量)
**Strang 的建议**：不要去解 $AA^T$ 的特征向量（虽然也可以），直接用公式 $Av_i = \sigma_i u_i$ 更快！
$$
u_1 = \frac{Av_1}{\sigma_1} = \frac{1}{4\sqrt{2}} \begin{bmatrix} 4 & 4 \\ -3 & 3 \end{bmatrix} \begin{bmatrix} \frac{1}{\sqrt{2}} \\ \frac{1}{\sqrt{2}} \end{bmatrix} = \frac{1}{8} \begin{bmatrix} 8 \\ 0 \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}
$$
$$
u_2 = \frac{Av_2}{\sigma_2} = \frac{1}{3\sqrt{2}} \begin{bmatrix} 4 & 4 \\ -3 & 3 \end{bmatrix} \begin{bmatrix} \frac{1}{\sqrt{2}} \\ -\frac{1}{\sqrt{2}} \end{bmatrix} = \frac{1}{6} \begin{bmatrix} 0 \\ -6 \end{bmatrix} = \begin{bmatrix} 0 \\ -1 \end{bmatrix}
$$
所以 $A$ 被分解为：旋转 ($V^T$) $\to$ 伸缩 ($\Sigma$) $\to$ 旋转 ($U$)。

---

## 4. 终极图景：四大子空间的基



这是本课程反复强调的图景。SVD 给了我们**正交基**来完美描述它们。
假设 $A$ 的秩为 $r$。

1.  **行空间** $\mathcal{C}(A^T)$：
    由 $V$ 的前 $r$ 个列 $v_1, \dots, v_r$ 张成。
2.  **零空间** $\mathcal{N}(A)$：
    由 $V$ 的后 $n-r$ 个列 $v_{r+1}, \dots, v_n$ 张成。
    *注意：$Av_{r+1} = 0$，因为对应的 $\sigma_{r+1}=0$。*
3.  **列空间** $\mathcal{C}(A)$：
    由 $U$ 的前 $r$ 个列 $u_1, \dots, u_r$ 张成。
4.  **左零空间** $\mathcal{N}(A^T)$：
    由 $U$ 的后 $m-r$ 个列 $u_{r+1}, \dots, u_m$ 张成。

> **Strang 的总结**：
> "Orthonormal bases for everyone. That is what SVD gives you."

---

## 5. 应用：秩一分解 (Rank-1 Decomposition)

SVD 允许我们将矩阵 $A$ 写成秩为 1 的矩阵之和：
$$
A = \sigma_1 u_1 v_1^T + \sigma_2 u_2 v_2^T + \cdots + \sigma_r u_r v_r^T
$$

**为什么这很重要？**
如果 $\sigma_1$ 很大，而 $\sigma_{100}$ 很小，我们可以扔掉后面的项。
$$
A \approx \sigma_1 u_1 v_1^T + \dots + \sigma_k u_k v_k^T
$$
这就是**图像压缩**、**降维 (PCA)** 和**去噪**的数学原理。我们只保留矩阵中“最重要的部分”。

---

## 6. 自测思考题

1.  对于对称矩阵 $A=A^T$，SVD 和特征值分解有什么区别？（提示：看 $\sigma_i$ 和 $\lambda_i$ 的符号关系）
2.  如果 $A$ 所有的奇异值 $\sigma_i$ 都不一样，那么 $v_i$ 是唯一的吗？（提示：想想特征向量的方向）
3.  为什么 $A$ 不可逆时，必定有至少一个 $\sigma = 0$？