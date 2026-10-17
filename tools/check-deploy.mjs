// 中文注释：
// 线上部署校验脚本（Node.js，仅开发期使用，不属于网站运行时依赖）。
// 作用：直接请求 https://hexu-phys.github.io 的公开发布页面，与本地文件逐字节比对，
//       顺带检查是否存在 Git 合并冲突标记（<<<<<<< / ======= / >>>>>>>）。
// 为什么需要它：2026-10 出现过一次"GitHub 网页端解决合并冲突时把冲突标记一起提交"的事故，
//       本地文件是干净的、线上却是坏的。这个脚本能把这种"本地对、线上错"的情况当场抓出来。
//
// 用法：node tools/check-deploy.mjs [--base https://hexu-phys.github.io]
// 退出码：0 = 线上与本地一致；1 = 有差异或冲突标记
//
// 注意：GitHub Pages 有 CDN 缓存（几十秒到几分钟）。刚推送完立刻跑可能仍显示旧内容，
//       等一会儿再跑。看到 STALE 时先刷新浏览器确认，再判断是不是真没部署上。

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const baseArg = process.argv.indexOf('--base');
const BASE = baseArg > -1 ? process.argv[baseArg + 1] : 'https://hexu-phys.github.io';

// 中文注释：公开发布的路由 → 本地文件。新增公开页面时在这里补一行。
const ROUTES = [
  ['/', 'index.html'],
  ['/projects/', 'projects/index.html'],
  ['/projects/phase-space-network/', 'projects/phase-space-network/index.html'],
  ['/projects/langevin-coupling/', 'projects/langevin-coupling/index.html'],
  ['/copyright/', 'copyright/index.html'],
  ['/cv/', 'cv/index.html'],
  ['/sitemap.xml', 'sitemap.xml'],
  ['/robots.txt', 'robots.txt'],
  ['/projects/phase-space-network/paper.pdf', 'projects/phase-space-network/paper.pdf'],
  ['/projects/langevin-coupling/paper.pdf', 'projects/langevin-coupling/paper.pdf'],
];

// 中文注释：合并冲突标记。'=======' 单独出现时可能是 Markdown 的下划线，
// 所以只在同一份文件里同时出现 '<<<<<<<' 时才把它算作冲突标记。
function conflictMarkers(buf) {
  const text = buf.toString('utf8');
  const hits = [];
  const open = text.match(/^<{7}.*$/gm);
  const close = text.match(/^>{7}.*$/gm);
  const sep = text.match(/^={7}$/gm);
  if (open) hits.push(...open.map((s) => s.trim()));
  if (close) hits.push(...close.map((s) => s.trim()));
  if (sep && open) hits.push(...sep.map((s) => s.trim()));
  return hits;
}

let failures = 0;
console.log(`Base: ${BASE}\n`);
console.log('--- 线上 / 本地 逐字节比对 ---');

for (const [route, relPath] of ROUTES) {
  const localPath = join(ROOT, relPath);
  if (!existsSync(localPath)) {
    failures++;
    console.log(`  FAIL  本地文件不存在：${relPath}`);
    continue;
  }
  const local = readFileSync(localPath);

  let res;
  try {
    res = await fetch(BASE + route, { cache: 'no-store' });
  } catch (err) {
    failures++;
    console.log(`  FAIL  ${route} 请求失败：${err.message}`);
    continue;
  }
  const remote = Buffer.from(await res.arrayBuffer());

  const remoteText = remote.toString('utf8');
  const markers = res.headers.get('content-type')?.includes('text/html')
    ? conflictMarkers(remote)
    : conflictMarkers(remote).filter((m) => m.startsWith('<') || m.startsWith('>'));

  if (res.status !== 200) {
    failures++;
    console.log(`  FAIL  ${route} 返回 ${res.status}`);
  } else if (remote.length !== local.length || !remote.equals(local)) {
    failures++;
    console.log(
      `  STALE ${route}  线上 ${remote.length} B / 本地 ${local.length} B` +
        `（线上还有 CDN 缓存？或线上被改动过）`
    );
  } else {
    console.log(`  OK    ${route}  ${local.length} B  与本地一致`);
  }

  if (markers.length) {
    failures++;
    console.log(`  BUG   ${route} 线上内容含合并冲突标记 ${markers.length} 处：${markers.slice(0, 3).join(' / ')}`);
  }
  if (remoteText.includes('<<<<<<<') || remoteText.includes('>>>>>>>')) {
    // 中文注释：兜底，防止 HTML 实体/转义导致上面的正则漏掉
    if (!markers.length) console.log(`  WARN  ${route} 疑似含冲突标记文本`);
  }
}

console.log(`\n结果：${failures === 0 ? '线上与本地一致，未发现冲突标记' : failures + ' 项需要处理'}`);
process.exit(failures === 0 ? 0 : 1);
