---
title: 向量与内积
date: 2025-12-17
---


# 向量与内积

> 目标：用最少的公理，搭出可以做计算与推导的「向量语言」。

## 1. 向量与范数

向量空间中的元素记为 $\mathbf{x}\in\mathbb{R}^n$。常用范数：

- $\ell_2$ 范数：$\|\mathbf{x}\|_2 = \sqrt{\sum_{i=1}^n x_i^2}$
- $\ell_1$ 范数：$\|\mathbf{x}\|_1 = \sum_{i=1}^n |x_i|$
- $\ell_\infty$ 范数：$\|\mathbf{x}\|_\infty = \max_i |x_i|$

::: tip 直觉
$\ell_2$ 是“欧氏距离”，$\ell_1$ 更像“走格子路”，$\ell_\infty$ 则只看最大坐标偏移。
:::

## 2. 内积与夹角
<div class="bg-red-500 text-white text-4xl p-10 text-center rounded-xl shadow-lg hover:bg-blue-500 transition-colors">
  Tailwind 测试
</div>

标准内积：

$$
\langle \mathbf{x},\mathbf{y} \rangle = \mathbf{x}^\top \mathbf{y} = \sum_{i=1}^n x_i y_i
$$

夹角定义：

$$
\cos\theta = \frac{\langle \mathbf{x},\mathbf{y} \rangle}{\|\mathbf{x}\|_2\,\|\mathbf{y}\|_2}
$$

当 $\langle \mathbf{x},\mathbf{y} \rangle = 0$ 时，称 $\mathbf{x}$ 与 $\mathbf{y}$ 正交。

## 3. 投影（projection）

将 $\mathbf{x}$ 投影到单位向量 $\mathbf{u}$（$\|\mathbf{u}\|_2=1$）上：

$$
\mathrm{proj}_{\mathbf{u}}(\mathbf{x}) = \langle \mathbf{x},\mathbf{u} \rangle\, \mathbf{u}
$$

更一般地，投影到非单位向量 $\mathbf{a}$：

$$
\mathrm{proj}_{\mathbf{a}}(\mathbf{x}) = \frac{\mathbf{x}^\top \mathbf{a}}{\mathbf{a}^\top \mathbf{a}}\,\mathbf{a}
$$

## 4. 一个小例题

已知 $\mathbf{a}=(2,1)^\top$，$\mathbf{x}=(1,2)^\top$。求 $\mathbf{x}$ 在 $\mathbf{a}$ 方向上的投影。

$$
\mathbf{x}^\top \mathbf{a} = 1\cdot 2 + 2\cdot 1 = 4,\quad
\mathbf{a}^\top \mathbf{a} = 2^2 + 1^2 = 5
$$

所以

$$
\mathrm{proj}_{\mathbf{a}}(\mathbf{x})
= \frac{4}{5}(2,1)^\top = (\tfrac{8}{5},\tfrac{4}{5})^\top
$$
