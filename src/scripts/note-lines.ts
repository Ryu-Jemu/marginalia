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

const BEND = 0.45; // where the elbow turns, as a fraction of the *gutter*
const RADIUS = 8;
const HOOK = 3; // radius of the little turn out of the marker
const NOTE_INSET = 6; // stop this far short of the note's left edge
const MARGIN_QUERY = '(min-width: 64rem)';

export interface NoteLink {
  ref: HTMLElement;
  note: HTMLElement;
  path: SVGPathElement;
}

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

  const clear = () => {
    svg.replaceChildren();
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

      built.push({ ref, note, path });
    }

    svg!.appendChild(frag);
    return built;
  }

  function draw(): void {
    if (!inMarginMode()) {
      clear();
      return;
    }
    svg!.replaceChildren();
    links = build();
    doc!.classList.toggle('has-lines', links.length > 0);
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

  const ro = new ResizeObserver(schedule);
  ro.observe(doc);

  const onControls = (e: Event) => {
    if ((e as CustomEvent).detail?.control === 'notes') schedule();
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
