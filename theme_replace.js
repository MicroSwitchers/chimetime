const fs = require('fs');
let txt = fs.readFileSync('index.html', 'utf8');

// 1. Add CSS root variables
txt = txt.replace(/:root {/, `:root {
      --t-rgb: 196, 160, 82;
      --t-base: #c4a052;
      --t-glow: #e8cf85;`);

// 2. Replace CSS references
txt = txt.replace(/--gold: #c4a052;/g, '--gold: var(--t-base);');
txt = txt.replace(/--gold2: #e8cf85;/g, '--gold2: var(--t-glow);');
txt = txt.replace(/rgba\(196, 160, 82,/g, 'rgba(var(--t-rgb),');

// 3. Inject JS global variables for canvas
txt = txt.replace(/const actx = new /, `let thRGB = '196,160,82', thBase = '#c4a052', thGlow = '#e8cf85';\n    const actx = new `);

// 4. Replace exact JS strings for canvas drawing
txt = txt.replace(/'rgba\(196,160,82,(.*?)\)'/g, '`rgba(${thRGB},$1)`');
txt = txt.replace(/'#c4a052'/g, 'thBase');
txt = txt.replace(/'#e8cf85'/g, 'thGlow');
txt = txt.replace(/'#f5cd64'/g, 'thGlow');

// 5. Add Theme JS function
const themeJS = `    function setTheme(id, btn) {
      document.querySelectorAll('.th-btn').forEach(b => b.classList.toggle('act', b === btn));
      const s = getComputedStyle(btn);
      document.documentElement.style.setProperty('--t-rgb', s.getPropertyValue('--t-rgb'));
      document.documentElement.style.setProperty('--t-base', s.getPropertyValue('--t-base'));
      document.documentElement.style.setProperty('--t-glow', s.getPropertyValue('--t-glow'));
      thRGB = s.getPropertyValue('--t-rgb').trim();
      thBase = s.getPropertyValue('--t-base').trim();
      thGlow = s.getPropertyValue('--t-glow').trim();
      resizeClock(); // Force redraw of static assets
    }
    
    // ── AUDIO ──`;
txt = txt.replace(/    \/\/ ── AUDIO ──/g, themeJS);

fs.writeFileSync('index.html', txt);
console.log('Replaced successfully');
