// مكتبة الأدوات المساعدة العامة
class Utils {
    
    // معالجة الأخطاء
    static handleError(error, context = 'Unknown') {
        const errorInfo = {
            message: error.message || 'خطأ غير معروف',
            context: context,
            timestamp: new Date().toISOString(),
            stack: error.stack
        };
        
        // تسجيل الخطأ
        // Removed console call
        
        // إظهار رسالة للمستخدم
        this.showToast(
            errorInfo.message.includes('network') || errorInfo.message.includes('fetch') 
                ? CONFIG.MESSAGES.ERROR_NETWORK 
                : CONFIG.MESSAGES.ERROR_GENERIC,
            'error'
        );
        
        // إرسال تقرير الخطأ (اختياري)
        if (CONFIG.DEBUG.ENABLED) {
            this.logError(errorInfo);
        }
        
        return errorInfo;
    }
    
    // تسجيل الأخطاء
    static logError(errorInfo) {
        const errors = this.getStorageItem('error_logs', []);
        errors.push(errorInfo);
        
        // الاحتفاظ بآخر 50 خطأ فقط
        if (errors.length > 50) {
            errors.splice(0, errors.length - 50);
        }
        
        this.setStorageItem('error_logs', errors);
    }
    
    // إظهار رسائل التنبيه
    static showToast(message, type = 'info', duration = CONFIG.UI.TOAST_DURATION) {
        // إزالة التوست السابق إن وجد
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const isMobile = window.innerWidth <= 768;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // ضبط المدة للموبايل وتقليل الحركة
        const finalDuration = Math.max(1500, isMobile ? Math.min(duration, 3000) : duration);

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.textContent = message;

        // ألوان حسب النوع
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };

        // إضافة الأنماط (تصميم مختلف للجوال)
        const baseStyle = {
            position: 'fixed',
            color: 'white',
            fontWeight: '600',
            zIndex: '10000',
            backgroundColor: colors[type] || colors.info,
            wordWrap: 'break-word',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
        };

        if (isMobile) {
            Object.assign(baseStyle, {
                left: '12px',
                right: '12px',
                bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
                padding: '14px 16px',
                borderRadius: '12px',
                transform: 'translateY(120%)',
                transition: prefersReducedMotion ? 'none' : 'transform 220ms ease'
            });
        } else {
            Object.assign(baseStyle, {
                top: '20px',
                right: '20px',
                padding: '12px 20px',
                borderRadius: '8px',
                transform: 'translateX(120%)',
                transition: prefersReducedMotion ? 'none' : 'transform 260ms ease',
                maxWidth: '360px'
            });
        }

        Object.assign(toast.style, baseStyle);
        document.body.appendChild(toast);

        // تأثير الظهور
        requestAnimationFrame(() => {
            if (isMobile) {
                toast.style.transform = 'translateY(0)';
            } else {
                toast.style.transform = 'translateX(0)';
            }
        });

        // دعم السحب للإخفاء على الجوال
        if (isMobile) {
            let startX = 0;
            let currentX = 0;
            let isDragging = false;

            const onTouchStart = (e) => {
                isDragging = true;
                startX = e.touches[0].clientX;
                currentX = startX;
                toast.style.transition = 'none';
            };

            const onTouchMove = (e) => {
                if (!isDragging) return;
                currentX = e.touches[0].clientX;
                const deltaX = currentX - startX;
                toast.style.transform = `translateY(0) translateX(${deltaX}px)`;
                toast.style.opacity = String(Math.max(0.3, 1 - Math.abs(deltaX) / 200));
            };

            const removeToast = () => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
                toast.removeEventListener('touchstart', onTouchStart);
                toast.removeEventListener('touchmove', onTouchMove);
                toast.removeEventListener('touchend', onTouchEnd);
                toast.removeEventListener('touchcancel', onTouchEnd);
            };

