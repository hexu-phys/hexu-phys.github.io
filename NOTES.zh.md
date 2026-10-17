# NOTES.zh.md — 中文维护说明（只给你看，不面向访客）

> 本文件是整站的中文维护手册。访客可见的所有文本都是英文；
> 本文件与各文件里的中文注释**仅供维护**，不会出现在页面上。

线上地址：<https://hexu-phys.github.io> ｜ 仓库：`hexu-phys.github.io`（`main` 分支根目录直接发布）

---

## 1. 目录结构说明

```
hexu-phys.github.io/
├── index.html                    # 首页 Home
├── research/
│   ├── index.html                # Research 总览（Selected research projects，年份倒序）
│   ├── projects/index.html       # 研究项目索引（指向下面三个详情页）
│   ├── publications/index.html   # 同行评审记录：当前写 "none yet"
│   ├── notes/index.html          # 研究笔记索引（指向 /notes/ 的正文）
│   ├── 2025-project-scaling/index.html   # 项目详情页（模板范例）
│   ├── 2024-project-method/index.html
│   └── 2023-project-note/index.html
├── projects/index.html           # 工程产物 / 工具 / 数据产品
├── cv/index.html                 # 网页版简历（含打印样式）
├── notes/index.html              # 技术笔记正文（<details> 折叠）
├── css/style.css                 # 全站唯一样式表（:root 变量集中在此）
├── js/main.js                    # 全站唯一脚本（复制文本 + 导航高亮兜底）
├── tools/                        # 本地自检脚本（开发期用，页面不引用、不是运行时依赖）
│   ├── check-site.mjs            # 死链 / 孤岛页 / head / 中文泄漏 / 无障碍 / sitemap
│   ├── lint-scripts.mjs          # 脚本语法 + 动画算法数值行为 + 动画自包含性
│   └── serve-and-verify.mjs      # 起临时服务器并逐个请求全部路由
├── assets/
│   ├── cv.pdf                    # 简历 PDF（下载用；由你原来的 assets/CV.pdf 改名而来）
│   ├── pdf/                      # 项目摘要 / 技术说明 PDF + README.md
│   ├── img/                      # SVG 示意图、og-default.svg + README.md
│   ├── anim/                     # 自包含交互动画（iframe 嵌入）
│   │   └── lib/                  # 动画用本地库目录（当前只有 README）
│   └── video/                    # 视频目录（当前只有 README）
├── favicon.svg                   # 站点图标（SVG）
├── favicon.ico                   # 真实的 32x32 ICO（326 字节，手工构造并已验证结构）
├── robots.txt                    # 允许抓取 + Sitemap 行
├── sitemap.xml                   # 手动维护的全站绝对 URL 清单
├── NOTES.zh.md                   # 本文件（中文维护手册）
├── README.md                     # 英文，仓库用途简介
├── cv.html                       # 旧版兼容跳转页 → cv/index.html（noindex）
├── project.html                  # 旧版兼容跳转页 → projects/index.html（noindex）
└── private.html                  # 旧版空文件改成的说明页（noindex + robots Disallow）
```

### 关于根目录那三个旧文件（重要）

你原先的 `index.html` / `cv.html` / `project.html` / `private.html` 都是 **0 字节空文件**，
且都**没有提交到 git**（`git ls-files` 只有 `README.md`）。按你的要求**没有删除**它们：

| 文件 | 现在的状态 |
|---|---|
| `index.html` | 已写成真正的首页（这是新站的主页） |
| `cv.html` | 写成一个极简跳转页 → `cv/index.html`，`noindex`，不进 sitemap |
| `project.html` | 写成一个极简跳转页 → `projects/index.html`，`noindex`，不进 sitemap |
| `private.html` | 写成一个"本页不承载内容"的说明页 → 首页；`noindex` + robots 禁止抓取 |

**为什么不直接删掉后三个**：它们虽然原本是空的，但可能已被外部链接或收藏引用；
保留成跳转页可以避免死链和"孤岛页面"，同时符合"不删除你已有文件"的要求。
如果你确认不需要它们，删掉 `cv.html` / `project.html` / `private.html` 三个文件即可，
其余文件不依赖它们。

---

## 2. 如何新增一篇论文（Publications）

> ⚠️ 先读第 7 节的**公开红线**。只有"已正式发表（有 DOI）且导师同意公开"的论文才能加进来。

1. **建详情页**：复制 `research/2023-project-note/` 整个目录，重命名为
   `research/<年份>-<短主题>/`（全小写、连字符分隔）。
2. **改 `research/<slug>/index.html`**：
   - `<title>`、`<meta name="description">`、`<link rel="canonical">`、`og:*` 里的
     URL 改成新 slug；
   - `<h1>` 换成论文标题（论文已发表就不必再用 `[Project topic]` 占位）；
   - 字段表 `.facts` 补全作者、期刊/会议、年份、DOI；
   - 链接行把 `[Summary available upon request]` 换成真实的
     `[PDF] [DOI] [Code]` 链接（外链记得加 `rel="noopener"`，PDF 加 `download`）；
   - 这时**才可以**恢复 `Abstract` 小节与 `BibTeX` 代码块
     （模板里刻意没有它们，因为未发表阶段不适用）；
   - 内联 PDF 区按 `assets/pdf/README.md` 的说明放文件。
3. **登记到三处**：
   - `research/publications/index.html`：把 `Peer-reviewed publications: none yet.`
     改成条目列表（作者列表里**你自己的名字用 `<strong>` 加粗**）；
   - `research/index.html`：在对应年份分组下加一条 `.entry`；
   - `sitemap.xml`：加一个 `<url><loc>https://hexu-phys.github.io/research/<slug>/</loc></url>`。
4. **检查**：按第 9 节的清单跑一遍（死链 / 孤岛页 / head 完整性）。

---

## 3. 如何新增一个研究项目（本项目当前的主轴）

与"新增论文"几乎一致，区别是**标题写项目主题，不写论文标题**，
并且**不要**加 `Abstract` / `BibTeX` / 复制引用按钮。

1. 复制 `research/2025-project-scaling/` 为新 slug 目录，例如
   `research/2026-project-<主题>/`。
2. 修改该页 `index.html`：
   - `h1` = 项目主题（例如 "Finite-size scaling of [Observable]"）；
   - `.facts` 字段：Collaborators / Timeline / Status / Role / Research area；
     - 状态只能写 `Ongoing` 或 `Completed`（用 `<span class="badge">`）；
     - 合作者与导师**若未获许可**就写 "available upon request"；
   - Links 行只能出现 `[Summary]` `[Code]` `[Poster]` `[Slides]`，
     没有公开链接就写 `[Link available upon request]`；
   - Research question / Methods / Tools / My contribution / Results (high level) 五节；
   - 媒体区（`id="media"`）里的 SVG / 动画 / PDF 换成新文件。
3. 登记到：
   - `research/index.html`（年份倒序）和 `research/projects/index.html`；
   - 首页 `index.html` 的 "Selected research projects"（只放最有代表性的 3 条）；
   - `cv/index.html` 的 "Selected Research Projects"（用 bullet 写项目经验）；
   - `projects/index.html`（如果有工程产物可讲）；
   - `sitemap.xml`。

---

## 4. 如何新增一个动画（自包含 HTML）

