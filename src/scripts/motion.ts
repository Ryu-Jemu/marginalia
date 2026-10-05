import { animate, createScope, createTimeline, utils, type Scope } from 'animejs';

type Dispose = () => void;
type Player = { play: () => unknown; pause: () => unknown; complete: () => unknown; completed: boolean };
let scope: Scope | undefined;
let cleanup: Dispose[] = [];
const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionOff = () => document.documentElement.dataset.motion === 'off' || preference.matches;
const MOTION_EVENT = 'portfolio:motion-change';

function controls(): Dispose {
  const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-motion-toggle]')];
  function sync() {
    const off = motionOff();
    buttons.forEach(button => {
      button.hidden = false;
      button.setAttribute('aria-pressed', String(off));
      button.setAttribute('aria-label', preference.matches ? '모션 끔: 시스템 설정 적용' : off ? '모션 켜기' : '모션 끄기');
      const label = button.querySelector('[data-motion-label]');
      if (label) label.textContent = off ? '모션 끔' : '모션 켬';
      else button.textContent = off ? '모션 끔' : '모션 켬';
      button.disabled = preference.matches;
      button.title = preference.matches ? '기기의 동작 줄이기 설정 적용 중' : '';
    });
    window.dispatchEvent(new Event(MOTION_EVENT));
  }
  function toggle() {
    document.documentElement.dataset.motion = document.documentElement.dataset.motion === 'off' ? 'on' : 'off';
    try { localStorage.setItem('portfolio-motion', document.documentElement.dataset.motion); } catch { /* Private browsing can block storage. */ }
    sync();
  }
  buttons.forEach(button => button.addEventListener('click', toggle));
  preference.addEventListener('change', sync);
  sync();
  return () => {
    buttons.forEach(button => button.removeEventListener('click', toggle));
    preference.removeEventListener('change', sync);
  };
}

/** All explanatory text ships visible; only decoration and entry motion are enhanced. */
function observePlayer(element: HTMLElement, player: Player, completedFrame: () => void): Dispose {
  let visible = false;
  function sync() {
    if (motionOff()) {
      player.complete();
      completedFrame();
    } else if (!visible || document.hidden) player.pause();
    else if (!player.completed) player.play();
  }
  const observer = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    sync();
  }, { threshold: 0.08 });
  observer.observe(element);
  window.addEventListener(MOTION_EVENT, sync);
  document.addEventListener('visibilitychange', sync);
  sync();
  return () => {
    observer.disconnect();
    player.pause();
    window.removeEventListener(MOTION_EVENT, sync);
    document.removeEventListener('visibilitychange', sync);
    completedFrame();
  };
}

function flows(): Dispose[] {
  return [...document.querySelectorAll<HTMLElement>('[data-flow]')].map(flow => {
    const stages = [...flow.querySelectorAll<HTMLElement>('[data-flow-stage]')];
    const lines = [...flow.querySelectorAll<HTMLElement>('[data-flow-line]')];
    const final = () => {
      stages.forEach(stage => { delete stage.dataset.active; stage.style.opacity = '1'; });
      utils.set(lines, { scaleX: 1 });
    };
    if (motionOff() || !stages.length) { final(); return () => {}; }
    const timeline = createTimeline({ autoplay: false, onComplete: final });
    stages.forEach((stage, index) => {
      timeline.add(stage, {
        opacity: [0.65, 1], duration: 420, ease: 'out(2)',
        onBegin: () => {
          stages.forEach(item => delete item.dataset.active);
          stage.dataset.active = '';
        },
      }, index * 450);
      const line = stage.querySelector<HTMLElement>('[data-flow-line]');
      if (line) timeline.add(line, { scaleX: [0, 1], duration: 450, ease: 'inOut(2)' }, index * 450);
    });
    return observePlayer(flow, timeline, final);
  });
}

function entries(): Dispose[] {
  return [...document.querySelectorAll<HTMLElement>('[data-reveal]')].map(element => {
    if (motionOff()) return () => {};
    const animation = animate(element, { opacity: [0.3, 1], translateY: [14, 0], duration: 600, ease: 'out(3)', autoplay: false });
    return observePlayer(element, animation, () => utils.set(element, { opacity: 1, translateY: 0 }));
  });
}

