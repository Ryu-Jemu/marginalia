/**
 * Leader lines from a claim in the text to its evidence in the margin.
 *
 * A note can end up well below its marker: `clear: right` pushes a tall note
 * past a short paragraph, and at 1440 the fourth note on a dense page sits
 * around 200px low. The number alone does not carry that distance. A drawn
 * line does — so when the lines are active the note's own number is hidden and
 * the line becomes the pairing.
 *
 * Everything here is measurement, so it must not run before the fonts have
 * settled: metrics computed against the fallback face are wrong by whole lines.
 */

import { animate, createDrawable, utils } from 'animejs';
import type { DrawableSVGGeometry } from 'animejs';
import { motionOff, whenInView } from './observe';

const BEND = 0.45; // where the elbow turns, as a fraction of the *gutter*
const RADIUS = 8;
const HOOK = 3; // radius of the little turn out of the marker
const NOTE_INSET = 6; // stop this far short of the note's left edge
const MARGIN_QUERY = '(min-width: 64rem)';

export interface NoteLink {
  ref: HTMLElement;
  note: HTMLElement;
  path: SVGPathElement;
  /**
   * `createDrawable` only writes the initial `draw` when the element's
   * pathLength is not already its normalised 1000 — so calling it twice on one
   * element silently skips initialisation. One proxy per path, made at build
   * time and reused.
   */
  drawable: DrawableSVGGeometry;
}

/** `draw` is an attribute the proxy interprets, not a DOM property. */
const setDraw = (d: DrawableSVGGeometry, value: `${number} ${number}`) =>
  d.setAttribute('draw', value);

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * The line must never cross the prose.
 *
 * A marker in the middle of a line has text to the right of it, so the leader
 * drops out of the marker to the bottom edge of its line box first and runs
 * along the boundary between two lines — where a 1px rule reads as a rule and
 * not as a strikethrough. The turn down towards the note is then made in the
 * gutter, past the column's right edge, never inside the measure.
 */
function leader(
  x1: number,
  y1: number,
  yRun: number,
  x2: number,
  y2: number,
  colRight: number,
): string {
  const seg: string[] = [`M ${x1} ${y1}`];

  // Drop out of the marker to the line boundary, with a small rounded turn.
  const drop = yRun - y1;
  if (drop > HOOK * 1.5) {
    seg.push(`L ${x1} ${yRun - HOOK}`, `Q ${x1} ${yRun} ${x1 + HOOK} ${yRun}`);
  } else {
    seg.push(`L ${x1} ${yRun}`);
  }

  // The vertical run belongs in the gutter: bend after the column edge.
  const gutterStart = Math.max(colRight, x1 + HOOK);
  const xb = Math.min(gutterStart + (x2 - gutterStart) * BEND, x2 - RADIUS);
  const dy = y2 - yRun;

  if (Math.abs(dy) < 1.5) {
    seg.push(`L ${x2} ${y2}`);
    return seg.join(' ');
  }

  const s = Math.sign(dy);
  const r = Math.min(RADIUS, Math.abs(dy) / 2, Math.max(0, xb - gutterStart), Math.abs(x2 - xb));

  if (r < 1) {
    seg.push(`L ${xb} ${yRun}`, `L ${xb} ${y2}`, `L ${x2} ${y2}`);
    return seg.join(' ');
  }

  seg.push(
    `L ${xb - r} ${yRun}`,
    `Q ${xb} ${yRun} ${xb} ${yRun + s * r}`,
    `L ${xb} ${y2 - s * r}`,
    `Q ${xb} ${y2} ${xb + r} ${y2}`,
    `L ${x2} ${y2}`,
  );
  return seg.join(' ');
}

function firstLineCentre(note: HTMLElement, box: DOMRect): number {
  // The note's own first line, not its box centre — a four-line note would
  // otherwise be met halfway down.
  const body = note.querySelector('.note__body');
  const target = body ?? note;
  const rects = target.getClientRects();
  const first = rects[0];
  if (!first) return note.getBoundingClientRect().top - box.top + 10;
  return first.top - box.top + first.height / 2;
}