1. 在 `assets/anim/` 下新建 `<slug>.html`。硬性要求：
   - **零外部依赖**：不引 CDN、不发网络请求（`fetch` 在 `file://` 下会因 CORS 失败）；
   - 库必须放 `assets/anim/lib/` 并相对引用（见该目录的 README）；
   - 用 `<canvas>` 或纯 DOM 都行，但必须**自己处理响应式**
     （按容器宽度 + `devicePixelRatio` 重绘，监听 `resize`）；
   - 必须处理 `prefers-reduced-motion`（`window.matchMedia('(prefers-reduced-motion: reduce)')`），
     开启时停在第 1 帧，但交互控件仍要可用；
   - 不用内联 `onclick`，一律 `addEventListener`；
   - 计算量设上限（现在三个动画都把重采样/循环设了上限），避免手机卡顿。
2. **固定随机种子**：如果动画里有随机数据，请用固定种子的伪随机数生成器
   （现有三个动画都用 mulberry32），这样每次打开图形一致，便于别人对照。
3. 在项目详情页里嵌入：

```html
<!-- 中文注释：sandbox 只给 allow-scripts，不给 allow-same-origin，也不给 allow-top-navigation -->
<figure class="media">
  <div class="anim-frame">
    <iframe src="../../assets/anim/<slug>.html"
            title="English title of the interactive figure"
            loading="lazy"
            sandbox="allow-scripts"
            referrerpolicy="no-referrer"></iframe>
  </div>
  <figcaption>Figure N. English caption.</figcaption>
</figure>
```

4. 容器尺寸由 CSS 的 `.anim-frame { aspect-ratio: 16 / 10 }` 控制，
   手机端自动变成 `4 / 3`（见 `css/style.css` 的 640px 断点）。
5. **红线**：动画里不能出现未发表的具体数值。用合成/示意数据，
   并在图注里明确写 "synthetic" / "illustrative"。

---

## 5. 如何新增一张图（GIF / SVG / 视频）

详见 `assets/img/README.md`、`assets/video/README.md`。要点：

- 文件名全小写、连字符分隔，**不要空格和中文**；
- 图片必须写英文 `alt`，并加 `loading="lazy" decoding="async"`；
- 有 GIF 和视频时**优先用 `<video>`**（体积小得多），GIF 作为回退；
- 视频用 `autoplay loop muted playsinline controls` + `poster`；
- 所有媒体统一放 `.media` 容器里，图注用 `<figcaption>`。

---

## 6. 如何本地预览

**方式 A：直接双击（最简单）**

```text
双击 hexu-phys.github.io/index.html
```

所有内部链接都是相对路径，所以 `file://` 下核心导航、样式、内容与服务器一致。
**允许的差异**：PDF 内联（`<object>`）与 iframe 动画在部分浏览器/`file://` 下
可能因浏览器安全策略不渲染或降级——这是预期行为，不影响页面本身可用性。

**方式 B：本地服务器（推荐用于最终检查）**

```bash
cd hexu-phys.github.io
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

> ⚠️ **本机实测结果**：这台 Windows 机器上的 `python` / `python3` 是
> `AppData\Local\Microsoft\WindowsApps\` 下的**应用执行别名（stub）**，
> 运行后**没有任何输出、也没有真的启动服务器**（`python --version` 空输出）。
> 所以上面这条命令在本机不可用，需要先装真正的 Python。
> 本机可用的是 **Node.js v24.19.0**，因此本次验证用的是下面这两条命令：

```powershell
# 起一个临时静态服务器（零依赖，纯 Node 内置模块）
cd hexu-phys.github.io
node tools/serve-and-verify.mjs 8123
# 脚本会自己起服务器、逐个请求全部 31 条路由 + 5 个显式 index.html + 1 个 404 路径，
# 打印每条的 HTTP 状态码与 Content-Type，然后自动关闭。实测全部 200、404 行为正确。
```

```powershell
# 只想要一个长期运行的本地预览服务器（零依赖）
node -e "const h=require('http'),f=require('fs'),p=require('path');const R=process.cwd();const M={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.svg':'image/svg+xml','.pdf':'application/pdf','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.ico':'image/x-icon'};h.createServer((q,s)=>{let r=decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/,'')||'index.html';let t=p.join(R,r);try{if(f.statSync(t).isDirectory())t=p.join(t,'index.html')}catch(e){}if(!f.existsSync(t)){s.writeHead(404);return s.end('404')}s.writeHead(200,{'Content-Type':M[p.extname(t).toLowerCase()]||'application/octet-stream'});f.createReadStream(t).pipe(s)}).listen(8000,()=>console.log('http://localhost:8000'))"
```

**三种方式打开的都是同一套相对路径，页面表现一致。**
`file://` 与服务器模式的差异只允许出现在 PDF 内联与 iframe 动画上（浏览器安全策略不同）。

**部署前建议开的检查**（浏览器里按键）：

| 按键 | 用途 |
|---|---|
| `F12` → Console | 确认没有 JS 报错 |
| `F12` → Network | 确认没有外部域请求（除了你自己点的外链） |
| `Ctrl+Shift+M` | 切到手机尺寸，检查响应式断点（<640px） |
| `Ctrl+P` | 在 `cv/index.html` 上预览打印效果（应无导航、无按钮、无 PDF 框） |

---

## 7. 未发表工作公开红线与待确认清单

### 7.1 默认规则（不改这条，除非导师书面同意）

**可以公开：**

- 研究领域、大方向（`[Research Area]`）
- 方法族、算法名、工具链（Python / NumPy / MPI / SLURM 等）
- 你的个人角色与贡献（"我实现了 X 流程"）
- 高层次、定性化的结果描述（"随尺寸增大而收敛"），不带具体数字
- 明确标注 **schematic / illustrative / synthetic** 的示意图与动画
- 状态 `Ongoing` / `Completed`

**绝对不能公开（除非导师明确许可）：**

- ❌ 论文标题（未发表阶段的）、摘要文本
- ❌ 具体数值结果、拟合出的指数值、图表里的真实坐标
- ❌ 目标期刊、会议名、"in preparation" / "submitted" / "under review" 字样
- ❌ 双盲评审相关信息、审稿人意见、投稿时间线
- ❌ 代码仓库真实链接、数据集真实链接
- ❌ 合作者/导师姓名（除非已获许可）

**允许的占位写法**（本站已在用）：

| 占位符 | 用在哪里 |
|---|---|
| `[Project topic]` | 项目标题未获许可公开时 |
| `[Method]` / `[Method 1]` `[Method 2]` | 方法名未获许可时 |
| `[Result summary]` | 结果的具体数值位置 |
| `[Link available upon request]` | 代码 / 数据 / 幻灯片链接 |
| `[Summary available upon request]` | 摘要文档 |
| `[Poster available upon request]` / `[Slides available upon request]` | 展示材料 |
| `[available upon request]` / `Details available upon request` | 通用说明 |

> 原则：**网站只做"公开安全版"**。更详细的未发表内容放在
> CV / Research Statement / 申请材料 / 邮件回复里，不放进这个公开仓库。

### 7.2 需要你逐条确认的清单（发布前请打勾）

> 状态更新（2026-10-13）：带 ✅ 的项目已按 `reference for edition.txt` 与
> `assets/cv.pdf` 落到首页 / 简历页，详细记录见第 14 节。

- [x] ✅ **姓名**：首页 h1 已是 `Xu He (何煦)`（中文名全站仅此一次）；其余页面仍是 `[Your Name]`
- [x] ✅ **单位与院系**：`Research Assistant, Physics Department — HKUST`、`Hong Kong SAR`
- [x] ✅ **导师与合作者**：首页写了 Prof. Yilong Han；简历页写了 Prof. Robert Jack /
      Prof. Krippendorf / Huize Gao（都来自你提供的材料）——若不许署名请告诉我去掉