function deck(deck: HTMLElement): Dispose {
  const shots = [...deck.querySelectorAll<HTMLElement>('[data-deck-shot]')];
  const controls = deck.querySelector<HTMLElement>('[data-deck-controls]');
  const status = deck.querySelector<HTMLElement>('[data-deck-status]');
  const buttons = [...deck.querySelectorAll<HTMLButtonElement>('[data-deck-step]')];
  const dots = [...deck.querySelectorAll<HTMLButtonElement>('[data-deck-index]')];
  const viewport = deck.querySelector<HTMLElement>('[data-deck-viewport]');
  if (!shots.length || !viewport) return () => {};
  let index = 0;
  let disposeAnimation: Dispose | undefined;
  const originalRole = viewport.getAttribute('role');
  viewport.tabIndex = 0;
  viewport.setAttribute('role', 'group');
  viewport.setAttribute('aria-label', '서비스 화면. 좌우 방향키로 화면 이동');
  deck.dataset.deckReady = '';
  if (controls) controls.hidden = false;

  function show(next: number, instant = false) {
    const newIndex = Math.max(0, Math.min(shots.length - 1, next));
    const previous = index;
    index = newIndex;
    disposeAnimation?.();
    shots.forEach((shot, i) => {
      shot.hidden = i !== index;
      shot.setAttribute('aria-hidden', String(i !== index));
      utils.set(shot, { opacity: 1, translateX: 0 });
    });
    if (status) status.textContent = `${index + 1} / ${shots.length} · ${shots[index].dataset.label ?? ''}`;
    buttons.forEach(button => { button.disabled = index + Number(button.dataset.deckStep) < 0 || index + Number(button.dataset.deckStep) >= shots.length; });
    dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === index)));
    if (!instant && previous !== index && !motionOff()) {
      const shot = shots[index];
      const animation = animate(shot, { opacity: [0.5, 1], translateX: [index > previous ? 14 : -14, 0], duration: 300, ease: 'out(3)', autoplay: false });
      disposeAnimation = observePlayer(deck, animation, () => utils.set(shot, { opacity: 1, translateX: 0 }));
    }
  }
  const onClick = (event: Event) => {
    const target = event.currentTarget as HTMLButtonElement;
    if (target.dataset.deckStep) show(index + Number(target.dataset.deckStep));
    else show(Number(target.dataset.deckIndex));
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') show(index + 1);
    else if (event.key === 'ArrowLeft') show(index - 1);
    else if (event.key === 'Home') show(0);
    else if (event.key === 'End') show(shots.length - 1);
    else return;
    event.preventDefault();
  };
  let touchStart: { x: number; y: number } | undefined;
  const onTouchStart = (event: TouchEvent) => {
    if (event.touches.length === 1) touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  };
  const onTouchEnd = (event: TouchEvent) => {
    if (!touchStart || event.changedTouches.length !== 1) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    touchStart = undefined;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) show(index + (dx < 0 ? 1 : -1));
  };
  [...buttons, ...dots].forEach(button => button.addEventListener('click', onClick));
  deck.addEventListener('keydown', onKey);
  viewport.addEventListener('touchstart', onTouchStart, { passive: true });
  viewport.addEventListener('touchend', onTouchEnd, { passive: true });
  show(0, true);
  return () => {
    disposeAnimation?.();
    [...buttons, ...dots].forEach(button => button.removeEventListener('click', onClick));
    deck.removeEventListener('keydown', onKey);
    viewport.removeEventListener('touchstart', onTouchStart);
    viewport.removeEventListener('touchend', onTouchEnd);
    viewport.removeAttribute('tabindex');
    viewport.removeAttribute('aria-label');
    if (originalRole) viewport.setAttribute('role', originalRole); else viewport.removeAttribute('role');
    delete deck.dataset.deckReady;
    if (controls) controls.hidden = true;
    shots.forEach(shot => { shot.hidden = false; shot.removeAttribute('aria-hidden'); });
  };
}

function printDetails(): Dispose {
  let closed: HTMLDetailsElement[] = [];
  const before = () => {
    closed = [...document.querySelectorAll<HTMLDetailsElement>('details')].filter(item => !item.open);
    closed.forEach(item => { item.open = true; });
  };
  const after = () => { closed.forEach(item => { item.open = false; }); closed = []; };
  window.addEventListener('beforeprint', before);
  window.addEventListener('afterprint', after);
  return () => {
    after();
    window.removeEventListener('beforeprint', before);
    window.removeEventListener('afterprint', after);
  };
}

