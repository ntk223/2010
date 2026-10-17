const GREETING_PARAGRAPHS = [
  'Nhân ngày 20/10, xin gửi những lời chúc tốt đẹp nhất đến tất cả những người phụ nữ tuyệt vời.',
  'Chúc mọi người luôn mạnh khỏe, vui vẻ, bình an và hạnh phúc. Mong rằng mỗi ngày đều có những niềm vui nho nhỏ, những điều bất ngờ đáng yêu và thật nhiều khoảnh khắc khiến mọi người mỉm cười.',
  'Dù là mẹ, chị, em hay những người bạn thân thương, mong mọi người luôn được yêu thương, trân trọng và tự tin sống theo cách mình mong muốn.',
];

const OPEN_DELAY_MS = 850;
const PARAGRAPH_PAUSE_MS = 350;
const TYPE_MIN_MS = 26;
const TYPE_MAX_MS = 56;

export function initCard() {
  const trigger = document.getElementById('card');
  const modal = document.getElementById('card-modal');
  const textEl = document.getElementById('card-text');
  const closeBtn = document.getElementById('card-close');
  const sheet = modal?.querySelector('.card-sheet');
  if (!trigger || !modal || !textEl || !closeBtn || !sheet) return;

  let timers = [];
  let lastFocused = null;
  let opening = false;
  let lockedScrollY = 0;
  let previousBodyStyles = null;

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const clearTimers = () => {
    timers.forEach((id) => window.clearTimeout(id));
    timers = [];
  };

  const typeGreeting = () => {
    clearTimers();
    textEl.textContent = '';
    if (prefersReducedMotion()) {
      GREETING_PARAGRAPHS.forEach((text) => {
        const paragraph = document.createElement('p');
        paragraph.className = 'card-paragraph';
        paragraph.textContent = text;
        textEl.appendChild(paragraph);
      });
      return;
    }
    const caret = document.createElement('span');
    caret.className = 'card-cursor';
    caret.setAttribute('aria-hidden', 'true');
    let paraIdx = 0;
    let charIdx = 0;
    let currentPara = null;

    const step = () => {
      if (paraIdx >= GREETING_PARAGRAPHS.length) return;
      const text = GREETING_PARAGRAPHS[paraIdx];
      if (charIdx === 0) {
        currentPara = document.createElement('p');
        currentPara.className = 'card-paragraph';
        textEl.appendChild(currentPara);
        currentPara.appendChild(caret);
      }
      currentPara.insertBefore(document.createTextNode(text[charIdx]), caret);
      charIdx += 1;
      if (charIdx >= text.length) {
        paraIdx += 1;
        charIdx = 0;
        if (paraIdx < GREETING_PARAGRAPHS.length) {
          timers.push(window.setTimeout(step, PARAGRAPH_PAUSE_MS));
        }
        return;
      }
      timers.push(
        window.setTimeout(step, TYPE_MIN_MS + Math.random() * (TYPE_MAX_MS - TYPE_MIN_MS))
      );
    };
    step();
  };

  const open = () => {
    if (opening || !modal.classList.contains('hidden')) return;
    opening = true;
    opening = false;
    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    lockedScrollY = window.scrollY;
    previousBodyStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    };
    document.body.style.position = 'fixed';
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = `${document.documentElement.clientWidth}px`;
    modal.classList.remove('hidden');
    sheet.classList.remove('card-opening');
    window.requestAnimationFrame(() => sheet.classList.add('card-opening'));
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
    timers.push(window.setTimeout(typeGreeting, OPEN_DELAY_MS));
  };

  const close = () => {
    clearTimers();
    modal.classList.add('hidden');
    sheet.classList.remove('card-opening');
    if (previousBodyStyles) {
      Object.assign(document.body.style, previousBodyStyles);
      previousBodyStyles = null;
      window.scrollTo(0, lockedScrollY);
    }
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    lastFocused = null;
  };

  trigger.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) close();
  });
}
