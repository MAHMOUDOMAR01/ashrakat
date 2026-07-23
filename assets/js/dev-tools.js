// أدوات التطوير المتقدمة
class DevTools {
    constructor() {
        this.isEnabled = CONFIG.DEBUG && CONFIG.DEBUG.ENABLED;
        this.logs = [];
        this.performance = {
            startTime: performance.now(),
            marks: new Map(),
            measures: new Map()
        };
        
        if (this.isEnabled) {
            this.init();
        }
    }
    
    init() {
        
        
        // إضافة أدوات إلى النافذة العامة
        window.dev = this;
        window.devTools = this;
        
        // إضافة اختصارات لوحة المفاتيح
        this.setupKeyboardShortcuts();
        
        // إضافة لوحة تحكم مطور
        this.createDevPanel();
        
        // مراقبة الأداء
        this.monitorPerformance();
    }
    
    // إعداد اختصارات لوحة المفاتيح
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl + Shift + D: تبديل لوحة المطور
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggleDevPanel();
            }
            
            // Ctrl + Shift + T: تشغيل الاختبارات
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.runTests();
            }
            
            // Ctrl + Shift + C: مسح وحدة التحكم
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                console.clear();
                this.log('تم مسح وحدة التحكم', 'info');
            }
            
            // Ctrl + Shift + R: إعادة تحميل مع مسح التخزين المؤقت
            if (e.ctrlKey && e.shiftKey && e.key === 'R') {
                e.preventDefault();
                this.hardReload();
            }
        });
    }
    
    // إنشاء لوحة تحكم المطور
    createDevPanel() {
        const panel = document.createElement('div');
        panel.id = 'devPanel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            width: 350px;
            max-height: 80vh;
            background: rgba(0, 0, 0, 0.9);
            color: #00ff00;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            border: 1px solid #00ff00;
            border-radius: 5px;
            padding: 10px;
            z-index: 10001;
            overflow-y: auto;
            display: none;
            backdrop-filter: blur(10px);
        `;
        
        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h3 style="margin: 0; color: #00ff00;">🔧 أدوات المطور</h3>
                <button onclick="devTools.toggleDevPanel()" style="
                    background: #ff0000;
                    color: white;
                    border: none;
                    border-radius: 3px;
                    padding: 2px 6px;
                    cursor: pointer;
                ">×</button>
            </div>
            
            <div style="margin-bottom: 10px;">
                <button onclick="devTools.runTests()" class="dev-btn">🧪 تشغيل الاختبارات</button>
                <button onclick="devTools.showPerformance()" class="dev-btn">📊 الأداء</button>
                <button onclick="devTools.clearAllData()" class="dev-btn">🗑️ مسح البيانات</button>
            </div>
            
            <div style="margin-bottom: 10px;">
                <button onclick="devTools.exportLogs()" class="dev-btn">📄 تصدير السجلات</button>
                <button onclick="devTools.simulateError()" class="dev-btn">⚠️ محاكاة خطأ</button>
                <button onclick="devTools.toggleTheme()" class="dev-btn">🌙 تبديل الوضع</button>
            </div>
            
            <div id="devLogs" style="
                background: rgba(0, 0, 0, 0.5);
                padding: 5px;
                border-radius: 3px;
                max-height: 200px;
                overflow-y: auto;
                font-size: 10px;
                line-height: 1.2;
            "></div>
            
            <div style="margin-top: 10px; font-size: 10px; color: #888;">
                اختصارات: Ctrl+Shift+D (لوحة) | Ctrl+Shift+T (اختبارات) | Ctrl+Shift+C (مسح)
            </div>
        `;
        
        // إضافة أنماط الأزرار
        const style = document.createElement('style');
        style.textContent = `
            .dev-btn {
                background: #333;
                color: #00ff00;
                border: 1px solid #00ff00;
                border-radius: 3px;
                padding: 4px 8px;
                margin: 2px;
                cursor: pointer;
                font-size: 10px;
                font-family: inherit;
            }
            .dev-btn:hover {
                background: #00ff00;
                color: #000;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(panel);
        
        this.devPanel = panel;
        this.devLogs = document.getElementById('devLogs');
    }
    
    // تبديل لوحة المطور
    toggleDevPanel() {
        if (this.devPanel) {
            const isVisible = this.devPanel.style.display !== 'none';
            this.devPanel.style.display = isVisible ? 'none' : 'block';
            this.log(isVisible ? 'إخفاء لوحة المطور' : 'إظهار لوحة المطور', 'info');
        }
    }
    
    // تسجيل رسالة
    log(message, type = 'info', data = null) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = {
            timestamp,
            message,
            type,
            data
        };
        
        this.logs.push(logEntry);
        
        // عرض في وحدة التحكم
        const consoleMethod = type === 'error' ? 'error' : type === 'warn' ? 'warn' : 'log';
        console[consoleMethod](`[${timestamp}] ${message}`, data || '');
        
        // عرض في لوحة المطور
        if (this.devLogs) {
            const colors = {
                info: '#00ff00',
                warn: '#ffff00',
                error: '#ff0000',
                success: '#00ffff'
            };
            
            const logDiv = document.createElement('div');
            logDiv.style.color = colors[type] || colors.info;
            logDiv.innerHTML = `[${timestamp}] ${message}`;
            
            this.devLogs.appendChild(logDiv);
            this.devLogs.scrollTop = this.devLogs.scrollHeight;
            
            // الاحتفاظ بآخر 100 رسالة فقط
            while (this.devLogs.children.length > 100) {
                this.devLogs.removeChild(this.devLogs.firstChild);
            }
        }
    }
    
    // تشغيل الاختبارات
    runTests() {
        this.log('بدء تشغيل الاختبارات...', 'info');
        if (typeof runTests === 'function') {
            runTests();
        } else {
            this.log('وظيفة الاختبارات غير متاحة', 'error');
        }
    }
    
    // عرض معلومات الأداء
    showPerformance() {
        const metrics = {
            loadTime: performance.now() - this.performance.startTime,
            memory: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + ' MB',
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + ' MB',
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) + ' MB'
            } : 'غير متاح',
            navigation: performance.getEntriesByType('navigation')[0],
            resources: performance.getEntriesByType('resource').length
        };
        
        this.log('معلومات الأداء:', 'info', metrics);
        console.table(metrics);
    }
    
    // مسح جميع البيانات
    clearAllData() {
        if (confirm('هل تريد مسح جميع البيانات المحفوظة؟')) {
            if (typeof app !== 'undefined' && app.clearAllData) {
                app.clearAllData();
            } else {
                localStorage.clear();
                sessionStorage.clear();
            }
            this.log('تم مسح جميع البيانات', 'success');
        }
    }
    
    // تصدير السجلات
    exportLogs() {
        const logsData = {
            timestamp: new Date().toISOString(),
            logs: this.logs,
            performance: this.performance,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        const blob = new Blob([JSON.stringify(logsData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `dev-logs-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        this.log('تم تصدير السجلات', 'success');
    }
    
    // محاكاة خطأ للاختبار
    simulateError() {
        try {
            throw new Error('خطأ تجريبي لاختبار معالجة الأخطاء');
        } catch (error) {
            if (typeof Utils !== 'undefined' && Utils.handleError) {
                Utils.handleError(error, 'DevTools.SimulateError');
            } else {
                // Removed console call
            }
        }
    }
    
    // تبديل الوضع المظلم
    toggleTheme() {
        if (typeof navManager !== 'undefined' && navManager.toggleDarkMode) {
            navManager.toggleDarkMode();
            this.log('تم تبديل الوضع المظلم', 'info');
        } else {
            this.log('مدير الوضع المظلم غير متاح', 'error');
        }
    }
    
    // إعادة تحميل صعبة
    hardReload() {
        this.log('إعادة تحميل مع مسح التخزين المؤقت...', 'info');
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                registrations.forEach(registration => registration.unregister());
            });
        }
        window.location.reload(true);
    }
    
    // مراقبة الأداء
    monitorPerformance() {
        // مراقبة استهلاك الذاكرة
        if (performance.memory) {
            setInterval(() => {
                const memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024;
                if (memoryUsage > 100) { // أكثر من 100 ميجابايت
                    this.log(`تحذير: استهلاك ذاكرة عالي: ${memoryUsage.toFixed(2)} MB`, 'warn');
                }
            }, 30000); // كل 30 ثانية
        }
        
        // مراقبة الأخطاء
        window.addEventListener('error', (event) => {
            this.log(`خطأ JavaScript: ${event.message}`, 'error', {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });
        
        // مراقبة الشبكة
        window.addEventListener('online', () => {
            this.log('تم استعادة الاتصال بالإنترنت', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.log('تم فقدان الاتصال بالإنترنت', 'warn');
        });
    }
    
    // إضافة علامة أداء
    mark(name) {
        performance.mark(name);
        this.performance.marks.set(name, performance.now());
        this.log(`علامة أداء: ${name}`, 'info');
    }
    
    // قياس الأداء بين علامتين
    measure(name, startMark, endMark) {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name, 'measure')[0];
        this.performance.measures.set(name, measure.duration);
        this.log(`قياس أداء: ${name} = ${measure.duration.toFixed(2)}ms`, 'info');
        return measure.duration;
    }
    
    // الحصول على معلومات النظام
    getSystemInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            hardwareConcurrency: navigator.hardwareConcurrency,
            deviceMemory: navigator.deviceMemory,
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            } : null,
            screen: {
                width: screen.width,
                height: screen.height,
                colorDepth: screen.colorDepth
            },
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
    }
}

// تهيئة أدوات التطوير
let devTools;

document.addEventListener('DOMContentLoaded', () => {
    if (typeof CONFIG !== 'undefined' && CONFIG.DEBUG && CONFIG.DEBUG.ENABLED) {
        devTools = new DevTools();
        
        // إضافة رسالة ترحيب
        console.log(`
🔧 أدوات التطوير مفعلة!

الاختصارات المتاحة:
- Ctrl+Shift+D: تبديل لوحة المطور
- Ctrl+Shift+T: تشغيل الاختبارات
- Ctrl+Shift+C: مسح وحدة التحكم
- Ctrl+Shift+R: إعادة تحميل صعبة

الأدوات المتاحة:
- devTools.log(message, type): تسجيل رسالة
- devTools.runTests(): تشغيل الاختبارات
- devTools.showPerformance(): عرض معلومات الأداء
- devTools.getSystemInfo(): معلومات النظام
        `);
    }
});

// تصدير للاستخدام العام
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DevTools;
} else {
    window.DevTools = DevTools;
}

