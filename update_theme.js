const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'assets', 'css', 'style.css');
const jsPath = path.join(__dirname, 'assets', 'js', 'main.js');

let cssContent = fs.readFileSync(cssPath, 'utf8');

cssContent = cssContent.replace(/#fff/g, 'var(--text-main)');
cssContent = cssContent.replace(/#020610/g, 'var(--footer-bg)');
cssContent = cssContent.replace(/rgba\(255, 255, 255/g, 'rgba(var(--rgb-white)');
cssContent = cssContent.replace(/rgba\(4, 11, 22/g, 'rgba(var(--rgb-dark-bg)');
cssContent = cssContent.replace(/rgba\(0, 0, 0/g, 'rgba(var(--rgb-black)');

const rootVars = `
  --text-main: #ffffff;
  --footer-bg: #020610;
  --rgb-white: 255, 255, 255;
  --rgb-dark-bg: 4, 11, 22;
  --rgb-black: 0, 0, 0;
`;
cssContent = cssContent.replace(':root {', ':root {' + rootVars);

const lightTheme = `
.light-theme {
  --bg-deep-navy: #f8fafc;
  --bg-midnight-blue: #f1f5f9;
  --bg-charcoal: #e2e8f0;
  --text-soft-white: #0f172a;
  --text-muted: #475569;
  
  --glass-bg: rgba(255, 255, 255, 0.5);
  --glass-border: rgba(0, 0, 0, 0.1);
  --glass-highlight: rgba(0, 0, 0, 0.2);
  
  --text-main: #0f172a;
  --footer-bg: #e2e8f0;
  --rgb-white: 0, 0, 0;
  --rgb-dark-bg: 241, 245, 249;
  --rgb-black: 255, 255, 255;
}

/* Theme Toggle Button Styles */
.theme-toggle {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: var(--text-main);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-fast);
  backdrop-filter: blur(10px);
}
.theme-toggle:hover {
  background: var(--glass-highlight);
  transform: translateY(-2px);
}
.theme-toggle svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.sun-icon { display: none; }
.light-theme .sun-icon { display: block; }
.light-theme .moon-icon { display: none; }
`;

cssContent += lightTheme;
fs.writeFileSync(cssPath, cssContent);

const themeBtnHtml = `
      <button class="theme-toggle" id="themeToggle" aria-label="Toggle Theme" style="margin-right: 16px;">
        <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
      </button>
`;

const themeScript = `  <script>
    if (localStorage.getItem('theme') === 'light' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: light)').matches)) {
      document.documentElement.classList.add('light-theme');
    }
  </script>
</head>`;

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  let htmlContent = fs.readFileSync(filePath, 'utf8');
  
  htmlContent = htmlContent.replace('</head>', themeScript);
  htmlContent = htmlContent.replace('<div class="nav-cta">', \`<div class="nav-cta" style="display: flex; align-items: center;">\n\${themeBtnHtml}\`);
  
  fs.writeFileSync(filePath, htmlContent);
});

let jsContent = fs.readFileSync(jsPath, 'utf8');
const jsThemeLogic = `
  // Theme Toggle Logic
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('light-theme');
      if (document.documentElement.classList.contains('light-theme')) {
        localStorage.setItem('theme', 'light');
      } else {
        localStorage.setItem('theme', 'dark');
      }
    });
  }
`;

if (!jsContent.includes('// Theme Toggle Logic')) {
  jsContent = jsContent.replace("document.addEventListener('DOMContentLoaded', () => {", "document.addEventListener('DOMContentLoaded', () => {\n" + jsThemeLogic);
  fs.writeFileSync(jsPath, jsContent);
}

console.log('Theme support added via Node.');
