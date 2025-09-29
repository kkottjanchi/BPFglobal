/**
 * 2025 Bupyeong Pungmul Global Zone - Thank You Popup Manager
 * Features:
 * - Single display with user control options
 * - LocalStorage/Cookie based display management  
 * - Sophisticated glassmorphism design
 * - Bilingual content support (EN/KO)
 * - GA4 tracking integration
 */

class ThankYouPopup {
    constructor() {
        this.isVisible = false;
        this.currentLang = 'en';
        this.storageKey = 'bpf_thankyou_popup_pref';
        
        // Content data for both languages
        this.content = {
            en: {
                'badge-text': 'Festival Successfully Completed!',
                'main-title': 'Thank You! 🎊',
                'subtitle': '2025 Bupyeong Pungmul Global Zone has brought Korean traditional culture to the world',
                'stat1-title': 'Global Visitors',
                'stat1-desc': 'From around the world',
                'stat2-title': 'Countries',
                'stat3-title': 'Engagements',
                'stat3-desc': 'Cultural interactions',
                'success-title': 'Mission Accomplished: Global K-Culture Bridge Built! 🌉',
                'success-message': "Together, we've created meaningful connections across cultures through the beauty of Korean traditional Pungmul. This website continues as a bridge for ongoing cultural exchange and conversation.",
                'website-status': '🌍 This platform remains open for continued cultural dialogue',
                'cta-text': 'Explore Festival Programs',
                'btn-today': "Don't show today",
                'btn-never': "Don't show again",
                'btn-close': "Close"
            },
            ko: {
                'badge-text': '축제 성공적으로 완료!',
                'main-title': '감사합니다! 🎊',
                'subtitle': '2025 부평 풍물 글로벌존이 한국 전통문화를 세계와 나누었습니다',
                'stat1-title': '글로벌 방문자',
                'stat1-desc': '전 세계에서',
                'stat2-title': '참여 국가',
                'stat3-title': '참여도',
                'stat3-desc': '문화적 상호작용',
                'success-title': '임무 완료: 글로벌 K-문화 다리 구축! 🌉',
                'success-message': '한국 전통 풍물의 아름다움을 통해 문화 간 의미 있는 연결을 만들어냈습니다. 이 웹사이트는 지속적인 문화교류와 소통의 다리 역할을 계속할 것입니다.',
                'website-status': '🌍 이 플랫폼은 지속적인 문화 대화를 위해 열려있습니다',
                'cta-text': '축제 프로그램 둘러보기',
                'btn-today': '오늘하루만 끄기',
                'btn-never': '다신 안 보기',
                'btn-close': '닫기'
            }
        };

        this.init();
    }