- [x] ✅ **三个项目的主题名**：已按你给的英文原文写进首页 About 第二段
      （Gaussian spectrum of phase-space networks / hexatic colloid Langevin couplings /
      reaction-diffusion hyperbolic patterns）
- [x] ✅ **时间线**：HKUST RA `Sep 2026 – Aug 2027`，与简历 PDF 一致
- [x] ✅ **邮箱**：`hexu@ust.hk`、`xh339@cantab.ac.uk`、`hexu879109462@gmail.com`
- [x] ✅ **GitHub**：已按你的要求从首页与简历页隐藏
- [x] ✅ **Google Scholar / ORCID**：同上，已隐藏
- [ ] **简历 PDF**：`assets/cv.pdf` 是你原来的 `assets/CV.pdf`（127 KB，2026-09 生成）
      —— 网页版已按它重写，但**请你自己再确认 PDF 里的手机号是否愿意公开**
      （网页版按保守做法没有放手机号）
- [ ] **三个占位 PDF**：`assets/pdf/*.pdf` 仍是"placeholder"说明页（只在 research/ 页面里用）
- [x] ✅ **教育经历 / 奖项 / 技能**：`cv/index.html` 已按 PDF 逐条重写，无占位符
- [x] ✅ **首页自我介绍**：已重写为 2 段，只写领域、方法、项目主题，不含任何结果数值
- [ ] **Publications 页**：确认仍然是 "none yet"，且没有任何投稿中信息

---

## 8. 占位符清单（我需要替换的所有 `[...]`）

> 用编辑器的"在文件中查找"（VS Code：`Ctrl+Shift+F`）搜 `[` 就能全站扫一遍。
> 下面是按文件列出的完整清单。
>
> **2026-10-13 更新：`index.html` 与 `cv/index.html` 已经完成，不再含任何 `[...]` 占位符**
> （这两页的内容与来源见第 14 节）。下面保留它们原来的清单只为对照历史，
> 其余页面（research/、notes/、projects/）的占位符仍然有效。

### `index.html`（首页）—— ✅ 已全部替换

原占位符 `[Your Name]`、`[Department]`、`[Institution]`、`[City, Country]`、
`[Research Area]`、`[Advisor Name]`、`[Lab or Group]`、`[Broad Physical System]`、
`[Project Theme 1..3]`、`[Year]`、`[email@example.com]`、
`[Google Scholar profile URL]`、`[ORCID iD URL]`、`[Method Family]`、`[Method 1..2]`、
`[Tool 1..3]` 均已替换或删除（GitHub / Scholar / ORCID 三条按本人要求隐藏）。

### `research/index.html`

`[Your Name]`、`[Broad Physical System]`、`[Method Family]`、`[Research Area]`、
`[Observable]`、`[Numerical Detail]`、`[email@example.com]`

### `research/projects/index.html`、`research/publications/index.html`、`research/notes/index.html`

`[Your Name]`、`[Observable]`、`[Numerical Detail]`、`[Research Area]`、
`[Google Scholar profile URL]`、`[ORCID iD URL]`、`[email@example.com]`

### 三个项目详情页（`research/2025-project-scaling/`、`2024-project-method/`、`2023-project-note/`）

公共：`[Your Name]`、`[Advisor Name]`、`[Lab or Group]`、`[Research Area]`、
`[Broad Physical System]`、`[Month Year]`、`[Role]`、`[Result summary]`、
`[Method]`、`[Method 1]`、`[Method 2]`、`[Method Family]`、`[Observable]`、
`[email@example.com]`

- 2025 专属：`[System Size]`、`[Numerical Detail]`（在 footer 以外的正文里）
- 2024 专属：`[Environment file]`、`[Build System]`
- 2023 专属：`[Numerical Detail]`、`[Control Parameter]`、`[Measurements of Observable]`

### `projects/index.html`

`[Your Name]`、`[Method]`、`[Role]`、`[Python]`、`[YAML configuration]`、`[SLURM]`、
`[pandas]`、`[Matplotlib]`、`[Git]`、`[Markdown]`、`[Make]`、`[C/C++]`、`[Fortran]`、
`[Shell]`、`[NumPy]`、`[SciPy]`、`[Method-specific library]`、`[MPI]`、`[OpenMP]`、
`[Profiling tool]`、`[Conda or venv]`、`[Container runtime, optional]`、`[email@example.com]`

### `cv/index.html` —— ✅ 已全部替换

原占位符已全部删除，页面内容改为 `assets/cv.pdf` 的真实信息：
学历（M.Math / BA）、Part III 与 Part IA/IB/II 成绩、Greig Prize 与 College Scholar、
HKUST RA、Part III essay、DAMTP 生成模型、Siler collingwoodi 结构色、CAS 暑期学校、
Programming / Machine learning 两行技能。
本轮**不再输出** Publications（无发表）、Presentations、Teaching、Languages 栏，
也**不放**手机号（PDF 里有，公开网页按保守做法省略）。详见第 14.3 节。

### `notes/index.html`

`[Your Name]`、`[Observable]`、`[email@example.com]`

### 其他文件

- `assets/img/og-default.svg`：`[Your Name]`、`[Department]`、`[Institution]`、`[Research Area]`
- `favicon.svg`：文字 `HX`（改成你的姓名首字母）
- `assets/pdf/README.md`、`assets/img/README.md` 等中文说明里的 `[email@example.com]`（可选改）

### 两个"不是占位符"的说明

- `[Ongoing]` / `[Completed]` 不存在，页面上是 `<span class="badge">Ongoing</span>`，
  已是正式文本。
- `research/publications/index.html` 里的 `none yet` 是**事实陈述**，
  有论文发表后再改（见第 2 节）。

---

## 9. 自检清单（每次改完都跑一遍）

**最快的方式：直接跑下面三个脚本（零依赖，Node 内置模块）。**
它们的实际输出见第 12 节。

```powershell
cd hexu-phys.github.io
node tools/check-site.mjs            # 死链 / 孤岛页 / head / 中文泄漏 / 无障碍 / sitemap
node tools/lint-scripts.mjs          # 脚本语法 + 动画算法数值行为 + 动画自包含性
node tools/serve-and-verify.mjs 8123 # 起临时服务器，逐个请求全部路由
```

手动核对时对应看这些点：

1. **死链**：所有相对路径的 `href` / `src` 是否指向真实存在的文件。
2. **孤岛页**：每个页面都能从导航到达，且都能回到首页。当前 11 个内容页 + 3 个旧版跳转页全部互联。
3. **head 完整性**：每页都有 `charset` / `viewport` / `title` / `description` /
   `canonical` / `og:type` / `og:title` / `og:description` / `og:url` / `og:image`。
4. **无 JS 可用性**：禁用 JavaScript 后，导航、折叠（`<details>`）、下载链接全部可用；
   只有"复制"按钮失效，但它旁边永远有可手动选择的文本。
5. **访客文本全英文**：页面里不能出现中文（`check-site.mjs` 会自动发现）。
6. **未发表信息未越界**：`check-site.mjs` 会扫描 `submitted` / `under review` /
   `manuscript` / `preprint` / `arXiv` / `DOI` 等词并给出警告；
   只允许出现在"我们刻意不放这些"的说明句里。
