import { animate, createDrawable, stagger, utils } from 'animejs';
import { motionOff, whenInView } from './observe';

/**
 * Motion for the figures.
 *
 * Every animation here is explanatory: packets travel because the diagram is
 * about packets not arriving; a bar grows from its baseline because the value
 * is measured against that baseline; a strike-through is drawn because the
 * variable was ruled out. None of it is decoration, so with motion off each
 * figure is simply shown in its finished state.
 */

type Teardown = () => void;

/** Drawables must be made once per element — see the note in note-lines.ts. */
const drawablesFor = (root: Element, selector: string) =>
  [...root.querySelectorAll<SVGGeometryElement>(selector)].map((el) => createDrawable(el, 0, 0)[0]);

const finishDraw = (ds: ReturnType<typeof drawablesFor>) => {
  for (const d of ds) d?.setAttribute('draw', '0 1');
};

/* ── Dartoo: the packets that never arrive ───────────────────────────────── */
function silentLoss(svg: SVGSVGElement): void {
  const persist = [...svg.querySelectorAll<SVGCircleElement>('[data-lane="persist"] [data-packet]')];
  const publish = [...svg.querySelectorAll<SVGCircleElement>('[data-lane="publish"] [data-packet]')];
  const gap = svg.querySelector<SVGGElement>('[data-gap]');
  const X0 = 118;
  const X1 = 545;
  const BREAK = 372;

  if (motionOff()) {
    // Rest state: both lanes populated, the gap annotation visible.
    persist.forEach((p, i) => utils.set(p, { opacity: 1, translateX: ((X1 - X0) / 8) * i }));
    publish.forEach((p, i) =>
      utils.set(p, { opacity: i < 6 ? 1 : 0, translateX: ((BREAK - X0) / 6) * Math.min(i, 6) }),
    );
    if (gap) utils.set(gap, { opacity: 1 });
    return;
  }

  animate(persist, {
    opacity: [0, 1, 1],
    translateX: [0, X1 - X0],
    duration: 1500,
    delay: stagger(110),
    ease: 'linear',
  });

  // The publish lane stops dead at the break and emits nothing.
  animate(publish, {
    opacity: [{ to: 1, duration: 120 }, { to: 0, duration: 200, delay: 700 }],
    translateX: [0, BREAK - X0],
    duration: 900,
    delay: stagger(110),
    ease: 'linear',
  });

  if (gap) animate(gap, { opacity: [0, 1], duration: 500, delay: 1700, ease: 'out(3)' });
}

/* ── the pipeline, with records moving along it ──────────────────────────── */
function flow(svg: SVGSVGElement): void {
  const x0 = Number(svg.dataset.x0 ?? 0);
  const x1 = Number(svg.dataset.x1 ?? 0);
  const span = x1 - x0;
  const packets = [...svg.querySelectorAll<SVGRectElement>('[data-packet]')];
  const stages = [...svg.querySelectorAll('[data-stage]')];
  const track = drawablesFor(svg, '.viz-track');

  if (motionOff()) {
    utils.set(stages, { opacity: 1 });
    finishDraw(track);
    // Rest state: records spread along the track rather than stacked at the
    // start, so the still frame still reads as a flow.
    packets.forEach((p, i) => utils.set(p, { opacity: 1, translateX: (span / packets.length) * i }));
    return;
  }

  utils.set(stages, { opacity: 0 });
  animate(track, { draw: '0 1', duration: 720, ease: 'inOut(2)' });
  animate(stages, {
    opacity: [0, 1],
    translateY: [6, 0],
    duration: 420,
    delay: stagger(110, { start: 240 }),
    ease: 'out(3)',
  });
  // The one loop on the site. The figure is about records in transit, and a
  // still diagram of that is a diagram of something else.
  animate(packets, {
    translateX: [0, span],
    opacity: [
      { to: 1, duration: 220 },
      { to: 1, duration: 2500 },
      { to: 0, duration: 480 },
    ],
    duration: 3200,
    delay: stagger(430, { start: 620 }),
    loop: true,
    ease: 'linear',
  });
}

/* ── the paper's uplift, grown from the baseline it is measured against ──── */
function pricing(svg: SVGSVGElement): void {
  const rects = [...svg.querySelectorAll<SVGRectElement>('[data-bar-rect]')];
  const values = [...svg.querySelectorAll<SVGTextElement>('[data-bar-value]')];
  const attribution = svg.querySelector<SVGGElement>('[data-attribution]');

  if (motionOff()) {
    utils.set(values, { opacity: 1 });
    if (attribution) utils.set(attribution, { opacity: 1 });
    return;
  }

  for (const rect of rects) {
    const h = Number(rect.getAttribute('height'));
    const y = Number(rect.getAttribute('y'));
    // Scale about the baseline: the bar has to grow up from zero, not appear.
    utils.set(rect, { transformOrigin: `50% ${y + h}px` });
  }

  animate(rects, {
    scaleY: [0, 1],
    duration: 760,
    delay: stagger(110),
    ease: 'out(3)',
  });
  animate(values, {
    opacity: [0, 1],
    translateY: [6, 0],
    duration: 420,
    delay: stagger(110, { start: 420 }),
    ease: 'out(3)',
  });
  if (attribution) animate(attribution, { opacity: [0, 1], duration: 520, delay: 1150, ease: 'out(3)' });
}

