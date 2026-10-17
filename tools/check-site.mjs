// 中文注释：
// 全站自检脚本（Node.js，仅用于本地检查，不属于网站运行时依赖，不会被页面引用）。
// 检查内容：
//   1) 死链：解析所有 HTML 的 href/src 与 CSS 的 url()，验证相对路径目标是否存在
//      （目录当 index.html 处理，带 #锚点 或 ?query 的先剥离）
//   2) 孤岛页：从 index.html 出发做可达性遍历，列出不可达的 HTML 文件
//      （旧版跳转页与隐去栏目豁免，见下面的 NOINDEX_PAGES / HIDDEN_PAGES）
//   3) head 完整性：charset / viewport / title / description / canonical / og:*
//   4) 访客可见文本是否混入中文（注释与 <script>/<style> 内容先剔除；
//      首页中文全名按本人要求允许一次）
//   5) 绝对路径检查：内部链接不得以 "/" 开头
//   6) 未发表信息越界：扫描 submitted / under review / manuscript / preprint / arXiv / double-blind 等词
//   7) 无障碍：<img> 必须有 alt，<iframe> 必须有 title
//   8) sitemap.xml 的 <loc> 与"当前对外可见"的页面是否一一对应（隐去栏目不计入）
//
// 用法：node tools/check-site.mjs      （从仓库根目录运行）
// 退出码：0 = 全部通过，1 = 存在错误

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative, sep } from 'node:path';

const ROOT = resolve(process.cwd());
const errors = [];
const warnings = [];
const info = [];

// 中文注释：递归收集所有文件（跳过 .git 与 node_modules）
function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules' || name === '.github') continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

const allFiles = walk(ROOT);
const rel = (p) => relative(ROOT, p).split(sep).join('/');
const htmlFiles = allFiles.filter((f) => f.endsWith('.html'));
const contentPages = htmlFiles.filter((f) => !rel(f).startsWith('tools/'));

// 中文注释：旧版兼容跳转页与动画页不算"导航主体"
const NOINDEX_PAGES = new Set(['cv.html', 'project.html', 'private.html']);
const ANIM_PAGES = (f) => rel(f).startsWith('assets/anim/');

// ---------- 0) 合并冲突标记 ----------
// 中文注释：
// 2026-10 线上出现过一次事故：在 GitHub 网页端解决合并冲突时，把冲突标记
// （以 7 个 < 开头的行、7 个 = 的行、7 个 > 开头的行）连同文件一起提交了，
// 访客在首页页脚直接看到这些标记。这里在自检阶段先拦一道。
// 只扫描会真正上线的代码文件（html/css/js/mjs/xml），文档里的示例不算。
{
  const codeExt = /\.(html|css|js|mjs|xml)$/i;
  let marked = 0;
  for (const f of allFiles) {
    if (!codeExt.test(f)) continue;
    const t = readFileSync(f, 'utf8');
    const open = t.match(/^<{7}.*$/gm) || [];
    const close = t.match(/^>{7}.*$/gm) || [];
    const sep = open.length || close.length ? t.match(/^={7}$/gm) || [] : [];
    if (open.length || close.length || sep.length) {
      marked++;
      errors.push(
        `[合并冲突] ${rel(f)} 含 Git 冲突标记（${(open[0] || close[0] || sep[0]).trim()}），不要部署`
      );
    }
  }
  if (!marked) info.push('代码文件中没有 Git 合并冲突标记');
}

// 中文注释：
// 首页 <h1> 按本人要求保留一次中文全名，这是"访客可见文本全英文"规则下唯一
// 显式允许的例外。这里把它在检测前替换掉，并单独校验出现次数（必须恰好 1 次）。
const NAME_EXCEPTION = 'Xu He (何煦)';

// 中文注释：
// 暂时隐去的栏目：这些页面仍在仓库里（没有删除），但按本人要求不出现在导航
// 与 sitemap.xml 中，所以豁免孤岛页检查，也不参与 sitemap 对齐检查。
// 当前隐去的是 research/ 全部页面与 notes/index.html（Research / Notes 未定稿）。
// 恢复栏目时：删掉这条规则、把 <loc> 加回 sitemap.xml、并在各页导航里加回 <li>。
const HIDDEN_PAGES = (f) => {
  const r = rel(f);
  return r.startsWith('research/') || r.startsWith('notes/');
};

// ---------- 1) 死链检查 ----------
const linkTargets = new Map(); // 页面 -> Set(被引用的目标相对路径)

