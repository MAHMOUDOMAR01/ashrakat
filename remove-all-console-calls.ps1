# إزالة جميع استدعاءات console المتبقية
$filesToProcess = Get-ChildItem -Path . -Recurse -Include *.js,*.html -Exclude *node_modules* | Where-Object { $_.FullName -notlike "*node_modules*" }

$totalModified = 0

foreach ($file in $filesToProcess) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # إزالة جميع استدعاءات console
    $newContent = $content -replace 'console\.(log|warn|error|info|debug)\(.*?\);?', '// Removed console call'
    
    if ($newContent -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
        Write-Host "تم تعديل الملف: $($file.FullName)"
        $totalModified++
    }
}

Write-Host "تم الانتهاء من إزالة استدعاءات console. تم تعديل $totalModified ملفات."
