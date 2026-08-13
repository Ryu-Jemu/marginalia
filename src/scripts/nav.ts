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

  const nav = document.querySelector<HTMLElement>('.nav');
  let frame = 0;

  function update(): void {
    const line = (nav?.getBoundingClientRect().height ?? 0) + 8;
    let current: HTMLAnchorElement | null = null;
    for (const { link, section } of watched) {
      if (section.getBoundingClientRect().top <= line) current = link;
    }
    for (const { link } of watched) {
      if (link === current) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
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
