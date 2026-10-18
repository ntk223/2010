export function initNtkNote() {
  const trigger = document.getElementById('ntk-note-trigger');
  const note = document.getElementById('ntk-note');
  if (!trigger || !note) return;

  let hideTimer;
  const closeNote = () => {
    note.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
  };

  trigger.addEventListener('click', () => {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    window.clearTimeout(hideTimer);
    if (isOpen) {
      closeNote();
      return;
    }
    note.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    hideTimer = window.setTimeout(closeNote, 2800);
  });

  document.addEventListener('click', (event) => {
    if (!trigger.contains(event.target) && !note.contains(event.target)) {
      window.clearTimeout(hideTimer);
      closeNote();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !note.hidden) {
      window.clearTimeout(hideTimer);
      closeNote();
      trigger.focus();
    }
  });
}