/** Deep links remain reachable when their destination is inside a folded profile. */
function disclosureLinks(): Dispose {
  function reveal(hash: string, scroll = false) {
    let id: string;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    let opened = false;
    let parent: HTMLElement | null = target;
    while (parent) {
      if (parent instanceof HTMLDetailsElement && !parent.open) {
        parent.open = true;
        opened = true;
      }
      parent = parent.parentElement;
    }
    if (opened && scroll) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }
  const onHash = () => reveal(window.location.hash, true);
  const onClick = (event: MouseEvent) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
    if (!link || link.target === '_blank') return;
    const url = new URL(link.href, window.location.href);
    if (url.origin === window.location.origin && url.pathname === window.location.pathname && url.search === window.location.search) reveal(url.hash);
  };
  document.addEventListener('click', onClick);
  window.addEventListener('hashchange', onHash);
  onHash();
  return () => {
    document.removeEventListener('click', onClick);
    window.removeEventListener('hashchange', onHash);
  };
}

/** The section boundary is also reflected in its local navigation. */
function sectionNavigation(): Dispose {
  const menus = [...document.querySelectorAll<HTMLElement>('[data-section-nav]')].map(menu =>
    [...menu.querySelectorAll<HTMLAnchorElement>('a[href]')].flatMap(link => {
      const url = new URL(link.href, window.location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return [];
      const section = document.getElementById(url.hash.slice(1));
      return section ? [{ link, section }] : [];
    })
  ).filter(menu => menu.length);
  let frame = 0;
  function update() {
    frame = 0;
    const offset = (document.querySelector('.site-header')?.getBoundingClientRect().height ?? 72) + 80;
    menus.forEach(menu => {
      let current = menu[0];
      for (const item of menu) if (item.section.getBoundingClientRect().top <= offset) current = item;
      menu.forEach(item => {
        if (item === current) item.link.setAttribute('aria-current', 'location');
        else item.link.removeAttribute('aria-current');
      });
    });
  }
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  document.addEventListener('toggle', schedule, true);
  update();
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    document.removeEventListener('toggle', schedule, true);
    menus.flat().forEach(item => item.link.removeAttribute('aria-current'));
  };
}

/** CSS network illustrations only run while visible and motion is permitted. */
function networks(): Dispose {
  const elements = [...document.querySelectorAll<HTMLElement>('[data-network]')];
  const visible = new Set<Element>();
  function sync() {
    elements.forEach(element => {
      const active = visible.has(element) && !document.hidden && !motionOff();
      element.toggleAttribute('data-network-active', active);
    });
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) visible.add(entry.target); else visible.delete(entry.target); });
    sync();
  }, { threshold: 0.1 });
  elements.forEach(element => observer.observe(element));
  window.addEventListener(MOTION_EVENT, sync);
  document.addEventListener('visibilitychange', sync);
  return () => {
    observer.disconnect();
    elements.forEach(element => element.removeAttribute('data-network-active'));
    window.removeEventListener(MOTION_EVENT, sync);
    document.removeEventListener('visibilitychange', sync);
  };
}

/** Keep wide architecture diagrams keyboard-scrollable across browser defaults. */
function diagramNavigation(): Dispose[] {
  return [...document.querySelectorAll<HTMLElement>('.architecture-viewport')].map(viewport => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || viewport.scrollWidth <= viewport.clientWidth) return;
      const step = Math.max(160, viewport.clientWidth * .7);
      let left: number;
      if (event.key === 'ArrowRight') left = viewport.scrollLeft + step;
      else if (event.key === 'ArrowLeft') left = viewport.scrollLeft - step;
      else if (event.key === 'Home') left = 0;
      else if (event.key === 'End') left = viewport.scrollWidth;
      else return;
      event.preventDefault();
      viewport.scrollTo({ left, behavior: 'instant' });
    };
    viewport.addEventListener('keydown', onKey);
    return () => viewport.removeEventListener('keydown', onKey);
  });
}

function stop() {
  cleanup.forEach(dispose => dispose());
  cleanup = [];
  scope?.revert();
  scope = undefined;
}
function start() {
  stop();
  scope = createScope({ root: document.body }).add(() => {
    cleanup = [controls(), printDetails(), disclosureLinks(), sectionNavigation(), networks(), ...diagramNavigation(), ...flows(), ...entries(), ...[...document.querySelectorAll<HTMLElement>('[data-phone-deck]')].map(deck)];
  });
}
// Support both normal navigation and a future Astro ClientRouter without duplicate listeners.
document.addEventListener('astro:page-load', start);
document.addEventListener('astro:before-swap', stop);
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
else start();
