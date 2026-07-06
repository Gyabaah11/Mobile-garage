// --- Form submission (Formspree) ---
// Replace YOUR_FORM_ID below with your real Formspree form ID once created.
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xqevnnqj';

const form = document.getElementById('request-form');
const statusEl = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      });

      if (res.ok) {
        statusEl.textContent = "Sent! We've received your request and will call you shortly.";
        statusEl.className = 'form-status success';
        form.reset();
      } else {
        const result = await res.json().catch(() => ({}));
        throw new Error((result.errors && result.errors[0] && result.errors[0].message) || 'Failed to send');
      }
    } catch (err) {
      statusEl.textContent = "Couldn't send automatically. Please call 055 417 8706 directly.";
      statusEl.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send request';
    }
  });
}

// --- Install App button ---
let deferredPrompt = null;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) installBtn.hidden = false;
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    installBtn.hidden = true;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  });
}

window.addEventListener('appinstalled', () => {
  if (installBtn) installBtn.hidden = true;
  deferredPrompt = null;
});

// --- iPhone install instructions ---
const iosTip = document.getElementById('ios-install-tip');

function isIos() {
  return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
}

function isInStandaloneMode() {
  return ('standalone' in window.navigator) && window.navigator.standalone;
}

if (isIos() && !isInStandaloneMode() && iosTip) {
  iosTip.hidden = false;
}

// --- Service worker registration ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
