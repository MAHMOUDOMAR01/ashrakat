// Navigation Bar and Dark Mode JavaScript - محسّن للموبايل
class NavigationManager {
    constructor() {
        this.isDarkMode = false;
        this.isMobileMenuOpen = false;
        this.init();
    }

    init() {
        this.loadTheme();
        this.createNavbar();
        this.bindEvents();
        this.updateTheme();
        this.handleMobileDropdowns();
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            this.isDarkMode = true;
        } else if (savedTheme === 'light') {
            this.isDarkMode = false;
        } else {
            this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
    }

    saveTheme() {
        localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }

    createNavbar() {
        const path = (window.location.pathname || '').replace(/\\/g, '/');
        let prefix = '';
        if (path.includes('/pages/main/games/index.html') || path.includes('\\pages\\main\\games\\index.html')) {
            prefix = '../../../';
        } else if (path.includes('/pages/') || path.includes('\\pages\\')) {
            prefix = '../../';
        } else {
            prefix = '';
        }

        const navbarHTML = `
            <nav class="navbar" id="mainNavbar">
                <a href="${prefix}index.html" class="logo">🎓 منصة التعلم التفاعلي</a>
                <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="قائمة التنقل" aria-expanded="false">
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                </button>
                
                <!-- Desktop Navigation -->
                <div class="nav-links desktop-nav">
                    <a href="${prefix}pages/main/home.html">🏠 الرئيسية</a>
                    <div class="dropdown">
                        <a href="${prefix}pages/main/games.html" class="dropdown-toggle">🎮 الألعاب</a>
                        <div class="dropdown-menu">
                            <a href="${prefix}pages/main/games/index.html">🤖 المساعد الذكي</a>
                            <a href="${prefix}pages/main/games.html">🎯 جميع الألعاب</a>
                            <a href="${prefix}pages/main/system.html">📖 نظام الصحة</a>
                        </div>
                    </div>
                    <a href="${prefix}pages/videos/videos.html">🎥 الفيديوهات</a>
                    <a href="${prefix}pages/guidance/guidance.html">📖 الإرشادات</a>
                    <a href="${prefix}pages/feedback/feedback.html">📝 التقييم</a>
                    <button class="dark-mode-toggle" id="darkModeToggle" title="تبديل الوضع المظلم" aria-label="تبديل الوضع المظلم">
                        <span id="themeIcon">🌙</span>
                    </button>
                </div>
                
                <!-- Mobile Menu -->
                <div class="mobile-menu" id="mobileMenu">
                    <div class="mobile-menu-content">
                        <a href="${prefix}pages/main/home.html" class="mobile-menu-item">
                            <span class="menu-icon">🏠</span>
                            <span class="menu-text">الرئيسية</span>
                        </a>
                        
                        <div class="mobile-dropdown" id="mobileGamesDropdown">
                            <button class="mobile-menu-item mobile-dropdown-toggle" aria-expanded="false">
                                <span class="menu-icon">🎮</span>
                                <span class="menu-text">الألعاب</span>
                                <span class="dropdown-arrow">▼</span>
                            </button>
                            <div class="mobile-dropdown-content">
                                <a href="${prefix}pages/main/games/index.html" class="mobile-submenu-item">
                                    <span class="submenu-icon">🤖</span>
                                    <span class="submenu-text">المساعد الذكي</span>
                                </a>
                                <a href="${prefix}pages/main/games.html" class="mobile-submenu-item">
                                    <span class="submenu-icon">🎯</span>
                                    <span class="submenu-text">جميع الألعاب</span>
                                </a>
                                <a href="${prefix}pages/main/system.html" class="mobile-submenu-item">
                                    <span class="submenu-icon">📖</span>
                                    <span class="submenu-text">نظام الصحة</span>
                                </a>
                            </div>
                        </div>
                        
                        <a href="${prefix}pages/videos/videos.html" class="mobile-menu-item">
                            <span class="menu-icon">🎥</span>
                            <span class="menu-text">الفيديوهات</span>
                        </a>
                        
                        <a href="${prefix}pages/guidance/guidance.html" class="mobile-menu-item">
                            <span class="menu-icon">📖</span>
                            <span class="menu-text">الإرشادات</span>
                        </a>

                        <a href="${prefix}pages/main/sitemap.html" class="mobile-menu-item">
                            <span class="menu-icon">🗺️</span>
                            <span class="menu-text">خريطة الموقع</span>
                        </a>
                        
                        <a href="${prefix}pages/feedback/feedback.html" class="mobile-menu-item">
                            <span class="menu-icon">📝</span>
                            <span class="menu-text">التقييم</span>
                        </a>
                        
                        <button class="mobile-menu-item dark-mode-toggle" id="mobileDarkModeToggle" aria-label="تبديل الوضع المظلم">
                            <span class="menu-icon" id="mobileThemeIcon">🌙</span>
                            <span class="menu-text">الوضع المظلم</span>
                        </button>
                    </div>
                </div>
            </nav>
        `;

        document.body.insertAdjacentHTML('afterbegin', navbarHTML);

        // Insert floating help button
        const helpBtn = document.createElement('a');
        helpBtn.href = `${prefix}pages/main/games/index.html`;
        helpBtn.setAttribute('aria-label', 'المساعد الذكي');
        helpBtn.title = 'المساعد الذكي';
        helpBtn.className = 'floating-help-btn';
        helpBtn.innerHTML = '🤖';
        document.body.appendChild(helpBtn);

        // Create assistant modal
        this.createAssistantModal(prefix);
    }

