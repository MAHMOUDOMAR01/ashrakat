$files = Get-ChildItem -Path "C:\Users\original\Desktop\موقع العاب سمنة" -Recurse -Include "*.js", "*.html" | Where-Object { $_.FullName -notlike "*node_modules*" }

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # تعديل استدعاءات console.log
    $content = $content -replace "console\.log\(\s*['""`].*?['""`].*?\);?", ""
    
    # تعديل استدعاءات console.warn
    $content = $content -replace "console\.warn\(\s*['""`].*?['""`].*?\);?", ""
    
    # الاحتفاظ بسجلات الأخطاء الهامة فقط
    # $content = $content -replace "console\.error\(\s*['""`].*?['""`].*?\);?", ""
    
    # حفظ التغييرات إذا تم تعديل الملف
    if ($content -ne $originalContent) {
        Write-Host "تم تعديل الملف: $($file.FullName)"
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    }
}

Write-Host "تم الانتهاء من إزالة استدعاءات console غير الضرورية"
