/**
 * مُولّد PNG بسيط  /  Tiny PNG encoder (zlib is built into Node — no deps)
 * يُستخدم لتوليد صور افتراضية: صورة المشاركة وأيقونة التطبيق.
 */

import zlib from 'node:zlib';

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/**
 * يبني PNG بحجم width×height باستخدام دالة لون لكل بكسل.
 * @param {number} width
 * @param {number} height
 * @param {(x:number,y:number)=>[number,number,number]} shade
 */
export function makePng(width, height, shade) {
  const raw = Buffer.alloc(height * (width * 3 + 1));
  let o = 0;
  for (let y = 0; y < height; y++) {
    raw[o++] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const [r, g, b] = shade(x, y);
      raw[o++] = r & 255;
      raw[o++] = g & 255;
      raw[o++] = b & 255;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const mix = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t));

/** صورة المشاركة الافتراضية 1200×630 — تُستبدل بصورة حقيقية لاحقاً */
export function ogCover(width = 1200, height = 630) {
  const cx = width * 0.72;
  const cy = height * 0.28;
  const maxR = Math.hypot(width, height) * 0.55;

  return makePng(width, height, (x, y) => {
    const t = y / height;
    let r = mix(11, 16, t);
    let g = mix(13, 19, t);
    let b = mix(18, 27, t);

    // توهج بلون التمييز
    const d = Math.hypot(x - cx, y - cy) / maxR;
    const glow = Math.max(0, 1 - d) ** 2.2;
    r = mix(r, 47, glow * 0.85);
    g = mix(g, 111, glow * 0.85);
    b = mix(b, 235, glow * 0.85);

    // شبكة خفيفة
    if (x % 60 === 0 || y % 60 === 0) {
      r += 6;
      g += 7;
      b += 10;
    }

    // شريط التمييز أسفل الصورة
    if (y > height - 10) return [47, 111, 235];

    return [r, g, b];
  });
}

/**
 * صورة شخصية افتراضية — رمادية محايدة بنقش مائل يوضّح أنها عنصر نائب.
 * استبدل الملف بصورتك الحقيقية بنفس الاسم.
 */
export function photoPlaceholder(size = 800) {
  const headR = size * 0.155;
  const headY = size * 0.4;
  const bodyR = size * 0.3;
  const bodyY = size * 0.96;

  return makePng(size, size, (x, y) => {
    const t = (x / size + y / size) / 2;
    let v = mix(232, 214, t);
    let r = v, g = v + 1, b = v + 4;

    // نقش مائل خفيف يدل على أنها صورة مؤقتة
    if ((x + y) % 26 < 2) { r -= 8; g -= 8; b -= 8; }

    // ظل شخص مبسّط
    const inHead = Math.hypot(x - size / 2, y - headY) < headR;
    const inBody = Math.hypot((x - size / 2) / 1.32, y - bodyY) < bodyR;
    if (inHead || inBody) { r = mix(r, 176, 0.75); g = mix(g, 182, 0.75); b = mix(b, 194, 0.75); }

    return [r, g, b];
  });
}

/** غلاف كتاب افتراضي داكن — يُستبدل بالغلاف الحقيقي */
export function bookPlaceholder(width = 400, height = 600) {
  return makePng(width, height, (x, y) => {
    const t = (x / width) * 0.5 + (y / height) * 0.5;
    let r = mix(32, 13, t);
    let g = mix(39, 16, t);
    let b = mix(55, 23, t);
    if (y < 5) return [47, 111, 235]; // شريط التمييز أعلى الغلاف
    if ((x - y) % 34 < 1) { r += 6; g += 7; b += 10; }
    return [r, g, b];
  });
}

/** أيقونة تطبيق مربعة بلون التمييز */
export function appIcon(size = 180) {
  const c = size / 2;
  return makePng(size, size, (x, y) => {
    const d = Math.hypot(x - c, y - c) / (size * 0.75);
    const t = (x + y) / (size * 2);
    const r = mix(mix(16, 47, t), 12, d);
    const g = mix(mix(19, 111, t), 14, d);
    const b = mix(mix(27, 235, t), 20, d);
    return [r, g, b];
  });
}