    init() {
        // Check if popup should be shown
        if (this.shouldShowPopup()) {
            // Wait for page to load, then show popup after delay
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(() => this.showPopup(), 1500);
                });
            } else {
                setTimeout(() => this.showPopup(), 1500);
            }
        }
    }

    shouldShowPopup() {
        const preference = localStorage.getItem(this.storageKey);
        
        if (!preference) {
            return true; // First visit - show popup
        }

        const pref = JSON.parse(preference);
        const today = new Date().toDateString();
        
        // Never show again
        if (pref.type === 'never') {
            return false;
        }
        
        // Don't show today
        if (pref.type === 'today' && pref.date === today) {
            return false;
        }
        
        return true; // Show popup
    }

    createPopupHTML() {
        return `
        <div id="thankYouPopupOverlay" class="popup-overlay">
            <div class="popup-container">
                <!-- Language Toggle -->
                <div class="popup-lang-toggle">
                    <button class="popup-lang-tab active" data-lang="en">
                        🇺🇸 English
                    </button>
                    <button class="popup-lang-tab" data-lang="ko">
                        🇰🇷 한국어
                    </button>
                </div>

                <!-- Close Button -->
                <button class="popup-close-btn" onclick="thankYouPopup.hidePopup()">&times;</button>

                <!-- Main Content -->
                <div class="popup-content">
                    <!-- Success Badge -->
                    <div class="popup-success-badge">
                        <i class="fas fa-check-circle"></i>
                        <span id="popup-badge-text">Festival Successfully Completed!</span>
                    </div>

                    <!-- Main Title -->
                    <h1 class="popup-main-title" id="popup-main-title">
                        Thank You! 🎊
                    </h1>
                    
                    <p class="popup-subtitle" id="popup-subtitle">
                        2025 Bupyeong Pungmul Global Zone has brought Korean traditional culture to the world
                    </p>

                    <!-- Stats Grid -->
                    <div class="popup-stats-grid">
                        <div class="popup-stats-card">
                            <div class="popup-floating-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <div class="popup-number-display">1.3K</div>
                            <div class="popup-stat-title" id="popup-stat1-title">Global Visitors</div>
                            <div class="popup-stat-desc" id="popup-stat1-desc">From around the world</div>
                        </div>
                        
                        <div class="popup-stats-card">
                            <div class="popup-floating-icon">
                                <i class="fas fa-globe"></i>
                            </div>
                            <div class="popup-number-display">5+</div>
                            <div class="popup-stat-title" id="popup-stat2-title">Countries</div>
                            <div class="popup-stat-desc">
                                <span class="country-flag">🇰🇷</span>
                                <span class="country-flag">🇺🇸</span>
                                <span class="country-flag">🇫🇷</span>
                                <span class="country-flag">🇬🇧</span>
                                <span class="country-flag">🇩🇪</span>
                            </div>
                        </div>
                        
                        <div class="popup-stats-card">
                            <div class="popup-floating-icon">
                                <i class="fas fa-heart"></i>
                            </div>
                            <div class="popup-number-display">8.7K</div>
                            <div class="popup-stat-title" id="popup-stat3-title">Engagements</div>
                            <div class="popup-stat-desc" id="popup-stat3-desc">Cultural interactions</div>
                        </div>
                    </div>

                    <!-- Success Message -->
                    <div class="popup-success-message">
                        <div class="popup-trophy-icon">
                            <i class="fas fa-trophy"></i>
                        </div>
                        <h2 class="popup-success-title" id="popup-success-title">
                            Mission Accomplished: Global K-Culture Bridge Built! 🌉
                        </h2>
                        <p class="popup-success-desc" id="popup-success-message">
                            Together, we've created meaningful connections across cultures through the beauty of Korean traditional Pungmul. 
                            This website continues as a bridge for ongoing cultural exchange and conversation.
                        </p>
                        <div class="popup-website-status">
                            <p id="popup-website-status">
                                🌍 This platform remains open for continued cultural dialogue
                            </p>
                        </div>
                    </div>

                    <!-- CTA Button -->
                    <div class="popup-cta-section">
                        <button class="popup-cta-btn" onclick="thankYouPopup.hidePopup()">
                            <i class="fas fa-home"></i>
                            <span id="popup-cta-text">Explore Festival Programs</span>
                        </button>
                    </div>
                </div>

                <!-- Control Buttons -->
                <div class="popup-controls">
                    <button class="popup-control-btn popup-btn-today" onclick="thankYouPopup.setPreference('today')">
                        <i class="fas fa-clock"></i>
                        <span id="popup-btn-today">Don't show today</span>
                    </button>
                    <button class="popup-control-btn popup-btn-never" onclick="thankYouPopup.setPreference('never')">
                        <i class="fas fa-ban"></i>
                        <span id="popup-btn-never">Don't show again</span>
                    </button>
                    <button class="popup-control-btn popup-btn-close" onclick="thankYouPopup.hidePopup()">
                        <i class="fas fa-times"></i>
                        <span id="popup-btn-close">Close</span>
                    </button>
                </div>
            </div>
        </div>`;
    }

    createPopupCSS() {
        const style = document.createElement('style');
        style.textContent = `
        .popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(10px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.4s ease;
        }

        .popup-overlay.show {
            opacity: 1;
            visibility: visible;
        }

        .popup-container {
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
            width: 800px;
            background: linear-gradient(135deg, 
                rgba(99, 102, 241, 0.9) 0%, 
                rgba(168, 85, 247, 0.9) 35%, 
                rgba(236, 72, 153, 0.9) 70%, 
                rgba(251, 146, 60, 0.9) 100%);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 24px;
            overflow-y: auto;
            transform: scale(0.7) translateY(50px);
            transition: all 0.4s ease;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        }

        .popup-overlay.show .popup-container {
            transform: scale(1) translateY(0);
        }

        .popup-lang-toggle {
            display: flex;
            justify-content: center;
            padding: 20px 20px 0;
        }

        .popup-lang-tab {
            padding: 8px 20px;
            border: none;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            border-radius: 20px;
            margin: 0 5px;
        }

        .popup-lang-tab.active {
            background: rgba(255, 255, 255, 0.2);
            border-bottom: 3px solid #ffffff;
        }

        .popup-close-btn {
            position: absolute;
            top: 15px;
            right: 15px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            font-size: 24px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
        }

        .popup-close-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.1);
        }

        .popup-content {
            padding: 20px 40px 10px;
            text-align: center;
            color: white;
        }

        .popup-success-badge {
            display: inline-flex;
            align-items: center;
            background: linear-gradient(45deg, #10b981, #059669);
            padding: 12px 24px;
            border-radius: 25px;
            color: white;
            font-weight: bold;
            margin-bottom: 20px;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        .popup-success-badge i {
            margin-right: 8px;
        }

        .popup-main-title {
            font-size: 3rem;
            font-weight: 900;
            margin-bottom: 16px;
            text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
            transition: all 0.5s ease;
        }

        .popup-subtitle {
            font-size: 1.2rem;
            margin-bottom: 30px;
            opacity: 0.95;
            line-height: 1.6;
            transition: all 0.5s ease;
        }

        .popup-stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .popup-stats-card {
            backdrop-filter: blur(20px);
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            padding: 24px;
            text-align: center;
            transition: all 0.4s ease;
        }

        .popup-stats-card:hover {
            transform: translateY(-5px) scale(1.02);
            background: rgba(255, 255, 255, 0.2);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }

        .popup-floating-icon {
            font-size: 2rem;
            margin-bottom: 12px;
            animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
        }

        .popup-number-display {
            font-size: 2.5rem;
            font-weight: 900;
            background: linear-gradient(45deg, #ffffff, #f8fafc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .popup-stat-title {
            font-weight: bold;
            margin-bottom: 8px;
            font-size: 1.1rem;
        }

        .popup-stat-desc {
            font-size: 0.9rem;
            opacity: 0.9;
        }

        .country-flag {
            font-size: 1.2rem;
            margin: 0 0.2rem;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }

        .popup-success-message {
            backdrop-filter: blur(15px);
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 25px;
        }

        .popup-trophy-icon {
            font-size: 3rem;
            color: #FFE66D;
            margin-bottom: 16px;
            animation: float 3s ease-in-out infinite;
        }

        .popup-success-title {
            font-size: 1.8rem;
            font-weight: bold;
            margin-bottom: 16px;
            transition: all 0.5s ease;
        }

        .popup-success-desc {
            font-size: 1rem;
            line-height: 1.6;
            margin-bottom: 20px;
            opacity: 0.95;
            transition: all 0.5s ease;
        }

        .popup-website-status {
            backdrop-filter: blur(15px);
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 12px;
            display: inline-block;
        }

        .popup-website-status p {
            margin: 0;
            font-size: 0.9rem;
            font-weight: 600;
        }

        .popup-cta-section {
            margin-bottom: 20px;
        }

        .popup-cta-btn {
            display: inline-flex;
            align-items: center;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border: none;
            color: white;
            padding: 16px 32px;
            border-radius: 30px;
            font-weight: bold;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .popup-cta-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.05);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .popup-cta-btn i {
            margin-right: 12px;
        }

        .popup-controls {
            display: flex;
            justify-content: center;
            gap: 12px;
            padding: 0 40px 30px;
            flex-wrap: wrap;
        }

        .popup-control-btn {
            display: flex;
            align-items: center;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
            font-size: 0.9rem;
        }

        .popup-control-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
        }

        .popup-control-btn i {
            margin-right: 8px;
        }

        .popup-btn-today:hover {
            background: rgba(59, 130, 246, 0.3);
            border-color: rgba(59, 130, 246, 0.5);
        }

        .popup-btn-never:hover {
            background: rgba(239, 68, 68, 0.3);
            border-color: rgba(239, 68, 68, 0.5);
        }

        .popup-btn-close:hover {
            background: rgba(156, 163, 175, 0.3);
            border-color: rgba(156, 163, 175, 0.5);
        }

        /* Content slide animation */
        .content-slide {
            transition: all 0.5s ease;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
            .popup-container {
                width: 95vw;
                margin: 20px;
            }

            .popup-content {
                padding: 15px 25px 10px;
            }

            .popup-controls {
                padding: 0 25px 25px;
                flex-direction: column;
            }

            .popup-main-title {
                font-size: 2.5rem;
            }

            .popup-stats-grid {
                grid-template-columns: 1fr;
                gap: 15px;
            }

            .popup-number-display {
                font-size: 2rem;
            }

            .popup-success-title {
                font-size: 1.5rem;
            }
        }

        @media (max-width: 480px) {
            .popup-main-title {
                font-size: 2rem;
            }

            .popup-success-message {
                padding: 20px;
            }

            .popup-control-btn {
                justify-content: center;
                width: 100%;
            }
        }`;
        
        document.head.appendChild(style);
    }

    showPopup() {
        // Create CSS if not exists
        if (!document.querySelector('style[data-popup-style]')) {
            this.createPopupCSS();
            document.querySelector('style').setAttribute('data-popup-style', 'true');
        }

        // Create popup HTML
        const popupHTML = this.createPopupHTML();
        const popupDiv = document.createElement('div');
        popupDiv.innerHTML = popupHTML;
        document.body.appendChild(popupDiv.firstElementChild);

        // Show popup with animation
        setTimeout(() => {
            document.getElementById('thankYouPopupOverlay').classList.add('show');
        }, 100);

        // Setup event listeners
        this.setupEventListeners();
        
        // Track popup shown
        this.trackEvent('popup_shown', {
            event_category: 'BPF_Popup',
            event_label: 'thank_you_popup_displayed'
        });

        this.isVisible = true;
    }

    hidePopup() {
        const overlay = document.getElementById('thankYouPopupOverlay');
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => {
                overlay.remove();
            }, 400);
        }
        
        // Track popup closed
        this.trackEvent('popup_closed', {
            event_category: 'BPF_Popup',
            event_label: 'thank_you_popup_closed'
        });

        this.isVisible = false;
    }

    setPreference(type) {
        const preference = {
            type: type,
            date: new Date().toDateString(),
            timestamp: Date.now()
        };

        localStorage.setItem(this.storageKey, JSON.stringify(preference));
        
        // Track preference set
        this.trackEvent('popup_preference_set', {
            event_category: 'BPF_Popup',
            event_label: `preference_${type}`,
            preference_type: type
        });

        this.hidePopup();
    }

    setupEventListeners() {
        // Language switching
        document.querySelectorAll('.popup-lang-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.switchLanguage(lang);
            });
        });

        // Prevent popup close when clicking inside
        document.querySelector('.popup-container').addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Close when clicking overlay
        document.getElementById('thankYouPopupOverlay').addEventListener('click', () => {
            this.hidePopup();
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hidePopup();
            }
        });
    }

    switchLanguage(lang) {
        this.currentLang = lang;
        
        // Update tab appearance
        document.querySelectorAll('.popup-lang-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
        
        // Update content with animation
        const elements = document.querySelectorAll('.content-slide, .popup-main-title, .popup-subtitle, .popup-success-title, .popup-success-desc, .popup-stat-title, .popup-stat-desc');
        elements.forEach(el => {
            el.style.opacity = '0.5';
            el.style.transform = 'translateY(10px)';
        });
        
        setTimeout(() => {
            Object.keys(this.content[lang]).forEach(key => {
                const element = document.getElementById(`popup-${key}`);
                if (element) {
                    element.innerHTML = this.content[lang][key];
                }
            });
            
            elements.forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }, 200);
        
        // Track language change
        this.trackEvent('popup_language_change', {
            event_category: 'BPF_Popup',
            language: lang,
            page: 'thank_you_popup'
        });
    }

    trackEvent(eventName, parameters = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }
    }
}

// Initialize popup when DOM is ready
let thankYouPopup;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        thankYouPopup = new ThankYouPopup();
    });
} else {
    thankYouPopup = new ThankYouPopup();
}