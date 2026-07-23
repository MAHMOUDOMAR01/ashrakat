# تحديث Navigation Bar الموحد مع Dark Mode

## نظرة عامة
تم إنشاء نظام navigation bar موحد مع دعم كامل للـ dark mode لجميع صفحات الموقع.

## الملفات المضافة/المحدثة

### ملفات جديدة:
1. **`assets/css/navbar.css`** - ملف CSS موحد للـ navigation bar مع دعم dark mode
2. **`assets/js/navbar.js`** - ملف JavaScript لإدارة الـ navigation bar و dark mode
3. **`assets/html/navbar.html`** - قالب HTML للـ navigation bar
4. **`test-navbar.html`** - صفحة اختبار للتحقق من وظائف الـ navigation bar

### صفحات محدثة:
1. **`pages/main/home.html`** - تم إزالة الـ navbar المدمج وإضافة النظام الجديد
2. **`pages/main/games.html`** - تم تحديث الـ navbar وإضافة دعم dark mode
3. **`pages/videos/videos.html`** - تم تحديث الـ navbar وإضافة دعم dark mode
4. **`pages/feedback/feedback.html`** - تم تحديث الـ navbar وإضافة دعم dark mode
5. **`index.html`** - تم إضافة دعم الـ navigation bar

## المميزات الجديدة

### 🎨 Navigation Bar الموحد
- تصميم موحد عبر جميع الصفحات
- دعم كامل للغة العربية (RTL)
- تصميم متجاوب للهواتف المحمولة
- تأثيرات بصرية متقدمة

### 🌙 Dark Mode
- تبديل سهل بين الوضع الفاتح والداكن
- حفظ تفضيلات المستخدم في localStorage
- دعم تفضيلات النظام (prefers-color-scheme)
- انتقالات سلسة بين الأوضاع

### 📱 Mobile Menu
- قائمة منسدلة للهواتف المحمولة
- تصميم متجاوب
- إغلاق تلقائي عند النقر خارج القائمة

### 🔗 الروابط
- روابط صحيحة لجميع الصفحات
- مسارات نسبية صحيحة
- تحديث تلقائي للروابط حسب موقع الصفحة

## كيفية الاستخدام

### إضافة Navigation Bar لصفحة جديدة:
```html
<!-- في <head> -->
<link rel="stylesheet" href="../../assets/css/navbar.css">

<!-- في نهاية <body> -->
<script src="../../assets/js/navbar.js"></script>
```

### التحكم في Dark Mode برمجياً:
```javascript
// تبديل الوضع
window.navManager.toggleDarkMode();

// تعيين وضع محدد
window.navManager.setTheme('dark'); // أو 'light'

// التحقق من الوضع الحالي
const isDark = window.navManager.isDarkModeActive();
```

## التخصيص

### ألوان الـ Navigation Bar:
يمكن تخصيص الألوان من خلال تعديل متغيرات CSS في `navbar.css`:

```css
:root {
    /* Light Mode Colors */
    --nav-bg-light: rgba(255, 255, 255, 0.95);
    --nav-text-light: #2c3e50;
    --nav-hover-light: #e3f2fd;
    
    /* Dark Mode Colors */
    --nav-bg-dark: rgba(26, 26, 26, 0.95);
    --nav-text-dark: #ffffff;
    --nav-hover-dark: rgba(255, 255, 255, 0.1);
}
```

### إضافة روابط جديدة:
قم بتعديل مصفوفة الروابط في `navbar.js`:

```javascript
const navbarHTML = `
    <nav class="navbar" id="mainNavbar">
        <a href="../../index.html" class="logo">🎓 منصة التعلم التفاعلي</a>
        <!-- ... -->
        <div class="nav-links">
            <a href="../../pages/main/home.html">🏠 الرئيسية</a>
            <a href="../../pages/main/games.html">🎮 الألعاب</a>
            <a href="../../pages/videos/videos.html">🎥 الفيديوهات</a>
            <a href="../../pages/feedback/feedback.html">📝 التقييم</a>
            <!-- أضف رابط جديد هنا -->
            <a href="../../pages/new-page.html">🆕 صفحة جديدة</a>
        </div>
        <!-- ... -->
    </nav>
`;
```

## الاختبار

### اختبار الـ Navigation Bar:
1. افتح `test-navbar.html` في المتصفح
2. جرب النقر على زر تبديل الوضع المظلم
3. جرب النقر على الروابط المختلفة
4. جرب فتح القائمة على الهاتف المحمول

### اختبار Dark Mode:
1. تأكد من تبديل الألوان عند النقر على زر التبديل
2. تأكد من حفظ التفضيلات عند إعادة تحميل الصفحة
3. تأكد من عمل الوضع على جميع الصفحات

## المتطلبات
- متصفح حديث يدعم CSS Grid و Flexbox
- دعم JavaScript
- دعم localStorage

## الدعم
- تم اختبار النظام على Chrome, Firefox, Safari, Edge
- دعم كامل للهواتف المحمولة
- دعم الوضع المظلم في جميع المتصفحات الحديثة

## ملاحظات مهمة
- تم إزالة جميع أنماط الـ navbar المدمجة من الصفحات
- تم توحيد المسارات النسبية للروابط
- تم إضافة دعم كامل للغة العربية
- تم تحسين الأداء من خلال استخدام CSS Variables

## التحديثات المستقبلية
- إضافة المزيد من الألوان المخصصة
- دعم المزيد من اللغات
- إضافة المزيد من التأثيرات البصرية
- تحسين الأداء على الأجهزة الضعيفة
