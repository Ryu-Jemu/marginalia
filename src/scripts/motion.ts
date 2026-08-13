import { createScope, type Scope } from 'animejs';
import { applyReadingState, initControls } from './controls';
import { initNoteLines } from './note-lines';
import { initBoundaries } from './boundaries';
import { initNav } from './nav';
import { initViz } from './viz';

/**
 * Lifecycle for everything scripted on the page.
 *
 * With view transitions the document is swapped rather than reloaded, so
 * anything holding a reference to the old DOM has to let go of it. anime's
 * scope reverts the animations it created; observers and listeners attached
 * directly to elements are not its business, so each initialiser returns its
 * own teardown and both run on every swap.
 */

let scope: Scope | undefined;
let teardown: Array<() => void> = [];

function stop(): void {
  for (const fn of teardown) {
    try {
      fn();
    } catch {
      /* a teardown must never block the swap */
    }
  }
  teardown = [];
  scope?.revert();
  scope = undefined;
}

function start(): void {
  stop();
  scope = createScope({ root: document.body }).add(() => {
    teardown = [initControls(), initNav(), initNoteLines(), initBoundaries(), initViz()];
  });
}

document.addEventListener('astro:page-load', start);
document.addEventListener('astro:before-swap', stop);
// The swap brings the new document's own <html> attributes with it, so the
// reading state has to be written back before the new page paints.
document.addEventListener('astro:after-swap', applyReadingState);

// astro:page-load also fires on the first load, but only when the view
// transition router is on the page. Starting directly when it has not fired
// keeps the site working if the router is ever removed.
if (!document.documentElement.hasAttribute('data-astro-transition-scope')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (!scope) start();
    });
  } else if (!scope) {
    start();
  }
}
