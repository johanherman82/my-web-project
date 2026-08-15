/**
 * Luminary Studio — Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  let currentHue = 217;
  let currentRadius = 12;

  const presets = {
    slate: 217,
    emerald: 158,
    amber: 38,
    rose: 350
  };

  // DOM Elements
  const hueSlider = document.getElementById('hue-slider');
  const hueDisplay = document.getElementById('hue-display');
  const radiusSlider = document.getElementById('radius-slider');
  const radiusDisplay = document.getElementById('radius-display');
  const swatchesGrid = document.getElementById('swatches-grid');
  const codeOutput = document.getElementById('code-output');
  const themeToggle = document.getElementById('theme-toggle');
  const btnRandomHue = document.getElementById('btn-random-hue');
  const copyCodeBtn = document.getElementById('copy-code-btn');
  const btnCopyFullCss = document.getElementById('btn-copy-full-css');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const presetButtons = document.querySelectorAll('.palette-chip');

  // Helper: HSL to HEX
  function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  // Helper: Relative Luminance for contrast calculation
  function getLuminance(hex) {
    const rgb = parseInt(hex.slice(1), 16);
    const r = ((rgb >> 16) & 0xff) / 255;
    const g = ((rgb >> 8) & 0xff) / 255;
    const b = (rgb & 0xff) / 255;
    const a = [r, g, b].map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function getContrastRatio(hex1, hex2) {
    const lum1 = getLuminance(hex1);
    const lum2 = getLuminance(hex2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return ((brightest + 0.05) / (darkest + 0.05)).toFixed(1);
  }

  // Toast Notification
  let toastTimer = null;
  function showToast(text) {
    if (toastTimer) clearTimeout(toastTimer);
    toastMessage.textContent = text;
    toast.classList.add('show');
    toast.setAttribute('aria-hidden', 'false');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
      toast.setAttribute('aria-hidden', 'true');
    }, 2400);
  }

  // Update Design System
  function updateTheme() {
    const root = document.documentElement;
    root.style.setProperty('--primary-hue', currentHue);
    root.style.setProperty('--radius-custom', `${currentRadius}px`);

    hueDisplay.textContent = `${currentHue}°`;
    radiusDisplay.textContent = `${currentRadius}px`;

    // Generate Swatches
    const steps = [
      { name: 'Primary 50', l: 95, s: 80 },
      { name: 'Primary 100', l: 88, s: 82 },
      { name: 'Primary 300', l: 70, s: 85 },
      { name: 'Primary 500 (Base)', l: 56, s: 90 },
      { name: 'Primary 700', l: 40, s: 90 },
      { name: 'Primary 900', l: 22, s: 85 },
    ];

    swatchesGrid.innerHTML = '';
    steps.forEach(step => {
      const hex = hslToHex(currentHue, step.s, step.l);
      const contrast = getContrastRatio(hex, '#0d1117');
      const contrastScore = contrast >= 7 ? 'AAA' : contrast >= 4.5 ? 'AA' : `${contrast}:1`;

      const card = document.createElement('div');
      card.className = 'swatch-card';
      card.innerHTML = `
        <div class="swatch-color" style="background-color: ${hex};">
          <span class="contrast-pill">${contrastScore}</span>
        </div>
        <div class="swatch-info">
          <div class="swatch-name">${step.name}</div>
          <div class="swatch-hex">${hex.toUpperCase()}</div>
        </div>
      `;
      swatchesGrid.appendChild(card);
    });

    // Update Computed Code Snippet
    codeOutput.textContent = `:root {
  --primary-hue: ${currentHue};
  --color-primary: hsl(${currentHue}, 90%, 56%);
  --color-primary-hover: hsl(${currentHue}, 90%, 48%);
  --color-primary-active: hsl(${currentHue}, 90%, 40%);
  --color-primary-subtle: hsl(${currentHue}, 40%, 15%);
  --radius-custom: ${currentRadius}px;
}`;
  }

  // Hue Slider
  hueSlider.addEventListener('input', (e) => {
    currentHue = parseInt(e.target.value, 10);
    presetButtons.forEach(btn => btn.classList.remove('active'));
    updateTheme();
  });

  // Radius Slider
  radiusSlider.addEventListener('input', (e) => {
    currentRadius = parseInt(e.target.value, 10);
    updateTheme();
  });

  // Preset Buttons
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const presetKey = btn.dataset.preset;
      if (presets[presetKey] !== undefined) {
        currentHue = presets[presetKey];
        hueSlider.value = currentHue;
        updateTheme();
      }
    });
  });

  // Randomize Hue
  btnRandomHue.addEventListener('click', () => {
    currentHue = Math.floor(Math.random() * 360);
    hueSlider.value = currentHue;
    presetButtons.forEach(b => b.classList.remove('active'));
    updateTheme();
  });

  // Theme Toggle (Dark/Light)
  const savedTheme = localStorage.getItem('luminary_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('luminary_theme', next);
    showToast(`Switched to ${next} mode`);
  });

  // Copy Snippet Buttons
  copyCodeBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(codeOutput.textContent).then(() => {
      showToast('Variables copied to clipboard!');
    });
  });

  btnCopyFullCss.addEventListener('click', () => {
    const fullSnippet = `/* Luminary Starter Design Tokens */
:root {
  --primary-hue: ${currentHue};
  --color-primary: hsl(${currentHue}, 90%, 56%);
  --color-primary-hover: hsl(${currentHue}, 90%, 48%);
  --color-primary-subtle: hsl(${currentHue}, 40%, 15%);
  --radius-custom: ${currentRadius}px;
  --font-sans: 'Plus Jakarta Sans', system-ui, sans-serif;
}`;
    navigator.clipboard.writeText(fullSnippet).then(() => {
      showToast('Starter kit copied to clipboard!');
    });
  });

  // Initial render
  updateTheme();
});
