// إعدادات المشروع المركزية
const CONFIG = {
    // معلومات المشروع
    PROJECT_NAME: 'منصة التعلم التفاعلي',
    VERSION: '2.0.0',
    
    // مسارات الملفات
    PATHS: {
        ROOT: '../../',
        ASSETS: '../../assets/',
        PAGES: '../../pages/',
        GAMES: '../../pages/main/games/',
        VIDEOS: '../../pages/videos/',
        FEEDBACK: '../../pages/feedback/'
    },
    
    // إعدادات الألعاب
    GAMES: {
        STORAGE_PREFIX: 'health_games_',
        AUTO_SAVE_INTERVAL: 30000, // 30 ثانية
        MAX_SAVE_SLOTS: 5,
        DEFAULT_DIFFICULTY: 'medium'
    },
    
    // إعدادات الواجهة
    UI: {
        ANIMATION_DURATION: 300,
        TOAST_DURATION: 3000,
        LOADING_MIN_TIME: 1000,
        THEME_TRANSITION: 200
    },
    
    // إعدادات الأداء
    PERFORMANCE: {
        LAZY_LOAD_IMAGES: true,
        PRELOAD_CRITICAL_RESOURCES: true,
        CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 ساعة
        MAX_CONCURRENT_REQUESTS: 6
    },
    
    // رسائل النظام
    MESSAGES: {
        LOADING: 'جاري التحميل...',
        ERROR_GENERIC: 'حدث خطأ غير متوقع',
        ERROR_NETWORK: 'خطأ في الاتصال بالشبكة',
        ERROR_STORAGE: 'خطأ في حفظ البيانات',
        SUCCESS_SAVE: 'تم الحفظ بنجاح',
        SUCCESS_LOAD: 'تم التحميل بنجاح'
    },
    
    // إعدادات التطوير
    DEBUG: {
        ENABLED: false,
        LOG_LEVEL: 'info', // 'debug', 'info', 'warn', 'error'
        SHOW_PERFORMANCE: false
    }
};

// دالة للحصول على المسار النسبي الصحيح
function getPath(key, filename = '') {
    const basePath = CONFIG.PATHS[key] || '';
    return basePath + filename;
}

// دالة للحصول على إعداد معين
function getSetting(path, defaultValue = null) {
    const keys = path.split('.');
    let value = CONFIG;
    
    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return defaultValue;
        }
    }
    
    return value;
}

// تصدير الإعدادات للاستخدام العام
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, getPath, getSetting };
} else {
    window.CONFIG = CONFIG;
    window.getPath = getPath;
    window.getSetting = getSetting;
}