7. **相对路径**：全站不能有 `href="/"` 开头的内部链接（canonical / og:url / sitemap 例外）。
8. **sitemap 与实际页面对齐**：`sitemap.xml` 的 `<loc>` 数量 = 实际内容页数量（当前 11 个）。
9. **图片 alt**：所有 `<img>` 都有英文 `alt`；所有 `iframe` 都有 `title` 与 `sandbox`。
10. **打印样式**：`cv/index.html` 按 `Ctrl+P` 应无导航、无按钮、无 PDF 框。

---

## 10. 如何部署到 GitHub Pages

```bash
cd hexu-phys.github.io

# 1) 看一下改了什么（不要用 git commit / git push，你自己来）
git status
git diff

# 2) 把新文件加进去
git add -A

# 3) 提交
git commit -m "Rebuild site as a research project portfolio"

# 4) 推送
git push origin main
```

然后在 GitHub 仓库页面确认：

1. **Settings → Pages**
   - Source：`Deploy from a branch`
   - Branch：`main` ／ 目录：`/ (root)`
   - 保存后等 1–2 分钟，访问 <https://hexu-phys.github.io>
2. **Actions** 标签页可以看到 `pages build and deployment` 的进度。
3. 如果样式没更新，强制刷新（`Ctrl+F5`）；GitHub Pages 的 CDN 有几十秒到几分钟缓存。
4. 确认 `https://hexu-phys.github.io/robots.txt` 和 `/sitemap.xml` 能打开。

> 我没有执行 `git commit` / `git push`，也没有删除你任何文件。
> 注意：`README.md` 原本是仓库里唯一被 git 跟踪的文件，这次它被改写了（见第 1 节说明）。

---

## 11. 技术决策记录（为什么这么做）

| 决策 | 原因（对应 prompt 的硬性约束） |
|---|---|
| 零构建、零 npm、零 CDN | 约束：必须能双击 `file://` 打开，且与 `python -m http.server` 表现一致 |
| 所有内部链接相对路径 | `file://` 下 `/` 开头的绝对路径会指向磁盘根目录，必然 404 |
| PDF 只用原生 `<object>` | 不引入 PDF.js（重依赖、增加首屏负担）；降级由 `<object>` 内部文本兜底 |
| 动画用 `<iframe sandbox="allow-scripts">` | 不给 `allow-same-origin` → 脚本无法访问父页 DOM 与同源存储；不给 `allow-top-navigation` |
| 主轴从"论文列表"改为"研究项目作品集" | 你的研究未发表且不能投稿；避免暗示未公开内容 |
| 没有主题切换按钮 | 按 prompt 2.5 删除该可选功能；JS 只保留"复制文本 + 导航高亮兜底" |
| 无 JS 也完全可用 | 折叠用原生 `<details>`；导航是纯 `<a>`；复制按钮旁边有可手动选择的文本 |
| 首页 `.entry` 不写 Abstract / BibTeX | 没有公开预印本/DOI 时写了就是虚假信息 |
| 三个占位 PDF 是手工构造的合法 PDF | 约 1.3 KB，能真实渲染出"这是占位文件"的说明；避免大二进制 |
| `favicon.ico` 是手工构造的真实 32×32 ICO | 326 字节，结构已解析验证（ICONDIR/条目/BMP 头偏移全部正确），不产生大二进制 |
| 旧文件保留为跳转页 | 不删除你的文件，同时避免死链与孤岛页 |
| 动画用"朴素 log-log 直线拟合"而不是"缩放后搜斜率" | 见第 12 节踩坑记录：后者数学上对参数完全不敏感，是错误做法 |
| 自检写成了 3 个 Node 脚本 | 让"检查结果"可复现，而不是靠我口头保证 |

---

## 12. 自检记录（本次实际执行的结果）

三个脚本都在仓库根目录下运行。**以下是真实输出，不是推断。**

### 12.1 `node tools/check-site.mjs`

```
=== 自检结果 ===
  信息  sitemap 条目 11 个；内容页 11 个
  信息  HTML 文件 17 个，其中内容页 17 个
  信息  全部文件 40 个

--- 警告 1 条 ---
  [越界待确认] research/publications/index.html 出现 "Manuscript"
      （请确认是刻意的说明句，而非投稿信息）

结果：通过（无死链、无孤岛页、head 完整、访客文本无中文）
```

- **死链 0 条**：17 个 HTML 的全部 `href` / `src`、CSS 的 `url()` 全部解析到真实存在的文件。
- **孤岛页 0 条**：从 `index.html` 出发的可达性遍历覆盖全部 17 个页面。
- **head 完整**：11 个内容页全部有 charset / viewport / title / description /
  canonical / og:type / og:title / og:description / og:url / og:image；
  3 个旧版跳转页也补齐了同样的标签。
- **中文泄漏 0 条**：访客可见文本里没有中文（注释与 `<script>`/`<style>` 已剔除后再扫描）。
- **唯一警告**是刻意的：`research/publications/index.html` 里有一句
  "Rather than list manuscripts that are not public…"，属于**说明为什么没有列表**，
  正是 prompt 2.5 要求的效果，不是投稿信息。

### 12.2 `node tools/lint-scripts.mjs`

```
共 15 项检查，失败 0 项
```

- 4 段脚本（3 个动画的内联脚本 + `js/main.js`）语法全部通过。
- **2025 动画的拟合行为经过数值验证**（这是本次最有价值的一项）：
  | 拟合窗口 | 估计指数 |
  |---|---|
  | L ≥ 4（含最小尺寸） | 1.444（偏大 +0.194） |
  | L ≥ 8 | 1.348 |
  | L ≥ 16 | 1.259（偏差 0.009） |
  | L ≥ 20 | 1.249（偏差 0.001） |

  偏差随窗口下限**单调下降**，与图注描述完全一致。
- **2023 动画的 bootstrap 行为经过数值验证**：样本量 10 → 400 时，
  重采样均值的标准差从 0.4140 降到 0.0484；理论值 `1/sqrt(n) = 0.0500`，
  比值 0.97，符合 `1/sqrt(n)` 律。
- 3 个动画页均**无任何外部 `src`/`href`**（零 CDN、零远程请求）。

### 12.3 `node tools/serve-and-verify.mjs 8123`

```
--- 路由检查 ---（31 条）
  全部 OK 200，Content-Type 正确（text/html, text/css, application/javascript,
  image/svg+xml, image/x-icon, application/pdf, application/xml）
--- 显式 index.html 检查 ---（5 条）
  全部 OK 200
--- 404 行为检查 ---
  OK 404 /does-not-exist.html
结果：全部通过
```

覆盖了 11 个内容页、3 个旧版跳转页、CSS、JS、两个 favicon、robots、sitemap、
CV PDF（127377 字节）、3 个占位 PDF、4 个 SVG、3 个动画页。

### 12.4 本次修复的真实问题（不是"看起来没问题"）

1. **`favicon.ico` 缺失**：11 个页面都 `<link rel="alternate icon" href="...favicon.ico">`，
   而该文件当时不存在 → 11 条死链。已手工构造一个**结构合法的 32×32 ICO**
   （326 字节），并解析回来验证了 ICONDIR、条目、BMP 头与偏移。
2. **3 个旧版页面成为孤岛**：`cv.html` / `project.html` / `private.html`
   无法从首页到达。已在首页页脚加 "Legacy links" 一行，并给三者补齐 head 标签。
