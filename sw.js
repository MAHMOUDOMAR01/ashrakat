// Service Worker للعمل دون اتصال وتحسين الأداء
const CACHE_NAME = 'health-games-v2.0.0';
const STATIC_CACHE = 'static-v2.0.0';
const DYNAMIC_CACHE = 'dynamic-v2.0.0';

// الملفات المهمة للتخزين المؤقت
const STATIC_FILES = [
    '/',
    '/index.html',
    '/offline.html',
    '/404.html',
    '/sitemap.xml',
    '/robots.txt',
    '/pages/main/home.html',
    '/pages/main/sitemap.html',
    '/pages/main/games/index.html',
    '/pages/main/games.html',
    '/pages/videos/videos.html',
    '/pages/feedback/feedback.html',
    '/assets/css/navbar.css',
    '/assets/js/navbar.js',
    '/assets/js/config.js',
    '/assets/js/utils.js',
    '/assets/html/navbar.html'
];

// الملفات التي يجب تحديثها دائماً
const NETWORK_FIRST = [
    '/pages/feedback/',
    '/api/',
    '.json'
];

// الملفات التي يمكن تخزينها مؤقتاً لفترة طويلة
const CACHE_FIRST = [
    '.css',
    '.js',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.woff',
    '.woff2'
];

// تثبيت Service Worker
self.addEventListener('install', event => {
    
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                
                return cache.addAll(STATIC_FILES);
            })
            .catch(error => {
                // Removed console call
            })
    );
    
    // تفعيل Service Worker فوراً
    self.skipWaiting();
});

// تفعيل Service Worker
self.addEventListener('activate', event => {
    
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        // حذف التخزين المؤقت القديم
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                // السيطرة على جميع العملاء
                return self.clients.claim();
            })
    );
});

// اعتراض طلبات الشبكة
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // تجاهل الطلبات غير HTTP/HTTPS
    if (!request.url.startsWith('http')) {
        return;
    }
    
    // تجاهل طلبات POST وغيرها
    if (request.method !== 'GET') {
        return;
    }
    
    event.respondWith(
        handleRequest(request)
    );
});

// معالجة الطلبات
async function handleRequest(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    try {
        // استراتيجية Network First للملفات الديناميكية
        if (shouldUseNetworkFirst(pathname)) {
            return await networkFirst(request);
        }
        
        // استراتيجية Cache First للملفات الثابتة
        if (shouldUseCacheFirst(pathname)) {
            return await cacheFirst(request);
        }
        
        // استراتيجية Stale While Revalidate للصفحات
        return await staleWhileRevalidate(request);
        
    } catch (error) {
        // Removed console call
        
        // إرجاع صفحة offline إذا كانت متاحة
        if (request.destination === 'document') {
            const offlinePage = await caches.match('/offline.html');
            if (offlinePage) {
                return offlinePage;
            }
        }
        
        // إرجاع استجابة خطأ بسيطة
        return new Response('غير متاح دون اتصال', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
    }
}

// تحديد ما إذا كان يجب استخدام Network First
function shouldUseNetworkFirst(pathname) {
    return NETWORK_FIRST.some(pattern => pathname.includes(pattern));
}

// تحديد ما إذا كان يجب استخدام Cache First
function shouldUseCacheFirst(pathname) {
    return CACHE_FIRST.some(ext => pathname.endsWith(ext));
}

// استراتيجية Network First
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // تخزين الاستجابة في التخزين المؤقت الديناميكي
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // العودة للتخزين المؤقت في حالة فشل الشبكة
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

// استراتيجية Cache First
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // إذا لم توجد في التخزين المؤقت، جلب من الشبكة
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
        const cache = await caches.open(STATIC_CACHE);
        cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
}

// استراتيجية Stale While Revalidate
async function staleWhileRevalidate(request) {
    const cachedResponse = await caches.match(request);
    
    // جلب نسخة محدثة في الخلفية
    const networkPromise = fetch(request)
        .then(networkResponse => {
            if (networkResponse.ok) {
                const cache = caches.open(DYNAMIC_CACHE);
                cache.then(c => c.put(request, networkResponse.clone()));
            }
            return networkResponse;
        })
        .catch(() => null);
    
    // إرجاع النسخة المخزنة فوراً إن وجدت، وإلا انتظار الشبكة
    return cachedResponse || await networkPromise;
}

// معالجة رسائل من العميل
self.addEventListener('message', event => {
    const { type, data } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_VERSION':
            event.ports[0].postMessage({ version: CACHE_NAME });
            break;
            
        case 'CLEAR_CACHE':
            clearAllCaches()
                .then(() => event.ports[0].postMessage({ success: true }))
                .catch(error => event.ports[0].postMessage({ error: error.message }));
            break;
            
        case 'CACHE_URLS':
            if (data && data.urls) {
                cacheUrls(data.urls)
                    .then(() => event.ports[0].postMessage({ success: true }))
                    .catch(error => event.ports[0].postMessage({ error: error.message }));
            }
            break;
    }
});

// مسح جميع التخزين المؤقت
async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
    );
}

// تخزين مؤقت لمجموعة من الروابط
async function cacheUrls(urls) {
    const cache = await caches.open(DYNAMIC_CACHE);
    await cache.addAll(urls);
}

// معالجة الأخطاء العامة بدون استخدام console
self.addEventListener('error', event => {
    // تسجيل الخطأ بطريقة أكثر أمانًا
    self.registration.update();
});

self.addEventListener('unhandledrejection', event => {
    // تسجيل الخطأ بطريقة أكثر أمانًا
    self.registration.update();
});



