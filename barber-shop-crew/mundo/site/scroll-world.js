/*!
 * scroll-world.js — motor de vuelo con scroll, sin dependencias ni framework.
 *
 * Convierte un vuelo de cámara pre-renderizado (secuencia de fotogramas o vídeo)
 * en una experiencia controlada por el scroll: el visitante "pilota" la cámara
 * bajando la página, con pausas (holds) en cada escena para mostrar el texto.
 *
 * Uso (script clásico, sirve en cualquier stack):
 *   <script src="scroll-world.js"></script>
 *   // o, con bundler (Vite, Next, Astro…): import './scroll-world.js'
 *   // o, con CommonJS: const ScrollWorld = require('./scroll-world.js')
 *
 *   const world = ScrollWorld.mount(document.querySelector('[data-sw-root]'), {
 *     manifest: 'world/manifest.json',   // URL u objeto ya cargado
 *     mode: 'auto',                       // 'auto' | 'frames' | 'video'
 *     smoothing: 0.14,                    // 0 = sin inercia, 1 = inmediato
 *     onChapter: (index, chapter) => {}
 *   })
 *   world.destroy()
 *
 * Marcado mínimo:
 *   <section data-sw-root>
 *     <div data-sw-stage>            ← se queda fijo (sticky) mientras se hace scroll
 *       <canvas data-sw-canvas></canvas>
 *       <article data-sw-chapter="0">…</article>
 *     </div>
 *   </section>
 */
