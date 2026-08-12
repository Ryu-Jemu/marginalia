/**
 * Reveal-on-scroll with a deadline.
 *
 * Anything that hides content in order to animate it in has to answer one
 * question: what happens if the trigger never fires? Fast scrolling past a
 * target, a detached observer after a page swap, an IntersectionObserver that
 * never resolves — each of those leaves the content invisible with no error.
 *
 * So every observation here carries a timeout. If the callback has not run by
 * then it runs anyway. The animation is an enhancement; the content is not.
 */

const DEADLINE = 2500;
const ROOT_MARGIN = '0px 0px -12% 0px';

export function whenInView(
  target: Element,
  reveal: () => void,
  { rootMargin = ROOT_MARGIN, deadline = DEADLINE }: { rootMargin?: string; deadline?: number } = {},
): () => void {
  let done = false;

  const run = () => {
    if (done) return;
    done = true;
    clearTimeout(timer);
    observer?.disconnect();
    reveal();
  };

  const timer = setTimeout(run, deadline);

  let observer: IntersectionObserver | undefined;
  if (typeof IntersectionObserver === 'undefined') {
    run();
    return () => clearTimeout(timer);
  }

  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) run();
    },
    { rootMargin, threshold: 0 },
  );
  observer.observe(target);

  // Already on screen at load: reveal on the next frame rather than waiting
  // for a scroll that may never come.
  requestAnimationFrame(() => {
    const r = target.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) run();
  });

  return () => {
    done = true;
    clearTimeout(timer);
    observer?.disconnect();
  };
}

/** True when the reader has asked for no motion, by system setting or control. */
export function motionOff(): boolean {
  return (
    document.documentElement.dataset.motion === 'off' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
