$files = Get-ChildItem "src/content/books/*.md"
$count = 0
$replacements = @(
    @{ From = [char]0x00E2 + [char]0x20AC + [char]0x201D; To = [char]0x2014 },
    @{ From = [char]0x00E2 + [char]0x20AC + [char]0x201C; To = [char]0x2013 },
    @{ From = [char]0x00E2 + [char]0x20AC + [char]0x2122; To = [char]0x2019 },
    @{ From = [char]0x00E2 + [char]0x20AC + [char]0x02DC; To = [char]0x2018 },
    @{ From = [char]0x00E2 + [char]0x20AC + [char]0x0153; To = [char]0x201C }
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
