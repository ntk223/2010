const PETAL_COLORS = [
  'rgba(251, 113, 133,',
  'rgba(244, 114, 182,',
  'rgba(143, 169, 204,',
  'rgba(196, 214, 236,',
];

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

export function initPetals() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'petal-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  hero.prepend(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let petals = [];

  function createPetal(fromTop) {
    return {
      baseX: randomBetween(0, width),
      y: fromTop ? -randomBetween(12, 48) : randomBetween(0, height),
      size: randomBetween(5, 13),
      fallSpeed: randomBetween(0.35, 1.1),
      swayAmplitude: randomBetween(16, 44),
      swaySpeed: randomBetween(0.5, 1.2),
      phase: randomBetween(0, Math.PI * 2),
      rotation: randomBetween(0, Math.PI * 2),
      rotationSpeed: randomBetween(-0.015, 0.015),
      alpha: randomBetween(0.3, 0.7),
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    };
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = hero.clientWidth;
    height = hero.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = window.innerWidth < 640 ? 10 : 18;
    petals = Array.from({ length: count }, () => createPetal(false));
  }

  function drawPetal(petal, x) {
    ctx.save();
    ctx.translate(x, petal.y);
    ctx.rotate(petal.rotation);
    ctx.globalAlpha = petal.alpha;
    ctx.fillStyle = `${petal.color} 1)`;
    ctx.beginPath();
    ctx.ellipse(0, 0, petal.size, petal.size * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function tick(timestamp) {
    ctx.clearRect(0, 0, width, height);
    const t = timestamp / 1000;
    for (let i = 0; i < petals.length; i += 1) {
      const petal = petals[i];
      petal.y += petal.fallSpeed;
      petal.rotation += petal.rotationSpeed;
      if (petal.y - petal.size > height) {
        petals[i] = createPetal(true);
        continue;
      }
      const sway = Math.sin(t * petal.swaySpeed + petal.phase) * petal.swayAmplitude;
      drawPetal(petal, petal.baseX + sway);
    }
    window.requestAnimationFrame(tick);
  }

  window.addEventListener('resize', resize);
  resize();
  window.requestAnimationFrame(tick);
}
