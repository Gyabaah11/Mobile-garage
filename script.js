const form = document.getElementById('request-form');
const statusEl = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

// --- Install App button ---
const installBtn = document.getElementById('install-btn');
let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  installBtn.hidden = false;
});

installBtn.addEventListener('click', async () => {
  if (!deferredInstallPrompt) return;
  installBtn.hidden = true;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
});

window.addEventListener('appinstalled', () => {
  installBtn.hidden = true;
});


form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form).entries());
  data.access_key = '872d69c1-e0ac-4e97-a8ca-3c570ab58c47';
  data.subject = 'New Mobile Garage request';
  data.from_name = 'Mobile Garage Website';

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';
  statusEl.textContent = '';
  statusEl.className = 'form-status';

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      statusEl.textContent = "Sent! We've received your request and will call you shortly.";
      statusEl.className = 'form-status success';
      form.reset();
    } else {
      throw new Error(result.message || 'Failed to send');
    }
  } catch (err) {
    statusEl.textContent = "Couldn't send automatically. Please call 055 417 8706 directly.";
    statusEl.className = 'form-status error';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send request';
  }
});
