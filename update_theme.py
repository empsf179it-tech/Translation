import os
import re

css_path = r"assets\css\style.css"
js_path = r"assets\js\main.js"
html_files = [f for f in os.listdir('.') if f.endswith('.html')]

# 1. UPDATE CSS
with open(css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

# Replace hardcoded colors
css_content = css_content.replace('#fff', 'var(--text-main)')
css_content = css_content.replace('#020610', 'var(--footer-bg)')
css_content = css_content.replace('rgba(255, 255, 255', 'var(--rgb-white)')
css_content = css_content.replace('rgba(4, 11, 22', 'var(--rgb-dark-bg)')
css_content = css_content.replace('rgba(0, 0, 0', 'var(--rgb-black)')

# Add variables to :root
root_vars = """
  --text-main: #ffffff;
  --footer-bg: #020610;
  --rgb-white: 255, 255, 255;
  --rgb-dark-bg: 4, 11, 22;
  --rgb-black: 0, 0, 0;
"""
css_content = css_content.replace(':root {', ':root {' + root_vars)

# Append light theme
light_theme = """
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
"""
css_content += light_theme

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css_content)

# 2. UPDATE HTML FILES
theme_btn_html = """
      <button class="theme-toggle" id="themeToggle" aria-label="Toggle Theme" style="margin-right: 16px;">
        <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
      </button>
"""

for html_file in html_files:
    with open(html_file, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Add script block to head to prevent flash of wrong theme
    theme_script = """  <script>
    if (localStorage.getItem('theme') === 'light' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: light)').matches)) {
      document.documentElement.classList.add('light-theme');
    }
  </script>
</head>"""
    html_content = html_content.replace('</head>', theme_script)
    
    # Add button to nav-cta
    if '<div class="nav-cta">' in html_content:
        html_content = html_content.replace('<div class="nav-cta">', f'<div class="nav-cta" style="display: flex; align-items: center;">\n{theme_btn_html}')
    
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html_content)

# 3. UPDATE JS
js_theme_logic = """
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
"""

with open(js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

if '// Theme Toggle Logic' not in js_content:
    js_content = js_content.replace("document.addEventListener('DOMContentLoaded', () => {", "document.addEventListener('DOMContentLoaded', () => {\n" + js_theme_logic)
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(js_content)

print("Theme support added successfully.")
