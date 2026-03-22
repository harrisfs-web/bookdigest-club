$files = Get-ChildItem "src/content/books/*.md"
$count = 0
$replacements = @(
    # Non-breaking hyphen (U+2011) mojibake: â€' -> -
    @{ From = [char]0x00E2 + [char]0x20AC + [char]0x2018; To = '-' },
    # Right double quote (U+201D) via U+009D: â€ + control -> "
    @{ From = [char]0x00E2 + [char]0x20AC + [char]0x009D; To = [char]0x201D }
)
foreach ($f in $files) {
    $text = [System.IO.File]::ReadAllText($f.FullName)
    $changed = $false
    foreach ($r in $replacements) {
        if ($text.Contains($r.From)) {
            $text = $text.Replace($r.From, $r.To)
            $changed = $true
        }
    }
    if ($changed) {
        [System.IO.File]::WriteAllText($f.FullName, $text, (New-Object System.Text.UTF8Encoding($false)))
        $count++
        Write-Host "$($f.Name) - fixed"
    }
}
Write-Host "Total: $count files fixed"
