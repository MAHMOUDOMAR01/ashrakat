// إعدادات التطوير - يمكن تخصيصها حسب الحاجة
// هذا الملف منفصل عن config.js الرئيسي لسهولة التطوير

// تفعيل/إلغاء وضع التطوير
const DEV_MODE = true;

// إعدادات التطوير
const DEV_CONFIG = {
    // الإعدادات العامة
    DEBUG: {
        ENABLED: DEV_MODE,
        LOG_LEVEL: 'debug', // 'debug', 'info', 'warn', 'error'
        SHOW_PERFORMANCE: true,
        SHOW_NETWORK_LOGS: true,
        SHOW_STORAGE_LOGS: true
    },
    
    // إعدادات الاختبارات
    TESTING: {
        AUTO_RUN: DEV_MODE,
        SHOW_RESULTS: true,
        DETAILED_REPORTS: true,
        PERFORMANCE_TESTS: true
    },
    
    // إعدادات أدوات التطوير
    DEV_TOOLS: {
        ENABLED: DEV_MODE,
        SHOW_PANEL: false, // إظهار لوحة المطور تلقائياً
        KEYBOARD_SHORTCUTS: true,
        CONSOLE_COMMANDS: true
    },
    
    // إعدادات المحاكاة
    SIMULATION: {
        SLOW_NETWORK: false,    // محاكاة شبكة بطيئة
        OFFLINE_MODE: false,    // محاكاة العمل دون اتصال
        LOW_MEMORY: false,      // محاكاة ذاكرة منخفضة
        MOBILE_DEVICE: false    // محاكاة جهاز محمول
    },
    
    // إعدادات التحسين
    OPTIMIZATION: {
        LAZY_LOADING: true,
        IMAGE_COMPRESSION: true,
        CACHE_AGGRESSIVE: false,
        PRELOAD_CRITICAL: true
    },
    
    // إعدادات التسجيل
    LOGGING: {
        SAVE_TO_STORAGE: true,
        MAX_LOG_ENTRIES: 1000,
        EXPORT_LOGS: true,
        LOG_USER_ACTIONS: true
    }
};

// دالة لتطبيق إعدادات التطوير
function applyDevConfig() {
    if (typeof CONFIG !== 'undefined') {
        // دمج إعدادات التطوير مع الإعدادات الرئيسية
        CONFIG.DEBUG = { ...CONFIG.DEBUG, ...DEV_CONFIG.DEBUG };
        CONFIG.PERFORMANCE = { ...CONFIG.PERFORMANCE, ...DEV_CONFIG.OPTIMIZATION };
        
        // تطبيق إعدادات المحاكاة
        if (DEV_CONFIG.SIMULATION.SLOW_NETWORK) {
            // محاكاة شبكة بطيئة
            CONFIG.PERFORMANCE.MAX_CONCURRENT_REQUESTS = 1;
            
        }
        
        if (DEV_CONFIG.SIMULATION.OFFLINE_MODE) {
            // محاكاة العمل دون اتصال
            Object.defineProperty(navigator, 'onLine', {
                writable: true,
                value: false
            });
            
        }
        
        if (DEV_CONFIG.SIMULATION.LOW_MEMORY) {
            // محاكاة ذاكرة منخفضة
            CONFIG.PERFORMANCE.LAZY_LOAD_IMAGES = true;
            CONFIG.PERFORMANCE.MAX_CONCURRENT_REQUESTS = 2;
            
        }
        
        if (DEV_CONFIG.SIMULATION.MOBILE_DEVICE) {
            // محاكاة جهاز محمول
            Object.defineProperty(navigator, 'hardwareConcurrency', {
                writable: true,
                value: 2
            });
            
        }
    }
}

// أدوات تطوير سريعة
const DevQuickTools = {
    // تفعيل/إلغاء وضع التطوير
    toggleDebug() {
        CONFIG.DEBUG.ENABLED = !CONFIG.DEBUG.ENABLED;
        
        location.reload();
    },
    
    // تشغيل اختبارات سريعة
    quickTest() {
        if (typeof runTests === 'function') {
            
            runTests();
        } else {
            // Removed console call
        }
    },
    
    // مسح جميع البيانات
    clearAll() {
        if (confirm('هل تريد مسح جميع البيانات؟')) {
            localStorage.clear();
            sessionStorage.clear();
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                    registrations.forEach(reg => reg.unregister());
                });
            }
            
            location.reload();
        }
    },
    
    // عرض معلومات النظام
    systemInfo() {
        const info = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            hardwareConcurrency: navigator.hardwareConcurrency,
            deviceMemory: navigator.deviceMemory,
            screen: {
                width: screen.width,
                height: screen.height,
                colorDepth: screen.colorDepth
            },
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            memory: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + ' MB',
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + ' MB'
            } : 'غير متاح'
        };
        
        console.table(info);
        return info;
    },
    
    // محاكاة خطأ
    simulateError(message = 'خطأ تجريبي') {
        try {
            throw new Error(message);
        } catch (error) {
            if (typeof Utils !== 'undefined' && Utils.handleError) {
                Utils.handleError(error, 'DevQuickTools.SimulateError');
            } else {
                // Removed console call
            }
        }
    },
    
    // اختبار الإشعارات
    testNotifications() {
        if (typeof Utils !== 'undefined' && Utils.showToast) {
            Utils.showToast('إشعار نجاح تجريبي', 'success');
            setTimeout(() => Utils.showToast('إشعار تحذير تجريبي', 'warning'), 1000);
            setTimeout(() => Utils.showToast('إشعار خطأ تجريبي', 'error'), 2000);
            setTimeout(() => Utils.showToast('إشعار معلومات تجريبي', 'info'), 3000);
        } else {
            // Removed console call
        }
    },
    
    // قياس أداء وظيفة
    measurePerformance(fn, name = 'test') {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        const duration = end - start;
        
        }ms`);
        return { result, duration };
    }
};

// تطبيق الإعدادات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    if (DEV_MODE) {
        applyDevConfig();
        
        // إضافة أدوات سريعة للنافذة العامة
        window.dev = DevQuickTools;
        window.devConfig = DEV_CONFIG;
        
        console.log(`
🔧 وضع التطوير مفعل!

الأدوات السريعة المتاحة:
- dev.toggleDebug()      // تبديل وضع التطوير
- dev.quickTest()        // اختبارات سريعة
- dev.clearAll()         // مسح جميع البيانات
- dev.systemInfo()       // معلومات النظام
- dev.simulateError()    // محاكاة خطأ
- dev.testNotifications() // اختبار الإشعارات
- dev.measurePerformance(fn, name) // قياس الأداء

الإعدادات:
- devConfig             // عرض جميع الإعدادات
        `);
        
        // إظهار لوحة المطور تلقائياً إذا كان مفعلاً
        if (DEV_CONFIG.DEV_TOOLS.SHOW_PANEL) {
            setTimeout(() => {
                if (typeof devTools !== 'undefined' && devTools.toggleDevPanel) {
                    devTools.toggleDevPanel();
                }
            }, 1000);
        }
    }
});

// تصدير للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DEV_CONFIG, DevQuickTools, applyDevConfig };
} else {
    window.DEV_CONFIG = DEV_CONFIG;
    window.DevQuickTools = DevQuickTools;
}


