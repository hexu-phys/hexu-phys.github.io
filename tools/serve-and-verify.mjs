// 中文注释：
// 本地验证脚本（Node.js，仅用于开发期自检，不属于网站运行时依赖）。
// 作用：起一个临时静态服务器，逐个请求站点里所有页面与资源，
//       验证 HTTP 状态码、Content-Type，以及目录 URL 的行为。
// 用法：node tools/serve-and-verify.mjs [port]
// 退出码：0 = 全部 200，1 = 有非 200

import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, resolve, extname, relative, sep } from 'node:path';

const ROOT = resolve(process.cwd());
const PORT = Number(process.argv[2] || 8123);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

const server = createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '');
  if (rel === '') rel = 'index.html';
  let full = join(ROOT, rel);
  if (existsSync(full) && statSync(full).isDirectory()) full = join(full, 'index.html');
  if (!existsSync(full) || !statSync(full).isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found: ' + rel);
    return;
  }
  const body = readFileSync(full);
  res.writeHead(200, {
    'Content-Type': MIME[extname(full).toLowerCase()] || 'application/octet-stream',
    'Content-Length': body.length,
  });
  res.end(body);
});

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules') continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

await new Promise((r) => server.listen(PORT, '127.0.0.1', r));
console.log(`Serving ${ROOT} at http://127.0.0.1:${PORT}/`);

const base = `http://127.0.0.1:${PORT}`;
let failures = 0;

// 中文注释：
// 路由清单改为从磁盘自动生成，避免新增页面后忘记往这里加一条。
// 规则：目录里所有 index.html 生成一条目录形式的 URL（GitHub Pages 实际访问形式），
// 其余文件生成文件 URL；跳过 tools/ 与其他开发期文件（.md / .mjs / .py / 本地说明 .txt）。
const allRoutes = walk(ROOT)
  .map((f) => '/' + relative(ROOT, f).split(sep).join('/'))
  .filter((u) => !u.startsWith('/tools/') && !u.startsWith('/.git/'))
  .filter((u) => !/^\.[^/]*$/.test(u.split('/').pop()) && u !== '/.gitignore')
  .filter((u) => !/\.(md|mjs|py)$/i.test(u))
  .filter((u) => !/^\/(prompt|reference for edition)\.txt$/i.test(decodeURI(u)))
  .filter((u) => !u.startsWith('/_'))
  .sort();

const indexRoutes = allRoutes.filter((u) => u.endsWith('/index.html'));
const routes = [
  ...indexRoutes.map((u) => u.replace(/index\.html$/, '')),
  ...allRoutes.filter((u) => !u.endsWith('/index.html')),
];

console.log('\n--- 路由检查 ---');
for (const route of routes) {
  const res = await fetch(base + encodeURI(route), { redirect: 'manual' });
  const buf = Buffer.from(await res.arrayBuffer());
  const ok = res.status === 200 && buf.length > 0;
  if (!ok) failures++;
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${String(res.status)}  ${String(buf.length).padStart(7)} B  ${res.headers.get('content-type') || '-'}  ${route}`);
}

// 中文注释：再测文件形式的 URL（file:// 风格，确保 index.html 显式可访问）
console.log('\n--- 显式 index.html 检查 ---');
for (const route of indexRoutes) {
  const res = await fetch(base + encodeURI(route));
  const buf = Buffer.from(await res.arrayBuffer());
  const ok = res.status === 200 && buf.length > 0;
  if (!ok) failures++;
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${res.status}  ${route}`);
}

// 中文注释：确认 404 行为正常（错误路径应返回 404，而不是 200 空页）
console.log('\n--- 404 行为检查 ---');
{
  const res = await fetch(base + '/does-not-exist.html');
  const ok = res.status === 404;
  if (!ok) failures++;
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${res.status}  /does-not-exist.html`);
}

server.close();
console.log(`\n结果：${failures === 0 ? '全部通过' : failures + ' 项失败'}`);
process.exit(failures === 0 ? 0 : 1);