function stripFragment(u) {
  return u.split('#')[0].split('?')[0];
}

function isExternal(u) {
  return /^(https?:|mailto:|tel:|data:|javascript:|#)/i.test(u);
}

function resolveTarget(fromFile, url) {
  const clean = stripFragment(url);
  if (!clean) return null;
  const base = dirname(fromFile);
  let target = clean.startsWith('/') ? join(ROOT, clean) : resolve(base, clean);
  return target;
}

for (const file of contentPages) {
  const text = readFileSync(file, 'utf8');
  const refs = new Set();

  // href / src
  const attrRe = /\b(?:href|src)\s*=\s*"([^"]*)"/gi;
  let m;
  while ((m = attrRe.exec(text)) !== null) {
    const url = m[1].trim();
    if (!url || isExternal(url)) continue;
    // 中文注释：跳过占位符（形如 [Google Scholar profile URL]）
    if (url.startsWith('[') || url.includes('[email@')) continue;
    refs.add(url);
  }
  // srcset（本项目暂未使用，但一并检查）
  const srcsetRe = /\bsrcset\s*=\s*"([^"]*)"/gi;
  while ((m = srcsetRe.exec(text)) !== null) {
    for (const part of m[1].split(',')) {
      const url = part.trim().split(/\s+/)[0];
      if (url && !isExternal(url)) refs.add(url);
    }
  }
  // 中文注释：<object data="..."> 是内嵌 PDF 的真实引用，也要检查（普通 data-* 属性不查）
  const objectRe = /<object\b[^>]*\bdata\s*=\s*"([^"]*)"/gi;
  while ((m = objectRe.exec(text)) !== null) {
    const url = m[1].trim();
    if (!url || isExternal(url)) continue;
    if (url.startsWith('[') || url.includes('[email@')) continue;
    refs.add(url);
  }

  for (const url of refs) {
    const target = resolveTarget(file, url);
    if (!target) continue;
    let ok = existsSync(target);
    if (ok && statSync(target).isDirectory()) ok = existsSync(join(target, 'index.html'));
    if (!ok) {
      errors.push(`[死链] ${rel(file)} -> ${url}`);
    }
  }
  linkTargets.set(file, refs);
}

// 中文注释：CSS 里的 url() 引用
for (const file of allFiles.filter((f) => f.endsWith('.css'))) {
  const text = readFileSync(file, 'utf8');
  const re = /url\(\s*['"]?([^'")]+)['"]?\s*\)/gi;
  let m;
  while ((m = re.exec(text)) !== null) {
    const url = m[1].trim();
    if (!url || isExternal(url)) continue;
    const target = resolveTarget(file, url);
    if (target && !existsSync(target)) errors.push(`[死链] ${rel(file)} -> url(${url})`);
  }
}

// ---------- 2) 孤岛页检查 ----------
const home = join(ROOT, 'index.html');
const reachable = new Set();
const queue = [home];
while (queue.length) {
  const current = queue.shift();
  const key = rel(current);
  if (reachable.has(key)) continue;
  reachable.add(key);
  const refs = linkTargets.get(current);
  if (!refs) continue;
  for (const url of refs) {
    if (/\.(pdf|svg|png|jpe?g|gif|webp|mp4|webm|ico|txt|xml|md)$/i.test(stripFragment(url))) continue;
    const target = resolveTarget(current, url);
    if (!target) continue;
    let entry = target;
    if (existsSync(target) && statSync(target).isDirectory()) entry = join(target, 'index.html');
    if (existsSync(entry) && entry.endsWith('.html')) queue.push(entry);
  }
}

for (const file of contentPages) {
  if (ANIM_PAGES(file)) continue;
  // 中文注释：
  // 旧版兼容跳转页（cv.html / project.html / private.html）的入口已从首页页脚移除，
  // 它们只服务于站外旧链接，故意不出现在站内导航里，因此豁免孤岛页检查。
  if (NOINDEX_PAGES.has(rel(file))) continue;
  // 中文注释：隐去栏目同样豁免（页面存在，但刻意不放进站内导航）
  if (HIDDEN_PAGES(file)) continue;
  if (!reachable.has(rel(file))) {
    errors.push(`[孤岛页] ${rel(file)} 无法从 index.html 通过链接到达`);
  }
}