/* ── MAP: the overwrite, then the write that does not happen ─────────────── */
function race(svg: SVGSVGElement): void {
  const overwrite = drawablesFor(svg, '[data-overwrite]');
  const blocked = drawablesFor(svg, '[data-blocked] line');
  const rows = [...svg.querySelectorAll('[data-row]')];

  if (motionOff()) {
    finishDraw(overwrite);
    finishDraw(blocked);
    utils.set(rows, { opacity: 1 });
    return;
  }

  utils.set(rows, { opacity: 0 });
  animate(rows, { opacity: [0, 1], duration: 420, delay: stagger(420), ease: 'out(3)' });
  animate(overwrite, { draw: '0 1', duration: 620, delay: 320, ease: 'inOut(2)' });
  animate(blocked, { draw: '0 1', duration: 420, delay: stagger(120, { start: 900 }), ease: 'out(2)' });
}

/* ── the regression, with the expected variable ruled out ────────────────── */
function crime(svg: SVGSVGElement): void {
  const groups = [...svg.querySelectorAll('[data-var]')];
  const edges = drawablesFor(svg, '[data-edge]');
  const strike = drawablesFor(svg, '[data-strike]');

  if (motionOff()) {
    utils.set(groups, { opacity: 1 });
    finishDraw(edges);
    finishDraw(strike);
    return;
  }

  animate(groups, { opacity: [0, 1], duration: 340, delay: stagger(90), ease: 'out(3)' });
  animate(edges, { draw: '0 1', duration: 620, delay: stagger(90), ease: 'inOut(2)' });
  animate(strike, { draw: '0 1', duration: 460, delay: 900, ease: 'out(2)' });
}

/* ── three stages, each handing its result to the next ───────────────────── */
function route(svg: SVGSVGElement): void {
  const pairs = [...svg.querySelectorAll<SVGLineElement>('[data-pair]')];
  const tours = drawablesFor(svg, '[data-tour]');

  if (motionOff()) {
    utils.set(pairs, { opacity: 0.9 });
    finishDraw(tours);
    return;
  }

  animate(pairs, { opacity: [0, 0.9], duration: 300, delay: stagger(45), ease: 'out(2)' });
  animate(tours, { draw: '0 1', duration: 700, delay: stagger(420, { start: 500 }), ease: 'inOut(2)' });
}

/* ── the regression's explained share, grown from zero ───────────────────── */
function fit(svg: SVGSVGElement): void {
  const bar = svg.querySelector<SVGRectElement>('[data-fit-fill]');
  const mark = svg.querySelector<SVGGElement>('[data-fit-mark]');
  if (!bar) return;

  if (motionOff()) {
    if (mark) utils.set(mark, { opacity: 1 });
    return;
  }

  animate(bar, { scaleX: [0, 1], duration: 820, ease: 'out(3)' });
  if (mark) animate(mark, { opacity: [0, 1], duration: 420, delay: 760, ease: 'out(3)' });
}

const RUNNERS: Record<string, (svg: SVGSVGElement) => void> = {
  flow,
  fit,
  'silent-loss': silentLoss,
  pricing,
  race,
  crime,
  route,
};

/* ── data panels: the figure counts up to itself ─────────────────────────── */

/** First numeric run in the string — "+105.8%", "3,948", "2 of 5", "< 5". */
const NUMBER = /-?\d[\d,]*(?:\.\d+)?/;

function countUp(el: HTMLElement): void {
  // The authored string is kept on the element so that a teardown mid-count —
  // a page swap, a scope revert — can put the real figure back. A number frozen
  // at 11% of itself would be a wrong claim, not an unfinished animation.
  const final = el.dataset.final ?? el.textContent ?? '';
  el.dataset.final = final;
  const m = final.match(NUMBER);
  if (!m || m.index === undefined) return;

  const raw = m[0];
  const target = Number(raw.replace(/,/g, ''));
  if (!Number.isFinite(target) || target === 0) return;

  const decimals = (raw.split('.')[1] ?? '').length;
  const grouped = raw.includes(',');
  const before = final.slice(0, m.index);
  const after = final.slice(m.index + raw.length);

  const state = { n: 0 };
  animate(state, {
    n: target,
    duration: 900,
    ease: 'out(4)',
    onUpdate: () => {
      const v = state.n.toFixed(decimals);
      el.textContent =
        before +
        (grouped
          ? Number(v).toLocaleString('en-US', {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })
          : v) +
        after;
    },
    // Restore the authored string rather than a formatted approximation of it.
    onComplete: () => {
      el.textContent = final;
    },
  });
}

