/* =========================================================
   La Cazuela de Manuela · interacciones y animaciones
   GSAP + ScrollTrigger + SplitText + Lenis
   ========================================================= */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined';

  /* ---------- Logo (cazuela) ---------- */
  const LOGO = `<svg viewBox="0 0 48 48" aria-hidden="true">
    <circle cx="24" cy="24" r="23" fill="#b8532a"/>
    <path d="M17 13c-2-3 2-4 0-7M24 12c-2-3 2-4 0-7M31 13c-2-3 2-4 0-7" fill="none" stroke="#fbf5ea" stroke-width="2" stroke-linecap="round"/>
    <path d="M10 21h28c0 9-6 15-14 15S10 30 10 21z" fill="#fbf5ea"/>
    <rect x="8" y="18" width="32" height="5" rx="2.5" fill="#e9a23b"/>
    <circle cx="18" cy="28" r="1.6" fill="#b8532a"/><circle cx="24" cy="30" r="1.6" fill="#b8532a"/><circle cx="30" cy="28" r="1.6" fill="#b8532a"/>
  </svg>`;
  $$('[data-logo]').forEach(el => (el.innerHTML = LOGO));
  $('#year').textContent = new Date().getFullYear();

  /* ---------- Viernes de arroz ---------- */
  const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const today = new Date().getDay();               // 0 = domingo
  const weekIdx = (today + 6) % 7;                 // 0 = lunes
  const weekEls = $$('#week span');
  if (weekEls[weekIdx]) weekEls[weekIdx].classList.add('is-today');
  const daysToFri = (5 - today + 7) % 7;
  $('#riceCount').textContent =
    daysToFri === 0 ? '¡Hoy es viernes: hay arroz!' :
    daysToFri === 1 ? 'Mañana es viernes: mañana hay arroz.' :
    `Hoy es ${DAYS[today]}. Faltan ${daysToFri} días para el arroz.`;

  /* ---------- Ticker de la cabecera ---------- */
  const tickerMsgs = [
    'Menú del día · 12 € con todo',
    'Los viernes, arroz',
    'Comer allí · para llevar · a domicilio',
    'Casero y recién hecho'
  ];
  const ticker = $('#ticker');
  let tickI = 0;
  setInterval(() => {
    tickI = (tickI + 1) % tickerMsgs.length;
    if (hasGsap && !reduced) {
      gsap.to(ticker, { yPercent: -100, opacity: 0, duration: .3, onComplete: () => {
        ticker.textContent = tickerMsgs[tickI];
        gsap.fromTo(ticker, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .3 });
      }});
    } else {
      ticker.textContent = tickerMsgs[tickI];
    }
  }, 3500);

  /* ---------- Cabecera al hacer scroll ---------- */
  const bar = $('#top-bar');
  const onScroll = () => bar.classList.toggle('is-scrolled', window.scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Tendedero: arrastrar con el ratón ---------- */
  const track = $('#lineTrack');
  let dragX = null, startScroll = 0;
  track.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse') return;
    dragX = e.clientX; startScroll = track.scrollLeft;
    track.classList.add('is-dragging');
  });
  addEventListener('pointermove', e => {
    if (dragX === null) return;
    track.scrollLeft = startScroll - (e.clientX - dragX);
  });
  addEventListener('pointerup', () => { dragX = null; track.classList.remove('is-dragging'); });

  /* ---------- Menú de azulejos ---------- */
  const menu = $('#menu');
  const burger = $('#burger');
  const tilesWrap = $('#menuTiles');
  let tiles = [];
  const buildTiles = () => {
    const size = innerWidth < 640 ? 70 : 110;
    const cols = Math.ceil(innerWidth / size);
    const rows = Math.ceil(innerHeight / size);
    tilesWrap.style.setProperty('--cols', cols);
    tilesWrap.innerHTML = '<span></span>'.repeat(cols * rows);
    tiles = $$('span', tilesWrap);
  };
  buildTiles();
  addEventListener('resize', () => { if (!menu.classList.contains('is-open')) buildTiles(); });

  let menuOpen = false;
  const setMenu = open => {
    menuOpen = open;
    root.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.setAttribute('aria-hidden', !open);
    if (window.lenis) open ? lenis.stop() : lenis.start();

    if (!hasGsap || reduced) {
      menu.classList.toggle('is-open', open);
      tiles.forEach(t => (t.style.transform = open ? 'scale(1.02)' : 'scale(0)'));
      $$('.menu-link, .menu-info').forEach(el => (el.style.opacity = open ? 1 : 0));
      return;
    }
    gsap.killTweensOf([tiles, '.menu-link', '.menu-info']);
    if (open) {
      menu.classList.add('is-open');
      gsap.to(tiles, { scale: 1.02, duration: .45, ease: 'power3.out', stagger: { grid: 'auto', from: 'end', amount: .4 } });
      gsap.fromTo('.menu-link', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .5, stagger: .07, delay: .35, ease: 'power3.out' });
      gsap.fromTo('.menu-info', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .5, delay: .55 });
    } else {
      gsap.to(['.menu-link', '.menu-info'], { opacity: 0, duration: .2 });
      gsap.to(tiles, { scale: 0, duration: .35, ease: 'power2.in', stagger: { grid: 'auto', from: 'start', amount: .3 },
        onComplete: () => { if (!menuOpen) menu.classList.remove('is-open'); } });
    }
  };
  burger.addEventListener('click', () => setMenu(!menuOpen));
  $$('.menu-link').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) setMenu(false); });

  /* ---------- Sin GSAP (CDN caído) o movimiento reducido ---------- */
  const showAll = () => {
    $('.preloader')?.remove();
    $$('.reveal-up').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    $$('.count').forEach(el => {
      const to = parseFloat(el.dataset.to); const dec = +el.dataset.dec || 0;
      el.textContent = to.toFixed(dec).replace('.', ',');
    });
    $('.recipe-fill').style.transform = 'scaleY(1)';
    $$('.step').forEach(s => s.classList.add('is-on'));
  };
  if (!hasGsap || reduced) { showAll(); return; }

  /* =========================================================
     A partir de aquí, todo con GSAP
     ========================================================= */
  gsap.registerPlugin(ScrollTrigger, SplitText);

  /* ---------- Scroll suave (Lenis) ---------- */
  if (typeof window.Lenis !== 'undefined') {
    window.lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const target = $(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -70, duration: 1.4 });
    }));
  }

  /* ---------- Preloader ---------- */
  const pre = { v: 0 };
  const preCount = $('#preCount');
  gsap.to('.pre-steam path', { y: -6, opacity: .2, duration: .6, stagger: .15, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.pre-fire path', { scaleY: 1.25, transformOrigin: '50% 100%', duration: .25, stagger: .08, repeat: -1, yoyo: true });

  const intro = gsap.timeline({ paused: true });
  intro
    .to('.preloader', { yPercent: -100, duration: .9, ease: 'power4.inOut' })
    .set('.preloader', { display: 'none' })
    .from('.kicker', { y: 20, opacity: 0, duration: .5 }, '-=.35')
    .from('.ht-line', { yPercent: 100, opacity: 0, duration: .8, ease: 'power4.out' }, '<.05')
    .from('.ht-script', { scale: .6, opacity: 0, rotate: -14, duration: .9, ease: 'back.out(2)' }, '<.2')
    .from('.hero-lead, .hero-ctas, .hero-meta li', { y: 24, opacity: 0, duration: .6, stagger: .08 }, '<.2')
    .from('.pot', { y: 80, opacity: 0, duration: .9, ease: 'power3.out' }, .6)
    .from('.lid', { y: -60, rotate: -10, transformOrigin: '50% 100%', duration: .8, ease: 'bounce.out' }, '<.3')
    .from('.steam-photo', { y: 120, scale: .5, opacity: 0, duration: .9, stagger: .12, ease: 'back.out(1.6)' }, '<.2')
    .from('.hero .hand-note', { opacity: 0, scale: .5, duration: .5, ease: 'back.out(3)' }, '<.4');

  gsap.to(pre, {
    v: 100, duration: 1.3, ease: 'power2.inOut',
    onUpdate: () => (preCount.textContent = Math.round(pre.v)),
    onComplete: () => intro.play()
  });

  /* ---------- Hero: vapor, fotos flotando y tapa al hacer scroll ---------- */
  $$('.steam path').forEach((p, i) => {
    const len = p.getTotalLength();
    gsap.set(p, { strokeDasharray: `${len * .35} ${len}` });
    gsap.fromTo(p, { strokeDashoffset: 0 }, { strokeDashoffset: -len * 1.35, duration: 2.6 + i * .4, repeat: -1, ease: 'none' });
  });
  $$('.steam-photo').forEach((el, i) => {
    gsap.to(el, { y: i % 2 ? 14 : -14, rotation: `+=${i % 2 ? 3 : -3}`, duration: 2.4 + i * .5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  });
  gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } })
    .to('.lid', { y: -110, rotate: 14, transformOrigin: '80% 100%', ease: 'none' }, 0)
    .to('.sp-1', { y: -160, ease: 'none' }, 0)
    .to('.sp-2', { y: -100, x: -40, ease: 'none' }, 0)
    .to('.sp-3', { y: -120, x: 40, ease: 'none' }, 0)
    .to('.steam', { opacity: 0, ease: 'none' }, 0);

  /* ---------- Títulos con SplitText ---------- */
  $$('.split').forEach(el => {
    const split = SplitText.create(el, { type: 'words,chars', wordsClass: 'w' });
    gsap.from(split.chars, {
      yPercent: 110, opacity: 0, rotate: 8, duration: .7, ease: 'power3.out', stagger: .015,
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  /* ---------- Apariciones genéricas ---------- */
  ScrollTrigger.batch('.reveal-up', {
    start: 'top 88%',
    onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: .8, stagger: .1, ease: 'power3.out' })
  });

  /* ---------- Pizarra: escritura con tiza ---------- */
  const chalkItems = $$('.chalk-date, .chalk-h, .chalk-list li, .chalk-incl');
  gsap.set(chalkItems, { clipPath: 'inset(0 100% 0 0)' });
  const pricePath = $('.chalk-price path');
  const priceLen = pricePath.getTotalLength();
  gsap.set(pricePath, { strokeDasharray: priceLen, strokeDashoffset: priceLen });
  gsap.timeline({ scrollTrigger: { trigger: '.board', start: 'top 70%' } })
    .from('.board-frame', { rotate: -4, y: 60, opacity: 0, duration: .9, ease: 'power3.out' })
    .to(chalkItems, { clipPath: 'inset(0 0% 0 0)', duration: .55, stagger: .12, ease: 'power1.inOut' }, '-=.3')
    .from('.chalk-price span', { scale: 0, rotate: -20, duration: .6, ease: 'back.out(2.5)' }, '-=.2')
    .to(pricePath, { strokeDashoffset: 0, duration: .8, ease: 'power2.inOut' }, '-=.2')
    .from('.chalk-doodle', { opacity: 0, y: -10, duration: .4 }, '<');

  /* ---------- Paellera girando ---------- */
  gsap.to('.paellera', {
    rotate: 200, ease: 'none',
    scrollTrigger: { trigger: '.rice', start: 'top bottom', end: 'bottom top', scrub: 1 }
  });
  gsap.from('.week span', {
    scale: 0, duration: .5, stagger: .06, ease: 'back.out(3)',
    scrollTrigger: { trigger: '.week', start: 'top 85%' }
  });

  /* ---------- Tendedero: entrada y balanceo según la velocidad ---------- */
  gsap.from('.pin', {
    y: -80, rotate: 0, opacity: 0, duration: .9, stagger: .1, ease: 'elastic.out(1, .6)',
    scrollTrigger: { trigger: '.line-stage', start: 'top 80%' }
  });
  const pins = $$('.pin');
  const swing = gsap.quickTo(pins, 'skewX', { duration: .6, ease: 'power3' });
  ScrollTrigger.create({
    trigger: '.kitchen', start: 'top bottom', end: 'bottom top',
    onUpdate: self => swing(gsap.utils.clamp(-6, 6, self.getVelocity() / -250))
  });
  track.addEventListener('scroll', () => {
    swing(gsap.utils.clamp(-5, 5, (track.scrollLeft - (track._last || 0)) * .4));
    track._last = track.scrollLeft;
    clearTimeout(track._t);
    track._t = setTimeout(() => swing(0), 120);
  }, { passive: true });

  /* ---------- Receta: línea, cuchara y pasos ---------- */
  const steps = $$('.step');
  gsap.timeline({
    scrollTrigger: {
      trigger: '#recipe', start: 'top 65%', end: 'bottom 55%', scrub: .6,
      onUpdate: self => steps.forEach((s, i) => s.classList.toggle('is-on', self.progress >= i / (steps.length - 1) - .02))
    }
  })
    .to('.recipe-fill', { scaleY: 1, ease: 'none' }, 0)
    .fromTo('.recipe-spoon', { top: '0%' }, { top: '100%', ease: 'none' }, 0);
  gsap.from(steps, {
    x: 40, opacity: 0, duration: .7, stagger: .12, ease: 'power3.out',
    scrollTrigger: { trigger: '#recipe', start: 'top 80%' }
  });

  /* ---------- Contadores ---------- */
  $$('.count').forEach(el => {
    const to = parseFloat(el.dataset.to);
    const dec = +el.dataset.dec || 0;
    const o = { v: 0 };
    gsap.to(o, {
      v: to, duration: 1.8, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate: () => (el.textContent = o.v.toFixed(dec).replace('.', ','))
    });
  });
  gsap.from('.stars-fill', { width: 0, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: '.stars', start: 'top 85%' } });

  /* ---------- Visítanos ---------- */
  gsap.from('.visit-info, .visit-map', {
    y: 50, opacity: 0, duration: .8, stagger: .15, ease: 'power3.out',
    scrollTrigger: { trigger: '.visit-grid', start: 'top 80%' }
  });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
