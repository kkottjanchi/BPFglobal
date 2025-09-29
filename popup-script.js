// Popup Control Functions
let currentPopupLang = 'en';

// Language Content for Popup
const popupContent = {
    en: {
        'popup-badge-text': 'Festival Successfully Completed!',
        'popup-main-title': 'Thank You! 🎊',
        'popup-subtitle': '2025 Bupyeong Pungmul Global Zone has brought Korean traditional culture to the world',
        'popup-stat1-title': 'Global Visitors',
        'popup-stat1-desc': 'From around the world',
        'popup-stat2-title': 'Countries',
        'popup-stat3-title': 'Engagements',
        'popup-stat3-desc': 'Cultural interactions',
        'popup-success-title': 'Mission Accomplished: Global K-Culture Bridge Built! 🌉',
        'popup-success-message': "Together, we've created meaningful connections across cultures through the beauty of Korean traditional Pungmul. This website continues as a bridge for ongoing cultural exchange and conversation.",
        'popup-website-status': '🌍 This platform remains open for continued cultural dialogue',
        'popup-btn-today': 'Hide for Today',
        'popup-btn-session': 'Hide for Session',
        'popup-btn-forever': 'Never Show Again',
        'popup-btn-continue': 'Explore Festival Programs'
    },
    ko: {
        'popup-badge-text': '축제 성공적으로 완료!',
        'popup-main-title': '감사합니다! 🎊',
        'popup-subtitle': '2025 부평 풍물 글로벌존이 한국 전통문화를 세계와 나누었습니다',
        'popup-stat1-title': '글로벌 방문자',
        'popup-stat1-desc': '전 세계에서',
        'popup-stat2-title': '참여 국가',
        'popup-stat3-title': '참여도',
        'popup-stat3-desc': '문화적 상호작용',
        'popup-success-title': '임무 완료: 글로벌 K-문화 다리 구축! 🌉',
        'popup-success-message': '한국 전통 풍물의 아름다움을 통해 문화 간 의미 있는 연결을 만들어냈습니다. 이 웹사이트는 지속적인 문화교류와 소통의 다리 역할을 계속할 것입니다.',
        'popup-website-status': '🌍 이 플랫폼은 지속적인 문화 대화를 위해 열려있습니다',
        'popup-btn-today': '오늘하루만 끄기',
        'popup-btn-session': '오늘은 그만 보기',
        'popup-btn-forever': '다신 안 보기',
        'popup-btn-continue': '축제 프로그램 둘러보기'
    }
};

function switchPopupLang(lang) {
    currentPopupLang = lang;
    
    // Update tab appearance
    document.querySelectorAll('.popup-lang-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update content with fade effect
    Object.keys(popupContent[lang]).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.style.opacity = '0.5';
            setTimeout(() => {
                element.innerHTML = popupContent[lang][key];
                element.style.opacity = '1';
            }, 150);
        }
    });
}

function showPopup() {
    const popup = document.getElementById('thankYouPopup');
    popup.classList.add('show');
    
    // Track popup view
    if (typeof gtag !== 'undefined') {
        gtag('event', 'popup_view', {
            event_category: 'BPF_Popup',
            event_label: 'thank_you_popup_shown'
        });
    }
}

function closePopup() {
    const popup = document.getElementById('thankYouPopup');
    popup.classList.remove('show');
}

function hidePopupToday() {
    const today = new Date().toDateString();
    localStorage.setItem('bpf_popup_hidden_today', today);
    closePopup();
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'popup_control', {
            event_category: 'BPF_Popup',
            event_label: 'hidden_today'
        });
    }
}

function hidePopupSession() {
    sessionStorage.setItem('bpf_popup_hidden_session', 'true');
    closePopup();
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'popup_control', {
            event_category: 'BPF_Popup',
            event_label: 'hidden_session'
        });
    }
}

function hidePopupForever() {
    localStorage.setItem('bpf_popup_hidden_forever', 'true');
    closePopup();
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'popup_control', {
            event_category: 'BPF_Popup',
            event_label: 'hidden_forever'
        });
    }
}

function continueToSite() {
    closePopup();
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'popup_control', {
            event_category: 'BPF_Popup',
            event_label: 'continue_to_site'
        });
    }
}

function shouldShowPopup() {
    // Check if user chose never show again
    if (localStorage.getItem('bpf_popup_hidden_forever') === 'true') {
        return false;
    }
    
    // Check if user chose hide for session
    if (sessionStorage.getItem('bpf_popup_hidden_session') === 'true') {
        return false;
    }
    
    // Check if user chose hide for today
    const hiddenToday = localStorage.getItem('bpf_popup_hidden_today');
    if (hiddenToday === new Date().toDateString()) {
        return false;
    }
    
    return true;
}

// Show popup on page load if conditions are met
window.addEventListener('load', function() {
    if (shouldShowPopup()) {
        // Delay popup to ensure page is fully loaded
        setTimeout(showPopup, 1500);
    }
});

// Close popup when clicking outside
document.addEventListener('click', function(event) {
    const popup = document.getElementById('thankYouPopup');
    if (popup && event.target === popup) {
        closePopup();
    }
});

// Close popup with escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePopup();
    }
});