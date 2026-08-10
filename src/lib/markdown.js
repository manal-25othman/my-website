/**
 * محلّل Markdown مصغّر  /  Minimal markdown + frontmatter parser
 * بلا أي اعتماديات خارجية — يغطي ما تحتاجه المقالات فقط.
 *
 * المدعوم:
 *   # ## ###           عناوين (## و ### تدخل في فهرس المحتوى)
 *   فقرات، **عريض**، *مائل*، `كود`، [نص](رابط)، ![بديل](صورة)
 *   - قوائم نقطية  ·  1. قوائم مرقّمة
 *   > اقتباس        ·  ```كتلة كود```  ·  ---  فاصل
 */

import { esc, slugify } from './html.js';

/* ── الواجهة الأمامية  /  Frontmatter ─────────────────────────────── */

function parseScalar(raw) {
  const v = raw.trim();
  if (v === '') return '';
  if (v === 'null' || v === '~') return null;
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (/^\[.*\]$/.test(v)) {
    const inner = v.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map((s) => parseScalar(s));
  }
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}

/** يفصل الواجهة الأمامية عن نص المقال */
export function parseFrontmatter(source) {
  const text = source.replace(/^﻿/, '');
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (!match) return { data: {}, body: text };

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const sep = line.indexOf(':');
    if (sep === -1) continue;
    data[line.slice(0, sep).trim()] = parseScalar(line.slice(sep + 1));
  }
  return { data, body: text.slice(match[0].length) };
}

/* ── التنسيق داخل السطر  /  Inline formatting ─────────────────────── */

function inline(text) {
  let out = esc(text);

  // `code`
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  // ![alt](src)
  out = out.replace(
    /!\[([^\]]*)\]\(([^)\s]+)\)/g,
    (_m, alt, src) => `<img src="${src}" alt="${alt}" loading="lazy" decoding="async">`
  );
  // [text](url) — الروابط الخارجية تُفتح في تبويب جديد بأمان
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label, url) => {
    const external = /^https?:\/\//i.test(url);
    const rel = external ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${url}"${rel}>${label}</a>`;
  });
  // **bold** ثم *italic*
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');

  return out;
}

/* ── المحلّل الرئيسي  /  Block parser ─────────────────────────────── */

/**
 * يحوّل Markdown إلى HTML ويستخرج فهرس المحتوى.
 * @returns {{ html: string, toc: Array<{id,text,level}>, words: number }}
 */
export function renderMarkdown(source) {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  const toc = [];
  const seen = new Map();
  let i = 0;
  let words = 0;

  const countWords = (s) => {
    words += (s.match(/[\p{L}\p{N}][\p{L}\p{N}'’_-]*/gu) || []).length;
  };

  const headingId = (text) => {
    let base = slugify(text) || 'section';
    const n = seen.get(base) || 0;
    seen.set(base, n + 1);
    return n === 0 ? base : `${base}-${n + 1}`;
  };

  while (i < lines.length) {
    const line = lines[i];

    /* سطر فارغ */
    if (!line.trim()) {
      i++;
      continue;
    }

    /* كتلة كود */
    if (/^```/.test(line)) {
      const lang = line.slice(3).trim();
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++; // تخطّي سطر الإغلاق
      const cls = lang ? ` class="language-${esc(lang)}"` : '';
      out.push(`<pre dir="ltr"><code${cls}>${esc(buf.join('\n'))}</code></pre>`);
      continue;
    }

    /* فاصل */
    if (/^(---|\*\*\*|___)\s*$/.test(line)) {
      out.push('<hr>');
      i++;
      continue;
    }

    /* عنوان */
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length;
      const text = h[2].trim();
      countWords(text);
      if (level === 2 || level === 3) {
        const id = headingId(text);
        toc.push({ id, text, level });
        out.push(`<h${level} id="${id}">${inline(text)}</h${level}>`);
      } else {
        out.push(`<h${level}>${inline(text)}</h${level}>`);
      }
      i++;
      continue;
    }

    /* اقتباس */
    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ''));
      countWords(buf.join(' '));
      out.push(`<blockquote><p>${inline(buf.join(' '))}</p></blockquote>`);
      continue;
    }

    /* قائمة نقطية */
    if (/^[-*+]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i])) {
        const item = lines[i++].replace(/^[-*+]\s+/, '');
        countWords(item);
        items.push(`<li>${inline(item)}</li>`);
      }
      out.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    /* قائمة مرقّمة */
    if (/^\d+[.)]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i])) {
        const item = lines[i++].replace(/^\d+[.)]\s+/, '');
        countWords(item);
        items.push(`<li>${inline(item)}</li>`);
      }
      out.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    /* فقرة */
    const buf = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,4}\s|>|[-*+]\s|\d+[.)]\s|```|---\s*$)/.test(lines[i])
    ) {
      buf.push(lines[i++]);
    }
    const paragraph = buf.join(' ').trim();
    countWords(paragraph);
    out.push(`<p>${inline(paragraph)}</p>`);
  }

  return { html: out.join('\n'), toc, words };
}

/** زمن القراءة بالدقائق (≈200 كلمة/دقيقة، بحد أدنى دقيقة واحدة) */
export function readingTime(words) {
  return Math.max(1, Math.round(words / 200));
}

/** نص عادي مختصر من Markdown — يُستخدم في وصف SEO عند غياب description */
export function plainExcerpt(source, max = 160) {
  const text = source
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,4}\s+.*$/gm, ' ')
    .replace(/[>*_`#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(' ', max)).trim() + '…';
}
