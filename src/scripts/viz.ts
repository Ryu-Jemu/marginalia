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

const RUNNERS: Record<string, (svg: SVGSVGElement) => void> = {
  'silent-loss': silentLoss,
  pricing,
  race,
  crime,
  route,
};

export function initViz(): Teardown {
  const figures = [...document.querySelectorAll<SVGSVGElement>('svg[data-viz]')];
  const stops = figures.map((svg) => {
    const run = RUNNERS[svg.dataset.viz ?? ''];
    if (!run) return () => {};
    return whenInView(svg, () => run(svg), { rootMargin: '0px 0px -8% 0px' });
  });

  // Switching motion off mid-figure must leave a readable diagram, not a
  // half-grown bar.
  const onControls = (e: Event) => {
    if ((e as CustomEvent).detail?.control !== 'motion' || !motionOff()) return;
    for (const svg of figures) RUNNERS[svg.dataset.viz ?? '']?.(svg);
  };
  window.addEventListener('marginalia:controls', onControls);

  return () => {
    for (const stop of stops) stop();
    window.removeEventListener('marginalia:controls', onControls);
  };
}