// ---------- 3) head 完整性 ----------
for (const file of contentPages) {
  if (ANIM_PAGES(file)) continue;
  const text = readFileSync(file, 'utf8');
  const head = text.slice(0, text.search(/<\/head>/i) + 7);
  const needs = [
    ['charset', /<meta\s+charset=/i],
    ['viewport', /<meta\s+name="viewport"/i],
    ['title', /<title>[^<]+<\/title>/i],
    ['description', /<meta\s+name="description"\s+content="[^"]+"/i],
    ['canonical', /<link\s+rel="canonical"\s+href="[^"]+"/i],
    ['og:type', /<meta\s+property="og:type"/i],
    ['og:title', /<meta\s+property="og:title"/i],
    ['og:description', /<meta\s+property="og:description"/i],
    ['og:url', /<meta\s+property="og:url"/i],
    ['og:image', /<meta\s+property="og:image"/i],
  ];
  for (const [name, re] of needs) {
    if (!re.test(head)) errors.push(`[head] ${rel(file)} 缺少 ${name}`);
  }
  if (!/<html\s+lang="en"/i.test(text)) errors.push(`[lang] ${rel(file)} 的 <html> 未声明 lang="en"`);
}

// ---------- 4) 访客可见文本混入中文 ----------
const CJK = /[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/;
for (const file of contentPages) {
  let text = readFileSync(file, 'utf8');
  // 中文注释：先移除注释、script、style，剩下的就是访客可见内容
  text = text.replace(/<!--[\s\S]*?-->/g, '');
  text = text.replace(/<script[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[\s\S]*?<\/style>/gi, '');
  // 中文注释：首页允许且只允许出现一次中文全名，先计数再替换掉
  const nameCount = text.split(NAME_EXCEPTION).length - 1;
  if (nameCount > 0) {
    if (rel(file) !== 'index.html') {
      errors.push(`[中文泄漏] ${rel(file)} 出现了中文全名（只允许在首页出现一次）`);
    } else if (nameCount > 1) {
      errors.push(`[中文泄漏] index.html 出现 ${nameCount} 次中文全名（只允许 1 次）`);
    } else {
      info.push('index.html 的中文全名出现 1 次（按本人要求的显式例外）');
    }
    text = text.split(NAME_EXCEPTION).join('Xu He');
  }
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    if (CJK.test(line)) {
      errors.push(`[中文泄漏] ${rel(file)}:${i + 1} ${line.trim().slice(0, 90)}`);
    }
  });
}
// 中文注释：CSS 里的中文只允许出现在注释中
{
  const css = readFileSync(join(ROOT, 'css/style.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  if (CJK.test(css)) errors.push('[中文泄漏] css/style.css 的注释之外出现中文');
}

// ---------- 5) 绝对路径链接 ----------
for (const file of contentPages) {
  const text = readFileSync(file, 'utf8');
  const re = /\b(?:href|src)\s*=\s*"\/([^"]*)"/gi;
  let m;
  while ((m = re.exec(text)) !== null) {
    errors.push(`[绝对路径] ${rel(file)} -> /${m[1]}（内部链接必须用相对路径）`);
  }
}

// ---------- 6) 未发表信息越界 ----------
const FORBIDDEN = [
  /\bunder review\b/i, /\bsubmitted\b/i, /\bmanuscript\b/i, /\bpreprint\b/i,
  /\barXiv\b/i, /\bdouble-blind\b/i, /\bunder revision\b/i, /\bin preparation\b/i,
  /\btarget journal\b/i, /\binvited talk\b/i, /\bDOI\b/,
];
for (const file of contentPages) {
  if (ANIM_PAGES(file)) continue;
  let text = readFileSync(file, 'utf8');
  text = text.replace(/<!--[\s\S]*?-->/g, '').replace(/<script[\s\S]*?<\/script>/gi, '');
  for (const re of FORBIDDEN) {
    const m = text.match(re);
    if (m) warnings.push(`[越界待确认] ${rel(file)} 出现 "${m[0]}"（请确认是刻意的说明句，而非投稿信息）`);
  }
}

