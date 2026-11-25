# assets/anim/lib — 中文维护说明

本目录用于存放**动画页用到的本地库**。当前为空（页面上只有本说明）。

## 硬性约束

- 动画页（`assets/anim/*.html`）必须**自包含**：
  不能依赖父页面的 CSS/JS，也不能从 CDN 加载任何东西。
- 如果确实需要第三方库（例如绘图库），把 **未压缩或压缩后的库文件**
  放在本目录下，然后用相对路径引用：

```html
<!-- 中文注释：库必须本地托管，禁止 CDN -->
<script src="lib/some-library.min.js"></script>
```

## 当前三个动画都不需要库

| 动画 | 实现方式 | 依赖 |
|---|---|---|
| `anim/2025-project-scaling.html` | 原生 Canvas 2D 手绘 + 自写最小二乘 | 无 |
| `anim/2024-project-method.html` | 纯 DOM + CSS | 无 |
| `anim/2023-project-note.html` | 原生 Canvas 2D 直方图 | 无 |

## 加库之前请先问自己

1. 能不能用 Canvas / SVG / 纯 CSS 手写？通常可以，而且体积小得多。
2. 这个库的许可证是否允许再分发（MIT / BSD / Apache 通常可以，
   注意保留许可证文件，放在 `lib/<library>-LICENSE.txt`）。
3. 加载后首屏是否明显变慢？动画是 `<iframe loading="lazy">`，
   本身已延迟加载，但仍应避免大库。

## 注意：sandbox 环境

动画被以 `<iframe sandbox="allow-scripts">` 嵌入（**没有** `allow-same-origin`），
所以库不能依赖：
- `localStorage` / `sessionStorage` / IndexedDB
- `document.cookie`
- 对父页面的任何访问（`parent.*`、`window.top.*`）
- `fetch()` 读取本地文件（`file://` 下也会因 CORS 失败）

只用纯计算 + DOM/Canvas 渲染的库是安全的。
