$htmlPath = "index.html"
$content = Get-Content -Raw -Path $htmlPath

# We only want to replace the cards in Section 3 (Core Translation Services)
# We can extract Section 3, run the regex, and put it back, or just run the regex globally since only these cards have this exact structure (or maybe others do too).
# Actually, the grid-8 on Industries has similar cards. Let's make sure we only match the Core Services section.
# We will split the file at "<!-- Section 4 - Industries -->"

$parts = $content -split '<!-- Section 4 - Industries -->'
$topPart = $parts[0]
$bottomPart = $parts[1]

$pattern = '(?m)<div class="card-content">\s*<div class="card-icon">[\s\S]*?</div>\s*<h3 class="card-title">(.*?)</h3>\s*<p class="card-desc">([\s\S]*?)</p>\s*<a href="services\.html" class="card-arrow">([\s\S]*?)</a>\s*</div>'

$replacement = '<div class="card-content" style="padding: 0;">
              <img src="assets/images/$1.png" alt="$1" style="width: 100%; height: 200px; object-fit: cover; border-radius: 16px 16px 0 0; border-bottom: 1px solid var(--glass-border); transform: translateZ(10px);">
              <div style="padding: 32px 32px 40px; display: flex; flex-direction: column; flex-grow: 1; transform: translateZ(20px);">
                <h3 class="card-title">$1</h3>
                <p class="card-desc">$2</p>
                <a href="services.html" class="card-arrow">$3</a>
              </div>
            </div>'

$topPart = [regex]::Replace($topPart, $pattern, $replacement)

$newContent = $topPart + "<!-- Section 4 - Industries -->" + $bottomPart

Set-Content -Path $htmlPath -Value $newContent
Write-Output "Cards updated successfully."
