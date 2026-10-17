const TOAST_VISIBLE_MS = 2200;
const SHARE_TEXT = 'Chúc mừng ngày Phụ nữ Việt Nam 20/10! 🌸';

export function initShare() {
  const button = document.getElementById('share-btn');
  const toast = document.getElementById('toast');
  if (!button) return;

  const showToast = () => {
    if (!toast) return;
    toast.classList.add('toast-show');
    window.setTimeout(() => toast.classList.remove('toast-show'), TOAST_VISIBLE_MS);
  };

  const copyToClipboard = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      showToast();
    } catch {
      const area = document.createElement('textarea');
      area.value = url;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
      showToast();
    }
  };

  button.addEventListener('click', async () => {
    const url = window.location.href;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: document.title, text: SHARE_TEXT, url });
        return;
      } catch (error) {
        if (error && error.name === 'AbortError') return;
      }
    }
    await copyToClipboard(url);
  });
}