export function initNoteLines(): () => void {
  const doc = document.querySelector<HTMLElement>('[data-annotated]');
  const svg = document.querySelector<SVGSVGElement>('[data-note-lines]');
  if (!doc || !svg) return () => {};

  const mq = window.matchMedia(MARGIN_QUERY);
  let links: NoteLink[] = [];
  let frame = 0;

  // A note is revealed once. A resize rebuilds the geometry, and replaying the
  // draw every time the window moved would be noise, not information.
  const revealed = new WeakSet<HTMLElement>();
  let stopObserving: Array<() => void> = [];
  // ResizeObserver fires once the moment you observe, and again for every
  // layout change the reveal itself causes. Rebuilding on those restarts the
  // geometry mid-draw and snaps every line to its finished state, so a rebuild
  // only happens when the box actually changed size.
  let lastBox = '';

  /**
   * The line is drawn first and the note follows it out into the margin: the
   * evidence is pulled into view by the connection, not announced on its own.
   */
  function reveal(group: NoteLink[]): void {
    if (!group.length) return;

    if (motionOff()) {
      // The line is information, not decoration. Only the drawing is skipped.
      finish(group);
      return;
    }

    utils.set(
      group.map((l) => l.note),
      { opacity: 0, translateX: -8 },
    );

    // Sequenced with delays rather than a timeline. In anime.js 4.5.0 a
    // drawable proxy passed through `createTimeline().add()` does not tween —
    // it jumps straight to the target value — while the same target through
    // `animate()` interpolates normally. Measured on one path over 800ms:
    // 96 distinct `draw` values via animate(), exactly 1 via the timeline.
    group.forEach((link, i) => {
      const at = i * 90;
      // A single target value, not a from-to pair: `draw` tweens from whatever
      // the proxy currently holds, which build() left at "0 0".
      animate(link.drawable, {
        draw: '0 1',
        duration: 620,
        ease: 'inOut(2)',
        delay: at,
      });
      animate(link.note, {
        opacity: [0, 1],
        translateX: [-8, 0],
        duration: 420,
        ease: 'out(3)',
        delay: at + 460,
        // Marked done only once it has finished. Marking at the start would
        // let a rebuild treat an in-flight reveal as already shown.
        onComplete: () => revealed.add(link.note),
      });
    });
  }

  /** Put a group straight into its finished state, with nothing in flight. */
  function finish(group: NoteLink[]): void {
    if (!group.length) return;
    utils.set(
      group.map((l) => l.path),
      { opacity: 0.45 },
    );
    for (const link of group) setDraw(link.drawable, '0 1');
    utils.set(
      group.map((l) => l.note),
      { opacity: 1, translateX: 0 },
    );
    group.forEach((l) => revealed.add(l.note));
  }

  function scheduleReveal(): void {
    for (const stop of stopObserving) stop();
    stopObserving = [];

    const pending = links.filter((l) => !revealed.has(l.note));
    for (const link of pending) utils.set(link.path, { opacity: 0 });

    // Group by paragraph so notes that belong to the same passage draw
    // together, staggered, instead of one at a time.
    const groups = new Map<Element, NoteLink[]>();
    for (const link of pending) {
      const key = link.ref.closest('p, li, h2, h3') ?? link.ref;
      const list = groups.get(key);
      if (list) list.push(link);
      else groups.set(key, [link]);
    }

    for (const [anchor, group] of groups) {
      stopObserving.push(
        whenInView(anchor, () => {
          utils.set(
            group.map((l) => l.path),
            { opacity: 0.45 },
          );
          reveal(group);
        }),
      );
    }

    // Anything already revealed keeps its finished state through the rebuild.
    finish(links.filter((l) => revealed.has(l.note)));
  }

  const clear = () => {
    for (const stop of stopObserving) stop();
    stopObserving = [];
    svg.replaceChildren();
    // Notes were only ever hidden by JS, so JS puts them back.
    for (const note of doc.querySelectorAll<HTMLElement>('[data-note]')) {
      note.style.removeProperty('opacity');
      note.style.removeProperty('transform');
      note.style.removeProperty('translate');
    }
    links = [];
    doc.classList.remove('has-lines');
  };

  const inMarginMode = () =>
    mq.matches && document.documentElement.dataset.notes !== 'inline';

  function build(): NoteLink[] {
    const box = doc!.getBoundingClientRect();
    svg!.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    svg!.setAttribute('width', String(box.width));
    svg!.setAttribute('height', String(box.height));

    const built: NoteLink[] = [];
    const frag = document.createDocumentFragment();

    for (const ref of doc!.querySelectorAll<HTMLElement>('[data-note-ref]')) {
      // Adjacent siblings by construction — see components/note/N.astro.
      const note = ref.nextElementSibling;
      if (!(note instanceof HTMLElement) || !note.matches('[data-note]')) continue;

      const rects = ref.getClientRects();
      const last = rects[rects.length - 1]; // a marker split across a line wrap
      const noteBox = note.getBoundingClientRect();
      if (!last || noteBox.width === 0) continue;

      const column = ref.closest<HTMLElement>('.column');
      const colRight = column
        ? column.getBoundingClientRect().right - box.left
        : noteBox.left - box.left;

      const x1 = last.right - box.left;
      const y1 = last.top - box.top + last.height / 2;
      // The bottom of the line box the marker sits on: the leader runs along
      // the boundary between this line and the next, not through either.
      const yRun = last.bottom - box.top;
      const x2 = noteBox.left - box.left - NOTE_INSET;
      const y2 = firstLineCentre(note, box);

      if (x2 <= x1) continue; // note is not to the right: nothing to draw

      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', leader(x1, y1, yRun, x2, y2, colRight));
      path.setAttribute('class', 'note-line');
      frag.appendChild(path);

      // Fresh element each rebuild, so this is the one and only proxy for it.
      const [drawable] = createDrawable(path, 0, 0);
      built.push({ ref, note, path, drawable });
    }

    svg!.appendChild(frag);
    return built;
  }

  function draw(): void {
    if (!inMarginMode()) {
      clear();
      return;
    }
    for (const stop of stopObserving) stop();
    stopObserving = [];
    svg!.replaceChildren();
    links = build();
    doc!.classList.toggle('has-lines', links.length > 0);
    scheduleReveal();
    document.dispatchEvent(new CustomEvent('marginalia:lines', { detail: { links } }));
  }

  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(draw);
  };

  // ── highlight on hover and on keyboard focus ─────────────────────────────
  const onPointerOver = (e: Event) => {
    const ref = (e.target as HTMLElement).closest<HTMLElement>('[data-note-ref]');
    if (!ref) return;
    const link = links.find((l) => l.ref === ref);
    if (!link) return;
    link.path.classList.add('is-linked');
    link.note.classList.add('is-linked');
  };
  const onPointerOut = (e: Event) => {
    const ref = (e.target as HTMLElement).closest<HTMLElement>('[data-note-ref]');
    if (!ref) return;
    const link = links.find((l) => l.ref === ref);
    if (!link) return;
    link.path.classList.remove('is-linked');
    link.note.classList.remove('is-linked');
  };

  doc.addEventListener('pointerover', onPointerOver);
  doc.addEventListener('pointerout', onPointerOut);
  doc.addEventListener('focusin', onPointerOver);
  doc.addEventListener('focusout', onPointerOut);

  const ro = new ResizeObserver(() => {
    const r = doc.getBoundingClientRect();
    const key = `${Math.round(r.width)}x${Math.round(r.height)}`;
    if (key === lastBox) return;
    lastBox = key;
    schedule();
  });
  ro.observe(doc);

  const onControls = (e: Event) => {
    const control = (e as CustomEvent).detail?.control;
    if (control === 'notes') schedule();
    // Turning motion off mid-reveal must not leave a half-drawn line behind.
    if (control === 'motion' && motionOff() && links.length) finish(links);
  };
  window.addEventListener('marginalia:controls', onControls);
  mq.addEventListener('change', schedule);

  // Metrics are only meaningful once the real faces are in.
  if (document.fonts?.status === 'loaded') schedule();
  else document.fonts?.ready.then(schedule).catch(schedule);

  return () => {
    cancelAnimationFrame(frame);
    ro.disconnect();
    mq.removeEventListener('change', schedule);
    window.removeEventListener('marginalia:controls', onControls);
    doc.removeEventListener('pointerover', onPointerOver);
    doc.removeEventListener('pointerout', onPointerOut);
    doc.removeEventListener('focusin', onPointerOver);
    doc.removeEventListener('focusout', onPointerOut);
    clear();
  };
}
