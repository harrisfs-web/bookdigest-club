$text = [System.IO.File]::ReadAllText("src/content/books/the-selfish-gene.md")
$results = @{}
for ($i = 0; $i -lt ($text.Length - 2); $i++) {
    if ([int]$text[$i] -eq 0x00E2 -and [int]$text[$i+1] -eq 0x20AC) {
        $third = [int]$text[$i+2]
        $key = "U+{0:X4}" -f $third
        if (-not $results.ContainsKey($key)) { $results[$key] = 0 }
        $results[$key]++
    }
}
$results.GetEnumerator() | ForEach-Object { "$($_.Key): $($_.Value) times" }
