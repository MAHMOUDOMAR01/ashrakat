# دليل البدء السريع 🚀

## تشغيل المشروع في 3 خطوات

### 1. افتح المشروع
```bash
# افتح الملف الرئيسي في المتصفح
index.html
```

### 2. تصفح الألعاب
- **فهرس الألعاب**: `pages/main/games/index.html`
- **جميع الألعاب**: `pages/main/games.html`

### 3. اختبر الوظائف
```javascript
// في وحدة تحكم المتصفح (F12)
runTests(); // تشغيل جميع الاختبارات
```

---

## الألعاب المتاحة (14 لعبة) 🎮

| اللعبة | الرابط المباشر | الوصف |
|---------|----------------|--------|
| 🥗 اختبار التغذية | `pages/main/games/nutrition.html` | أسئلة حول الخيارات الصحية |
| 🍎 ذاكرة الأطعمة | `pages/main/games/food-memory.html` | لعبة ذاكرة تفاعلية |
| ⚖️ مصنف الأطعمة | `pages/main/games/food-categorizer.html` | سحب وإسقاط للتصنيف |
| 📊 حاسبة BMI | `pages/main/games/bmi-calculator.html` | BMI وBMR وTDEE |
| 🏃 اختبار الرياضة | `pages/main/games/exercise-quiz.html` | أهمية النشاط البدني |
| 🎯 تحدي نمط الحياة | `pages/main/games/lifestyle-challenge.html` | قرارات يومية صحية |
| 🔢 حاسب السعرات | `pages/main/games/calorie-counter.html` | تتبع الوجبات والماكروز |
| 📅 مخطط الوجبات | `pages/main/games/meal-planner.html` | تخطيط الوجبات |
| 💧 متتبع الماء | `pages/main/games/water-tracker.html` | مراقبة الهدف اليومي |
| 👨‍🍳 لعبة الطبخ | `pages/main/games/cooking-game.html` | طرق تحضير صحية |
| 🫀 اختبار أجزاء الجسم | `pages/main/games/body-parts-quiz.html` | التوعية بالمخاطر |
| 📈 متتبع العادات | `pages/main/games/habit-tracker.html` | تتبع العادات اليومية |
| 🍽️ أحجام الحصص | `pages/main/games/portion-size-game.html` | تعلم الأحجام المناسبة |
| 🎯 تحدي التغذية | `pages/main/games/nutrition-challenge.html` | سلسلة تحديات شاملة |

---

## أدوات التطوير السريعة 🔧

### في وحدة تحكم المتصفح:
```javascript
// اختبارات
runTests();                    // تشغيل جميع الاختبارات
testSuite.runAllTests();       // تشغيل مفصل

// معلومات الأداء
app.getPerformanceMetrics();   // إحصائيات الأداء
performance.now();             // وقت التحميل

// إدارة البيانات
app.clearAllData();            // مسح جميع البيانات
app.exportUserData();          // تصدير البيانات
app.importUserData(file);      // استيراد البيانات

// إشعارات
Utils.showToast('رسالة', 'success');  // إشعار نجاح
Utils.showToast('خطأ', 'error');      // إشعار خطأ
Utils.showToast('تحذير', 'warning');  // إشعار تحذير

// الوضع المظلم
navManager.toggleDarkMode();    // تبديل الوضع المظلم
navManager.setTheme('dark');    // تعيين وضع مظلم
navManager.setTheme('light');   // تعيين وضع فاتح
```

---

## هيكل الملفات المهمة 📁

```
المشروع/
├── index.html              # نقطة البداية
├── manifest.json           # إعدادات PWA
├── sw.js                   # Service Worker
├── offline.html            # صفحة العمل دون اتصال
├── assets/js/
│   ├── config.js          # الإعدادات المركزية
│   ├── utils.js           # الأدوات المساعدة
│   ├── app.js             # مدير التطبيق
│   ├── navbar.js          # شريط التنقل
│   └── test-suite.js      # مجموعة الاختبارات
└── pages/main/games/
    ├── index.html         # فهرس الألعاب
    └── [game-name].html   # الألعاب الفردية
```

---

## استكشاف الأخطاء السريع 🔍

### المشاكل الشائعة:
1. **اللعبة لا تعمل**: تحقق من وحدة التحكم للأخطاء
2. **الروابط معطلة**: تأكد من المسارات النسبية
3. **البيانات لا تحفظ**: تحقق من دعم localStorage
4. **الصفحة بطيئة**: شغل `app.getPerformanceMetrics()`

### الحلول السريعة:
```javascript
// إعادة تعيين كاملة
localStorage.clear();
location.reload();

// تفعيل وضع التطوير
CONFIG.DEBUG.ENABLED = true;

// فحص دعم المتصفح
Utils.checkBrowserSupport();
```

---

## الميزات الجديدة في الإصدار 2.0.0 ✨

- ✅ **PWA Support**: يعمل كتطبيق ويب تقدمي
- ✅ **العمل دون اتصال**: Service Worker متقدم
- ✅ **تقسيم الألعاب**: كل لعبة لها صفحة مستقلة
- ✅ **نظام اختبارات**: فحص تلقائي للجودة
- ✅ **معالجة أخطاء**: نظام شامل للأخطاء
- ✅ **تحسينات أداء**: تحميل أسرع وأكثر كفاءة
- ✅ **وضع مظلم**: تبديل سلس بين الأوضاع

---

## نصائح للتطوير 💡

1. **استخدم وضع التطوير** لرؤية التفاصيل
2. **شغل الاختبارات بانتظام** للتأكد من الجودة
3. **راقب وحدة التحكم** للأخطاء والتحذيرات
4. **اختبر على أجهزة مختلفة** للتأكد من الاستجابة
5. **استخدم أدوات المطور** لفحص الأداء

---

**🎉 المشروع جاهز للاستخدام والتطوير!**

*للمزيد من التفاصيل، راجع `README.md`*