            const onTouchEnd = () => {
                if (!isDragging) return;
                isDragging = false;
                const deltaX = currentX - startX;
                // إذا السحب كبير، اخفاء
                if (Math.abs(deltaX) > 60) {
                    toast.style.transition = prefersReducedMotion ? 'none' : 'transform 180ms ease, opacity 180ms ease';
                    toast.style.transform = `translateY(0) translateX(${deltaX > 0 ? 500 : -500}px)`;
                    toast.style.opacity = '0';
                    setTimeout(removeToast, prefersReducedMotion ? 0 : 180);
                } else {
                    // رجوع للوضع الطبيعي
                    toast.style.transition = prefersReducedMotion ? 'none' : 'transform 220ms ease, opacity 220ms ease';
                    toast.style.transform = 'translateY(0) translateX(0)';
                    toast.style.opacity = '1';
                }
            };

            toast.addEventListener('touchstart', onTouchStart, { passive: true });
            toast.addEventListener('touchmove', onTouchMove, { passive: true });
            toast.addEventListener('touchend', onTouchEnd);
            toast.addEventListener('touchcancel', onTouchEnd);
        }

        // إخفاء التوست بعد المدة
        const hide = () => {
            if (!toast.parentNode) return;
            if (isMobile) {
                toast.style.transform = 'translateY(120%)';
            } else {
                toast.style.transform = 'translateX(120%)';
            }
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, prefersReducedMotion ? 0 : 260);
        };

        const hideTimer = setTimeout(hide, finalDuration);

        // إغلاق عند النقر
        toast.addEventListener('click', () => {
            clearTimeout(hideTimer);
            hide();
        });
    }
    
    // التحقق من صحة البيانات
    static validateData(data, schema) {
        const errors = [];
        
        for (const [key, rules] of Object.entries(schema)) {
            const value = data[key];
            
            if (rules.required && (value === undefined || value === null || value === '')) {
                errors.push(`${key} مطلوب`);
                continue;
            }
            
            if (value !== undefined && value !== null) {
                if (rules.type && typeof value !== rules.type) {
                    errors.push(`${key} يجب أن يكون من نوع ${rules.type}`);
                }
                
                if (rules.min && value < rules.min) {
                    errors.push(`${key} يجب أن يكون أكبر من ${rules.min}`);
                }
                
                if (rules.max && value > rules.max) {
                    errors.push(`${key} يجب أن يكون أصغر من ${rules.max}`);
                }
                
                if (rules.pattern && !rules.pattern.test(value)) {
                    errors.push(`${key} لا يتطابق مع النمط المطلوب`);
                }
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    // إدارة التخزين المحلي مع معالجة الأخطاء
    static setStorageItem(key, value) {
        try {
            const prefixedKey = CONFIG.GAMES.STORAGE_PREFIX + key;
            localStorage.setItem(prefixedKey, JSON.stringify(value));
            return true;
        } catch (error) {
            this.handleError(error, 'Storage.Set');
            return false;
        }
    }
    
    static getStorageItem(key, defaultValue = null) {
        try {
            const prefixedKey = CONFIG.GAMES.STORAGE_PREFIX + key;
            const item = localStorage.getItem(prefixedKey);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            this.handleError(error, 'Storage.Get');
            return defaultValue;
        }
    }
    
    static removeStorageItem(key) {
        try {
            const prefixedKey = CONFIG.GAMES.STORAGE_PREFIX + key;
            localStorage.removeItem(prefixedKey);
            return true;
        } catch (error) {
            this.handleError(error, 'Storage.Remove');
            return false;
        }
    }
    
    // تحسين الأداء - تحميل كسول للصور
    static lazyLoadImages() {
        if (!CONFIG.PERFORMANCE.LAZY_LOAD_IMAGES) return;
        
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // تحسين الأداء - قياس الأداء
    static measurePerformance(name, fn) {
        if (!CONFIG.DEBUG.SHOW_PERFORMANCE) {
            return fn();
        }
        
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        
        .toFixed(2)}ms`);
        return result;
    }
    
    // تنسيق التاريخ والوقت
    static formatDate(date, format = 'full') {
        const d = new Date(date);
        const options = {
            full: { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
            },
            date: { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            },
            time: { 
                hour: '2-digit', 
                minute: '2-digit' 
            }
        };
        
        return d.toLocaleDateString('ar-SA', options[format] || options.full);
    }
    
    // تحديث شريط التقدم
    static updateProgress(element, current, total, showText = true) {
        if (!element) return;
        
        const percentage = Math.min(100, Math.max(0, (current / total) * 100));
        
        const progressBar = element.querySelector('.progress-bar') || element;
        progressBar.style.width = `${percentage}%`;
        
        if (showText) {
            const progressText = element.querySelector('.progress-text');
            if (progressText) {
                progressText.textContent = `${current}/${total} (${Math.round(percentage)}%)`;
            }
        }
        
        return percentage;
    }
    
    // تشفير بسيط للبيانات الحساسة
    static simpleEncrypt(text, key = 'health_games_key') {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(
                text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
            );
        }
        return btoa(result);
    }
    
    static simpleDecrypt(encryptedText, key = 'health_games_key') {
        try {
            const text = atob(encryptedText);
            let result = '';
            for (let i = 0; i < text.length; i++) {
                result += String.fromCharCode(
                    text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
                );
            }
            return result;
        } catch (error) {
            this.handleError(error, 'Decrypt');
            return '';
        }
    }
    
    // تحقق من دعم المتصفح للميزات
    static checkBrowserSupport() {
        const features = {
            localStorage: typeof Storage !== 'undefined',
            intersectionObserver: 'IntersectionObserver' in window,
            webGL: !!document.createElement('canvas').getContext('webgl'),
            serviceWorker: 'serviceWorker' in navigator,
            webAudio: 'AudioContext' in window || 'webkitAudioContext' in window
        };
        
        return features;
    }
    
    // تنظيف البيانات القديمة
    static cleanupOldData() {
        const now = Date.now();
        const maxAge = CONFIG.PERFORMANCE.CACHE_DURATION;
        
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && key.startsWith(CONFIG.GAMES.STORAGE_PREFIX)) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data && data.timestamp && (now - data.timestamp) > maxAge) {
                        localStorage.removeItem(key);
                    }
                } catch (error) {
                    // إزالة البيانات التالفة
                    localStorage.removeItem(key);
                }
            }
        }
    }
}

// مدير الألعاب - لحل مشكلة اللاج عند التنقل بين الألعاب
class GameManager {
    constructor() {
        this.currentGame = null;
        this.gameData = new Map();
        this.timers = new Set();
        this.intervals = new Set();
        this.eventListeners = new Map();
        this.animationFrames = new Set();
        this.mediaElements = new Set();
        
        // تنظيف عند إغلاق الصفحة
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
        
        // تنظيف عند تغيير الصفحة
        window.addEventListener('pagehide', () => {
            this.cleanup();
        });
    }
    
    // بدء لعبة جديدة
    startGame(gameId) {
        if (CONFIG.DEBUG && CONFIG.DEBUG.ENABLED) {
            
        }
        
        // تنظيف اللعبة السابقة
        if (this.currentGame && this.currentGame !== gameId) {
            this.cleanup(this.currentGame);
        }
        
        this.currentGame = gameId;
        
        // تهيئة بيانات اللعبة
        if (!this.gameData.has(gameId)) {
            this.gameData.set(gameId, {
                startTime: Date.now(),
                score: 0,
                level: 1,
                state: 'active'
            });
        }
        
        return this.gameData.get(gameId);
    }
    
    // إنهاء اللعبة
    endGame(gameId = null) {
        const targetGame = gameId || this.currentGame;
        
        if (CONFIG.DEBUG && CONFIG.DEBUG.ENABLED) {
            
        }
        
        if (targetGame && this.gameData.has(targetGame)) {
            const gameData = this.gameData.get(targetGame);
            gameData.endTime = Date.now();
            gameData.duration = gameData.endTime - gameData.startTime;
            gameData.state = 'completed';
        }
        
        this.cleanup(targetGame);
        
        if (targetGame === this.currentGame) {
            this.currentGame = null;
        }
    }
    
    // إضافة timer للتتبع
    addTimer(callback, delay) {
        const timerId = setTimeout(() => {
            this.timers.delete(timerId);
            callback();
        }, delay);
        
        this.timers.add(timerId);
        return timerId;
    }
    
    // إضافة interval للتتبع
    addInterval(callback, delay) {
        const intervalId = setInterval(callback, delay);
        this.intervals.add(intervalId);
        return intervalId;
    }
    
    // إضافة event listener للتتبع
    addEventListener(element, event, handler, options = false) {
        const key = `${element.constructor.name}_${event}_${Date.now()}`;
        this.eventListeners.set(key, { element, event, handler, options });
        element.addEventListener(event, handler, options);
        return key;
    }
    
    // إزالة event listener
    removeEventListener(key) {
        if (this.eventListeners.has(key)) {
            const { element, event, handler, options } = this.eventListeners.get(key);
            element.removeEventListener(event, handler, options);
            this.eventListeners.delete(key);
        }
    }
    
    // إضافة animation frame للتتبع
    addAnimationFrame(callback) {
        const frameId = requestAnimationFrame(() => {
            this.animationFrames.delete(frameId);
            callback();
        });
        
        this.animationFrames.add(frameId);
        return frameId;
    }
    
    // إضافة عنصر وسائط للتتبع
    addMediaElement(element) {
        this.mediaElements.add(element);
        return element;
    }
    
    // تنظيف شامل
    cleanup(gameId = null) {
        const targetGame = gameId || this.currentGame;
        
        if (CONFIG.DEBUG && CONFIG.DEBUG.ENABLED) {
            
        }
        
        // مسح جميع المؤقتات
        this.timers.forEach(timerId => {
            clearTimeout(timerId);
        });
        this.timers.clear();
        
        // مسح جميع الفواصل الزمنية
        this.intervals.forEach(intervalId => {
            clearInterval(intervalId);
        });
        this.intervals.clear();
        
        // إزالة جميع مستمعي الأحداث
        this.eventListeners.forEach(({ element, event, handler, options }, key) => {
            try {
                element.removeEventListener(event, handler, options);
            } catch (error) {
                
            }
        });
        this.eventListeners.clear();
        
        // إلغاء animation frames
        this.animationFrames.forEach(frameId => {
            cancelAnimationFrame(frameId);
        });
        this.animationFrames.clear();
        
        // إيقاف عناصر الوسائط
        this.mediaElements.forEach(element => {
            try {
                if (element.pause) element.pause();
                if (element.currentTime !== undefined) element.currentTime = 0;
                if (element.src) element.src = '';
            } catch (error) {
                
            }
        });
        this.mediaElements.clear();
        
        // مسح المتغيرات العامة للألعاب
        this.clearGameGlobals();
        
        // تنظيف DOM
        this.cleanupDOM();
        
        // إجبار garbage collection إذا كان متاحاً
        this.forceGarbageCollection();
        
        // تحديث حالة اللعبة
        if (targetGame && this.gameData.has(targetGame)) {
            const gameData = this.gameData.get(targetGame);
            gameData.state = 'cleaned';
        }
    }
    
    // مسح المتغيرات العامة للألعاب
    clearGameGlobals() {
        const gameGlobals = [
            // متغيرات عامة للألعاب
            'gameState', 'currentGame', 'gameData', 'gameScore', 'gameLevel',
            'gameTimer', 'gameInterval', 'gameStarted', 'gamePaused', 'gameEnded',
            
            // متغيرات الأسئلة والإجابات
            'selectedItems', 'currentQuestion', 'questions', 'answers', 'userAnswers',
            'correctAnswers', 'wrongAnswers', 'questionIndex', 'totalQuestions',
            
            // متغيرات البيانات
            'nutritionData', 'foodItems', 'categories', 'challengeData', 
            'currentChallenge', 'challengeScore', 'waterIntake', 'dailyGoal',
            'exerciseData', 'habitData', 'mealPlan', 'calorieData', 'bmiData', 'bodyData',
            
            // متغيرات الحالة
            'isPlaying', 'isPaused', 'isCompleted', 'isLoading', 'hasStarted',
            'currentLevel', 'currentScore', 'timeLeft', 'timeElapsed',
            
            // متغيرات التحكم
            'gameController', 'gameRenderer', 'gameLoop', 'gameAudio',
            'gameInput', 'gameUI', 'gameLogic'
        ];
        
        gameGlobals.forEach(globalVar => {
            if (window[globalVar] !== undefined) {
                try {
                    delete window[globalVar];
                } catch (e) {
                    window[globalVar] = null;
                }
            }
        });
    }
    
    // تنظيف DOM
    cleanupDOM() {
        // إزالة العناصر المؤقتة
        const tempSelectors = [
            '.temp-element', '.game-overlay', '.modal-overlay', '.loading-overlay',
            '.game-popup', '.score-popup', '.hint-popup', '.feedback-popup',
            '.game-timer', '.game-progress', '.game-notification'
        ];
        
        tempSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                try {
                    element.remove();
                } catch (e) {
                    // Removed console call
                }
            });
        });
        
        // إعادة تعيين النماذج
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            try {
                form.reset();
            } catch (e) {
                // تجاهل الأخطاء
            }
        });
        
        // مسح الفئات المؤقتة من body
        const tempClasses = [
            'game-active', 'modal-open', 'loading', 'playing', 'paused',
            'game-completed', 'game-over', 'fullscreen-game'
        ];
        
        tempClasses.forEach(className => {
            document.body.classList.remove(className);
        });
        
        // إعادة تعيين scroll position
        window.scrollTo(0, 0);
    }
    
    // إجبار garbage collection
    forceGarbageCollection() {
        // محاولة تشغيل garbage collection إذا كان متاحاً
        if (window.gc && typeof window.gc === 'function') {
            try {
                window.gc();
            } catch (e) {
                // تجاهل الأخطاء
            }
        }
        
        // تنظيف إضافي للذاكرة
        if (window.CollectGarbage && typeof window.CollectGarbage === 'function') {
            try {
                window.CollectGarbage();
            } catch (e) {
                // تجاهل الأخطاء
            }
        }
    }
    
    // الحصول على معلومات اللعبة الحالية
    getCurrentGameInfo() {
        if (!this.currentGame) return null;
        
        return {
            id: this.currentGame,
            data: this.gameData.get(this.currentGame),
            resources: {
                timers: this.timers.size,
                intervals: this.intervals.size,
                eventListeners: this.eventListeners.size,
                animationFrames: this.animationFrames.size,
                mediaElements: this.mediaElements.size
            }
        };
    }
    
    // الحصول على إحصائيات الأداء
    getPerformanceStats() {
        return {
            memoryUsage: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            } : null,
            activeResources: {
                timers: this.timers.size,
                intervals: this.intervals.size,
                eventListeners: this.eventListeners.size,
                animationFrames: this.animationFrames.size,
                mediaElements: this.mediaElements.size
            },
            gamesData: Array.from(this.gameData.entries()).map(([id, data]) => ({
                id,
                state: data.state,
                duration: data.duration || (Date.now() - data.startTime)
            }))
        };
    }
}

// إنشاء instance عام من GameManager
let gameManager;

// تهيئة GameManager عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    gameManager = new GameManager();
    window.gameManager = gameManager;
    
    if (CONFIG.DEBUG && CONFIG.DEBUG.ENABLED) {
        
    }
});

// تصدير الكلاسات للاستخدام العام
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Utils, GameManager };
} else {
    window.Utils = Utils;
    window.GameManager = GameManager;
}


