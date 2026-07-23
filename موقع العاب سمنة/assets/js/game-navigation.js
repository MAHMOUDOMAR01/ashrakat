// مدير التنقل بين الألعاب - لحل مشكلة اللاج
class GameNavigation {
    constructor() {
        this.isTransitioning = false;
        this.transitionTimeout = null;
        this.preloadedGames = new Map();
        this.eventListeners = {}; // تخزين مستمعي الأحداث للتنظيف اللاحق
        
        this.init();
    }
    
    init() {
        // مراقبة تغيير الصفحة
        window.addEventListener('beforeunload', () => {
            this.handlePageUnload();
        });
        
        // مراقبة الروابط للألعاب
        this.setupGameLinks();
        
        // تنظيف دوري للموارد
        this.startPeriodicCleanup();
        
        if (CONFIG.DEBUG && CONFIG.DEBUG.ENABLED) {
            
        }
    }
    
    // تسجيل مستمع حدث مع تتبعه
    addEventListenerWithTracking(element, eventType, listener) {
        // إنشاء مصفوفة للنوع إذا لم تكن موجودة
        if (!this.eventListeners[eventType]) {
            this.eventListeners[eventType] = [];
        }
        
        // إضافة المستمع إلى العنصر
        element.addEventListener(eventType, listener);
        
        // تخزين المستمع للتنظيف لاحقًا
        this.eventListeners[eventType].push(listener);
        
        return listener;
    }
    
    // إعداد روابط الألعاب
    setupGameLinks() {
        this.addEventListenerWithTracking(document, 'click', (e) => {
            const gameLink = e.target.closest('a[href*="games/"], .game-card, .play-btn');
            
            if (gameLink && !this.isTransitioning) {
                const href = gameLink.href || gameLink.dataset.href;
                
                if (href && href.includes('games/')) {
                    e.preventDefault();
                    this.navigateToGame(href, gameLink);
                }
            }
        });
    }
    
    // التنقل إلى لعبة
    async navigateToGame(gameUrl, sourceElement = null) {
        if (this.isTransitioning) {
            
            return;
        }
        
        this.isTransitioning = true;
        
        try {
        // استخراج معرف اللعبة من الرابط
        const gameId = this.extractGameId(gameUrl);
        
        if (CONFIG.DEBUG && CONFIG.DEBUG.ENABLED) {
            
        }
        
        // إظهار مؤشر التحميل
        this.showLoadingIndicator(sourceElement);
        
        // تنظيف اللعبة الحالية
        await this.cleanupCurrentGame();
        
        // تأخير قصير للسماح بالتنظيف
        await this.delay(100);
        
        // التنقل إلى الصفحة الجديدة
        window.location.href = gameUrl;
        
    } catch (error) {
        // تم إزالة console.error
        Utils.showToast('حدث خطأ في تحميل اللعبة', 'error');
        this.isTransitioning = false;
        this.hideLoadingIndicator();
    }
    }
    
    // استخراج معرف اللعبة من الرابط
    extractGameId(gameUrl) {
        const match = gameUrl.match(/games\/([^.]+)\.html/);
        return match ? match[1] : 'unknown';
    }
    
    // تنظيف اللعبة الحالية
    async cleanupCurrentGame() {
        if (typeof gameManager !== 'undefined' && gameManager) {
            // الحصول على معلومات اللعبة الحالية قبل التنظيف
            const currentGameInfo = gameManager.getCurrentGameInfo();
            
            if (currentGameInfo) {
                if (CONFIG.DEBUG && CONFIG.DEBUG.ENABLED) {
                    
                }
                
                // حفظ التقدم إذا لزم الأمر
                await this.saveGameProgress(currentGameInfo);
            }
            
            // تنظيف شامل
            gameManager.cleanup();
        }
        
        // تنظيف إضافي للموارد
        this.performAdditionalCleanup();
    }
    
    // حفظ تقدم اللعبة
    async saveGameProgress(gameInfo) {
        try {
            const progressData = {
                gameId: gameInfo.id,
                timestamp: Date.now(),
                data: gameInfo.data,
                resources: gameInfo.resources
            };
            
            Utils.setStorageItem(`game_progress_${gameInfo.id}`, progressData);
            
            if (CONFIG.DEBUG && CONFIG.DEBUG.ENABLED) {
                
            }
        } catch (error) {
            
        }
    }
    
