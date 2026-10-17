export function initBouquet() {
  const container = document.getElementById('bouquet');
  if (!container) return;
  const assetBase = import.meta.env.BASE_URL;

  const petals = Array.from({ length: 12 }, (_, index) => {
    const positions = [
      ['16%', '12%'], ['76%', '9%'], ['34%', '20%'], ['88%', '30%'],
      ['8%', '38%'], ['58%', '32%'], ['25%', '48%'], ['82%', '54%'],
      ['43%', '62%'], ['13%', '70%'], ['69%', '76%'], ['53%', '14%'],
    ];
    const [x, y] = positions[index];
    const drift = [-18, 14, -10, 20, -14, 11][index % 6];
    const fall = 42 + (index % 4) * 10;
    const duration = 4.8 + (index % 5) * 0.7;
    return `<span class="bouquet-petal bouquet-petal-${index % 4}" style="--x:${x};--y:${y};--delay:${index * -0.72}s;--duration:${duration}s;--drift:${drift}px;--fall:${fall}px;--spin:${index % 2 ? 220 : -250}deg" aria-hidden="true"></span>`;
  }).join('');

  container.innerHTML = `
    <div class="bouquet-art" role="img" aria-label="Bó hoa nhiều màu được gói giấy xanh đậm">
      <img class="bouquet-illustration" src="${assetBase}images/bouquet2.svg" alt="" draggable="false" />
      <div class="bouquet-petals" aria-hidden="true">${petals}</div>
      <div class="art-lace" aria-hidden="true"></div>
    </div>`;
}
