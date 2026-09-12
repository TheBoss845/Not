import { useEffect } from 'react';

const selector = '[data-tv-focusable="true"]:not([disabled]):not([aria-hidden="true"])';

function center(rect) {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function chooseNext(current, elements, direction) {
  const a = center(current.getBoundingClientRect());
  const candidates = elements
    .filter((el) => el !== current)
    .map((el) => {
      const b = center(el.getBoundingClientRect());
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const valid = direction === 'left' ? dx < -4 : direction === 'right' ? dx > 4 : direction === 'up' ? dy < -4 : dy > 4;
      if (!valid) return null;
      const primary = direction === 'left' || direction === 'right' ? Math.abs(dx) : Math.abs(dy);
      const secondary = direction === 'left' || direction === 'right' ? Math.abs(dy) : Math.abs(dx);
      return { el, score: primary + secondary * 2.25 };
    })
    .filter(Boolean)
    .sort((x, y) => x.score - y.score);
  return candidates[0]?.el ?? null;
}

export function useSpatialNavigation(enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined;
    const onKey = (event) => {
      const target = event.target;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) return;
      const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
      if (map[event.key]) {
        const els = [...document.querySelectorAll(selector)].filter((el) => el.offsetParent !== null);
        if (!els.length) return;
        const active = document.activeElement && els.includes(document.activeElement) ? document.activeElement : els[0];
        const next = chooseNext(active, els, map[event.key]);
        if (next) {
          event.preventDefault();
          next.focus({ preventScroll: false });
          next.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      } else if (event.key === 'Enter' && document.activeElement?.matches?.(selector)) {
        document.activeElement.click();
      } else if (event.key === 'Escape' || event.key === 'Backspace') {
        window.dispatchEvent(new CustomEvent('notflix:back'));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled]);
}
