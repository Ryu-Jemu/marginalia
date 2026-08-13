import { animate, createDrawable, utils } from 'animejs';
import { motionOff, whenInView } from './observe';

/**
 * The amber frame around a limit is stroked on entry — the same drawing
 * technique as the leader lines, in the other colour and the other shape. A
 * result gets a line to its evidence; an edge gets a box drawn around it. The
 * two are deliberately not interchangeable.
 */
export function initBoundaries(): () => void {
  const blocks = [...document.querySelectorAll<HTMLElement>('[data-boundary]')];
  if (blocks.length === 0) return () => {};

  const rects = blocks
    .map((b) => b.querySelector<SVGRectElement>('rect'))
    .filter((r): r is SVGRectElement => r !== null);
  if (rects.length === 0) return () => {};

  // One proxy per rect, created once — createDrawable skips initialisation on
  // an element whose pathLength is already normalised.
  const drawables = rects.map((r) => createDrawable(r, 0, 0)[0]);

  // Same rule as the leader lines: with motion off the frame is simply there.
  if (motionOff()) {
    for (const d of drawables) d.setAttribute('draw', '0 1');
    return () => {};
  }

  const stops = blocks.map((block, i) => {
    const drawable = drawables[i];
    if (!drawable) return () => {};
    return whenInView(block, () => {
      animate(drawable, {
        draw: '0 1',
        duration: 820,
        ease: 'inOut(2)',
        delay: i * 70,
      });
    });
  });

  const onControls = (e: Event) => {
    if ((e as CustomEvent).detail?.control !== 'motion' || !motionOff()) return;
    utils.set(rects, { opacity: 1 });
    for (const d of drawables) d.setAttribute('draw', '0 1');
  };
  window.addEventListener('marginalia:controls', onControls);

  return () => {
    for (const stop of stops) stop();
    window.removeEventListener('marginalia:controls', onControls);
  };
}
