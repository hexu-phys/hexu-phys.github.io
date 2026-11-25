// 中文注释：
// 全站唯一的脚本文件，刻意保持极简。只做两件事：
//   1) 给带 data-copy-target 的按钮实现"复制文本"（用于复制联系方式等纯文本）；
//   2) 给导航做一次渐进增强的当前页标记（HTML 里已静态写好 aria-current，
//      这里只是兜底：万一新增页面漏写属性，脚本会按路径自动补上）。
// 硬性约束：
//   - 没有 JS 时页面必须完全可用（所以复制按钮旁边永远有可手动选择的 <pre> 文本）。
//   - 不使用内联 onclick，不使用 document.write。
//   - 不使用 fetch/XHR（file:// 下会因 CORS 失败），所有逻辑纯 DOM。
(function () {
  'use strict';

  // 中文注释：把相对路径归一化，便于比较导航链接与当前页面路径
  function normalizePath(path) {
    var parts = path.split('/');
    var stack = [];
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      if (part === '' && i !== 0) { continue; }
      if (part === '.') { continue; }
      if (part === '..') { stack.pop(); continue; }
      stack.push(part);
    }
    return stack.join('/');
  }

  // 中文注释：当前页面所在目录（file:// 与 http:// 下都用 pathname 计算）
  function currentDir() {
    var p = window.location.pathname;
    // 中文注释：目录形式的 URL（以 / 结尾）直接就是目录，否则去掉文件名
    return p.charAt(p.length - 1) === '/' ? p : p.replace(/[^/]*$/, '');
  }

  // 中文注释：
  // 导航当前页高亮兜底。用 querySelector 拿不到 http 下的相对解析时，
  // 通过 new URL(link.href).pathname 与当前路径做前缀比较。
  function markCurrentNav() {
    var links = document.querySelectorAll('nav.site-nav a');
    if (!links.length) { return; }

    var here = currentDir();
    var best = null;
    var bestLen = -1;

    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      if (link.hasAttribute('aria-current')) { return; } // 中文注释：静态标记已存在，不重复处理
      var abs;
      try {
        abs = new URL(link.getAttribute('href'), window.location.href).pathname;
      } catch (err) {
        continue;
      }
      var targetDir = abs.charAt(abs.length - 1) === '/' ? abs : abs.replace(/[^/]*$/, '');
      if (normalizePath(targetDir) === normalizePath(here) && targetDir.length > bestLen) {
        best = link;
        bestLen = targetDir.length;
      }
    }

    // 中文注释：根目录首页要单独处理（导航 Home 指向 index.html 或 ./）
    if (!best) {
      for (var j = 0; j < links.length; j++) {
        var href = links[j].getAttribute('href');
        if (/^(\.\/)?index\.html$/.test(href) && normalizePath(here) === normalizePath(currentDir())) {
          var isRoot = normalizePath(here) === '/' || normalizePath(here) === '';
          if (isRoot) { best = links[j]; }
        }
      }
    }

    if (best) { best.setAttribute('aria-current', 'page'); }
  }

  // 中文注释：
  // 复制按钮：<button class="btn" data-copy-target="#some-id">Copy</button>
  // 目标元素的 textContent 会被复制到剪贴板；成功后按钮文字临时变为 "Copied"。
  // 剪贴板 API 在 file:// 或非安全上下文可能不可用，此时用 execCommand 兜底，
  // 两者都失败就只提示用户手动选择文本——页面功能不受影响。
  function wireCopyButtons() {
    var buttons = document.querySelectorAll('[data-copy-target]');
    if (!buttons.length) { return; }

    function copyText(text) {
      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
      }
      return new Promise(function (resolve, reject) {
        try {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', 'readonly');
          ta.style.position = 'fixed';
          ta.style.top = '-1000px';
          document.body.appendChild(ta);
          ta.select();
          var ok = document.execCommand('copy');
          document.body.removeChild(ta);
          ok ? resolve() : reject(new Error('execCommand failed'));
        } catch (err) {
          reject(err);
        }
      });
    }

    for (var i = 0; i < buttons.length; i++) {
      (function (button) {
        var original = button.textContent;
        button.addEventListener('click', function () {
          var target = document.querySelector(button.getAttribute('data-copy-target'));
          if (!target) { return; }
          copyText(target.textContent.trim()).then(function () {
            button.textContent = 'Copied';
            window.setTimeout(function () { button.textContent = original; }, 1600);
          }).catch(function () {
            button.textContent = 'Select and copy manually';
            window.setTimeout(function () { button.textContent = original; }, 2400);
          });
        });
      })(buttons[i]);
    }
  }

  // 中文注释：脚本放在 </body> 前，DOM 基本已就绪，但仍做一次防御性判断
  function init() {
    markCurrentNav();
    wireCopyButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
