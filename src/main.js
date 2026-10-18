import './style.css';

import { initPetals } from './js/petals.js';
import { initBouquet } from './js/bouquet.js';
import { initBouquetTouch } from './js/bouquet-touch.js';
import { initGiftEntrance } from './js/gift-entrance.js';
import { initCard } from './js/card.js';
import { initShare } from './js/share.js';
import { initNtkNote } from './js/ntk-note.js';
import { initPasscode } from './js/passcode.js';
import { initFlowerCrate } from './js/flower-crate.js';

function boot() {
  initPetals();
  initBouquet();
  initBouquetTouch();
  const giftEntrance = initGiftEntrance();
  initCard();
  initShare();
  initNtkNote();
  initFlowerCrate();
  initPasscode(() => {
    const hero = document.getElementById('hero');
    const choreographed = giftEntrance.run(() => {
      if (hero) hero.classList.add('hero-visible');
    });
    if (!choreographed && hero) hero.classList.add('hero-visible');
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