function revealPanel(panel: Element): void {
  const values = [...panel.querySelectorAll<HTMLElement>('[data-countup]')];
  if (motionOff()) return;
  for (const v of values) countUp(v);
}

/* ── defect rows, and the rail that runs down them ───────────────────────── */
function revealFixes(list: Element): void {
  const items = [...list.querySelectorAll<HTMLElement>('[data-fix]')];
  const rails = [...list.querySelectorAll<HTMLElement>('.fix__rail')];
  if (motionOff()) return;

  utils.set(items, { opacity: 0 });
  utils.set(rails, { scaleY: 0 });
  animate(items, {
    opacity: [0, 1],
    translateY: [8, 0],
    duration: 460,
    delay: stagger(90),
    ease: 'out(3)',
  });
  animate(rails, {
    scaleY: [0, 1],
    duration: 620,
    delay: stagger(90, { start: 120 }),
    ease: 'out(3)',
  });
}

/* ── bullet lists: the rule draws in before the line is read ─────────────── */
function revealBullets(list: Element): void {
  const items = [...list.querySelectorAll<HTMLElement>('[data-bullet]')];
  if (motionOff()) return;

  utils.set(items, { opacity: 0 });
  animate(items, {
    opacity: [0, 1],
    translateX: [-6, 0],
    duration: 380,
    delay: stagger(70),
    ease: 'out(3)',
  });
}

/* ── safety cards ────────────────────────────────────────────────────────── */
function revealSafety(list: Element): void {
  const items = [...list.querySelectorAll<HTMLElement>('[data-safety-item]')];
  if (motionOff()) return;

  utils.set(items, { opacity: 0 });
  animate(items, {
    opacity: [0, 1],
    translateY: [8, 0],
    duration: 420,
    delay: stagger(60),
    ease: 'out(3)',
  });
}

/* ── verification bars, grown from their own zero ────────────────────────── */
function revealVerification(block: Element): void {
  const bars = [...block.querySelectorAll<HTMLElement>('[data-verify-bar]')];
  if (motionOff()) return;

  utils.set(bars, { scaleX: 0 });
  animate(bars, {
    scaleX: [0, 1],
    duration: 700,
    delay: stagger(80),
    ease: 'out(3)',
  });
}

/* ── device frames ───────────────────────────────────────────────────────── */
function revealPhones(group: Element): void {
  const phones = [...group.querySelectorAll<HTMLElement>('[data-phone]')];
  if (motionOff()) return;

  utils.set(phones, { opacity: 0 });
  animate(phones, {
    opacity: [0, 1],
    translateY: [14, 0],
    duration: 620,
    delay: stagger(120),
    ease: 'out(3)',
  });
}

export function initViz(): Teardown {
  const figures = [...document.querySelectorAll<SVGSVGElement>('svg[data-viz]')];
  const stops = figures.map((svg) => {
    const run = RUNNERS[svg.dataset.viz ?? ''];
    if (!run) return () => {};
    return whenInView(svg, () => run(svg), { rootMargin: '0px 0px -8% 0px' });
  });

  // Everything below hides nothing until its own reveal runs, so a missed
  // trigger leaves the content on the page rather than off it.
  const groups: Array<[string, (el: Element) => void]> = [
    ['[data-panel]', revealPanel],
    ['[data-fixes]', revealFixes],
    ['[data-bullets]', revealBullets],
    ['[data-safety]', revealSafety],
    ['[data-verify]', revealVerification],
    ['.devices', revealPhones],
  ];
  for (const [selector, reveal] of groups) {
    for (const el of document.querySelectorAll(selector)) {
      stops.push(whenInView(el, () => reveal(el), { rootMargin: '0px 0px -6% 0px' }));
    }
  }

  // Switching motion off mid-figure must leave a readable diagram, not a
  // half-grown bar.
  const onControls = (e: Event) => {
    if ((e as CustomEvent).detail?.control !== 'motion' || !motionOff()) return;
    for (const svg of figures) RUNNERS[svg.dataset.viz ?? '']?.(svg);
    utils.set('[data-fix]', { opacity: 1, translateY: 0 });
    utils.set('.fix__rail', { scaleY: 1 });
    utils.set('[data-phone]', { opacity: 1, translateY: 0 });
    utils.set('[data-bullet]', { opacity: 1, translateX: 0 });
    utils.set('[data-safety-item]', { opacity: 1, translateY: 0 });
    utils.set('[data-verify-bar]', { scaleX: 1 });
    restoreFigures();
  };
  window.addEventListener('marginalia:controls', onControls);

  return () => {
    for (const stop of stops) stop();
    window.removeEventListener('marginalia:controls', onControls);
    restoreFigures();
  };
}

/** Put every counted figure back to its authored string. */
function restoreFigures(): void {
  for (const el of document.querySelectorAll<HTMLElement>('[data-countup]')) {
    if (el.dataset.final) el.textContent = el.dataset.final;
  }
}