// ---------- 7) 无障碍 ----------
// 中文注释：同时验证脚本引用的元素 id 是否真实存在（防 DOM 错配导致运行时报错）
for (const file of contentPages) {
  const raw = readFileSync(file, 'utf8');
  // 中文注释：先剔除注释与 <script>，避免把注释里举例的标签当成真实标签
  const text = raw
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '');
  const imgs = text.match(/<img\b[^>]*>/gi) || [];
  for (const tag of imgs) {
    if (!/\balt\s*=/.test(tag)) errors.push(`[alt] ${rel(file)} 有 <img> 缺少 alt：${tag.slice(0, 80)}`);
    if (!/\bloading\s*=/.test(tag)) warnings.push(`[lazy] ${rel(file)} 的 <img> 未写 loading：${tag.slice(0, 80)}`);
    if (!/\bdecoding\s*=/.test(tag)) warnings.push(`[decoding] ${rel(file)} 的 <img> 未写 decoding：${tag.slice(0, 80)}`);
  }
  const iframes = text.match(/<iframe\b[^>]*>/gi) || [];
  for (const tag of iframes) {
    if (!/\btitle\s*=/.test(tag)) errors.push(`[iframe-title] ${rel(file)} 的 <iframe> 缺少 title`);
    if (!/\bsandbox\s*=/.test(tag)) errors.push(`[iframe-sandbox] ${rel(file)} 的 <iframe> 缺少 sandbox`);
    if (/allow-top-navigation/.test(tag)) errors.push(`[iframe-sandbox] ${rel(file)} 的 <iframe> 不应给 allow-top-navigation`);
    if (!/\bloading="lazy"/.test(tag)) warnings.push(`[lazy] ${rel(file)} 的 <iframe> 未写 loading="lazy"`);
  }

  // 中文注释：检查内联脚本里 getElementById('x') 的 x 是否真有对应 id
  const ids = new Set([...raw.matchAll(/\bid\s*=\s*"([^"]+)"/g)].map((m) => m[1]));
  const scripts = [...raw.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const looked = new Set();
  for (const s of scripts) {
    for (const m of s.matchAll(/getElementById\(\s*'([^']+)'\s*\)/g)) looked.add(m[1]);
    for (const m of s.matchAll(/getElementById\(\s*"([^"]+)"\s*\)/g)) looked.add(m[1]);
  }
  for (const id of looked) {
    if (!ids.has(id)) errors.push(`[dom-id] ${rel(file)} 的脚本引用了不存在的 id "${id}"`);
  }
  if (looked.size) {
    const missing = [...looked].filter((id) => !ids.has(id));
    if (!missing.length) info.push(`${rel(file)}：脚本引用的 ${looked.size} 个 id 全部存在`);
  }
}

// ---------- 8) sitemap 与实际页面对齐 ----------
{
  const sm = readFileSync(join(ROOT, 'sitemap.xml'), 'utf8');
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const expected = contentPages
    .filter((f) => !ANIM_PAGES(f) && !NOINDEX_PAGES.has(rel(f)) && !HIDDEN_PAGES(f))
    .map((f) => {
      const r = rel(f);
      const dir = r.replace(/index\.html$/, '');
      return `https://hexu-phys.github.io/${dir}`;
    });
  for (const e of expected) {
    if (!locs.includes(e)) errors.push(`[sitemap] 缺少 ${e}`);
  }
  for (const l of locs) {
    if (!expected.includes(l)) warnings.push(`[sitemap] 多出 ${l}（确认对应页面是否仍存在）`);
  }
  info.push(`sitemap 条目 ${locs.length} 个；内容页 ${expected.length} 个`);
}

// ---------- 9) robots.txt ----------
{
  const rb = readFileSync(join(ROOT, 'robots.txt'), 'utf8');
  if (!/Sitemap:\s*https:\/\/hexu-phys\.github\.io\/sitemap\.xml/.test(rb)) {
    errors.push('[robots] 缺少正确的 Sitemap 行');
  }
  if (!/Allow:\s*\//.test(rb)) errors.push('[robots] 缺少 Allow: /');
}

// ---------- 输出 ----------
info.push(`HTML 文件 ${htmlFiles.length} 个，其中内容页 ${contentPages.length} 个`);
info.push(`全部文件 ${allFiles.length} 个`);

console.log('=== 自检结果 ===');
for (const i of info) console.log(`  信息  ${i}`);
if (warnings.length) {
  console.log(`\n--- 警告 ${warnings.length} 条 ---`);
  for (const w of warnings) console.log(`  ${w}`);
}
if (errors.length) {
  console.log(`\n--- 错误 ${errors.length} 条 ---`);
  for (const e of errors) console.log(`  ${e}`);
  console.log('\n结果：失败');
  process.exit(1);
}
console.log('\n结果：通过（无死链、无孤岛页、head 完整、访客文本无中文）');
