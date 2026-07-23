$files = Get-ChildItem -Path "C:\Users\original\Desktop\موقع العاب سمنة" -Recurse -Include "*.js", "*.html" | Where-Object { $_.FullName -notlike "*node_modules*" }

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # حذف استدعاءات console.log غير الضرورية
    $content = $content -replace "console\.log\(\s*['""].*?['""].*?\);?", ""
    $content = $content -replace "console\.log\(\s*`.*?`.*?\);?", ""
    
    # الاحتفاظ بسجلات الأخطاء الهامة
    # $content = $content -replace "console\.warn\(\s*['""].*?['""].*?\);?", ""
    # $content = $content -replace "console\.error\(\s*['""].*?['""].*?\);?", ""
    
    # حفظ التغييرات إذا تم تعديل الملف
    if ($content -ne $originalContent) {
        Write-Host "تم تعديل الملف: $($file.FullName)"
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    }
}

Write-Host "تم الانتهاء من إزالة استدعاءات console.log غير الضرورية"
