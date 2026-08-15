/* ═════════════════════════════════════════════════════════════════════════
   سكربت الموقع  /  Site behaviour — vanilla JS, no dependencies
   ═════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var doc = document;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, root) { return (root || doc).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); };

  /* ── 1 · المظهر  /  Theme ─────────────────────────────────────── */
  function initTheme() {
    var btn = $('[data-theme-toggle]');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = doc.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      doc.documentElement.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) { /* التخزين معطّل */ }
    });
  }

  /* ── 2 · الترويسة اللاصقة  /  Sticky header ───────────────────── */
  function initHeader() {
    var head = $('[data-header]');
    if (!head) return;
    var onScroll = function () { head.classList.toggle('is-stuck', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── 3 · القائمة الجانبية  /  Drawer ──────────────────────────── */
  function initDrawer() {
    var drawer = $('#drawer');
    var openBtn = $('[data-drawer-open]');
    if (!drawer || !openBtn) return;
    var lastFocus = null;

    function open() {
      lastFocus = doc.activeElement;
      drawer.hidden = false;
      openBtn.setAttribute('aria-expanded', 'true');
      doc.body.style.overflow = 'hidden';
      var first = $('[data-drawer-close]', drawer);
      if (first) first.focus();
    }
    function close() {
      drawer.hidden = true;
      openBtn.setAttribute('aria-expanded', 'false');
      doc.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    openBtn.addEventListener('click', open);
    $$('[data-drawer-close]', drawer).forEach(function (b) { b.addEventListener('click', close); });
    drawer.addEventListener('click', function (e) { if (e.target === drawer) close(); });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !drawer.hidden) close();
      if (e.key !== 'Tab' || drawer.hidden) return;
      // حصر التركيز داخل القائمة
      var items = $$('a[href], button:not([disabled])', drawer);
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    $$('a', drawer).forEach(function (a) { a.addEventListener('click', close); });
  }

  /* ── 4 · ظهور العناصر عند التمرير  /  Reveal on scroll ────────── */
  function initReveal() {
    var items = $$('.reveal');
    if (!items.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ── 5 · عدّادات الأرقام  /  Animated counters ────────────────── */
  function initCounters() {
    var nodes = $$('[data-count]');
    if (!nodes.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        var out = entry.target.querySelector('.stat__num');
        var target = parseFloat(entry.target.getAttribute('data-count'));
        if (!out || isNaN(target)) return;
        var start = performance.now();
        var dur = 1000;
        (function step(now) {
          var t = Math.min(1, (now - start) / dur);
          var eased = 1 - Math.pow(1 - t, 3);
          out.textContent = String(Math.round(target * eased));
          if (t < 1) requestAnimationFrame(step);
          else out.textContent = String(target);
        })(start);
      });
    }, { threshold: 0.4 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ── 6 · الأقسام القابلة للتوسيع  /  Expandables ──────────────── */
  function initExpanders() {
    $$('[data-expand]').forEach(function (btn) {
      var panel = btn.getAttribute('aria-controls')
        ? doc.getElementById(btn.getAttribute('aria-controls'))
        : btn.parentElement.querySelector('[data-expandable]');
      if (!panel) return;
      var label = btn.querySelector('span') || btn;
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        panel.hidden = open;
        var text = open ? btn.getAttribute('data-more') : btn.getAttribute('data-less');
        if (text) {
          var svg = btn.querySelector('svg');
          btn.textContent = text;
          if (svg) btn.appendChild(svg);
        }
      });
    });
  }

  /* ── 7 · البحث والفلاتر  /  Search & filters ──────────────────── */
  function initFilters() {
    $$('[data-filters]').forEach(function (bar) {
      var scope = bar.parentElement;
      var list = $('[data-filter-list]', scope);
      if (!list) return;
      var items = $$('[data-item]', list);
      var input = $('[data-search-input]', bar);
      var chips = $$('[data-filter]', bar);
      var empty = $('[data-empty]', scope);
      var counter = $('[data-count-out]', bar);
      var active = 'all';

      function apply() {
        var q = (input && input.value || '').trim().toLowerCase();
        var shown = 0;
        items.forEach(function (item) {
          var okCat = active === 'all' || item.getAttribute('data-category') === active;
          var okText = !q || (item.getAttribute('data-search') || '').indexOf(q) !== -1;
          var show = okCat && okText;
          item.hidden = !show;
          if (show) shown++;
        });
        if (empty) empty.hidden = shown !== 0;
        if (counter) counter.textContent = String(shown);
      }

      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          chips.forEach(function (c) { c.classList.remove('is-active'); });
          chip.classList.add('is-active');
          active = chip.getAttribute('data-filter');
          apply();
        });
      });

      if (input) {
        var timer;
        input.addEventListener('input', function () {
          clearTimeout(timer);
          timer = setTimeout(apply, 120);
        });
      }
    });
  }

  /* ── 8 · نسخ الرابط  /  Copy link ─────────────────────────────── */
  function initCopy() {
    $$('[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var value = btn.getAttribute('data-copy');
        var done = function () {
          btn.classList.add('is-copied');
          btn.setAttribute('title', btn.getAttribute('data-copied') || '');
          setTimeout(function () { btn.classList.remove('is-copied'); }, 1800);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(value).then(done).catch(function () {});
        } else {
          var ta = doc.createElement('textarea');
          ta.value = value;
          doc.body.appendChild(ta);
          ta.select();
          try { doc.execCommand('copy'); done(); } catch (e) { /* غير مدعوم */ }
          doc.body.removeChild(ta);
        }
      });
    });
  }

  /* ── 9 · تتبّع العنوان النشط في فهرس المقال  /  TOC scrollspy ─── */
  function initToc() {
    var toc = $('.toc');
    if (!toc || !('IntersectionObserver' in window)) return;
    var links = $$('a', toc);
    var map = {};
    var heads = links
      .map(function (a) {
        var id = decodeURIComponent(a.getAttribute('href') || '').slice(1);
        var el = id && doc.getElementById(id);
        if (el) map[id] = a;
        return el;
      })
      .filter(Boolean);
    if (!heads.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('is-active'); });
        var a = map[entry.target.id];
        if (a) a.classList.add('is-active');
      });
    }, { rootMargin: '-90px 0px -70% 0px', threshold: 0 });
    heads.forEach(function (h) { io.observe(h); });
  }

  /* ── 10 · تضمين مقاطع TikTok عند الطلب  /  Lazy TikTok embeds ── */
  function initTikTok() {
    var scriptLoaded = false;
    function loadScript() {
      if (scriptLoaded) return;
      scriptLoaded = true;
      var s = doc.createElement('script');
      s.src = 'https://www.tiktok.com/embed.js';
      s.async = true;
      doc.body.appendChild(s);
    }

    $$('[data-tiktok-load]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var frame = btn.closest('[data-tiktok]');
        if (!frame) return;
        var id = frame.getAttribute('data-tiktok');
        var url = frame.getAttribute('data-url');
        frame.innerHTML =
          '<blockquote class="tiktok-embed" cite="' + url + '" data-video-id="' + id + '">' +
          '<section></section></blockquote>';
        loadScript();
        if (window.tiktokEmbed && window.tiktokEmbed.lib) window.tiktokEmbed.lib.render([frame]);
      });
    });
  }

  /* ── 11 · نموذج التواصل  /  Contact form ──────────────────────── */
  function initForm() {
    var form = $('[data-contact-form]');
    if (!form) return;

    var msgs = form.querySelector('.cform__msgs');
    var status = $('[data-status]', form);
    var ts = form.querySelector('input[name="_ts"]');
    if (ts) ts.value = String(Date.now());

    var text = function (key) { return msgs ? msgs.getAttribute('data-msg-' + key) || '' : ''; };

    function setError(field, message) {
      var wrap = field.closest('.field');
      var slot = wrap && wrap.querySelector('[data-err]');
      if (slot) slot.textContent = message || '';
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
      return !message;
    }

    function validate() {
      var ok = true;
      var name = form.elements.name;
      var email = form.elements.email;
      var subject = form.elements.subject;
      var message = form.elements.message;

      ok = setError(name, name.value.trim() ? '' : text('required')) && ok;
      ok = setError(subject, subject.value.trim() ? '' : text('required')) && ok;
      ok =
        setError(
          email,
          !email.value.trim()
            ? text('required')
            : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())
              ? ''
              : text('email')
        ) && ok;
      ok =
        setError(
          message,
          !message.value.trim() ? text('required') : message.value.trim().length < 20 ? text('short') : ''
        ) && ok;
      return ok;
    }

    function say(message, kind) {
      if (!status) return;
      status.textContent = message;
      status.className = 'cform__status' + (kind ? ' is-' + kind : '');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      /* التحقق من المدخلات أولاً حتى يرى الزائر أخطاءه دائماً */
      if (!validate()) return;

      /* حماية من السبام (1): الحقل الخفي — لا يملؤه إلا برنامج آلي.
         نُظهر رسالة نجاح دون إرسال شيء حتى لا يتعلّم الـbot أنه كُشف. */
      var hp = form.elements.company;
      if (hp && hp.value) {
        say(text('success'), 'ok');
        form.reset();
        if (ts) ts.value = String(Date.now());
        return;
      }

      /* حماية من السبام (2): الإرسال الفوري (أقل من ثانيتين ونصف) يُؤخَّر
         بدل رفضه — لا يخسر الزائر الحقيقي رسالته، ويُبطَّأ الإرسال الآلي. */
      var elapsed = ts ? Date.now() - Number(ts.value || 0) : 99999;
      if (elapsed < 2500) {
        say(text('sending'));
        setTimeout(function () { send(); }, 2500 - elapsed);
        return;
      }
      send();
    });

    function send() {
      var data = {
        name: form.elements.name.value.trim().slice(0, 120),
        email: form.elements.email.value.trim().slice(0, 180),
        subject: form.elements.subject.value.trim().slice(0, 160),
        message: form.elements.message.value.trim().slice(0, 4000),
      };

      track('contact_submit', form.getAttribute('data-mode'));

      var mode = form.getAttribute('data-mode');
      var endpoint = form.getAttribute('data-endpoint');

      if (mode === 'endpoint' && endpoint) {
        say(text('sending'));
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        })
          .then(function (r) {
            if (!r.ok) throw new Error('bad response');
            say(text('success'), 'ok');
            form.reset();
            if (ts) ts.value = String(Date.now());
          })
          .catch(function () { say(text('error'), 'err'); });
        return;
      }

      /* الوضع الافتراضي: فتح برنامج البريد لدى الزائر */
      var to = form.getAttribute('data-email') || '';
      var body = data.message + '\n\n— ' + data.name + ' <' + data.email + '>';
      var url =
        'mailto:' + encodeURIComponent(to) +
        '?subject=' + encodeURIComponent(data.subject) +
        '&body=' + encodeURIComponent(body);
      window.location.href = url;
      say(text('success'), 'ok');
    }
  }

  /* ── 12 · زر الطباعة (الملف التعريفي → PDF) ───────────────────── */
  function initPrint() {
    $$('[data-print]').forEach(function (b) {
      b.addEventListener('click', function () { window.print(); });
    });
  }

  /* ── 13 · التحليلات  /  Analytics (تعمل فقط عند ضبط المعرّفات) ─ */
  var analytics = { ga: null, tiktokPixel: null, respectDnt: true, on: false };

  function initAnalytics() {
    var node = doc.getElementById('analytics-config');
    if (!node) return;
    try { analytics = Object.assign(analytics, JSON.parse(node.textContent)); } catch (e) { return; }

    var dnt = navigator.doNotTrack === '1' || window.doNotTrack === '1';
    if (analytics.respectDnt && dnt) return;
    if (!analytics.ga && !analytics.tiktokPixel) return;
    analytics.on = true;

    if (analytics.ga) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', analytics.ga);
    }

    if (analytics.tiktokPixel) {
      /* TikTok Pixel — يُحمَّل فقط عند ضبط المعرّف في الإعدادات */
      var s = doc.createElement('script');
      s.async = true;
      s.src = 'https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=' + analytics.tiktokPixel + '&lib=ttq';
      doc.head.appendChild(s);
    }

    /* أحداث مُتتبَّعة: النقر على الروابط الاجتماعية والأدوات ومقاطع TikTok */
    doc.addEventListener('click', function (e) {
      var el = e.target.closest('[data-track]');
      if (!el) return;
      track(el.getAttribute('data-track'), el.getAttribute('data-track-label') || el.textContent.trim().slice(0, 60));
    });

    var view = doc.querySelector('[data-track="article_view"]');
    if (view) track('article_view', view.getAttribute('data-track-label'));

    initScrollDepth();
    initOutbound();
  }

  /* عمق القراءة — يفرّق بين قارئ فعلي وزيارة عابرة.
     كل عتبة تُرسَل مرة واحدة فقط في الصفحة. */
  function initScrollDepth() {
    var el = doc.querySelector('[data-scroll-depth]');
    if (!el || !('IntersectionObserver' in window)) return;
    var label = el.getAttribute('data-track-label') || location.pathname;
    var sent = {};

    [25, 50, 75, 100].forEach(function (pct) {
      var marker = doc.createElement('span');
      marker.setAttribute('aria-hidden', 'true');
      marker.style.cssText = 'position:absolute;width:1px;height:1px;pointer-events:none';
      marker.style.top = pct + '%';
      el.appendChild(marker);

      new IntersectionObserver(function (entries, obs) {
        if (!entries[0].isIntersecting || sent[pct]) return;
        sent[pct] = true;
        track('scroll_depth', label + ' — ' + pct + '%');
        obs.disconnect();
      }).observe(marker);
    });
  }

  /* النقرات الخارجة — تكشف إلى أين يذهب القارئ بعد المقال */
  function initOutbound() {
    doc.addEventListener('click', function (e) {
      var a = e.target.closest('a[target="_blank"]');
      if (!a || a.hasAttribute('data-track')) return; /* المتتبَّع مسبقاً لا يُكرَّر */
      var host = '';
      try { host = new URL(a.href, location.href).hostname; } catch (err) { return; }
      if (!host || host === location.hostname) return;
      track('outbound_click', host);
    });
  }

  function track(event, label) {
    if (!analytics.on || !event) return;
    if (window.gtag) window.gtag('event', event, { event_label: label || undefined });
    if (window.ttq && typeof window.ttq.track === 'function') window.ttq.track(event, { label: label });
  }

  /* ── تشغيل  /  Boot ───────────────────────────────────────────── */
  function boot() {
    initTheme();
    initHeader();
    initDrawer();
    initReveal();
    initCounters();
    initExpanders();
    initFilters();
    initCopy();
    initToc();
    initTikTok();
    initForm();
    initPrint();
    initAnalytics();
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