    createAssistantModal(prefix) {
        const existingModal = document.getElementById('globalAssistantModal');
        if (existingModal) return;

        const modal = document.createElement('div');
        modal.id = 'globalAssistantModal';
        modal.className = 'assistant-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'assistantModalTitle');

        modal.innerHTML = `
            <div class="assistant-modal-overlay"></div>
            <div class="assistant-modal-content">
                <div class="assistant-modal-header">
                    <h2 id="assistantModalTitle">🤖 المساعد الذكي</h2>
                    <button class="assistant-modal-close" aria-label="إغلاق">✕</button>
                </div>
                <iframe id="assistantIframe" title="المساعد الذكي" src="${prefix}pages/main/games/index.html"></iframe>
            </div>
        `;

        document.body.appendChild(modal);

        // Bind modal events
        const closeBtn = modal.querySelector('.assistant-modal-close');
        const overlay = modal.querySelector('.assistant-modal-overlay');
        const helpBtns = document.querySelectorAll('.floating-help-btn');

        const openModal = (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        helpBtns.forEach(btn => btn.addEventListener('click', openModal));
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    bindEvents() {
        // Dark mode toggles
        const darkModeToggle = document.getElementById('darkModeToggle');
        const mobileDarkModeToggle = document.getElementById('mobileDarkModeToggle');
        
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
        }
        
        if (mobileDarkModeToggle) {
            mobileDarkModeToggle.addEventListener('click', () => this.toggleDarkMode());
        }

        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (mobileMenuToggle && mobileMenu) {
            mobileMenuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu();
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.isMobileMenuOpen && 
                    !mobileMenu.contains(e.target) && 
                    !mobileMenuToggle.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            // Prevent clicks inside menu from closing it
            mobileMenu.addEventListener('click', (e) => {
                if (e.target.tagName === 'A' && !e.target.classList.contains('mobile-dropdown-toggle')) {
                    this.closeMobileMenu();
                }
            });
        }

        // System theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.isDarkMode = e.matches;
                this.updateTheme();
            }
        });
    }

    handleMobileDropdowns() {
        const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
        
        mobileDropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.mobile-dropdown-toggle');
            const content = dropdown.querySelector('.mobile-dropdown-content');
            
            if (toggle && content) {
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const isOpen = dropdown.classList.contains('active');
                    
                    // Close all other dropdowns
                    document.querySelectorAll('.mobile-dropdown.active').forEach(d => {
                        if (d !== dropdown) {
                            d.classList.remove('active');
                            d.querySelector('.mobile-dropdown-toggle').setAttribute('aria-expanded', 'false');
                        }
                    });
                    
                    // Toggle current dropdown
                    if (isOpen) {
                        dropdown.classList.remove('active');
                        toggle.setAttribute('aria-expanded', 'false');
                    } else {
                        dropdown.classList.add('active');
                        toggle.setAttribute('aria-expanded', 'true');
                    }
                });
            }
        });
    }

    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        this.updateTheme();
        this.saveTheme();
        this.animateThemeChange();
    }

    updateTheme() {
        const body = document.body;
        const themeIcon = document.getElementById('themeIcon');
        const mobileThemeIcon = document.getElementById('mobileThemeIcon');
        
        if (this.isDarkMode) {
            body.classList.add('dark-mode', 'dark');
            if (themeIcon) themeIcon.textContent = '☀️';
            if (mobileThemeIcon) mobileThemeIcon.textContent = '☀️';
        } else {
            body.classList.remove('dark-mode', 'dark');
            if (themeIcon) themeIcon.textContent = '🌙';
            if (mobileThemeIcon) mobileThemeIcon.textContent = '🌙';
        }

        this.updateMetaThemeColor();
    }

    updateMetaThemeColor() {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = this.isDarkMode ? '#1a1a1a' : '#667eea';
    }

    animateThemeChange() {
        const body = document.body;
        body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        
        if (mobileMenu && mobileMenuToggle) {
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
            
            if (this.isMobileMenuOpen) {
                mobileMenu.classList.add('active');
                mobileMenuToggle.classList.add('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
            } else {
                this.closeMobileMenu();
            }
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        
        if (mobileMenu && mobileMenuToggle) {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            this.isMobileMenuOpen = false;
            
            // Close all dropdowns
            document.querySelectorAll('.mobile-dropdown.active').forEach(d => {
                d.classList.remove('active');
                d.querySelector('.mobile-dropdown-toggle').setAttribute('aria-expanded', 'false');
            });
        }
    }

    getCurrentTheme() {
        return this.isDarkMode ? 'dark' : 'light';
    }

    setTheme(theme) {
        if (theme === 'dark' || theme === 'light') {
            this.isDarkMode = theme === 'dark';
            this.updateTheme();
            this.saveTheme();
        }
    }

    isDarkModeActive() {
        return this.isDarkMode;
    }
}

// Dark mode styles
const darkModeStyles = `
    .dark-mode {
        --primary: #667eea;
        --secondary: #764ba2;
        --accent: #f093fb;
        --success: #4ECDC4;
        --dark: #1a1a1a;
        --light: #ffffff;
        --glass: rgba(255, 255, 255, 0.08);
        --glass-border: rgba(255, 255, 255, 0.18);
        --glass-hover: rgba(255, 255, 255, 0.12);
    }

    body.dark-mode {
        background: linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
        color: #ffffff;
    }

    .dark-mode .page-title,
    .dark-mode h1, .dark-mode h2, .dark-mode h3 {
        color: #ffffff;
    }

    .dark-mode .category-card,
    .dark-mode .section-card,
    .dark-mode .video-card,
    .dark-mode .game-card {
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(25px);
        border: 1px solid rgba(255, 255, 255, 0.18);
        color: #ffffff;
    }

    .dark-mode .form-control {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: #ffffff;
    }

    .dark-mode * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = darkModeStyles;
document.head.appendChild(styleSheet);

// Initialize
let navManager;
document.addEventListener('DOMContentLoaded', function() {
    navManager = new NavigationManager();
    window.navManager = navManager;
});