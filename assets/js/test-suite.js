// مجموعة اختبارات شاملة للمشروع
class TestSuite {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            total: 0
        };
        this.startTime = null;
        this.endTime = null;
    }
    
    // إضافة اختبار جديد
    addTest(name, testFunction, description = '') {
        this.tests.push({
            name,
            testFunction,
            description,
            status: 'pending'
        });
    }
    
    // تشغيل جميع الاختبارات
    async runAllTests() {
        
        this.startTime = performance.now();
        
        for (const test of this.tests) {
            await this.runSingleTest(test);
        }
        
        this.endTime = performance.now();
        this.generateReport();
    }
    
    // تشغيل اختبار واحد
    async runSingleTest(test) {
        try {
            
            
            const result = await test.testFunction();
            
            if (result === true) {
                test.status = 'passed';
                this.results.passed++;
                
            } else {
                test.status = 'failed';
                test.error = result || 'فشل الاختبار';
                this.results.failed++;
                
            }
        } catch (error) {
            test.status = 'failed';
            test.error = error.message;
            this.results.failed++;
            
        }
        
        this.results.total++;
    }
    
    // إنشاء تقرير النتائج
    generateReport() {
        const duration = this.endTime - this.startTime;
        const successRate = (this.results.passed / this.results.total) * 100;
        
        
        
        } مللي ثانية`);
        }%`);
        
        
        
        
        // عرض تفاصيل الاختبارات الفاشلة
        const failedTests = this.tests.filter(test => test.status === 'failed');
        if (failedTests.length > 0) {
            
            failedTests.forEach(test => {
                
            });
        }
        
        // إنشاء تقرير HTML
        this.generateHTMLReport();
    }
    
    // إنشاء تقرير HTML
    generateHTMLReport() {
        const reportHTML = `
            <div id="testReport" style="
                position: fixed;
                top: 20px;
                right: 20px;
                width: 400px;
                max-height: 80vh;
                overflow-y: auto;
                background: white;
                border: 2px solid #ddd;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                z-index: 10000;
                font-family: 'Cairo', sans-serif;
                font-size: 14px;
                direction: rtl;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="margin: 0; color: #333;">📊 تقرير الاختبارات</h3>
                    <button onclick="document.getElementById('testReport').remove()" style="
                        background: #f44336;
                        color: white;
                        border: none;
                        border-radius: 50%;
                        width: 25px;
                        height: 25px;
                        cursor: pointer;
                    ">×</button>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <div style="background: #e8f5e8; padding: 10px; border-radius: 5px; margin-bottom: 5px;">
                        ✅ نجح: ${this.results.passed}
                    </div>
                    <div style="background: #ffeaea; padding: 10px; border-radius: 5px; margin-bottom: 5px;">
                        ❌ فشل: ${this.results.failed}
                    </div>
                    <div style="background: #e3f2fd; padding: 10px; border-radius: 5px;">
                        📊 معدل النجاح: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%
                    </div>
                </div>
                
                <div style="max-height: 300px; overflow-y: auto;">
                    ${this.tests.map(test => `
                        <div style="
                            padding: 8px;
                            margin: 5px 0;
                            border-radius: 5px;
                            background: ${test.status === 'passed' ? '#e8f5e8' : '#ffeaea'};
                        ">
                            <div style="font-weight: bold;">
                                ${test.status === 'passed' ? '✅' : '❌'} ${test.name}
                            </div>
                            ${test.description ? `<div style="font-size: 12px; color: #666; margin-top: 3px;">${test.description}</div>` : ''}
                            ${test.error ? `<div style="font-size: 12px; color: #d32f2f; margin-top: 3px;">${test.error}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', reportHTML);
    }
}

// إنشاء مجموعة الاختبارات الرئيسية
const testSuite = new TestSuite();

// اختبارات الإعدادات والتكوين
testSuite.addTest('تحميل الإعدادات', () => {
    return typeof CONFIG !== 'undefined' && CONFIG.PROJECT_NAME;
}, 'التحقق من تحميل ملف الإعدادات بنجاح');

testSuite.addTest('مكتبة الأدوات', () => {
    return typeof Utils !== 'undefined' && typeof Utils.handleError === 'function';
}, 'التحقق من توفر مكتبة الأدوات المساعدة');

testSuite.addTest('مدير التطبيق', () => {
    return typeof App !== 'undefined';
}, 'التحقق من تحميل مدير التطبيق الرئيسي');

// اختبارات التخزين المحلي
testSuite.addTest('التخزين المحلي - الكتابة', () => {
    const testKey = 'test_storage';
    const testValue = { test: true, timestamp: Date.now() };
    return Utils.setStorageItem(testKey, testValue);
}, 'اختبار كتابة البيانات في التخزين المحلي');

testSuite.addTest('التخزين المحلي - القراءة', () => {
    const testKey = 'test_storage';
    const retrieved = Utils.getStorageItem(testKey);
    return retrieved && retrieved.test === true;
}, 'اختبار قراءة البيانات من التخزين المحلي');

testSuite.addTest('التخزين المحلي - الحذف', () => {
    const testKey = 'test_storage';
    Utils.removeStorageItem(testKey);
    const retrieved = Utils.getStorageItem(testKey);
    return retrieved === null;
}, 'اختبار حذف البيانات من التخزين المحلي');

// اختبارات الشبكة والاتصال
testSuite.addTest('حالة الاتصال', () => {
    return typeof navigator.onLine === 'boolean';
}, 'التحقق من إمكانية قراءة حالة الاتصال');

testSuite.addTest('Service Worker', async () => {
    if (!('serviceWorker' in navigator)) {
        return 'Service Worker غير مدعوم في هذا المتصفح';
    }
    
    try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        return registrations.length > 0;
    } catch (error) {
        return `خطأ في Service Worker: ${error.message}`;
    }
}, 'التحقق من تسجيل Service Worker');

// اختبارات واجهة المستخدم
testSuite.addTest('عناصر التنقل', () => {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    return navbar && navLinks.length > 0;
}, 'التحقق من وجود شريط التنقل والروابط');

testSuite.addTest('الوضع المظلم', () => {
    if (typeof navManager === 'undefined') {
        return 'مدير التنقل غير متاح';
    }
    
    // اختبار تبديل الوضع المظلم
    const currentTheme = navManager.getCurrentTheme();
    navManager.toggleDarkMode();
    const newTheme = navManager.getCurrentTheme();
    navManager.toggleDarkMode(); // إعادة للوضع الأصلي
    
    return currentTheme !== newTheme;
}, 'اختبار وظيفة تبديل الوضع المظلم');

// اختبارات الألعاب (إذا كانت متاحة)
testSuite.addTest('وظائف الألعاب', () => {
    const gameCards = document.querySelectorAll('.game-card');
    const hasStartGame = typeof startGame === 'function';
    const hasBackToGames = typeof backToGames === 'function';
    
    if (gameCards.length === 0) {
        return 'لا توجد بطاقات ألعاب في الصفحة الحالية';
    }
    
    return hasStartGame && hasBackToGames;
}, 'التحقق من وجود وظائف الألعاب الأساسية');

// اختبارات الأداء
testSuite.addTest('أداء التحميل', () => {
    const loadTime = performance.now();
    return loadTime < 5000; // أقل من 5 ثوانٍ
}, 'التحقق من سرعة تحميل الصفحة');

testSuite.addTest('استهلاك الذاكرة', () => {
    if (!performance.memory) {
        return 'معلومات الذاكرة غير متاحة';
    }
    
    const memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
    return memoryUsage < 100; // أقل من 100 ميجابايت
}, 'التحقق من استهلاك الذاكرة');

// اختبارات التوافق
testSuite.addTest('دعم المتصفح', () => {
    const features = Utils.checkBrowserSupport();
    const requiredFeatures = ['localStorage', 'intersectionObserver'];
    
    return requiredFeatures.every(feature => features[feature]);
}, 'التحقق من دعم المتصفح للميزات المطلوبة');

testSuite.addTest('الاستجابة للشاشات', () => {
    const viewport = window.innerWidth;
    const isMobile = viewport <= 768;
    const isTablet = viewport > 768 && viewport <= 1024;
    const isDesktop = viewport > 1024;
    
    return isMobile || isTablet || isDesktop;
}, 'التحقق من الاستجابة لأحجام الشاشات المختلفة');

// اختبارات الأمان
testSuite.addTest('التشفير والأمان', () => {
    const testData = 'test data for encryption';
    const encrypted = Utils.simpleEncrypt(testData);
    const decrypted = Utils.simpleDecrypt(encrypted);
    
    return encrypted !== testData && decrypted === testData;
}, 'اختبار وظائف التشفير وفك التشفير');

// اختبار التحقق من البيانات
testSuite.addTest('التحقق من البيانات', () => {
    const testData = {
        name: 'اختبار',
        age: 25,
        email: 'test@example.com'
    };
    
    const schema = {
        name: { required: true, type: 'string' },
        age: { required: true, type: 'number', min: 0, max: 150 },
        email: { required: true, type: 'string', pattern: /\S+@\S+\.\S+/ }
    };
    
    const validation = Utils.validateData(testData, schema);
    return validation.isValid;
}, 'اختبار نظام التحقق من صحة البيانات');

// وظيفة تشغيل الاختبارات عند الطلب
window.runTests = function() {
    testSuite.runAllTests();
};

// تشغيل الاختبارات تلقائياً في وضع التطوير
if (CONFIG && CONFIG.DEBUG && CONFIG.DEBUG.ENABLED) {
    // تأخير التشغيل للتأكد من تحميل جميع الموارد
    setTimeout(() => {
        
        testSuite.runAllTests();
    }, 2000);
}

// تصدير للاستخدام العام
window.TestSuite = TestSuite;
window.testSuite = testSuite;

