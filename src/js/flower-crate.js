const FLOWERS = [
  { icon: '💐', name: 'Cẩm chướng', wish: 'Mong bạn luôn được yêu thương và trân trọng.' },
  { icon: '🌹', name: 'Hoa hồng', wish: 'Chúc bạn luôn rạng rỡ và tự tin theo cách riêng.' },
  { icon: '🌷', name: 'Tulip dịu dàng', wish: 'Mong mỗi ngày của bạn đều có một điều đáng mong chờ.' },
  { icon: '🌻', name: 'Hướng dương', wish: 'Chúc bạn luôn tìm thấy ánh nắng trong những ngày bình thường.' },
  { icon: '🌼', name: 'Cúc bình yên', wish: 'Mong lòng bạn luôn nhẹ nhàng và an yên.' },
  { icon: '🌺', name: 'Hoa bí ẩn', wish: 'Chúc niềm vui nhỏ hôm nay nở thành thật nhiều hạnh phúc.' },
  { icon: '🪷', name: 'Sen thanh khiết', wish: 'Chúc bạn luôn bình yên và vững vàng theo cách dịu dàng nhất.' },
  { icon: '🪻', name: 'Oải hương', wish: 'Mong những ngày của bạn luôn thơm dịu và thư thái.' },
  { icon: '💮', name: 'Mẫu đơn', wish: 'Chúc bạn đón nhận thật nhiều yêu thương và may mắn.' },
  { icon: '🏵️', name: 'Cúc đồng tiền', wish: 'Mong mỗi ngày đều có một niềm vui nhỏ làm bạn mỉm cười.' },
  { icon: '🌸', name: 'Đào phai', wish: 'Chúc tuổi mới của bạn nở rộ với nhiều điều tốt đẹp.' },
  { icon: '🌷', name: 'Tulip hồng', wish: 'Mong bạn luôn được nâng niu và sống thật rạng rỡ.' },
  { icon: '🌹', name: 'Hồng pastel', wish: 'Chúc trái tim bạn luôn ấm áp và đầy ắp yêu thương.' },
  { icon: '🌿', name: 'Lá xanh dịu dàng', wish: 'Mong bạn có thật nhiều sức khỏe, bình an và năng lượng mới.' },
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