3. **3 个旧版页面缺 canonical / og 标签**：已补齐（`private.html` 补 canonical 且保持 noindex）。
4. **2025 动画的目标函数是错的**（最严重的一个）：
   原先用"把数据乘 `L^b` 后搜索斜率最小的 `b`"。因为
   `log(y·L^b) = log y + b·log L`，而 `b·log L` 对 `log L` 是线性的，
   会被回归的截距与斜率**完全吸收**——实测 `b` 从 0.5 到 3.0，
   卡方**恒为 431.5615**，搜索出来的结果纯属噪声（曾给出 2.913 这种离谱值）。
   已改为标准的**加权 log-log 直线拟合**，`exp_est = -slope`，
   并写了数值验证脚本锁住这个行为。这个坑已写进动画源码的注释里。
5. **相对误差 vs 绝对误差**：原先动画用绝对误差 `0.012 + 0.02/sqrt(L)`，
   在数据随尺寸快速衰减时，大尺寸点的权重被严重高估，导致大窗口拟合崩掉。
   已改为相对误差 `sigma/y = 0.004 + 0.02/sqrt(L)`。
6. **自检脚本自身的误报**：一开始把 HTML 注释里举例的 `<iframe ...>` 当成真实标签，
   报了两条不存在的错误。已在检查前剔除注释与 `<script>`。

### 12.5 本次**未能**完成的验证（如实说明，不要当成已通过）

- **没有做视觉/渲染验证（截图）**。我尝试用本机 Edge 的 headless 模式
  （`msedge.exe --headless=new --screenshot=...`）对 7 个页面截图，
  但 DSH 的文件沙箱**禁止进程间命名管道与进程句柄操作**，Edge 启动即失败：

  ```
  FATAL:mojo\public\cpp\platform\platform_channel.cc:187] Check failed: . : 拒绝访问。 (0x5)
  Start-Process : Access is denied
  ```

  这属于沙箱的预期边界，不是网站的问题（也没有反复重试）。

  **因此"页面的视觉效果"需要你亲自看一眼确认。** 我验证到的是：
  链接全部可达、HTTP 全部 200、head 完整、脚本语法正确、动画算法数值行为正确、
  PDF 结构合法。**版式是否合你的审美、字体是否如你所愿，我没有看到过。**

  建议你打开 `index.html`（或按第 6 节起服务器）后重点看这几处：
  1. 首页 760px 版心与顶部留白是否合适；
  2. `research/2025-project-scaling/index.html` 里两个 iframe（图形）是否正常渲染；
  3. `cv/index.html` 按 `Ctrl+P` 的打印预览是否干净；
  4. 窗口缩到手机宽度（<640px）时导航换行与媒体区是否正常；
  5. 禁用 JavaScript 后页面是否依然完整可读。

---

## 13. 已知限制与待办

- [ ] `assets/img/og-default.svg` 是 SVG。**部分社交平台（Twitter/X、Slack）不支持
      SVG 预览图**，建议导出 1200×630 的 PNG 覆盖（见 `assets/img/README.md`）。
- [ ] 本机的 `python` / `python3` 是无效的 WindowsApps 别名，所以
      `python3 -m http.server 8000` **在本机不可用**；已在第 6 节给出
      Node.js 替代命令（本机 Node v24.19.0 可用，已验证）。
- [ ] 图片全部是手绘示意 SVG，未包含任何真实数据——这是刻意的。
      替换前请对照第 7 节的红线。
- [ ] 三个占位 PDF 里的说明文字指向 `[email@example.com]`，替换邮箱时要一起改。
- [ ] 第 7.2 节的确认清单需要你逐条打勾后才能发布。
- [ ] 首页页脚的 "Legacy links" 一行（指向 `cv.html` / `project.html` / `private.html`）
      是为你保留旧文件而加的。若你确认不需要这三个页面，删掉那一行和对应文件即可。
      **2026-10-13 更新：这一行已经从首页删除**（公开首页不该出现内部文件名）；
      三个文件仍然保留在仓库里，只是不再有站内入口，详见第 14.4 节。
- [ ] `NOTES.zh.md` 与 `README.md` 都提到了占位符；替换完全站占位符后，
      建议回来把第 8 节的清单标记为已完成（或直接删掉该节）。
      **2026-10-13 更新：`index.html` 与 `cv/index.html` 已完成，第 8 节已相应标注。**

（没有未登记的 TODO：上面这一节就是全部待办。）

---

## 14. 本轮修改记录（2026-10-13，依据 `reference for edition.txt`）

### 14.1 改了哪些文件

| 文件 | 修改内容 |
|---|---|
| `index.html` | 按真实信息重写（见 14.2）；导航暂时只有 Home / Projects / CV |
| `cv/index.html` | 按 `assets/cv.pdf` 的真实内容重写（见 14.3）；导航同上 |
| `assets/img/og-default.svg` | 社交预览图的占位改成真实信息；顺手修掉一个真 bug（见 14.5） |
| `tools/check-site.mjs` | 新增两条显式豁免（中文姓名一次、旧版跳转页孤岛），见 14.4 |
| `NOTES.zh.md` | 本文件：更新第 7.2 / 8 / 13 节，新增本节 |

其余文件本轮**未改动**：`research/`（含 3 个详情页）、`notes/`、`projects/`、
`sitemap.xml`、`robots.txt`、`css/style.css`、`js/main.js`。

### 14.2 首页（`index.html`）的确定内容

- **h1**：`Xu He (何煦)` —— 中文全名**全站仅此一处**。
- **身份行**：`Research Assistant, Physics Department — HKUST`；
  下一行 `BA and MMath, University of Cambridge`；
  再下一行 `Hong Kong SAR · Research area: soft matter and soft condensed matter physics`。
- **About 第一段**：HKUST 物理系 RA（Prof. Yilong Han 组）+ 胶体系统的场论与图案形成
  + 支撑它们的数值方法；建模捕捉宏观集体行为与图案形成，并写模拟/分析流水线，
  把大规模数值数据变成可检验的定量陈述。（原英文的语法已按学术书面语重写。）
- **About 第二段**：三个项目主题 + 2027 秋季博士申请。三个主题按你给的原文写成：
  1. universality of the Gaussian spectrum for phase-space networks of local operators
  2. couplings and rotational correlations of hexatic colloids from the Langevin equation
  3. a reaction-diffusion model of hyperbolic patterns in biological systems
- **联系方式**：只留 `hexu@ust.hk` / `xh339@cantab.ac.uk` / `hexu879109462@gmail.com`；
  GitHub、Google Scholar、ORCID 已隐藏。
- **Research interests**（3 条）：软物质与软凝聚态（集体行为、经典多体相互作用，理论/模拟/数据分析）；
  建模用平均场与更精细的场论、通过自由能研究相变；生物系统图案形成的微分几何初步方法。
  按你的要求**删掉了** "Reproducible scientific computing" 一条。
- **已删除**："Selected research projects" 小节、页脚的 Research / Notes 链接、
  页脚的 "Legacy links" 一行。

### 14.3 简历页（`cv/index.html`）的确定内容

来源：`assets/cv.pdf`（真实简历，2026-09 生成）。顺序刻意安排为
**Education → Scholarships and Awards → Research Experience → Skills**，
让剑桥学历与成绩靠前；2026 年 9 月之前的经历简单带过。

