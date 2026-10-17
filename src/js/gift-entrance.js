const FLY_BIT_COUNT = 16;
const FLY_MIN_MS = 1250;
const FLY_MAX_MS = 1500;
const PRESENT_AT_MS = 1700;
const HOLD_AT_MS = 3000;
const HINT_DELAY_MS = 500;
const REVEAL_AFTER_DISMISS_MS = 350;
const SETTLE_CLEANUP_MS = 700;
const BIT_SIZE_MIN = 10;
const BIT_SIZE_MAX = 16;
const EDGE_OFFSCREEN_PX = 40;

export function initGiftEntrance() {
  let hasRun = false;

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const spawnFlyingBits = () => {
    const targetX = window.innerWidth / 2;
    const targetY = window.innerHeight / 2 - window.innerHeight * 0.04;
    for (let i = 0; i < FLY_BIT_COUNT; i += 1) {
      const bit = document.createElement('span');
      const variant = i % 4;
      bit.className =
        variant === 3
          ? 'gift-bit gift-bit-heart'
          : variant === 2
            ? 'gift-bit gift-bit-blush'
            : 'gift-bit';
      const size = Math.round(BIT_SIZE_MIN + Math.random() * (BIT_SIZE_MAX - BIT_SIZE_MIN));
      bit.style.width = `${size}px`;
      bit.style.height = `${Math.round(size * 1.2)}px`;

      const alongX = Math.random() * window.innerWidth;
      const alongY = Math.random() * window.innerHeight;
      const edge = i % 4;
      let startX;
      let startY;
      if (edge === 0) {
        startX = alongX;
        startY = -EDGE_OFFSCREEN_PX;
      } else if (edge === 1) {
        startX = window.innerWidth + EDGE_OFFSCREEN_PX;
        startY = alongY;
      } else if (edge === 2) {
        startX = alongX;
        startY = window.innerHeight + EDGE_OFFSCREEN_PX;
      } else {
        startX = -EDGE_OFFSCREEN_PX;
        startY = alongY;
      }
      bit.style.left = `${Math.round(startX)}px`;
      bit.style.top = `${Math.round(startY)}px`;
      bit.style.setProperty('--gx', `${Math.round(targetX - startX)}px`);
      bit.style.setProperty('--gy', `${Math.round(targetY - startY)}px`);
      bit.style.setProperty('--gr', `${Math.round(-220 + Math.random() * 440)}deg`);
      bit.style.setProperty('--gc', `${Math.round(-70 + Math.random() * 140)}px`);
      const duration = Math.round(FLY_MIN_MS + Math.random() * (FLY_MAX_MS - FLY_MIN_MS));
      bit.style.setProperty('--gd', `${duration}ms`);
      document.body.appendChild(bit);
      window.setTimeout(() => bit.remove(), duration + 80);
    }
  };

  const startHold = (row, onReveal) => {
    const hint = document.getElementById('gift-hint');
    let dismissed = false;
    let hintTimer = 0;

    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      window.clearTimeout(hintTimer);
      document.removeEventListener('click', onOutsideTap);
      document.removeEventListener('keydown', onKeyDown);
      if (hint) hint.classList.remove('gift-hint-visible');
      document.body.classList.remove('gift-stage-active');
      document.body.classList.add('gift-stage-ending');
      window.setTimeout(() => document.body.classList.remove('gift-stage-ending'), 700);
      row.classList.remove('gift-holding', 'gift-present');
      row.classList.add('gift-settle');
      window.setTimeout(() => {
        if (typeof onReveal === 'function') onReveal();
      }, REVEAL_AFTER_DISMISS_MS);
      window.setTimeout(() => row.classList.remove('gift-settle'), SETTLE_CLEANUP_MS);
    };

    const onOutsideTap = (event) => {
      if (event.target instanceof Element) {
        if (row.contains(event.target)) return;
        const modal = document.getElementById('card-modal');
        if (modal && !modal.classList.contains('hidden') && modal.contains(event.target)) return;
      }
      dismiss();
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') dismiss();
    };

    document.addEventListener('click', onOutsideTap);
    document.addEventListener('keydown', onKeyDown);
    if (hint) {
      hintTimer = window.setTimeout(() => hint.classList.add('gift-hint-visible'), HINT_DELAY_MS);
    }
  };

  const run = (onReveal) => {
    if (hasRun) return false;
    hasRun = true;
    if (prefersReducedMotion()) return false;
    const row = document.getElementById('gift-row');
    if (!row) return false;
    document.body.classList.add('gift-stage-active');
    row.classList.add('gift-hidden');
    spawnFlyingBits();
    window.setTimeout(() => {
      row.classList.remove('gift-hidden');
      row.classList.add('gift-present');
    }, PRESENT_AT_MS);
    window.setTimeout(() => startHold(row, onReveal), HOLD_AT_MS);
    return true;
  };

  return { run };
}
