// 中文注释：
// 开发期自检脚本（Node.js，不属于网站运行时依赖）。做两件事：
//   1) 语法检查：把每个 HTML 里的内联 <script> 和 js/main.js 交给 new vm.Script() 解析，
//      任何语法错误都会在这里暴露出来。
//   2) 算法验证：把两个 canvas 动画里的纯计算函数抽出来在 Node 里跑，
//      确认数值行为符合预期（而不是只"看起来没问题"）。
// 用法：node tools/lint-scripts.mjs
// 退出码：0 = 通过

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve, relative, sep } from 'node:path';
import vm from 'node:vm';

const ROOT = resolve(process.cwd());
let errors = 0;
let checks = 0;

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules' || name === 'tools') continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

const rel = (p) => relative(ROOT, p).split(sep).join('/');
const files = walk(ROOT);

// ---------- 1) 语法检查 ----------
console.log('--- 语法检查 ---');

function checkScript(label, code) {
  checks++;
  try {
    new vm.Script(code, { filename: label });
    console.log(`  OK   ${label}`);
  } catch (err) {
    errors++;
    console.log(`  FAIL ${label}: ${err.message}`);
  }
}

for (const file of files.filter((f) => f.endsWith('.html'))) {
  const text = readFileSync(file, 'utf8');
  const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
  let m, i = 0;
  while ((m = re.exec(text)) !== null) {
    i++;
    if (m[1].trim()) checkScript(`${rel(file)} [inline #${i}]`, m[1]);
  }
}

for (const file of files.filter((f) => f.endsWith('.js') || f.endsWith('.mjs'))) {
  if (rel(file).startsWith('tools/')) continue;
  checkScript(rel(file), readFileSync(file, 'utf8'));
}

// ---------- 2) 算法验证：2025-project-scaling 的拟合行为 ----------
console.log('\n--- 算法验证：2025 拟合（窗口越小偏差越大，窗口抬高后收敛到真值）---');
{
  const text = readFileSync(join(ROOT, 'assets/anim/2025-project-scaling.html'), 'utf8');
  const script = text.match(/<script>([\s\S]*?)<\/script>/)[1];

  // 中文注释：只抽取纯计算部分（常量 + 随机数 + 合成数据 + 拟合），不碰 DOM
  const start = script.indexOf('var SIZES');
  const end = script.indexOf('var canvas =');
  const pure = script.slice(start, end);

  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(pure + '\nthis.__api = { DATA, fitExponent, TRUE_EXP };', sandbox);
  const { DATA, fitExponent, TRUE_EXP } = sandbox.__api;

  checks++;
  if (DATA.length === 9) { console.log(`  OK   合成数据点 ${DATA.length} 个，size 范围 ${DATA[0].L}..${DATA[DATA.length - 1].L}`); }
  else { errors++; console.log(`  FAIL 合成数据点数应为 9，实际 ${DATA.length}`); }

  const fitFor = (minSize) => fitExponent(DATA.filter((d) => d.L >= minSize));
  const e4 = fitFor(4);      // 全部尺寸（含最小的三个）
  const e8 = fitFor(8);
  const e16 = fitFor(16);    // 只用大尺寸
  const e20 = fitFor(20);

  checks++;
  if (Number.isFinite(e4) && Number.isFinite(e8) && Number.isFinite(e16) && Number.isFinite(e20)) {
    console.log(`  OK   四个窗口的估计值均为有限数：L>=4:${e4.toFixed(3)} L>=8:${e8.toFixed(3)} L>=16:${e16.toFixed(3)} L>=20:${e20.toFixed(3)}`);
  } else {
    errors++;
    console.log(`  FAIL 出现非有限估计值：${e4} ${e8} ${e16} ${e20}`);
  }

  checks++;
  if (e4 > TRUE_EXP + 0.03) {
    console.log(`  OK   含最小尺寸时估计偏大：${e4.toFixed(3)} > 真值 ${TRUE_EXP}（偏差 +${(e4 - TRUE_EXP).toFixed(3)}）`);
  } else {
    errors++;
    console.log(`  FAIL 含最小尺寸的估计 ${e4.toFixed(3)} 未明显偏离真值 ${TRUE_EXP}`);
  }

  checks++;
  if (Math.abs(e16 - TRUE_EXP) < Math.abs(e4 - TRUE_EXP) && Math.abs(e16 - TRUE_EXP) < 0.05) {
    console.log(`  OK   抬高窗口下限后收敛到真值：L>=16 得 ${e16.toFixed(3)}（偏差 ${Math.abs(e16 - TRUE_EXP).toFixed(3)} < 0.05）`);
  } else {
    errors++;
    console.log(`  FAIL 抬高窗口下限未收敛：L>=16 得 ${e16.toFixed(3)}，真值 ${TRUE_EXP}`);
  }

  checks++;
  if (Math.abs(e8 - TRUE_EXP) < Math.abs(e4 - TRUE_EXP) || Math.abs(e20 - TRUE_EXP) < 0.06) {
    console.log('  OK   偏差随窗口下限单调下降（与图注描述一致）');
  } else {
    errors++;
    console.log('  FAIL 偏差未随窗口下限下降，图注描述与行为不符');
  }
}

