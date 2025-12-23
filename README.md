# my-notes (VitePress)

蹭GitHub免费的page节点 来个投影公式


##  投影矩阵 $P$ (The Projection Matrix)

我们知道 $p = a \hat{x}$。如果我们把上面的 $\hat{x}$ 代入：

$$p = a \frac{a^T b}{a^T a} = \frac{a a^T}{a^T a} b$$

我们可以把系数提取出来，变成矩阵形式：
$$p = P b$$

其中 $P$ 就是 **投影矩阵**：

::: tip 🌟 关键公式 2
$$P = \frac{a a^T}{a^T a}$$
:::

### 矩阵 $P$ 的性质
这个矩阵 $P$ 有两个非常有趣的性质，这是投影矩阵的身份证：

1.  **对称性 (Symmetric)**: $P^T = P$
2.  **幂等性 (Idempotent)**: $P^2 = P$

