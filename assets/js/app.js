// ملف التطبيق الرئيسي - تهيئة عامة وإدارة الأداء
class App {
    constructor() {
        this.isOnline = navigator.onLine;
        this.serviceWorker = null;
        this.performanceMetrics = {};
        
        this.init();
    }
    
    async init() {
        try {
            // تسجيل بداية التحميل
            this.performanceMetrics.startTime = performance.now();
            
            // تحميل الإعدادات
            await this.loadConfig();
            
            // تسجيل Service Worker
            await this.registerServiceWorker();
            
            // تهيئة معالجة الأخطاء
            this.setupErrorHandling();
            
            // تهيئة مراقبة الاتصال
            this.setupNetworkMonitoring();
            
            // تهيئة تحسينات الأداء
            this.setupPerformanceOptimizations();
            
            // تنظيف البيانات القديمة
            this.cleanupOldData();
            
            // تسجيل انتهاء التحميل
            this.performanceMetrics.loadTime = performance.now() - this.performanceMetrics.startTime;
            
            if (CONFIG.DEBUG.ENABLED) {
                , 'ms');
            }
            
        } catch (error) {
            Utils.handleError(error, 'App.Init');
        }
    }
    
    async loadConfig() {
        // التأكد من تحميل الإعدادات
        if (typeof CONFIG === 'undefined') {
            throw new Error('Configuration not loaded');
        }
        
        // تطبيق إعدادات التطوير
        if (CONFIG.DEBUG.ENABLED) {
            
            window.CONFIG = CONFIG;
            window.Utils = Utils;
        }
    }
    
    async registerServiceWorker() {
        if (!('serviceWorker' in navigator)) {
            
            return;
        }
        
        try {
            const registration = await navigator.serviceWorker.register('./sw.js');
            this.serviceWorker = registration;
            
            
            
            // معالجة التحديثات
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        this.showUpdateNotification();
                    }
                });
            });
            
        } catch (error) {
            // Removed console call
        }
    }
    
    setupErrorHandling() {
        // معالجة الأخطاء العامة
        window.addEventListener('error', (event) => {
            Utils.handleError(event.error, 'Global.Error');
        });
        
        // معالجة الأخطاء غير المعالجة في Promise
        window.addEventListener('unhandledrejection', (event) => {
            Utils.handleError(event.reason, 'Global.UnhandledRejection');
            event.preventDefault();
        });
        
        // معالجة أخطاء الموارد
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                Utils.handleError(
                    new Error(`Resource failed to load: ${event.target.src || event.target.href}`),
                    'Resource.LoadError'
                );
            }
        }, true);
    }
    
    setupNetworkMonitoring() {
        // مراقبة حالة الاتصال
        window.addEventListener('online', () => {
            this.isOnline = true;
            Utils.showToast('تم استعادة الاتصال بالإنترنت', 'success');
            this.syncOfflineData();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            Utils.showToast('لا يوجد اتصال بالإنترنت - سيتم العمل في الوضع دون اتصال', 'warning', 5000);
        });
        
        // مراقبة سرعة الاتصال
        if ('connection' in navigator) {
            const connection = navigator.connection;
            this.updateConnectionInfo(connection);
            
            connection.addEventListener('change', () => {
                this.updateConnectionInfo(connection);
            });
        }
    }
    
    updateConnectionInfo(connection) {
        const effectiveType = connection.effectiveType;
        
        // تحسين الأداء حسب سرعة الاتصال
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
            // تقليل جودة الصور وتأجيل التحميل
            CONFIG.PERFORMANCE.LAZY_LOAD_IMAGES = true;
            CONFIG.PERFORMANCE.MAX_CONCURRENT_REQUESTS = 2;
        } else if (effectiveType === '3g') {
            CONFIG.PERFORMANCE.MAX_CONCURRENT_REQUESTS = 4;
        } else {
            CONFIG.PERFORMANCE.MAX_CONCURRENT_REQUESTS = 6;
        }
        
        if (CONFIG.DEBUG.ENABLED) {
            
        }
    }
    
    setupPerformanceOptimizations() {
        // تحميل كسول للصور
        if (CONFIG.PERFORMANCE.LAZY_LOAD_IMAGES) {
            Utils.lazyLoadImages();
        }
        
        // تحسين التمرير
        this.optimizeScrolling();
        
        // تحسين الرسوم المتحركة
        this.optimizeAnimations();
        
        // تحميل مسبق للموارد المهمة
        if (CONFIG.PERFORMANCE.PRELOAD_CRITICAL_RESOURCES) {
            this.preloadCriticalResources();
        }
    }
    
    optimizeScrolling() {
        let ticking = false;
        
        const updateScrollPosition = () => {
            // تحديث موقع التمرير بكفاءة
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollPosition);
                ticking = true;
            }
        }, { passive: true });
    }
    
    optimizeAnimations() {
        // تقليل الرسوم المتحركة للأجهزة الضعيفة
        const isLowEndDevice = navigator.hardwareConcurrency <= 2 || 
                              navigator.deviceMemory <= 2;
        
        if (isLowEndDevice) {
            document.documentElement.style.setProperty('--animation-duration', '0.1s');
        }
        
        // احترام تفضيلات المستخدم للحركة المقللة
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0s');
        }
    }
    
    preloadCriticalResources() {
        const criticalResources = [
            './assets/css/navbar.css',
            './assets/js/navbar.js',
            './assets/js/utils.js'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }
    
    cleanupOldData() {
        try {
            Utils.cleanupOldData();
            
            // تنظيف IndexedDB إذا كان متاحاً
            if ('indexedDB' in window) {
                this.cleanupIndexedDB();
            }
            
        } catch (error) {
            Utils.handleError(error, 'App.Cleanup');
        }
    }
    
    async cleanupIndexedDB() {
        // تنظيف قواعد البيانات القديمة
        try {
            const databases = await indexedDB.databases();
            const oldDatabases = databases.filter(db => 
                db.name.includes('old') || 
                db.version < 2
            );
            
            for (const db of oldDatabases) {
                indexedDB.deleteDatabase(db.name);
            }
        } catch (error) {
            // IndexedDB.databases() قد لا يكون مدعوماً في جميع المتصفحات
            
        }
    }
    
    async syncOfflineData() {
        if (!this.isOnline) return;
        
        try {
            // مزامنة البيانات المحفوظة دون اتصال
            const offlineData = Utils.getStorageItem('offline_data', []);
            
            if (offlineData.length > 0) {
                
                
                // إرسال البيانات للخادم (إذا كان متاحاً)
                // await this.sendOfflineData(offlineData);
                
                // مسح البيانات بعد المزامنة
                Utils.removeStorageItem('offline_data');
                
                Utils.showToast('تم مزامنة البيانات المحفوظة', 'success');
            }
        } catch (error) {
            Utils.handleError(error, 'App.SyncOfflineData');
        }
    }
    
    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <span>🔄 يتوفر تحديث جديد للتطبيق</span>
                <button id="updateBtn" class="update-btn">تحديث الآن</button>
                <button id="dismissBtn" class="dismiss-btn">لاحقاً</button>
            </div>
        `;
        
        // إضافة الأنماط
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            zIndex: '10001',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '14px'
        });
        
        document.body.appendChild(notification);
        
        // معالجة الأحداث
        document.getElementById('updateBtn').onclick = () => {
            if (this.serviceWorker && this.serviceWorker.waiting) {
                this.serviceWorker.waiting.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
            }
        };
        
        document.getElementById('dismissBtn').onclick = () => {
            notification.remove();
        };
        
        // إزالة تلقائية بعد 10 ثوانٍ
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 10000);
    }
    
    // واجهة برمجية للتطبيق
    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            isOnline: this.isOnline,
            serviceWorkerActive: !!this.serviceWorker
        };
    }
    
    async clearAllData() {
        try {
            // مسح localStorage
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(CONFIG.GAMES.STORAGE_PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
            
            // مسح Service Worker cache
            if (this.serviceWorker) {
                const messageChannel = new MessageChannel();
                this.serviceWorker.active.postMessage(
                    { type: 'CLEAR_CACHE' },
                    [messageChannel.port2]
                );
            }
            
            Utils.showToast('تم مسح جميع البيانات', 'success');
            
        } catch (error) {
            Utils.handleError(error, 'App.ClearAllData');
        }
    }
    
    async exportUserData() {
        try {
            const userData = {};
            
            // جمع بيانات المستخدم
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(CONFIG.GAMES.STORAGE_PREFIX)) {
                    userData[key] = localStorage.getItem(key);
                }
            });
            
            // تشفير البيانات
            const encryptedData = Utils.simpleEncrypt(JSON.stringify(userData));
            
            // إنشاء ملف للتحميل
            const blob = new Blob([encryptedData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `health-games-backup-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            
            URL.revokeObjectURL(url);
            
            Utils.showToast('تم تصدير البيانات بنجاح', 'success');
            
        } catch (error) {
            Utils.handleError(error, 'App.ExportUserData');
        }
    }
    
    async importUserData(file) {
        try {
            const text = await file.text();
            const decryptedData = Utils.simpleDecrypt(text);
            const userData = JSON.parse(decryptedData);
            
            // استيراد البيانات
            Object.entries(userData).forEach(([key, value]) => {
                localStorage.setItem(key, value);
            });
            
            Utils.showToast('تم استيراد البيانات بنجاح', 'success');
            
            // إعادة تحميل الصفحة لتطبيق التغييرات
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            
        } catch (error) {
            Utils.handleError(error, 'App.ImportUserData');
            Utils.showToast('فشل في استيراد البيانات - تأكد من صحة الملف', 'error');
        }
    }
}

// تهيئة التطبيق عند تحميل الصفحة
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new App();
});

// تصدير للاستخدام العام
window.App = App;
window.app = app;


