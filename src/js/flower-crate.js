const FLOWERS = [
  { icon: '🌷', name: 'Hoa tulip', wish: 'Mong mỗi ngày của bạn đều có một điều đáng mong chờ.' },
  { icon: '🌹', name: 'Hoa hồng', wish: 'Chúc bạn luôn rạng rỡ và tự tin theo cách riêng.' },
  { icon: '🌻', name: 'Hoa hướng dương', wish: 'Chúc bạn luôn tìm thấy ánh nắng trong những ngày bình thường.' },
  { icon: '🌸', name: 'Hoa anh đào', wish: 'Mong những điều dịu dàng và tốt đẹp luôn ghé thăm bạn.' },
  { icon: '🌺', name: 'Hoa dâm bụt', wish: 'Chúc niềm vui nhỏ hôm nay nở thành thật nhiều hạnh phúc.' },
  { icon: '🪷', name: 'Hoa sen', wish: 'Chúc bạn luôn bình yên và vững vàng theo cách dịu dàng nhất.' },
  { icon: '🌼', name: 'Hoa cúc', wish: 'Mong những niềm vui giản dị luôn làm ngày của bạn tươi sáng.' },
  { icon: '🪻', name: 'Hoa dạ lan hương', wish: 'Chúc những điều mới mẻ mang đến cho bạn nhiều cảm hứng.' },
];

const PREVIEW_COUNT = 9;
const ROLL_COUNT = 31;
const WINNING_INDEX = 24;
const SPIN_MS = 5700;

export function initFlowerCrate() {
  const windowEl = document.getElementById('crate-window');
  const track = document.getElementById('crate-track');
  const openButton = document.getElementById('crate-open');
  const result = document.getElementById('crate-result');
  const resultFlower = document.getElementById('crate-result-flower');
  const resultName = document.getElementById('crate-result-name');
  const resultWish = document.getElementById('crate-result-wish');
  if (!windowEl || !track || !openButton || !result || !resultFlower || !resultName || !resultWish) return;

  let spinning = false;
  let spinTimer = 0;

  const makeCard = (flower) => {
    const card = document.createElement('div');
    card.className = 'crate-item';
    card.setAttribute('aria-hidden', 'true');
    const icon = document.createElement('span');
    icon.className = 'crate-item-flower';
    icon.textContent = flower.icon;
    const name = document.createElement('span');
    name.className = 'crate-item-name';
    name.textContent = flower.name;
    card.append(icon, name);
    return card;
  };

  const renderTrack = (flowers) => {
    track.replaceChildren(...flowers.map(makeCard));
  };

  const setButtonLabel = (label) => {
    openButton.replaceChildren();
    const icon = document.createElement('span');
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '✿';
    openButton.append(icon, document.createTextNode(` ${label}`));
  };

  const finishSpin = (flower) => {
    spinning = false;
    resultFlower.textContent = flower.icon;
    resultName.textContent = flower.name;
    resultWish.textContent = flower.wish;
    result.hidden = false;
    result.classList.remove('crate-result-show');
    void result.offsetWidth;
    result.classList.add('crate-result-show');
    openButton.disabled = false;
    setButtonLabel('Mở hòm lần nữa');
  };

  const openCrate = () => {
    if (spinning) return;
    spinning = true;
    openButton.disabled = true;
    setButtonLabel('Đang tìm bó hoa…');
    result.hidden = true;

    const winningFlower = FLOWERS[Math.floor(Math.random() * FLOWERS.length)];
    const roll = Array.from({ length: ROLL_COUNT }, () => FLOWERS[Math.floor(Math.random() * FLOWERS.length)]);
    roll[WINNING_INDEX] = winningFlower;
    renderTrack(roll);
    track.classList.remove('crate-track-spinning');
    track.style.transition = 'none';
    track.style.transform = 'translateX(0px)';

    const item = track.children[WINNING_INDEX];
    const itemCenter = item.offsetLeft + item.offsetWidth / 2;
    const offset = windowEl.clientWidth / 2 - itemCenter;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduceMotion ? 0 : SPIN_MS;

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        track.style.transition = reduceMotion ? 'none' : `transform ${duration}ms cubic-bezier(.08,.72,.12,1)`;
        track.style.transform = `translateX(${offset}px)`;
        if (spinTimer) window.clearTimeout(spinTimer);
        spinTimer = window.setTimeout(() => finishSpin(winningFlower), duration + 100);
      });
    });
  };

  renderTrack(Array.from({ length: PREVIEW_COUNT }, (_, index) => FLOWERS[index % FLOWERS.length]));
  openButton.addEventListener('click', openCrate);
}
