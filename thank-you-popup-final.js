// Thank You Popup Manager - 첫 방문시에만 표시되는 감사 팝업
class ThankYouPopup {
    constructor() {
        this.storageKey = 'bpf_thankyou_displayed';
        this.currentLang = 'en'; // 기본 영어
        
        this.content = {
            ko: {
                title: '감사합니다! 🎊',
                subtitle: '2025 부평 풍물 글로벌존이 성공적으로 완료되었습니다',
                message: '한국 전통 풍물의 아름다움을 통해 전 세계 1.3K 방문자들과 5개국이 참여한 의미 있는 문화 교류를 만들어냈습니다.',
                todayBtn: '오늘하루만 끄기',
                neverBtn: '다신 안 보기', 
                closeBtn: '닫기'
            },
            en: {
                title: 'Thank You! 🎊',
                subtitle: '2025 Bupyeong Pungmul Global Zone Successfully Completed',
                message: 'We created meaningful cultural exchanges with 1.3K global visitors from 5+ countries through the beauty of Korean traditional Pungmul.',
                todayBtn: "Don't show today",
                neverBtn: "Don't show again",
                closeBtn: 'Close'
            }
        };
        
        this.init();
    }
    
    init() {
        // 먼저 CSS 스타일 추가
        this.addStyles();
        
        if (this.shouldShow()) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.show());
            } else {
                this.show();
            }
        }
    }
    
    addStyles() {
        if (document.getElementById('thankYouPopupStyles')) return; // 이미 추가됨
        
        const style = document.createElement('style');
        style.id = 'thankYouPopupStyles';
        style.textContent = `
        #thankYouPopup {
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
            transition: opacity 0.3s ease;
        }
        
        #thankYouPopup.show {
            opacity: 1;
        }
        
        .popup-container {
            background: linear-gradient(135deg, 
                rgba(99, 102, 241, 0.95) 0%, 
                rgba(168, 85, 247, 0.95) 35%, 
                rgba(236, 72, 153, 0.95) 70%, 
                rgba(251, 146, 60, 0.95) 100%);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            color: white;
            text-align: center;
            position: relative;
            transform: scale(0.9) translateY(20px);
            transition: all 0.3s ease;
        }
        
        #thankYouPopup.show .popup-container {
            transform: scale(1) translateY(0);
        }
        
        .popup-close {
            position: absolute;
            top: 10px;
            right: 15px;
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .popup-close:hover {
            background: rgba(255,255,255,0.3);
        }
        
        .popup-lang-switch {
            margin-bottom: 20px;
        }
        
        .popup-lang-switch button {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 8px 16px;
            margin: 0 5px;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .popup-lang-switch button.active,
        .popup-lang-switch button:hover {
            background: rgba(255,255,255,0.3);
        }
        
        .popup-badge {
            background: linear-gradient(45deg, #10b981, #059669);
            padding: 8px 20px;
            border-radius: 20px;
            display: inline-block;
            margin-bottom: 15px;
            font-weight: bold;
        }
        
        .popup-title {
            font-size: 2.5rem;
            font-weight: bold;
            margin: 15px 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .popup-subtitle {
            font-size: 1.1rem;
            margin-bottom: 20px;
            opacity: 0.9;
        }
        
        .popup-stats {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #FFE66D;
        }
        
        .stat-label {
            font-size: 0.9rem;
            opacity: 0.8;
        }
        
        .popup-message {
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            line-height: 1.5;
        }
        
        .popup-controls {
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .popup-controls button {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 10px 15px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .popup-controls button:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }
        
        .btn-today:hover { background: rgba(59, 130, 246, 0.4) !important; }
        .btn-never:hover { background: rgba(239, 68, 68, 0.4) !important; }
        .btn-close:hover { background: rgba(156, 163, 175, 0.4) !important; }
        
        @media (max-width: 768px) {
            .popup-container {
                padding: 20px;
            }
            
            .popup-title {
                font-size: 2rem;
            }
            
            .popup-stats {
                flex-direction: column;
                gap: 10px;
            }
            
            .popup-controls {
                flex-direction: column;
            }
            
            .popup-controls button {
                width: 100%;
            }
        }`;
        
        document.head.appendChild(style);
    }
    
    shouldShow() {
        const pref = localStorage.getItem(this.storageKey);
        
        if (!pref) return true; // 첫 방문
        
        const data = JSON.parse(pref);
        const today = new Date().toDateString();
        
        if (data.type === 'never') return false;
        if (data.type === 'today' && data.date === today) return false;
        
        return true;
    }
    
    show() {
        this.createPopup();
        this.trackEvent('popup_shown');
    }
    
    createPopup() {
        const popup = document.createElement('div');
        popup.id = 'thankYouPopup';
        popup.innerHTML = this.getHTML();
        document.body.appendChild(popup);
        
        // 애니메이션을 위한 딜레이
        setTimeout(() => popup.classList.add('show'), 50);
        
        this.setupEvents();
    }
    
    getHTML() {
        const text = this.content[this.currentLang];
        return `
        <div class="popup-overlay">
            <div class="popup-container">
                <button class="popup-close" onclick="thankYouPopup.close()">&times;</button>
                
                <div class="popup-lang-switch">
                    <button onclick="thankYouPopup.switchLang('en')" class="${this.currentLang === 'en' ? 'active' : ''}">🇺🇸 English</button>
                    <button onclick="thankYouPopup.switchLang('ko')" class="${this.currentLang === 'ko' ? 'active' : ''}">🇰🇷 한국어</button>
                </div>
                
                <div class="popup-content">
                    <div class="popup-badge">✅ Festival Successfully Completed!</div>
                    <h1 class="popup-title">${text.title}</h1>
                    <p class="popup-subtitle">${text.subtitle}</p>
                    
                    <div class="popup-stats">
                        <div class="stat-item">
                            <div class="stat-number">1.3K</div>
                            <div class="stat-label">Global Visitors</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">5+</div>
                            <div class="stat-label">Countries</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">8.7K</div>
                            <div class="stat-label">Engagements</div>
                        </div>
                    </div>
                    
                    <div class="popup-message">
                        🏆 <strong>Mission Accomplished!</strong><br>
                        ${text.message}
                    </div>
                    
                    <div class="popup-controls">
                        <button onclick="thankYouPopup.setPref('today')" class="btn-today">${text.todayBtn}</button>
                        <button onclick="thankYouPopup.setPref('never')" class="btn-never">${text.neverBtn}</button>
                        <button onclick="thankYouPopup.close()" class="btn-close">${text.closeBtn}</button>
                    </div>
                </div>
            </div>
        </div>`;
    }
    
    setupEvents() {
        // 오버레이 클릭시 닫기
        document.querySelector('#thankYouPopup .popup-overlay').onclick = (e) => {
            if (e.target === e.currentTarget) this.close();
        };
        
        // ESC 키로 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('thankYouPopup')) {
                this.close();
            }
        });
    }
    
    switchLang(lang) {
        this.currentLang = lang;
        const popup = document.getElementById('thankYouPopup');
        if (popup) {
            popup.innerHTML = this.getHTML();
            setTimeout(() => popup.classList.add('show'), 50);
            this.setupEvents();
        }
        this.trackEvent('language_changed', { language: lang });
    }
    
    setPref(type) {
        const data = {
            type: type,
            date: new Date().toDateString(),
            timestamp: Date.now()
        };
        localStorage.setItem(this.storageKey, JSON.stringify(data));
        this.trackEvent('preference_set', { type });
        this.close();
    }
    
    close() {
        const popup = document.getElementById('thankYouPopup');
        if (popup) {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 300);
        }
        this.trackEvent('popup_closed');
    }
    
    trackEvent(action, data = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: 'BPF_ThankYou_Popup',
                ...data
            });
        }
    }
}

// 전역 변수로 초기화 (페이지 로드시 자동 실행)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.thankYouPopup = new ThankYouPopup();
    });
} else {
    window.thankYouPopup = new ThankYouPopup();
}