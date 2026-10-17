# assets/img — 中文维护说明

本目录存放页面引用的**位图与矢量图**。访客可见的文件名必须是
**小写字母、数字、连字符**，不能有空格和中文（GIF/PNG/JPG/SVG/WebP 同理）。

## 现有文件

| 文件（相对 `assets/img/`） | 用途 | 被谁引用 |
|---|---|---|
| `2025-project-scaling-fig1.svg` | 有限尺寸标度示意（Figure 1） | `research/2025-project-scaling/index.html` |
| `2024-project-method-fig1.svg` | 四阶段流程示意（Figure 1） | `research/2024-project-method/index.html` |
| `2023-project-note-fig1.svg` | 数值假象衰减示意（Figure 1） | `research/2023-project-note/index.html` |
| `og-default.svg` | 社交分享预览图（Open Graph） | 所有页面的 `<head>`（绝对 URL） |

这些 SVG 都是**占位示意图**，不含任何未发表数据：曲线与数值点都是手绘的示意内容。

## 如何替换成真实图

1. **保持文件名不变**是最省事的方式：直接用同名文件覆盖即可，HTML 无需改动。
2. 若换成 GIF / PNG / WebP，请同步修改对应详情页里的 `<img src="...">`，
   并确保：
   - `alt` 是**英文且描述性**的（不要写 "figure"、不要留空）；
   - 加 `loading="lazy"` 和 `decoding="async"`（GIF 更要加，体积大）；
   - 图注写在 `<figcaption>` 里，英文。
3. **未发表数据的公开红线**：只放经导师明确许可的图。
   不能放原始数据曲线、具体数值、目标期刊相关的图。
   没拿到许可就用带 "schematic" / "illustrative" 字样的示意图，
   并在 `NOTES.zh.md` 的"未发表工作公开红线与待确认清单"里登记。

## 关于 og-default

`og-default.svg` 被所有页面引用。**部分平台（Twitter/X、Slack 等）不支持 SVG 预览图**。
若要最大兼容性：

1. 把 `og-default.svg` 导出为 1200×630 的 PNG，命名 `og-default.png` 放在本目录；
2. 把每个 HTML 文件 `<head>` 中的
   `https://hexu-phys.github.io/assets/img/og-default.svg`
   批量替换为 `.../og-default.png`。

## 建议命名的目录（可选，当前为空）

- `favicon-32.png`、`favicon-192.png`、`apple-touch-icon.png`：若日后需要 PNG 图标。
- `<slug>-poster.jpg`：视频的 `poster` 图（见 `assets/video/README.md`）。
