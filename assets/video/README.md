# assets/video — 中文维护说明

本目录当前**为空（只有本说明）**，用于将来放 mp4 / webm 短视频。

## 为什么现在没有视频

- 硬性约束要求不生成大型二进制文件。
- 现有三个项目详情页的动效都用了更轻的方案：
  - **SVG 静态示意图**（`assets/img/*.svg`，几 KB）
  - **自包含 HTML 交互动画**（`assets/anim/*.html`，纯文本，零依赖）

## 什么时候该用视频

当你要展示的是一段**时间演化**（例如系统随时间的弛豫、参数扫描的连续变化），
而 HTML 动画又做不出来时，用视频比 GIF 好得多：**体积小一个数量级**。

## 推荐做法

1. 导出两种格式以覆盖浏览器：
   - `assets/video/<slug>.webm`（VP9，首选）
   - `assets/video/<slug>.mp4`（H.264，兜底）
2. 静音自动循环的短视频，**必须**带 `poster` 和 `controls` 兜底：

```html
<!-- 中文注释：静音自动循环的短视频，必须带 poster 和 controls 兜底 -->
<figure class="media">
  <video autoplay loop muted playsinline controls
         poster="../../assets/img/<slug>-poster.jpg"
         aria-label="English description of the animation">
    <source src="../../assets/video/<slug>.webm" type="video/webm">
    <source src="../../assets/video/<slug>.mp4" type="video/mp4">
    Your browser does not support video. <a href="../../assets/video/<slug>.mp4" download>Download the video</a>.
  </video>
  <figcaption>Figure N. English caption.</figcaption>
</figure>
```

3. poster 图放在 `assets/img/`（jpg/png），文件名 `<slug>-poster.jpg`。
4. 加了视频后，请更新 `NOTES.zh.md` 的目录树说明与 `sitemap.xml`
   （视频本身不列入 sitemap，但引用它的页面已经列了）。
5. **公开红线**：视频同样不能展示未发表结果。只放经导师许可的动画。

## 体积建议

- webm 目标 < 2 MB，mp4 目标 < 5 MB。
- 宽度 960–1280 px 足够（站点版心只有 760 px）。
- 不要提交 `assets/video/` 下的临时工程文件（.prproj、.aep 等）。
