import { animate, utils } from 'animejs';
import { motionOff } from './observe';

/**
 * The device deck: one frame, and scrolling walks its screens.
 *
 * The markup ships every screen in the flow so that a failure here leaves the
 * row of framed screenshots rather than one screen and a hole. Collapsing to
 * the stack is the first thing this does and the last thing undone on
 * teardown, which is why `data-stacked` is set from script and never in CSS.
 *
 * Position is taken from where the frame sits in the viewport rather than from
 * a wheel counter: the reader stays in control of the page, nothing is
 * captured, and going back up walks the screens back.
 */

type Teardown = () => void;

/** How much of the travel is spent settled on a screen rather than between. */
const SPAN = 0.82;

function setup(deck: HTMLElement): Teardown {
  const shots = [...deck.querySelectorAll<HTMLElement>('[data-deck-shot]')];
  if (shots.length === 0) return () => {};

  const meter = deck.querySelector<HTMLElement>('[data-deck-meter]');
  const label = deck.querySelector<HTMLElement>('[data-deck-label]');
  const dots = [...deck.querySelectorAll<HTMLButtonElement>('[data-deck-dot]')];
  const names = shots.map(
    (s) => s.querySelector('figcaption')?.textContent?.trim() ?? '',
  );

  deck.dataset.stacked = '';
  if (meter) meter.hidden = false;

  let index = -1;
  let pinned: number | null = null;

  function show(next: number, instant = false): void {
    const i = Math.max(0, Math.min(shots.length - 1, next));
    if (i === index) return;
    const previous = index;
    index = i;

    if (label) label.textContent = names[i] ?? '';
    dots.forEach((d, k) => {
      if (k === i) d.setAttribute('aria-current', 'true');
      else d.removeAttribute('aria-current');
    });

    if (instant || motionOff() || previous === -1) {
      shots.forEach((s, k) => utils.set(s, { opacity: k === i ? 1 : 0, translateY: 0, scale: 1 }));
      return;
    }

    // Forward and back read differently: the incoming screen arrives from the
    // direction the reader is travelling.
    const dir = i > previous ? 1 : -1;
    animate(shots[previous], {
      opacity: [1, 0],
      translateY: [0, -14 * dir],
      scale: [1, 0.985],
      duration: 300,
      ease: 'out(2)',
    });
    animate(shots[i], {
      opacity: [0, 1],
      translateY: [16 * dir, 0],
      scale: [0.99, 1],
      duration: 380,
      ease: 'out(3)',
    });
  }

  let frame = 0;
  function update(): void {
    if (pinned !== null) return;
    const r = deck.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    // 0 when the frame's top reaches the lower third, 1 when its bottom
    // clears the upper third — the stretch a reader scrolls it through.
    const travel = r.height + vh * 0.5;
    const progress = (vh * 0.75 - r.top) / travel;
    const eased = (progress - (1 - SPAN) / 2) / SPAN;
    show(Math.round(Math.max(0, Math.min(1, eased)) * (shots.length - 1)));
  }

  const onScroll = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  };

  // Clicking a marker takes over; scrolling on hands it back.
  const onDot = (e: Event) => {
    const el = (e.currentTarget as HTMLElement).dataset.i;
    if (el === undefined) return;
    pinned = Number(el);
    show(pinned);
    window.setTimeout(() => {
      pinned = null;
    }, 900);
  };
  for (const d of dots) d.addEventListener('click', onDot);

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  show(0, true);
  update();

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    for (const d of dots) d.removeEventListener('click', onDot);
    // Put the row back exactly as it shipped.
    for (const s of shots) utils.set(s, { opacity: 1, translateY: 0, scale: 1 });
    delete deck.dataset.stacked;
    if (meter) meter.hidden = true;
  };
}

export function initDeck(): Teardown {
  const stops = [...document.querySelectorAll<HTMLElement>('[data-phone-deck]')].map(setup);
  return () => {
    for (const stop of stops) stop();
  };
}
