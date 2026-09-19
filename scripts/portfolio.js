(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = document.querySelector('.motion-toggle');
  let paused = reduced.matches;
  let explicitPreference = false;
  const scene = document.querySelector('#universe');
  const canvas = document.querySelector('#orbit-canvas');
  const context = canvas.getContext('2d');
  const nodes = [...document.querySelectorAll('[data-orbit]')];
  let width = 1, height = 1, angle = 0.35, frame = 0, lastTime = 0;
  let visible = true, hover = false, dragging = false, lastX = 0;
  let focused = false;

  function updateMotion() {
    document.body.classList.toggle('motion-paused', paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.textContent = paused ? 'Enable motion' : 'Pause motion';
    document.documentElement.style.scrollBehavior = paused ? 'auto' : '';
    syncAnimation();
  }
  motionButton.addEventListener('click', () => {
    explicitPreference = true;
    paused = !paused;
    updateMotion();
  });
  reduced.addEventListener('change', () => {
    if (!explicitPreference) { paused = reduced.matches; updateMotion(); }
  });

  // Project points from a tilted 3D orbit into screen coordinates. No WebGL or
  // external runtime is needed; every product remains a normal keyboard link.
  function project(theta, radius, tilt = 0.63) {
    const x = Math.cos(theta) * radius;
    const y = Math.sin(theta) * radius;
    const z = y * Math.sin(tilt);
    const scale = 560 / (560 - z);
    return { x: x * scale, y: y * Math.cos(tilt) * scale, z, scale };
  }
  function render() {
    const radius = Math.min(width * 0.345, height * 0.355);
    if (context) {
      context.clearRect(0, 0, width, height);
      context.save();
      context.translate(width / 2, height / 2);
      // Three orbital guides create depth without competing with the products.
      for (let ring = 0; ring < 3; ring++) {
        context.beginPath();
        for (let step = 0; step <= 100; step++) {
          const p = project(step / 100 * Math.PI * 2, radius * (0.75 + ring * 0.18), 0.3 + ring * 0.32);
          const rotation = -0.3 + ring * 0.33;
          const x = p.x * Math.cos(rotation) - p.y * Math.sin(rotation);
          const y = p.x * Math.sin(rotation) + p.y * Math.cos(rotation);
          if (!step) context.moveTo(x, y); else context.lineTo(x, y);
        }
        context.strokeStyle = ring === 1 ? '#c3f87930' : '#6c80652d';
        context.lineWidth = 1;
        context.stroke();
      }
      for (let i = 0; i < 35; i++) {
        const theta = i * 2.39996;
        const r = radius * (0.45 + (i % 8) / 10);
        const x = Math.cos(theta) * r;
        const y = Math.sin(theta) * r;
        context.fillStyle = i % 4 ? '#75896a50' : '#c3f87980';
        context.beginPath(); context.arc(x, y, i % 4 ? 1 : 1.7, 0, Math.PI * 2); context.fill();
      }
    }
    nodes.forEach((node, index) => {
      const p = project(angle + index * Math.PI * 2 / nodes.length, radius, 0.6);
      const rotation = -0.4;
      const x = p.x * Math.cos(rotation) - p.y * Math.sin(rotation);
      const y = p.x * Math.sin(rotation) + p.y * Math.cos(rotation);
      node.style.setProperty('--x', `${x.toFixed(2)}px`);
      node.style.setProperty('--y', `${y.toFixed(2)}px`);
      node.style.setProperty('--s', (0.92 + (p.scale - 1) * 0.5).toFixed(3));
      node.style.zIndex = p.z > 0 ? '4' : '2';
      if (context) {
        context.beginPath(); context.moveTo(0, 0); context.lineTo(x, y);
        context.strokeStyle = '#859e6723'; context.stroke();
      }
    });
    if (context) context.restore();
  }
  function resize() {
    const rect = scene.getBoundingClientRect();
    width = rect.width; height = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    if (context) context.setTransform(dpr, 0, 0, dpr, 0, 0);
    render();
  }
  function shouldAnimate() { return !paused && visible && !document.hidden && !hover && !focused && !dragging; }
  function animate(time) {
    frame = 0;
    if (!shouldAnimate()) { lastTime = 0; return; }
    if (lastTime) angle += Math.min(time - lastTime, 40) * 0.000095;
    lastTime = time; render(); frame = requestAnimationFrame(animate);
  }
  function syncAnimation() {
    if (!shouldAnimate()) { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
    else if (!frame) frame = requestAnimationFrame(animate);
  }
  new ResizeObserver(resize).observe(scene);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; syncAnimation(); }).observe(scene);
  document.addEventListener('visibilitychange', syncAnimation);
  scene.addEventListener('pointerenter', () => { hover = true; syncAnimation(); });
  scene.addEventListener('pointerleave', () => { hover = false; syncAnimation(); });
  scene.addEventListener('focusin', () => { focused = true; syncAnimation(); });
  scene.addEventListener('focusout', event => { if (!scene.contains(event.relatedTarget)) { focused = false; syncAnimation(); } });
  scene.addEventListener('pointerdown', event => {
    if (event.target.closest('a') || (event.pointerType === 'mouse' && event.button !== 0)) return;
    dragging = true; lastX = event.clientX; scene.setPointerCapture(event.pointerId);
    scene.classList.add('is-dragging'); syncAnimation();
  });
  scene.addEventListener('pointermove', event => {
    if (!dragging) return;
    angle += (event.clientX - lastX) * 0.008; lastX = event.clientX; render();
  });
  function endDrag() { dragging = false; scene.classList.remove('is-dragging'); syncAnimation(); }
  scene.addEventListener('pointerup', endDrag);
  scene.addEventListener('pointercancel', endDrag);
  scene.addEventListener('lostpointercapture', endDrag);
  document.querySelector('#rotate-left').addEventListener('click', () => { angle -= Math.PI / 5; render(); });
  document.querySelector('#rotate-right').addEventListener('click', () => { angle += Math.PI / 5; render(); });

  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  function closeMenu() {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('is-open');
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    navigation.classList.toggle('is-open', open);
  });
  navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navigation.classList.contains('is-open')) { closeMenu(); menuButton.focus(); }
  });
  matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);
  const navLinks = [...navigation.querySelectorAll('a')];
  const activeSection = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      navLinks.forEach(link => {
        if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-15% 0px -65% 0px' });
  document.querySelectorAll('main > section[id]').forEach(section => activeSection.observe(section));

  const reveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (!paused) entry.target.classList.add('revealed');
      reveal.unobserve(entry.target);
    });
  }, { threshold: 0.07 });
  document.querySelectorAll('[data-reveal]').forEach(el => reveal.observe(el));
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (paused || !finePointer.matches) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty('--rx', `${(0.5 - y) * 7}deg`);
      card.style.setProperty('--ry', `${(x - 0.5) * 7}deg`);
      card.style.setProperty('--px', `${x * 100}%`);
      card.style.setProperty('--py', `${y * 100}%`);
    });
    card.addEventListener('pointerleave', () => { card.style.removeProperty('--rx'); card.style.removeProperty('--ry'); });
  });
  let scrollFrame = 0;
  function updateProgress() {
    scrollFrame = 0;
    const total = document.documentElement.scrollHeight - innerHeight;
    const ratio = total > 0 ? Math.min(1, Math.max(0, scrollY / total)) : 0;
    document.querySelector('.reading-progress').style.transform = `scaleX(${ratio})`;
  }
  addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProgress); }, { passive: true });
  addEventListener('resize', updateProgress);
  document.querySelector('#contactForm').addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = `${data.get('message')}\n\nFrom: ${data.get('name')}\nEmail: ${data.get('email')}`;
    location.href = `mailto:abilashblnair@gmail.com?subject=${encodeURIComponent(data.get('subject'))}&body=${encodeURIComponent(body)}`;
    document.querySelector('#form-status').textContent = 'Your draft is ready in your email app. If it did not open, email abilashblnair@gmail.com directly.';
  });
  resize(); updateMotion(); updateProgress();
})();
