import { animate, utils } from 'animejs';
import { motionOff } from './observe';

/**
 * The device deck: one frame, and the reader steps through its screens.
 *
 * The markup ships every screen in the flow so that a failure here leaves the
 * row of framed screenshots rather than one screen and a hole. Collapsing to
 * the stack is the first thing this does and the last thing undone on
 * teardown, which is why `data-stacked` is set from script and never in CSS.
 *
 * Nothing here listens to the page's scroll. The reader moves the deck by
 * asking it to move, which means the position survives scrolling past and
 * coming back, and a phone three sections up is not quietly rewinding itself.
 */

type Teardown = () => void;

function setup(deck: HTMLElement): Teardown {
  const shots = [...deck.querySelectorAll<HTMLElement>('[data-deck-shot]')];
  if (shots.length === 0) return () => {};

  const meter = deck.querySelector<HTMLElement>('[data-deck-meter]');
  const label = deck.querySelector<HTMLElement>('[data-deck-label]');
  const dots = [...deck.querySelectorAll<HTMLButtonElement>('[data-deck-dot]')];
  const arrows = [...deck.querySelectorAll<HTMLButtonElement>('[data-deck-step]')];
  const names = shots.map((s) => s.querySelector('figcaption')?.textContent?.trim() ?? '');

  deck.dataset.stacked = '';
  if (meter) meter.hidden = false;
  for (const a of arrows) a.hidden = false;

  let index = -1;

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
    // Disabled rather than hidden: a control that disappears at the end of the
    // set moves the frame sideways, and the frame is the thing being read.
    for (const a of arrows) {
      const step = Number(a.dataset.deckStep ?? 0);
      a.disabled = i + step < 0 || i + step > shots.length - 1;
    }

    if (instant || motionOff() || previous === -1) {
      shots.forEach((s, k) => utils.set(s, { opacity: k === i ? 1 : 0, translateX: 0, scale: 1 }));
      return;
    }

    // Forward and back read differently: the incoming screen arrives from the
    // side the reader asked to travel towards.
    const dir = i > previous ? 1 : -1;
    animate(shots[previous], {
      opacity: [1, 0],
      translateX: [0, `${-6 * dir}%`],
      scale: [1, 0.985],
      duration: 260,
      ease: 'out(2)',
    });
    animate(shots[i], {
      opacity: [0, 1],
      translateX: [`${8 * dir}%`, '0%'],
      scale: [0.99, 1],
      duration: 340,
      ease: 'out(3)',
    });
  }

  const onArrow = (e: Event) => {
    const step = Number((e.currentTarget as HTMLElement).dataset.deckStep ?? 0);
    show(index + step);
  };
  const onDot = (e: Event) => {
    const i = (e.currentTarget as HTMLElement).dataset.i;
    if (i !== undefined) show(Number(i));
  };
  // Once anything in the deck has focus the arrow keys mean the deck, which is
  // how a reader who is not using a mouse gets at the other screens.
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') show(index + 1);
    else if (e.key === 'ArrowLeft') show(index - 1);
    else return;
    e.preventDefault();
  };

  for (const a of arrows) a.addEventListener('click', onArrow);
  for (const d of dots) d.addEventListener('click', onDot);
  deck.addEventListener('keydown', onKey);

  show(0, true);

  return () => {
    for (const a of arrows) a.removeEventListener('click', onArrow);
    for (const d of dots) d.removeEventListener('click', onDot);
    deck.removeEventListener('keydown', onKey);
    // Put the row back exactly as it shipped.
    for (const s of shots) utils.set(s, { opacity: 1, translateX: 0, scale: 1 });
    delete deck.dataset.stacked;
    if (meter) meter.hidden = true;
    for (const a of arrows) {
      a.hidden = true;
      a.disabled = false;
    }
  };
}

export function initDeck(): Teardown {
  const stops = [...document.querySelectorAll<HTMLElement>('[data-phone-deck]')].map(setup);
  return () => {
    for (const stop of stops) stop();
  };
}
