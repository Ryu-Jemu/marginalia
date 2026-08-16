import { animate, createDrawable, createTimeline, stagger, utils } from 'animejs';
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

/* ── the pipeline, one record walking it ─────────────────────────────────── */

/**
 * A stream of packets says "throughput". This plate is about the path one
 * record takes, so one record travels it, pausing in each stage, and the stage
 * it is inside is lit while it is there. The pace is set to be followed rather
 * than glanced at: a reader should be able to watch a single record arrive at
 * a stage, see the stage light, and see it leave.
 */
const HOP = 700;
const DWELL = 550;
/** The beat before the next record sets off. */
const REST = 1000;
/** After the track has drawn and the boxes have arrived. */
const START = 900;

function flow(svg: SVGSVGElement): void {
  const x0 = Number(svg.dataset.x0 ?? 0);
  const x1 = Number(svg.dataset.x1 ?? 0);
  const packet = svg.querySelector<SVGRectElement>('[data-packet]');
  const stages = [...svg.querySelectorAll<SVGGElement>('[data-stage]')];
  const lits = [...svg.querySelectorAll<SVGRectElement>('[data-stage-lit]')];
  const track = drawablesFor(svg, '.viz-track');

  if (motionOff()) {
    utils.set(stages, { opacity: 1 });
    utils.set(lits, { opacity: 0 });
    finishDraw(track);
    // Rest state: the record sits in the first stage rather than off the left
    // edge, so the still frame is of a pipeline with something in it.
    if (packet) utils.set(packet, { opacity: 0 });
    if (lits[0]) utils.set(lits[0], { opacity: 1 });
    return;
  }

  utils.set(stages, { opacity: 0 });
  utils.set(lits, { opacity: 0 });
  animate(track, { draw: '0 1', duration: 720, ease: 'inOut(2)' });
  animate(stages, {
    opacity: [0, 1],
    translateY: [6, 0],
    duration: 420,
    delay: stagger(110, { start: 240 }),
    ease: 'out(3)',
  });

  if (!packet || lits.length === 0) return;

  // Where the record pauses: the centre of each stage box, then off the end.
  const centres = lits.map((r) => Number(r.getAttribute('x')) + Number(r.getAttribute('width')) / 2);
  const stops = [...centres, x1];

  /* Written as one timeline rather than as separate looping animations: the
     lights have to agree with the record about where it is, and separate loops
     with their own delays drift apart within a few cycles. */
  const hops: Array<Record<string, unknown>> = [];
  const litAt: number[] = [];
  let at = START;
  stops.forEach((x, i) => {
    hops.push({ to: x - x0, duration: HOP, ease: 'inOut(2)' });
    at += HOP;
    if (i < centres.length) {
      litAt.push(at);
      hops.push({ to: x - x0, duration: DWELL, ease: 'linear' });
      at += DWELL;
    }
  });

  const tl = createTimeline({ loop: true });
  tl.add(packet, { translateX: hops }, START);
  tl.add(packet, { opacity: [0, 1], duration: 200, ease: 'out(2)' }, START);
  tl.add(packet, { opacity: [1, 0], duration: 240, ease: 'out(2)' }, at - HOP * 0.35);

  lits.forEach((lit, i) => {
    tl.add(
      lit,
      {
        opacity: [
          { to: 1, duration: 200, ease: 'out(2)' },
          { to: 1, duration: DWELL },
          { to: 0, duration: 300, ease: 'out(2)' },
        ],
      },
      litAt[i] - 200,
    );
  });

  // Holds the timeline open for a beat after the record has left, so the loop
  // reads as the next record rather than as a stutter.
  tl.add(packet, { opacity: 0, duration: REST }, at);
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

/* ── the correlation matrix, filled cell by cell ─────────────────────────── */
function heat(svg: SVGSVGElement): void {
  const cells = [...svg.querySelectorAll<SVGGElement>('[data-heat-cell]')];
  const peak = [...svg.querySelectorAll<SVGRectElement>('.heat__peak')];
  if (cells.length === 0) return;

  if (motionOff()) {
    utils.set(cells, { opacity: 1 });
    utils.set(peak, { opacity: 1 });
    return;
  }

  // Along the diagonal rather than in reading order: the matrix is symmetric,
  // and a wash that spreads from the diagonal shows that it is.
  const n = Math.round(Math.sqrt(cells.length));
  utils.set(cells, { opacity: 0 });
  cells.forEach((cell, i) => {
    const r = Math.floor(i / n);
    const c = i % n;
    animate(cell, {
      opacity: [0, 1],
      duration: 320,
      delay: 120 + Math.abs(r - c) * 90 + Math.min(r, c) * 30,
      ease: 'out(2)',
    });
  });

  // The marked pair last, once there is a matrix for it to be marked in.
  utils.set(peak, { opacity: 0 });
  animate(peak, { opacity: [0, 1], duration: 380, delay: 900, ease: 'out(2)' });
}

const RUNNERS: Record<string, (svg: SVGSVGElement) => void> = {
  flow,
  fit,
  'silent-loss': silentLoss,
  pricing,
  race,
  crime,
  route,
  heat,
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
