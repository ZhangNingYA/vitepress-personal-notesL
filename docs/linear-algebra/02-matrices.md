---
title: 矩阵与线性变换
date: 2025-12-17
---

# 矩阵与线性变换

把矩阵 $A\in\mathbb{R}^{m\times n}$ 理解为线性映射 $f(\mathbf{x})=A\mathbf{x}$，比“行列式/消元的集合”更易组织知识。

## 1. 线性性

对任意 $\alpha,\beta$ 与向量 $\mathbf{x},\mathbf{y}$：

$$
A(\alpha\mathbf{x}+\beta\mathbf{y}) = \alpha A\mathbf{x} + \beta A\mathbf{y}
$$

## 2. 列空间与秩

$A\mathbf{x}$ 是 $A$ 的列向量的线性组合，因此像空间（range）就是列空间。

- $\mathrm{rank}(A)$：列空间维数
- $\mathrm{null}(A)$：零空间

::: info 复习目标
能把“解线性方程组”统一成：求 $A\mathbf{x}=\mathbf{b}$ 是否可解、解的维数是多少。
:::
