const PASSCODE = '2010';
const CODE_LENGTH = 4;
const GATE_ANIMATION_MS = 600;
const GATE_CELEBRATION_MS = 1450;

export function initPasscode(onOpen) {
  const overlay = document.getElementById('passcode-overlay');
  const dotsEl = document.getElementById('passcode-dots');
  const errorEl = document.getElementById('passcode-error');
  const passcodeCard = document.getElementById('passcode-card');
  const successEl = document.getElementById('gate-success');
  const continueButton = document.getElementById('passcode-continue');
  if (!overlay || !dotsEl || !passcodeCard || !successEl || !continueButton) return;

  const dots = Array.from(dotsEl.querySelectorAll('.passcode-dot'));
  const firstKey = overlay.querySelector('button[data-key]');

  let entered = '';
  let unlocked = false;
  document.body.style.overflow = 'hidden';

  const render = () => {
    dots.forEach((dot, i) => {
      const hasDigit = i < entered.length;
      const isCorrect = hasDigit && entered[i] === PASSCODE[i];
      dot.classList.toggle('passcode-dot-filled', hasDigit);
      dot.classList.toggle('passcode-dot-correct', isCorrect);
      dot.classList.toggle('passcode-dot-wrong', hasDigit && !isCorrect);
    });
    continueButton.disabled = entered !== PASSCODE || unlocked;
    continueButton.classList.toggle('key-btn-continue-ready', !continueButton.disabled);
  };

  const setFeedback = (message, state = '') => {
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.dataset.state = state;
  };

  const spawnCelebration = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const colors = ['#e87573', '#f3bd45', '#e89aa3', '#f39b55', '#78916d'];
    for (let i = 0; i < 22; i += 1) {
      const angle = (Math.PI * 2 * i) / 22 + (Math.random() - 0.5) * 0.28;
      const distance = 65 + Math.random() * 170;
      const petal = document.createElement('span');
      petal.className = 'gate-celebration-petal';
      petal.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
      petal.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
      petal.style.setProperty('--petal-color', colors[i % colors.length]);
      petal.style.setProperty('--flight', `${750 + Math.random() * 450}ms`);
      overlay.appendChild(petal);
      petal.addEventListener('animationend', () => petal.remove(), { once: true });
    }
  };

  const unlock = () => {
    unlocked = true;
    successEl.classList.remove('hidden');
    passcodeCard.classList.add('gate-success-mode');
    overlay.classList.add('gate-celebrating');
    successEl.focus({ preventScroll: true });
    spawnCelebration();
    window.setTimeout(() => {
      overlay.classList.add('gate-closing');
      window.setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = '';
        if (typeof onOpen === 'function') onOpen();
      }, GATE_ANIMATION_MS);
    }, GATE_CELEBRATION_MS);
  };

  const submit = () => {
    if (unlocked) return;
    if (entered === PASSCODE) unlock();
  };

  const pressDigit = (digit) => {
    if (unlocked || entered.length >= CODE_LENGTH) return;
    const index = entered.length;
    entered += digit;
    render();
    dots[index]?.classList.remove('passcode-dot-pop');
    if (dots[index]) {
      void dots[index].offsetWidth;
      dots[index].classList.add('passcode-dot-pop');
    }
    const correctCount = [...entered].filter((value, i) => value === PASSCODE[i]).length;
    if (digit === PASSCODE[index]) {
      setFeedback(
        entered.length === CODE_LENGTH
          ? 'Đúng hết rồi! Mở quà thôi nào! 🎁✨'
          : `Chuẩn rồi đó! Còn ${CODE_LENGTH - entered.length} số nữa, cố lên! 🌼`,
        'success',
      );
    } else {
      const encouragingMessage =
        entered.length === CODE_LENGTH
          ? `Số thứ ${index + 1} chưa đúng — chạm nút xóa để sửa nhé! 💛`
          : entered.length > 1 && correctCount === entered.length - 1
          ? `Gần lắm rồi! Thử lại số thứ ${index + 1} nhé, bạn sắp mở được quà rồi! 💪✨`
          : `Ôi, số thứ ${index + 1} chưa trúng rồi — không sao, thử tiếp nha! 🌷`;
      setFeedback(
        encouragingMessage,
        'error',
      );
    }
  };

  const pressBackspace = () => {
    if (unlocked || entered.length === 0) return;
    entered = entered.slice(0, -1);
    render();
    if (entered.length === 0) setFeedback('');
    else {
      const correctCount = [...entered].filter((value, i) => value === PASSCODE[i]).length;
      setFeedback(
        correctCount === entered.length
          ? 'Ổn rồi đó, tiếp tục nào! 🌟'
          : 'Đã xóa số vừa rồi — mình thử lại nhé! 💛',
        'neutral',
      );
    }
  };

  dotsEl.addEventListener('animationend', (event) => {
    if (event.target === dotsEl && event.animationName === 'shake') dotsEl.classList.remove('shake');
  });
  dotsEl.addEventListener('animationend', (event) => {
    if (event.target instanceof Element && event.animationName === 'passcode-dot-pop') {
      event.target.classList.remove('passcode-dot-pop');
    }
  });

  overlay.querySelectorAll('button[data-key]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      if (key === 'backspace') pressBackspace();
      else pressDigit(key);
    });
  });

  continueButton.addEventListener('click', submit);

  document.addEventListener('keydown', (event) => {
    if (unlocked || event.metaKey || event.ctrlKey || event.altKey) return;
    const targetIsKey =
      event.target instanceof Element && event.target.closest('button[data-key]');
    if (event.key >= '0' && event.key <= '9') {
      pressDigit(event.key);
      event.preventDefault();
    } else if (event.key === 'Backspace') {
      pressBackspace();
      event.preventDefault();
    }
  });

  if (firstKey) {
    window.setTimeout(() => firstKey.focus({ preventScroll: true }), 60);
  }
}