- **Education**
  - Master of Mathematics (M.Math)，Christ's College, University of Cambridge，
    Sep 2025 – Jul 2026；Part III: First with Merit (74/100)。
  - BA in Natural Sciences，Christ's College, University of Cambridge，
    Sep 2022 – Jul 2025；First Class throughout，Part IA 71.4/100；
    Part IB 112/545；Part II 78.8/100 (19/129)。
- **Scholarships and Awards**：Greig Prize (2025)；College Scholar (2022–2026)。
- **Research Experience**（时间倒序）
  - Research Assistant, Yilong Han Lab, HKUST（Sep 2026 – Aug 2027）：2 条 bullet
    （相空间网络的普适高斯谱；二维胶体盘中 hexatic/glassy 相的 Langevin 动力学与耦合）。
  - M.Math Part III Essay，DAMTP（Mar–May 2026，Supervisor: Prof. Robert Jack）：
    active–passive 混合体系的图案形成、spinodal–binodal 关系、reciprocal Cahn–Hilliard。
  - Research Assistant，DAMTP（Jul–Sep 2025，Supervisor: Prof. Krippendorf）：
    生成式扩散模型解 string theory flux vacua 反问题（8 维 flux 向量、LDM/CCDM、PyTorch）。
  - Research project：Siler collingwoodi 结构色（与 Peking University 张蔚实验室合作，
    Jul 2023 – Aug 2024）。
  - Summer school participant：CAS 物理所 "International Conference on Physics under
    Synergetic Extreme Conditions"（Jul–Aug 2023）。
- **Skills**：Programming: Python (NumPy, SciPy, PyTorch), LaTeX；
  Machine learning: neural networks (CNNs, VAEs), diffusion models (LDM, CCDM)。
- **刻意没有的栏目**：Publications（目前没有已发表论文，宁可不写也不写投稿中信息）、
  Presentations、Teaching、Languages。
- **手机号**：PDF 里有 `+44 7927651039`，公开网页按保守做法**没有放**。
  要放就自己在 `cv/index.html` 的 `.contact-line` 里加一条，
  格式照 `hexu@ust.hk` 那几条即可。
- ⚠️ **需要你确认的一处**：`Part IB 112/545` 是**逐字照抄 PDF 原文**，
  我没有推测它是分数还是排名。如果它其实是排名，请改成 `Part IB rank 112/545`。

### 14.4 两处显式豁免（为什么"访客文本无中文"还能通过）

1. **中文姓名例外**：你要求首页出现一次中文全名。`tools/check-site.mjs` 里加了
   常量 `NAME_EXCEPTION = 'Xu He (何煦)'`，检测前先把它替换掉，并单独校验
   **恰好出现 1 次**——出现在别的页面、或出现超过 1 次，仍然报错。
   自检会打印一行 `index.html 的中文全名出现 1 次（按本人要求的显式例外）`。
2. **旧版跳转页孤岛豁免**：首页页脚的 "Legacy links" 一行已删除，
   所以 `cv.html` / `project.html` / `private.html` 不再有站内入口。
   这三个文件仍保留（不删除已有文件），但 `NOINDEX_PAGES` 现在同时用于
   sitemap 检查与孤岛页检查——它们是"故意不在站内导航里"的。

### 14.5 顺手修掉的一个真 bug

`assets/img/og-default.svg` 是 XML，但原件里写了 HTML 实体 `&mdash;` 与 `&middot;`。
**XML 只预定义 `&amp; &lt; &gt; &quot; &apos;` 五个实体**，这两个是未定义的，
浏览器按 `image/svg+xml` 解析时会直接报 XML 解析错误（社交预览图可能整张不显示）。
已改成 UTF-8 的 `—` 与 `·` 字符，并用 `lxml` 实际解析验证通过。

### 14.6 本轮**未**做（需要你决定）

> **2026-10-13 第二轮已处理**：Research / Notes 已在全站隐去、`sitemap.xml` 已同步、
> `projects/index.html` 已重写为两个真实项目。下面三条已被第 15 节取代，保留只为记录。

- **research / notes 只是从首页与简历页的导航里隐去**（按你的原话"在 index 上隐去"）。
  `projects/index.html` 的导航里**仍然**有 Research / Notes，
  所以这两页目前还能从 Projects 页点进去。若你要**全站**都看不到，
  告诉我一声，我把 `projects/`、`research/`、`notes/` 内部页面的导航一起改掉
  （那会动到你说"暂不修改"的 projects 页）。
- `projects/index.html` 的内容仍是上一轮的通用占位（"Simulation campaign driver" 之类），
  本轮按要求**没动**。等你给三个项目的呈现方式后再重写。
- `sitemap.xml` 未改：`research/`、`notes/` 的 URL 仍在里面（页面本身还在）。
  若要彻底隐藏，sitemap 与 robots 也要一起调整。
- 首页与简历页现在**没有任何 `[...]` 占位符**；其余页面（`research/`、`notes/`、
  `projects/`）里的占位符仍在，等下一阶段处理。
- 仍然**没有**做视觉/渲染验证（原因见 12.5，沙箱禁止 Edge headless）。
  版式需要你自己打开看一眼。

### 14.7 本轮自检记录（真实输出）

```text
node tools/check-site.mjs
=== 自检结果 ===
  信息  index.html 的中文全名出现 1 次（按本人要求的显式例外）
  信息  assets/anim/2023-project-note.html：脚本引用的 6 个 id 全部存在
  信息  assets/anim/2024-project-method.html：脚本引用的 9 个 id 全部存在
  信息  assets/anim/2025-project-scaling.html：脚本引用的 8 个 id 全部存在
  信息  sitemap 条目 11 个；内容页 11 个
  信息  HTML 文件 17 个，其中内容页 17 个
  信息  全部文件 42 个

--- 警告 1 条 ---
  [越界待确认] research/publications/index.html 出现 "Manuscript"
      （与上一轮相同的刻意说明句，非投稿信息）

结果：通过（无死链、无孤岛页、head 完整、访客文本无中文）
```

```text
node tools/lint-scripts.mjs
共 15 项检查，失败 0 项

node tools/serve-and-verify.mjs 8231
--- 路由检查 ---（30 条）全部 200，Content-Type 正确
--- 显式 index.html 检查 ---（5 条）全部 200
--- 404 行为检查 --- OK 404 /does-not-exist.html
结果：全部通过
```

其中本轮重点确认的几条：

- `/`（新首页）200，7100 B；`/cv/`（新简历页）200，11885 B；
  `/assets/img/og-default.svg` 200，1768 B。
- 首页 `<h1>` 的中文全名被单独计数为 1（脚本信息行）；其余 16 个 HTML 无中文。
- 首页与简历页的导航都已只剩 Home / Projects / CV，且 `aria-current="page"` 正确。
- 简历页仍带 `class="cv-page"`，`Ctrl+P` 打印时会走 `@media print`
  （隐藏导航与下载按钮、去掉颜色、字号调小）。

---

## 15. 第二轮修改记录（2026-10-13，Projects 页面）

### 15.1 文件变动

