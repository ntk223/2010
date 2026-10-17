const BURST_COUNT = 14;
const BURST_LIFETIME_MS = 850;
const BIT_DISTANCE_MIN = 0.28;
const BIT_DISTANCE_MAX = 0.78;
const BIT_VERTICAL_SQUASH = 0.8;
const BIT_RISE_PX = 20;

export function initBouquetTouch() {
  const bouquet = document.getElementById('bouquet');
  const hint = document.getElementById('bouquet-hint');
  if (!bouquet) return;

  let burstActive = false;
  let hintDismissed = false;

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const dismissHint = () => {
    if (hintDismissed || !hint) return;
    hintDismissed = true;
    hint.classList.add('bouquet-hint-hidden');
  };

  const bounce = () => {
    bouquet.classList.remove('bouquet-bounce');
    void bouquet.offsetWidth;
    bouquet.classList.add('bouquet-bounce');
  };

  const spawnBurst = () => {
    const rect = bouquet.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    for (let i = 0; i < BURST_COUNT; i += 1) {
      const bit = document.createElement('span');
      const variant = i % 4;
      bit.className =
        variant === 3
          ? 'burst-bit burst-bit-heart'
          : variant === 2
            ? 'burst-bit burst-bit-blush'
            : 'burst-bit';
      const angle = Math.random() * Math.PI * 2;
      const dist = rect.width * (BIT_DISTANCE_MIN + Math.random() * (BIT_DISTANCE_MAX - BIT_DISTANCE_MIN));
      bit.style.setProperty('--bx', `${Math.round(Math.cos(angle) * dist)}px`);
      bit.style.setProperty(
        '--by',
        `${Math.round(Math.sin(angle) * dist * BIT_VERTICAL_SQUASH - BIT_RISE_PX)}px`
      );
      bit.style.setProperty('--br', `${Math.round(-160 + Math.random() * 320)}deg`);
      bit.style.setProperty('--bd', `${(0.7 + Math.random() * 0.2).toFixed(2)}s`);
      bit.style.left = `${Math.round(centerX)}px`;
      bit.style.top = `${Math.round(centerY + (Math.random() - 0.5) * rect.height * 0.3)}px`;
      document.body.appendChild(bit);
      window.setTimeout(() => bit.remove(), BURST_LIFETIME_MS);
    }
  };

  const handleTap = () => {
    if (!prefersReducedMotion()) {
      if (!burstActive) {
        burstActive = true;
        bounce();
        spawnBurst();
        window.setTimeout(() => {
          burstActive = false;
        }, BURST_LIFETIME_MS);
      }
    }
    if (typeof navigator.vibrate === 'function') navigator.vibrate(15);
    dismissHint();
  };

  bouquet.addEventListener('click', handleTap);
  bouquet.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTap();
    }
  });
}