(function (global) {
  'use strict';

  var raf = global.requestAnimationFrame || function (f) { return setTimeout(function () { f(Date.now()); }, 16); };
  var caf = global.cancelAnimationFrame || clearTimeout;

  function loadManifest(src) {
    if (typeof src !== 'string') return Promise.resolve(src);
    return fetch(src).then(function (r) {
      if (!r.ok) throw new Error('scroll-world: no se pudo cargar ' + src + ' (' + r.status + ')');
      return r.json();
    }).then(function (m) { m.__base = src.replace(/[^/]*$/, ''); return m; });
  }

  function resolve(base, path) {
    if (!path || /^(https?:|data:|\/)/.test(path)) return path;
    return (base || '') + path;
  }

  function framePath(m, i) {
    var f = m.frames, n = String(i + (f.start || 0));
    while (n.length < (f.pad || 0)) n = '0' + n;
    return resolve(m.__base, f.pattern.replace('{i}', n));
  }

  /* Línea de tiempo: convierte la lista de segmentos en tramos de scroll. */
  function buildTimeline(m) {
    var segs = [], total = 0, chapterIdx = -1;
    (m.timeline || []).forEach(function (s) {
      var w = Math.max(0, +s.scroll || 0);
      var seg = { type: s.type, scroll: w, start: total, end: total + w, chapter: s.chapter };
      if (s.type === 'clip') { seg.from = +s.from; seg.to = +s.to; seg.id = s.id; }
      else { seg.from = seg.to = +s.at; }
      if (typeof s.chapter === 'number') chapterIdx = s.chapter;
      seg.activeChapter = chapterIdx;
      segs.push(seg);
      total += w;
    });
    return { segs: segs, total: total || 1 };
  }

  function frameAt(tl, u) {                      // u: 0..total (en "pantallas" de scroll)
    var segs = tl.segs;
    for (var i = 0; i < segs.length; i++) {
      var s = segs[i];
      if (u <= s.end || i === segs.length - 1) {
        var t = s.scroll ? Math.min(1, Math.max(0, (u - s.start) / s.scroll)) : 1;
        return { frame: s.from + (s.to - s.from) * t, seg: s, local: t, index: i };
      }
    }
    return { frame: 0, seg: segs[0], local: 0, index: 0 };
  }

  /* Orden de precarga: primero los fotogramas de pausa, luego pasadas cada vez más finas
     (cada 32, 16, 8…), así el scroll ya es usable con pocos fotogramas cargados. */
  function preloadOrder(count, priority) {
    var seen = new Uint8Array(count), out = [];
    function push(i) { i = Math.round(i); if (i >= 0 && i < count && !seen[i]) { seen[i] = 1; out.push(i); } }
    priority.forEach(push);
    for (var step = 32; step >= 1; step = step >> 1) for (var i = 0; i < count; i += step) push(i);
    return out;
  }

  function mount(root, opts) {
    opts = opts || {};
    if (!root) throw new Error('scroll-world: falta el elemento raíz');
    var stage = root.querySelector('[data-sw-stage]') || root;
    var canvas = root.querySelector('[data-sw-canvas]');
    if (!canvas) { canvas = document.createElement('canvas'); canvas.setAttribute('data-sw-canvas', ''); stage.prepend(canvas); }
    var ctx = canvas.getContext('2d');
    var chapters = Array.prototype.slice.call(root.querySelectorAll('[data-sw-chapter]'));
    var reduced = global.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var smoothing = reduced ? 1 : (opts.smoothing == null ? 0.14 : opts.smoothing);

    var state = {
      m: null, tl: null, images: [], loaded: 0, video: null, mode: null,
      target: 0, current: -1, drawn: -1, chapter: -2, rafId: 0, alive: true, w: 0, h: 0
    };

    root.classList.add('sw-loading');

    function sizeCanvas() {
      var dpr = Math.min(global.devicePixelRatio || 1, 2);
      var r = stage.getBoundingClientRect();
      state.w = Math.round(r.width * dpr); state.h = Math.round(r.height * dpr);
      canvas.width = state.w; canvas.height = state.h;
      state.drawn = -1;
    }

    function setRootHeight() {
      // Cada unidad de "scroll" del manifiesto = una altura de pantalla.
      root.style.height = (state.tl.total * 100 + 100) + 'vh';
    }

    function progressUnits() {
      var r = root.getBoundingClientRect();
      var range = r.height - global.innerHeight;
      var p = range > 0 ? Math.min(1, Math.max(0, -r.top / range)) : 0;
      root.style.setProperty('--sw-progress', p.toFixed(4));
      return p * state.tl.total;
    }

    function drawCover(src, sw, sh) {
      var s = Math.max(state.w / sw, state.h / sh);
      var dw = sw * s, dh = sh * s;
      ctx.drawImage(src, (state.w - dw) / 2, (state.h - dh) / 2, dw, dh);
    }

    function nearestLoaded(i) {
      var imgs = state.images;
      if (imgs[i] && imgs[i].__ok) return imgs[i];
      for (var d = 1; d < imgs.length; d++) {
        if (imgs[i - d] && imgs[i - d].__ok) return imgs[i - d];
        if (imgs[i + d] && imgs[i + d].__ok) return imgs[i + d];
      }
      return null;
    }

    function render(frame) {
      var count = state.m.frames ? state.m.frames.count : 0;
      var i = Math.round(frame);
      if (state.mode === 'frames') {
        i = Math.max(0, Math.min(count - 1, i));
        var img = nearestLoaded(i);
        if (!img) return;
        var key = i + ':' + img.__i;
        if (key === state.drawn) return;
        state.drawn = key;
        drawCover(img, img.naturalWidth, img.naturalHeight);
      } else if (state.video) {
        var v = state.video, fps = state.m.fps || 24;
        var t = Math.max(0, Math.min((v.duration || 0) - 0.001, frame / fps));
        if (!v.seeking && Math.abs(v.currentTime - t) > 0.5 / fps) v.currentTime = t;
        if (v.readyState >= 2) drawCover(v, v.videoWidth, v.videoHeight);
      }
    }

    function updateChapters(info) {
      var c = info.seg.type === 'hold' ? info.seg.chapter : -1;
      chapters.forEach(function (el) {
        var on = +el.getAttribute('data-sw-chapter') === c;
        el.classList.toggle('is-active', on);
        if (on) el.style.setProperty('--sw-chapter-progress', info.local.toFixed(3));
      });
      if (c !== state.chapter) {
        state.chapter = c;
        root.setAttribute('data-sw-current', c);
        if (c >= 0 && opts.onChapter) opts.onChapter(c, state.m.chapters ? state.m.chapters[c] : null);
      }
    }

    function tick() {
      if (!state.alive) return;
      var u = progressUnits();
      var info = frameAt(state.tl, u);
      state.target = info.frame;
      if (state.current < 0) state.current = state.target;
      state.current += (state.target - state.current) * smoothing;
      if (Math.abs(state.target - state.current) < 0.01) state.current = state.target;
      render(state.current);
      updateChapters(info);
      state.rafId = raf(tick);
    }

    function startFrames() {
      var m = state.m, count = m.frames.count;
      state.images = new Array(count);
      var holds = state.tl.segs.filter(function (s) { return s.type === 'hold'; }).map(function (s) { return s.from; });
      var order = preloadOrder(count, [0].concat(holds));
      var inflight = 0, next = 0, MAX = opts.concurrency || 6;
      function pump() {
        while (inflight < MAX && next < order.length && state.alive) {
          (function (i) {
            var img = new Image();
            img.decoding = 'async';
            img.__i = i;
            inflight++;
            img.onload = function () {
              img.__ok = true; state.loaded++; inflight--; state.drawn = -1;
              root.style.setProperty('--sw-loaded', (state.loaded / count).toFixed(3));
              if (state.loaded === 1) root.classList.remove('sw-loading');
              if (state.loaded === count) root.classList.add('sw-ready');
              pump();
            };
            img.onerror = function () { inflight--; pump(); };
            img.src = framePath(m, i);
            state.images[i] = img;
          })(order[next++]);
        }
      }
      pump();
    }

    function startVideo() {
      var v = document.createElement('video');
      v.muted = true; v.playsInline = true; v.preload = 'auto';
      v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
      v.src = resolve(state.m.__base, state.m.video.src);
      v.addEventListener('loadeddata', function () { root.classList.remove('sw-loading'); root.classList.add('sw-ready'); state.drawn = -1; });
      v.addEventListener('seeked', function () { state.drawn = -1; });
      state.video = v;
    }

    function pickMode(m) {
      var want = opts.mode || 'auto';
      if (want === 'frames' && m.frames) return 'frames';
      if (want === 'video' && m.video) return 'video';
      // Por defecto, fotogramas: el scrub es exacto en todos los navegadores (iOS incluido).
      // El vídeo se reserva para cuando no hay secuencia o se pide expresamente.
      return m.frames ? 'frames' : 'video';
    }

    var onResize = function () { sizeCanvas(); };

    loadManifest(opts.manifest || root.getAttribute('data-sw-manifest')).then(function (m) {
      if (!state.alive) return;
      state.m = m;
      state.tl = buildTimeline(m);
      state.mode = pickMode(m);
      root.setAttribute('data-sw-mode', state.mode);
      setRootHeight();
      sizeCanvas();
      global.addEventListener('resize', onResize);
      if (state.mode === 'frames') startFrames(); else startVideo();
      tick();
    }).catch(function (e) {
      root.classList.remove('sw-loading');
      root.classList.add('sw-error');
      if (global.console) console.error(e);
    });

    return {
      destroy: function () {
        state.alive = false;
        caf(state.rafId);
        global.removeEventListener('resize', onResize);
        if (state.video) { state.video.removeAttribute('src'); state.video.load(); }
        state.images = [];
        root.style.height = '';
      },
      /** Lleva el scroll hasta el capítulo indicado (para menús de navegación). */
      goToChapter: function (index, behavior) {
        if (!state.tl) return;
        var seg = state.tl.segs.filter(function (s) { return s.type === 'hold' && s.chapter === index; })[0];
        if (!seg) return;
        var r = root.getBoundingClientRect();
        var range = r.height - global.innerHeight;
        var y = global.scrollY + r.top + range * ((seg.start + seg.scroll * 0.35) / state.tl.total);
        global.scrollTo({ top: y, behavior: behavior || 'smooth' });
      },
      get state() { return state; }
    };
  }

  var api = { mount: mount, _buildTimeline: buildTimeline, _frameAt: frameAt, _preloadOrder: preloadOrder };
  global.ScrollWorld = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);

