$text = [System.IO.File]::ReadAllText("src/content/books/the-selfish-gene.md")
$shown = 0
for ($i = 0; $i -lt ($text.Length - 2); $i++) {
    if ([int]$text[$i] -eq 0x00E2 -and [int]$text[$i+1] -eq 0x20AC -and [int]$text[$i+2] -eq 0x2018) {
        $start = [Math]::Max(0, $i-20)
        $len = [Math]::Min(45, $text.Length - $start)
        $ctx = $text.Substring($start, $len)
        Write-Host "Context: $ctx"
        $shown++
        if ($shown -ge 5) { break }
    }
}