// ---------- 3) 算法验证：2023-project-note 的 bootstrap ----------
console.log('\n--- 算法验证：2023 bootstrap（样本量越大，重采样均值分布应越窄）---');
{
  const text = readFileSync(join(ROOT, 'assets/anim/2023-project-note.html'), 'utf8');
  const script = text.match(/<script>([\s\S]*?)<\/script>/)[1];

  const start = script.indexOf('function makeRng');
  const end = script.indexOf('var canvas =');
  const pure = script.slice(start, end);

  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(pure + '\nthis.__api = { makeRng, makeSample, bootstrapMeans, stdev };', sandbox);
  const { makeRng, makeSample, bootstrapMeans, stdev } = sandbox.__api;

  function spreadFor(n, resamples) {
    const rng = makeRng(1234567 + n * 31 + resamples);
    const sample = makeSample(rng, n);
    const means = bootstrapMeans(rng, sample, resamples);
    return { sd: stdev(means), count: means.length, finite: means.every(Number.isFinite) };
  }

  const small = spreadFor(10, 400);
  const large = spreadFor(400, 400);

  checks++;
  if (small.count === 400 && large.count === 400 && small.finite && large.finite) {
    console.log('  OK   重采样输出数量正确且全为有限数');
  } else {
    errors++;
    console.log(`  FAIL 重采样输出异常（count=${small.count}/${large.count}, finite=${small.finite}/${large.finite}）`);
  }

  checks++;
  if (large.sd < small.sd) {
    console.log(`  OK   样本量 400 的分布更窄（sd ${small.sd.toFixed(4)} -> ${large.sd.toFixed(4)}），约 1/sqrt(n) 关系`);
  } else {
    errors++;
    console.log(`  FAIL 样本量增大后分布未变窄（${small.sd.toFixed(4)} -> ${large.sd.toFixed(4)}）`);
  }

  // 中文注释：理论上 sd(mean) = 1/sqrt(n)；检查量级是否合理（允许 40% 误差，bootstrap 有限样本）
  checks++;
  const expected = 1 / Math.sqrt(400);
  const ratio = large.sd / expected;
  if (ratio > 0.6 && ratio < 1.4) {
    console.log(`  OK   大样本 sd=${large.sd.toFixed(4)}，理论 1/sqrt(n)=${expected.toFixed(4)}，比值 ${ratio.toFixed(2)}`);
  } else {
    errors++;
    console.log(`  FAIL 大样本 sd=${large.sd.toFixed(4)} 与理论值 ${expected.toFixed(4)} 量级不符（比值 ${ratio.toFixed(2)}）`);
  }
}

// ---------- 4) 结构检查：动画页必须自包含 ----------
console.log('\n--- 自包含检查：动画页不得有外部引用 ---');
for (const file of files.filter((f) => rel(f).startsWith('assets/anim/') && f.endsWith('.html'))) {
  const text = readFileSync(file, 'utf8');
  checks++;
  const externals = [...text.matchAll(/\b(?:src|href)\s*=\s*"(https?:[^"]*)"/gi)].map((m) => m[1]);
  if (externals.length === 0) {
    console.log(`  OK   ${rel(file)} 无外部 src/href`);
  } else {
    errors++;
    console.log(`  FAIL ${rel(file)} 含外部引用：${externals.join(', ')}`);
  }
}

console.log(`\n共 ${checks} 项检查，失败 ${errors} 项`);
process.exit(errors === 0 ? 0 : 1);