| 文件 | 变动 |
|---|---|
| `projects/index.html` | 整体重写：导航只剩 Home / Projects / CV；内容改为"软物质、偏理论、会一点实验"；两个真实项目；**删除 "Tools I use" 整节**；"Working practices" 改写为 "Approach" |
| `projects/phase-space-network/index.html` | 新建项目详情页 |
| `projects/langevin-coupling/index.html` | 新建项目详情页 |
| `projects/phase-space-network/paper.pdf` | 由 `projects/Universality_of_Phase_Space_as_Gaussian_Spectrum__1_.pdf` 复制（730030 B，SHA256 一致） |
| `projects/langevin-coupling/paper.pdf` | 由 `projects/Langevin_Coupling_of_Oriented_Disks__1_.pdf` 复制（603593 B，SHA256 一致） |
| `sitemap.xml` | 改为只列 5 个对外可见页面：`/`、`/projects/`、两个项目页、`/cv/` |
| `tools/check-site.mjs` | 新增 `HIDDEN_PAGES`：research/ 与 notes/ 豁免孤岛页检查与 sitemap 对齐检查 |
| `tools/serve-and-verify.mjs` | 路由清单改为**从磁盘自动生成**，以后新增页面不用再手改这个脚本 |
| `README.md` | 更新目录结构表，新增"如何更新 PDF"与"暂时隐去的栏目"说明 |

### 15.2 PDF 怎么更新（重要）

两个项目页里的下载按钮与内嵌查看器都指向**固定文件名 `paper.pdf`**：

```
projects/phase-space-network/paper.pdf
projects/langevin-coupling/paper.pdf
```

以后有新版本：把新 PDF **改名成 `paper.pdf` 直接覆盖**，HTML 一个字都不用改。

⚠️ **需要你手动做一步**：你原来的两个长文件名 PDF 还留在 `projects/` 根目录
（`Universality_of_Phase_Space_as_Gaussian_Spectrum__1_.pdf`、
`Langevin_Coupling_of_Oriented_Disks__1_.pdf`）。DSH 沙箱禁止我删除你的已有文件，
所以我只能"复制"不能"移动"。请手动删掉这两个文件，否则仓库里会有两份重复文件，
而且它们同样会被公开访问。

### 15.3 两个项目页写了什么

依据是你给的 PDF 的标题页 + Introduction + 目录（**没有读全文**，也没有写任何具体数值、
目标期刊或投稿状态）：

- **phase-space-network**（2026 年 9 月起）：相空间连通图的经验谱分布在热力学极限下趋于
  高斯；用算符代数 + 矩方法 + 累积迹衰减假设给出充分条件；四个环节（可解超立方体模型、
  局域性、守恒荷分块、抽取式粗粒化）+ 对 Han 组模型的检验。
- **langevin-coupling**（2026 年 10 月起）：二维三角格子刚性圆盘只转不移，窄缝润滑流传力矩；
  有效转动 Langevin 方程与耦合系数估计；三角格子 Fourier/模式分析（超越平均场阻尼）；
  稳态关联与两窗口比较；弱无序推广；与实验观测比较。

两个详情页结构一致：`.facts` 字段表（时间线 / 状态 / 角色 / 领域 / 方法 / 体系 / 文档页数）
→ Research question → Approach → My contribution → 写到手稿（下载 + 内嵌 PDF）。

### 15.4 关于"多余的按钮"

你确认指的是**顶部导航里没隐藏的 Research 与 Notes**。现在：

- `index.html`、`projects/index.html`、`cv/index.html` 三个页面的导航都只有
  Home / Projects / CV。
- Research 与 Notes 的页面文件都还在，但**不再被任何对外页面链接**，也不在 sitemap 里；
  `tools/check-site.mjs` 用 `HIDDEN_PAGES` 把它们登记为"暂时隐去"。
- 你说"假链接不删"，所以 `[Code available upon request]` 这类占位文本**保留了**
  （纯文本，不是 `<a>`，不会产生死链）。
- `Tools I use` 整节已删除。

### 15.5 仍需你处理 / 决定

- **删掉 `projects/` 下那两个原始长文件名 PDF**（见 15.2）。
- ⚠️ 这两份 PDF 是**完整草稿**（含推导与结果），放在公开站点等于公开。
  若导师还没同意，建议先撤下或只留摘要——这个决定权在你，我按你的指示放了。
- Research 与 Notes 的页面内容仍是上一轮的占位，要恢复栏目需要三步：
  ①把 `<loc>` 加回 `sitemap.xml`；②在各页导航加回 `<li>`；
  ③把 `tools/check-site.mjs` 里的 `HIDDEN_PAGES` 规则删掉。
- 视觉验证仍没做（沙箱禁止 headless 浏览器），版式请你打开看一眼。

### 15.6 本轮自检记录（真实输出）

```text
node tools/check-site.mjs
=== 自检结果 ===
  信息  index.html 的中文全名出现 1 次（按本人要求的显式例外）
  信息  assets/anim/2023-project-note.html：脚本引用的 6 个 id 全部存在
  信息  assets/anim/2024-project-method.html：脚本引用的 9 个 id 全部存在
  信息  assets/anim/2025-project-scaling.html：脚本引用的 8 个 id 全部存在
  信息  sitemap 条目 5 个；内容页 5 个
  信息  HTML 文件 19 个，其中内容页 19 个
  信息  全部文件 49 个

--- 警告 1 条 ---
  [越界待确认] research/publications/index.html 出现 "Manuscript"
      （隐去栏目里的刻意说明句，不影响对外页面）

结果：通过（无死链、无孤岛页、head 完整、访客文本无中文）
```

```text
node tools/serve-and-verify.mjs 8237
--- 路由检查 ---（38 条）全部 200，Content-Type 正确
--- 显式 index.html 检查 ---（12 条）全部 200
--- 404 行为检查 --- OK 404 /does-not-exist.html
结果：全部通过（51 项）
```

重点确认：

- `/projects/` 200（8809 B）；`/projects/phase-space-network/` 200（8507 B）；
  `/projects/langevin-coupling/` 200（8297 B）。
- 两份 PDF 以 `application/pdf` 返回，字节数与原文件一致（730030 / 603593）。
- `sitemap.xml` 5 条 ↔ 对外可见页面 5 个，一一对应。
- 两个详情页都用原生 `<object>` 内嵌 PDF；`file://` 下若浏览器不渲染，
  会显示对象内部的下载提示文字（渐进增强的兜底）。

---

## 16. 第三轮：版权与使用条款（2026-10-13）

### 16.1 新增了什么

新建 `copyright/index.html`（`https://hexu-phys.github.io/copyright/`），
按你的要求声明三类内容**都不允许被随意拿去牟利**：

| 覆盖对象 | 条款要点 |
|---|---|
| 网站本身（文字 / 版式 / 样式表 / 图表） | © 2026 Xu He；不得复制、再分发或并入任何出售/商用的产品、服务、课程、出版物 |
| 个人信息（姓名、单位、邮箱、CV 里的学历与经历） | 仅供同事、合作者、招生委员会联系；禁止抓取、汇编成联系人库、广告营销、群发邮件，并明确表示不授权对这些信息的自动化收集 |
| 研究成果（Projects 下两份 PDF 草稿） | 未发表草稿，非同行评审、可能随时修改、不得当作已发表结果引用；除注明出处是他人图表的以外，推导/结果/图表/数据归本人；禁止复制、再分发、放到别处托管、商用 |

另有四节：**允许且无需询问**的用途（阅读、链到本站、带署名的短引用、自己下载阅读）、
**需要许可**的用途（复制改写、再分发、商用、放进数据集或商业模型训练语料）、
**如何申请**（写邮件到 hexu@ust.hk，书面答复；涉及未发表项目会先问导师）、
**第三方材料与外部链接**。

### 16.2 每个公开页面都加了声明

首页、Projects 总览、两个项目详情页、CV 五处页脚都换成了统一的版权声明，
并加上 *Copyright and terms of use* 链接：

