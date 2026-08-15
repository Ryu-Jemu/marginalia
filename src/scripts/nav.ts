/**
 * Marks which section the reader is currently in.
 *
 * The naive version — highlight whatever is intersecting — flickers between two
 * neighbours at a section boundary and lights up nothing at the very top or
 * bottom of the page. This tracks the last section whose top has passed the
 * bar, which is stable and matches what a reader would say they are looking at.
 */
export function initNav(): () => void {
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-nav-link][data-watches]')];
  const watched = links
    .map((link) => ({ link, section: document.getElementById(link.dataset.watches ?? '') }))
    .filter((w): w is { link: HTMLAnchorElement; section: HTMLElement } => w.section !== null);

  if (watched.length === 0) return () => {};

  let frame = 0;

  function update(): void {
    // Where an anchor jump actually parks a section: the root's
    // `scroll-padding-top` and the section's own `scroll-margin-top` add, so
    // measured against the bar alone the heading lands far below the line and
    // the marker sits one section behind on every click. Read both rather than
    // guess a constant — 88 + 80 here, and neither is a number to hard-code.
    const px = (v: string) => Number.parseFloat(v) || 0;
    const line =
      px(getComputedStyle(document.documentElement).scrollPaddingTop) +
      px(getComputedStyle(watched[0].section).scrollMarginTop) +
      2;
    // The current *section*, not the current link: the bar and the side rail
    // both watch the same ids, and marking one link would leave whichever of
    // them came second in the DOM as the only one lit.
    let current: string | null = null;
    for (const { link, section } of watched) {
      if (section.getBoundingClientRect().top <= line) current = link.dataset.watches ?? null;
    }
    for (const { link } of watched) {
      if (current !== null && link.dataset.watches === current) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    }
  }

  const onScroll = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  };
}