    // تنظيف إضافي للموارد
    performAdditionalCleanup() {
        // مسح جميع المؤقتات العامة
        const highestTimeoutId = setTimeout(() => {}, 0);
        for (let i = 0; i < highestTimeoutId; i++) {
            clearTimeout(i);
        }
        
        // مسح جميع الفواصل الزمنية العامة
        const highestIntervalId = setInterval(() => {}, 0);
        clearInterval(highestIntervalId);
        for (let i = 0; i < highestIntervalId; i++) {
            clearInterval(i);
        }
        
        // إيقاف جميع عناصر الوسائط
        const mediaElements = document.querySelectorAll('audio, video');
        mediaElements.forEach(element => {
            try {
                element.pause();
                element.currentTime = 0;
                element.src = '';
            } catch (e) {
                // تجاهل الأخطاء
            }
        });
        
        // مسح Canvas contexts
        const canvasElements = document.querySelectorAll('canvas');
        canvasElements.forEach(canvas => {
            try {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            } catch (e) {
                // تجاهل الأخطاء
            }
        });
        
        // إزالة event listeners من النافذة
        // نستخدم طريقة آمنة لإزالة مستمعي الأحداث دون الاعتماد على getEventListeners
        const events = ['resize', 'scroll', 'keydown', 'keyup', 'mousemove', 'click'];
        
        // إنشاء مستمعي أحداث فارغين لتجنب الأخطاء
        events.forEach(event => {
            try {
                // إزالة مستمعي الأحداث المعروفين
                if (typeof this.eventListeners === 'object' && Array.isArray(this.eventListeners[event])) {
                    this.eventListeners[event].forEach(listener => {
                        window.removeEventListener(event, listener);
                    });
                }
            } catch (e) {
                // تجاهل الأخطاء
            }
        });
    }
    
    // إظهار مؤشر التحميل
    showLoadingIndicator(sourceElement = null) {
        // إزالة مؤشر التحميل السابق
        this.hideLoadingIndicator();
        
        const loader = document.createElement('div');
        loader.id = 'game-navigation-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="spinner"></div>
                <p>جاري تحميل اللعبة...</p>
            </div>
        `;
        
        // إضافة الأنماط
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            #game-navigation-loader .loader-content {
                text-align: center;
                color: white;
                font-family: 'Cairo', sans-serif;
            }
            
            #game-navigation-loader .spinner {
                width: 50px;
                height: 50px;
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-top: 4px solid #4CAF50;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            #game-navigation-loader p {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(loader);
        
        // إضافة تأثير للعنصر المصدر
        if (sourceElement) {
            sourceElement.style.opacity = '0.6';
            sourceElement.style.pointerEvents = 'none';
        }
    }
    
    // إخفاء مؤشر التحميل
    hideLoadingIndicator() {
        const loader = document.getElementById('game-navigation-loader');
        if (loader) {
            loader.remove();
        }
        
        // إزالة التأثيرات من العناصر
        const disabledElements = document.querySelectorAll('[style*="pointer-events: none"]');
        disabledElements.forEach(element => {
            element.style.opacity = '';
            element.style.pointerEvents = '';
        });
    }
    
    // معالجة إغلاق الصفحة
    handlePageUnload() {
        if (typeof gameManager !== 'undefined' && gameManager) {
            gameManager.cleanup();
        }
        
        this.performAdditionalCleanup();
        
        if (CONFIG.DEBUG && CONFIG.DEBUG.ENABLED) {
            
        }
    }
    
    // تنظيف دوري للموارد
    startPeriodicCleanup() {
        // تنظيف كل 30 ثانية
        setInterval(() => {
            this.performPeriodicMaintenance();
        }, 30000);
    }
    
    // صيانة دورية
    performPeriodicMaintenance() {
        if (CONFIG.DEBUG && CONFIG.DEBUG.ENABLED) {
            
        }
        
        // تنظيف البيانات القديمة
        Utils.cleanupOldData();
        
        // فحص استهلاك الذاكرة
        if (performance.memory) {
            const memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024;
            
            if (memoryUsage > 100) { // أكثر من 100 ميجابايت
                // Removed console call} MB`);
                
                // تنظيف إضافي
                if (typeof gameManager !== 'undefined' && gameManager) {
                    gameManager.forceGarbageCollection();
                }
            }
        }
        
        // إزالة العناصر المؤقتة المنسية
        const tempElements = document.querySelectorAll('.temp-element, .expired-element');
        tempElements.forEach(element => {
            const created = element.dataset.created;
            if (created && (Date.now() - parseInt(created)) > 300000) { // أكثر من 5 دقائق
                element.remove();
            }
        });
    }
    
    // تأخير (Promise-based)
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // الحصول على إحصائيات التنقل
    getNavigationStats() {
        return {
            isTransitioning: this.isTransitioning,
            preloadedGames: this.preloadedGames.size,
            memoryUsage: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
            } : null,
            gameManager: typeof gameManager !== 'undefined' ? gameManager.getPerformanceStats() : null
        };
    }
}

// إنشاء instance عام من GameNavigation
let gameNavigation;

// تهيئة GameNavigation عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    gameNavigation = new GameNavigation();
    window.gameNavigation = gameNavigation;
    
    if (CONFIG.DEBUG && CONFIG.DEBUG.ENABLED) {
        
        
        // إضافة أدوات تطوير للتنقل
        window.navStats = () => gameNavigation.getNavigationStats();
        window.forceCleanup = () => gameNavigation.performAdditionalCleanup();
    }
});

// تصدير للاستخدام العام
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameNavigation;
} else {
    window.GameNavigation = GameNavigation;
}

