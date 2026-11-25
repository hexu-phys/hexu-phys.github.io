# assets/pdf — 中文维护说明

存放项目详情页内联查看 / 下载的 PDF。文件名规则：**全小写、连字符分隔、无空格无中文**。

## 现有文件

| 文件 | 页面 | 作用 |
|---|---|---|
| `2025-project-scaling-summary.pdf` | `research/2025-project-scaling/index.html` | Project summary（占位） |
| `2024-project-method-note.pdf` | `research/2024-project-method/index.html` | Technical note（占位） |
| `2023-project-note-note.pdf` | `research/2023-project-note/index.html` | Technical note（占位） |

这三个文件都是**手工构造的极小单页 PDF**（约 1.3 KB），正文写着
"This file is a placeholder..."，用来验证内联查看器与下载链接确实可用，
并且**不含任何未发表内容**。它们结构合法（正确的 xref 偏移），
所以浏览器原生 `<object>` 查看器可以正常渲染。

## 如何替换成真实 PDF

1. 覆盖同名文件即可，HTML 不用改。
2. 确认页面里三处路径一致：
   - `<a class="btn" href="../../assets/pdf/<name>.pdf" download>`
   - `<object data="../../assets/pdf/<name>.pdf" type="application/pdf">`
   - `<object>` 内部降级提示里的下载链接
3. 建议用 `pdfinfo` 或浏览器检查一遍：文件可打开、没有加密、
   页面中**不含**未发表数值 / 目标期刊 / 投稿状态 / 双盲信息。
4. 如果导师不允许放出 PDF：把 `<section>` 里的 `.pdf-frame` 整块删掉，
   只保留一段文字说明（"Available upon request"），
   并同步删除这里对应的占位文件与本表条目。

## 兼容性提醒

- 移动端 Safari 与部分浏览器对内联 PDF 体验很差，所以每个 PDF **上方**
  都固定放了一个 `Download ... (PDF)` 直链（带 `download` 属性）。
- 本站按硬性约束**不引入 PDF.js**，只用浏览器原生 `<object>`。
  降级由 `<object>` 内部的 `<p>` 兜底文本负责。

## 不要做的事

- 不要放大体积扫描件（建议单文件 < 5 MB）。
- 不要用带空格或中文的文件名（GitHub Pages 上会被 URL 编码，容易出错）。
