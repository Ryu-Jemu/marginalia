/**
 * The three reading controls: theme, motion, and where the notes sit.
 *
 * `notes` chooses between the margin and the flow — it never hides them. A
 * control that could switch the evidence off would undo the point of the site.
 *
 * State lives on <html> as data attributes so CSS can respond without JS
 * involvement, and it is written by the inline head script before first paint.
 */

type Control = 'theme' | 'motion' | 'notes';

const CYCLE: Record<Control, readonly string[]> = {
  theme: ['light', 'dark'],
  motion: ['on', 'off'],
  notes: ['margin', 'inline'],
};

/**
 * Re-apply the stored reading state to <html>.
 *
 * The inline head script does this before the first paint, but a view
 * transition swaps in the new document's own <html> attributes — which are the
 * server-rendered defaults, with no data-theme and no data-notes. Left alone,
 * the notes stop matching `[data-notes="margin"]` and silently fall out of the
 * margin after the first client-side navigation.
 *
 * Called on astro:after-swap, which runs before the new page paints.
 */
export function applyReadingState(): void {
  const d = document.documentElement;
  const read = (key: Control, fallback: string) => {
    try {
      const v = localStorage.getItem(key);
      return v && CYCLE[key].includes(v) ? v : fallback;
    } catch {
      return fallback;
    }
  };
  d.dataset.theme = read(
    'theme',
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  );
  d.dataset.motion = read('motion', 'on');
  d.dataset.notes = read('notes', 'margin');
  d.classList.remove('no-js');
}

const LABEL: Record<Control, Record<string, string>> = {
  theme: { light: 'Light', dark: 'Dark' },
  motion: { on: 'Motion on', off: 'Motion off' },
  notes: { margin: 'Notes in margin', inline: 'Notes inline' },
};

function current(control: Control): string {
  const v = document.documentElement.dataset[control];
  return v && CYCLE[control].includes(v) ? v : CYCLE[control][0];
}

function apply(control: Control, value: string): void {
  document.documentElement.dataset[control] = value;
  try {
    localStorage.setItem(control, value);
  } catch {
    /* private mode — the attribute still applies for this session */
  }
  // The margin notes are laid out from measured geometry, so a change of
  // theme, motion or placement has to invalidate that measurement.
  window.dispatchEvent(new CustomEvent('marginalia:controls', { detail: { control, value } }));
}

function sync(button: HTMLElement, control: Control): void {
  const value = current(control);
  const label = LABEL[control][value] ?? value;
  button.dataset.value = value;
  button.setAttribute('aria-label', label);
  button.setAttribute('title', label);
  const text = button.querySelector('[data-control-value]');
  if (text) text.textContent = label;
}

export function initControls(): () => void {
  const buttons = [...document.querySelectorAll<HTMLElement>('[data-control]')];
  const handlers: Array<[HTMLElement, (e: Event) => void]> = [];

  for (const button of buttons) {
    const control = button.dataset.control as Control | undefined;
    if (!control || !(control in CYCLE)) continue;

    sync(button, control);

    const onClick = () => {
      const values = CYCLE[control];
      const next = values[(values.indexOf(current(control)) + 1) % values.length];
      apply(control, next);
      for (const b of buttons) {
        const c = b.dataset.control as Control | undefined;
        if (c && c in CYCLE) sync(b, c);
      }
    };

    button.addEventListener('click', onClick);
    handlers.push([button, onClick]);
  }

  return () => {
    for (const [button, onClick] of handlers) button.removeEventListener('click', onClick);
  };
}
