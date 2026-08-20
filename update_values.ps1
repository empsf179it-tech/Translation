$htmlPath = "about.html"
$content = Get-Content -Raw -Path $htmlPath

# We only want to replace the cards in Section 3 - Our Values
$parts = $content -split '<!-- Section 4 - Global Reach -->'
$topPart = $parts[0]
$bottomPart = $parts[1]

$pattern = '(?m)<div class="value-block glass-panel reveal" style="padding: 40px 32px; text-align: center; height: 100%; display: flex; flex-direction: column; align-items: center;(.*?)">\s*<div class="value-icon"[\s\S]*?</div>\s*<h3 style="margin-bottom: 16px; font-size: 1\.3rem;">(.*?)</h3>\s*<p style="color: var\(--text-muted\); font-size: 0\.95rem;">([\s\S]*?)</p>\s*</div>'

$replacement = '<div class="value-block glass-panel reveal" style="padding: 0; height: 100%; display: flex; flex-direction: column;$1">
          <img src="assets/images/$2.png" alt="$2" style="width: 100%; height: 180px; object-fit: cover; border-radius: 16px 16px 0 0; border-bottom: 1px solid var(--glass-border);">
          <div style="padding: 32px; display: flex; flex-direction: column; align-items: center; flex-grow: 1; text-align: center;">
            <h3 style="margin-bottom: 16px; font-size: 1.3rem;">$2</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem;">$3</p>
          </div>
        </div>'

$topPart = [regex]::Replace($topPart, $pattern, $replacement)

$newContent = $topPart + "<!-- Section 4 - Global Reach -->" + $bottomPart

Set-Content -Path $htmlPath -Value $newContent
Write-Output "Values updated successfully."
