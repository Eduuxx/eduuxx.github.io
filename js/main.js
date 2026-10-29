(() => {
  const body = document.body;
  const loader = document.querySelector('.loader');
  const count = document.querySelector('#loader-count');
  const line = document.querySelector('.loader__line span');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const finishLoader = () => {
    body.classList.remove('is-loading');
    loader?.classList.add('is-done');
    window.setTimeout(() => loader?.remove(), 1300);
  };

  if (reducedMotion) {
    finishLoader();
  } else {
    body.classList.add('is-loading');
    let progress = 0;
    const loadingTimer = window.setInterval(() => {
      progress += progress < 60 ? 7 : progress < 90 ? 4 : 2;
      if (progress >= 100) {
        progress = 100;
        window.clearInterval(loadingTimer);
        window.setTimeout(finishLoader, 260);
      }
      if (count) count.textContent = String(progress).padStart(3, '0');
      if (line) line.style.width = `${progress}%`;
    }, 45);
  }

  const cursor = document.querySelector('.cursor');
  const spotlight = document.querySelector('.spotlight');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canHover && cursor) {
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let cursorX = pointerX;
    let cursorY = pointerY;
    const moveCursor = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (spotlight) {
        document.documentElement.style.setProperty('--mx', `${pointerX}px`);
        document.documentElement.style.setProperty('--my', `${pointerY}px`);
      }
    };
    const renderCursor = () => {
      cursorX += (pointerX - cursorX) * 0.18;
      cursorY += (pointerY - cursorY) * 0.18;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      requestAnimationFrame(renderCursor);
    };
    window.addEventListener('pointermove', moveCursor, { passive: true });
    renderCursor();
    document.querySelectorAll('a, button, .project').forEach((interactive) => {
      interactive.addEventListener('pointerenter', () => cursor.classList.add('is-hover'));
      interactive.addEventListener('pointerleave', () => cursor.classList.remove('is-hover'));
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  document.querySelectorAll('.reveal, .reveal-text').forEach((element) => observer.observe(element));

  const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = entry.target;
      const value = target.dataset.value;
      if (value === '∞' || reducedMotion) {
        target.textContent = value;
      } else {
        const end = Number(value);
        const started = performance.now();
        const countUp = (now) => {
          const progress = Math.min((now - started) / 1100, 1);
          target.textContent = String(Math.floor(progress * end)).padStart(2, '0');
          if (progress < 1) requestAnimationFrame(countUp);
        };
        requestAnimationFrame(countUp);
      }
      numberObserver.unobserve(target);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-value]').forEach((number) => numberObserver.observe(number));

  document.querySelectorAll('.magnetic').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      if (!canHover || reducedMotion) return;
      const bounds = element.getBoundingClientRect();
      const x = (event.clientX - bounds.left - bounds.width / 2) * 0.12;
      const y = (event.clientY - bounds.top - bounds.height / 2) * 0.12;
      element.style.transform = `translate(${x}px, ${y}px)`;
    });
    element.addEventListener('pointerleave', () => { element.style.transform = ''; });
  });

  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.site-nav');
  menuButton?.addEventListener('click', () => {
    const open = menuButton.classList.toggle('is-open');
    navigation?.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
  });
  navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuButton?.classList.remove('is-open');
    navigation.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));

  const clock = document.querySelector('#clock');
  const updateClock = () => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour12: false });
    if (clock) {
      clock.textContent = time;
      clock.dateTime = now.toISOString();
    }
  };
  updateClock();
  window.setInterval(updateClock, 1000);
})();