- 首页 / Projects：`All rights reserved. No part of this site — text, figures, contact details, or research drafts — may be reused for commercial purposes without written permission.`
- 两个项目页：`This draft is shared for discussion; it may not be redistributed or used commercially without written permission.`
- CV 页：同样声明，且条款链接加了 `class="no-print"`，
  所以 **Ctrl+P 打印时只印版权句、不印链接**（打印件更像正式材料）。

### 16.3 没覆盖到的地方（如实说明）

- `research/`、`notes/` 以及三个旧版跳转页**没有改**（栏目已隐去，且里面的内容仍是
  上一轮的占位、页脚还写着 `[Your Name]`）。如果以后恢复 Research 栏目，
  记得把版权行一起补上——搜 `site-foot` 即可。
- 这是**权利声明**，不是法律意见。真要更强硬的措辞（比如逐条列举许可范围、
  加 DMCA 流程），建议先问学校或律师。
- 页脚印的是 2026 年；跨年后请把各页 `&copy; 2026` 与 `copyright/index.html`
  里的 `&copy; 2026`、`last updated` 一起改。

### 16.4 自检

```text
node tools/check-site.mjs
  信息  sitemap 条目 6 个；内容页 6 个
  信息  HTML 文件 20 个，其中内容页 20 个
  信息  全部文件 48 个
结果：通过（无死链、无孤岛页、head 完整、访客文本无中文）

node tools/serve-and-verify.mjs → 全部通过（含 /copyright/ 200，7888 B）
```

五个公开页面的页脚链接、`sitemap.xml` 的 6 条 `<loc>`、`/copyright/` 的
canonical 与 og 标签都已由脚本核对，无死链。

---

## 17. 第四轮：线上 Git 冲突标记事故（2026-10-13）

### 17.1 事故是什么

线上页面里确实渲染出了 Git 合并冲突标记（`<<<<<<< HEAD` / `=======` /
`>>>>>>> 3698b754…`），但**本地文件是干净的**：`node tools/check-site.mjs` 通过，
整仓 grep 也找不到标记。

原因是部署路径上出的事：本地这批文件被上传到 GitHub 后，与旧提交
`3698b7545120df397ba8b8b2a503849abc97ed41` 发生了合并，冲突在网页端被"提交"了，
标记就留在了线上这 **6 个文件**里：
`index.html`、`sitemap.xml`、`projects/index.html`、
`projects/phase-space-network/index.html`、`projects/langevin-coupling/index.html`、
`cv/index.html`。

线上 / 本地逐字节比对（`node tools/check-deploy.mjs` 的真实输出，节选）：

```text
STALE /                          线上 7668 B / 本地 7439 B   + 6 处冲突标记
STALE /projects/                 线上 9293 B / 本地 9118 B   + 3 处
STALE /projects/phase-space-network/  线上 8865 B / 本地 8725 B  + 3 处
STALE /projects/langevin-coupling/    线上 8655 B / 本地 8515 B  + 3 处
STALE /cv/                       线上 12351 B / 本地 12199 B  + 3 处
STALE /sitemap.xml               线上 2122 B / 本地 1884 B   + 4 处
OK    /copyright/  7888 B 、/robots.txt 389 B
OK    /projects/*/paper.pdf（两份，与本地逐字节一致）
```

多出来的字节数正好等于被重复粘贴的那几段页脚 / 条目，说明**内容本身没丢**，
只是线上版本被写坏了。

### 17.2 本地已经做的修复

1. **`tools/check-site.mjs` 新增"合并冲突标记"检查**：任何 `.html/.css/.js/.mjs/.xml`
   里出现 7 个 `<` 开头、7 个 `=` 单独成行、7 个 `>` 开头的行，自检直接**失败**
   （已用临时文件验证能拦住，删除后恢复正常）。
2. **新增 `tools/check-deploy.mjs`**：拉取线上 10 条公开路由，与本地**逐字节**比对，
   并单独报告冲突标记。部署后跑一次就知道文件到底传上去没有。
3. **Research / Notes 的 8 个页面加了 `noindex`**（Kimi 这条说对了：占位页仍可被搜到）。
   恢复栏目时删掉这一行即可。

### 17.3 怎么把线上修好（两条路，选一条）

**A. 网页端上传（推荐，避免再发生合并）**

先删掉仓库里这 6 个坏文件，再上传本地同名文件。**不要**点"解决冲突"编辑器：

```text
index.html
sitemap.xml
projects/index.html
projects/phase-space-network/index.html
projects/langevin-coupling/index.html
cv/index.html
```

要"整体覆盖"也可以：线上其余文件（`copyright/`、`assets/`、`css/`、`js/`、
`research/`、`notes/`、`robots.txt`…）本来就是好的，全部重传不会有坏处。

**B. 本地 git（如果你在别的终端能用 git）**

```bash
cd hexu-phys.github.io
node tools/check-site.mjs              # 必须先"通过"再往下
git add -A
git commit -m "Rebuild site; remove merge-conflict markers"
git push --force-with-lease origin main
```

用 `--force-with-lease` 是因为远端多出来的那个合并提交本身就是坏的，覆盖掉最干净。
**不要先 `git pull`**，否则又会把坏文件拉回本地。

### 17.4 部署后必须做的事

```bash
node tools/check-deploy.mjs
```

全部 `OK` 才算修好。GitHub Pages 有 CDN 缓存（几十秒到几分钟），刚推完可能仍是旧内容，
稍等再跑；浏览器用 `Ctrl+F5`。以后每次部署前跑 `check-site`，部署后跑 `check-deploy`。

### 17.5 Kimi 那份评测的逐条判断（哪些是真的）

| Kimi 的说法 | 判断 | 处理 |
|---|---|---|
| ① 首页有合并冲突残留、页脚重复 | **真**，且是 6 个文件 | 本地干净；按 17.3 覆盖上传 |
| ② Research/Notes 仍是模板、占位符会进搜索结果 | **真** | 已加 `noindex`；内容仍未填（栏目继续隐藏） |
| ③ 首页三个项目 vs Research 三个模板项目互相矛盾 | **真**（逻辑上） | Research 已隐藏 + noindex，不再对外；是否合并两页由你决定 |
| ④ `/cv` 是空的重定向页 | **假**：`/cv/` 是完整简历（只是被冲突标记污染）；`/cv.html` 才是旧链接跳转页且 noindex | 无需改 |
| ⑤ 首页没有顶部导航、Copyright 链接可能不存在 | **假**：首页有 Home/Projects/CV；`/copyright/` 200 存在 | 无需改 |
| 补充教育背景 | 已有：首页第三行 `BA and MMath, University of Cambridge` + CV 页 | 无需改 |
| 三个邮箱冗余 | 这是你的要求 | 可选：给 `hexu@ust.hk` 标 "preferred" |
| 精简版权声明 | 与你的明确要求相反 | 保留现状 |
| 加 GitHub / ORCID / Scholar | 你明确要求暂时隐藏 | 继续隐藏 |
| 加 News / 更新记录 | 可选，对申请季有用 | 待定 |
| 确认 Write-up (PDF) 链接有效 | **已确认**：线上两份 PDF 与本地逐字节一致 | 完成 |

> 结论：Kimi 的 ①②③ 是真问题（①属于部署事故，②③是隐藏栏目没藏干净）；
> ④⑤ 是它基于坏页面产生的误判。它给的"加学术链接 / 精简版权 / 合并邮箱"三条建议
> 与你的明确要求冲突，**不采纳**。
