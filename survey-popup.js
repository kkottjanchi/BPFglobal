// BPF Global Zone Festival Survey Popup
class SurveyPopup {
    constructor() {
        this.isKorean = this.detectLanguage();
        this.surveyData = {
            name: '',
            nationality: '',
            programs: [],
            expectations: ''
        };
        
        // Google Forms 링크 설정 - 올바른 링크로 수정
        this.surveySubmitUrl = 'https://forms.gle/NfYJ9UhvwSWypowt5'; // 사용자 제공 링크
        
        this.init();
    }

    detectLanguage() {
        const path = window.location.pathname;
        const lang = navigator.language || navigator.userLanguage;
        return path.includes('/ko.html') || path === '/' || lang.startsWith('ko');
    }

    init() {
        // 저장된 URL 로드
        this.loadSavedUrl();

        // 강제로 팝업 표시 (디버깅용)
        console.log('🚨 팝업 시스템 초기화 중...');
        
        // 페이지 로드 후 1초 뒤 무조건 팝업 표시
        setTimeout(() => {
            console.log('🚨 팝업 강제 표시!');
            this.showPopup();
        }, 1000);
    }

    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    showPopup() {
        const popup = this.createPopup();
        document.body.appendChild(popup);
        
        // 애니메이션 효과
        setTimeout(() => {
            popup.classList.add('show');
        }, 100);

        // GA4 이벤트 추적
        if (typeof gtag !== 'undefined') {
            gtag('event', 'survey_popup_shown', {
                event_category: 'BPF_Survey',
                event_label: this.isKorean ? 'korean' : 'english'
            });
        }
    }

    createPopup() {
        const overlay = document.createElement('div');
        overlay.className = 'bpf-survey-overlay';
        
        // 항상 이중언어 콘텐츠 사용
        const content = this.getBilingualContent();
        
        overlay.innerHTML = `
            <div class="bpf-survey-popup">
                <div class="bpf-survey-header">
                    <h3>${content.title}</h3>
                    <button class="bpf-survey-close" onclick="surveyPopup.closePopup()">&times;</button>
                </div>
                <div class="bpf-survey-body">
                    <p class="bpf-survey-desc">${content.description}</p>
                    <form class="bpf-survey-form">
                        <!-- 이름 입력 -->
                        <div class="bpf-form-group">
                            <label>${content.nameLabel}</label>
                            <input type="text" id="survey-name" placeholder="${content.namePlaceholder}" maxlength="50">
                        </div>

                        <!-- 국적 입력 -->
                        <div class="bpf-form-group">
                            <label>${content.nationalityLabel}</label>
                            <input type="text" id="survey-nationality" placeholder="${content.nationalityPlaceholder}" maxlength="30">
                        </div>

                        <!-- 프로그램 선택 -->
                        <div class="bpf-form-group">
                            <label>${content.programLabel}</label>
                            <div class="bpf-checkbox-group">
                                <label class="bpf-checkbox">
                                    <input type="checkbox" value="k-content"> 
                                    <span>🎭 ${content.kContent}</span>
                                </label>
                                <label class="bpf-checkbox">
                                    <input type="checkbox" value="k-deco"> 
                                    <span>🎨 ${content.kDeco}</span>
                                </label>
                                <label class="bpf-checkbox">
                                    <input type="checkbox" value="manmanse"> 
                                    <span>🎪 ${content.manmanse}</span>
                                </label>
                                <label class="bpf-checkbox">
                                    <input type="checkbox" value="pungmul"> 
                                    <span>🥁 ${content.pungmul}</span>
                                </label>
                                <label class="bpf-checkbox">
                                    <input type="checkbox" value="tour"> 
                                    <span>🚌 ${content.tour}</span>
                                </label>
                            </div>
                        </div>

                        <!-- 기대평 -->
                        <div class="bpf-form-group">
                            <label>${content.expectationLabel}</label>
                            <textarea id="survey-expectations" placeholder="${content.expectationPlaceholder}" maxlength="200"></textarea>
                        </div>

                        <!-- 버튼들 -->
                        <div class="bpf-form-buttons">
                            <button type="button" class="bpf-btn-secondary" onclick="surveyPopup.closePopup()">${content.laterButton}</button>
                            <button type="submit" class="bpf-btn-primary">${content.submitButton}</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // 폼 제출 이벤트
        const form = overlay.querySelector('.bpf-survey-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        return overlay;
    }

    getBilingualContent() {
        return {
            title: '🎪 부평 풍물 글로벌존 오픈!<br>🎪 Bupyeong Pungmul Global Zone Open!',
            description: '축제 시작을 기념해 간단한 설문에 참여해주세요! (30초 소요)<br><span class="text-sm text-blue-600">Join our quick survey to celebrate the festival launch! (Takes 30 seconds)</span>',
            nameLabel: '이름 / Name',
            namePlaceholder: '이름을 입력해주세요 / Enter your name',
            nationalityLabel: '국적 / Nationality',
            nationalityPlaceholder: '예: 대한민국, 미국, 일본... / e.g. Korea, USA, Japan...',
            programLabel: '관심있는 프로그램 (다중선택 가능)<br><span class="text-sm text-blue-600">Programs of Interest (Multiple selection allowed)</span>',
            kContent: 'K-콘텐츠 체험 / K-Content Experience',
            kDeco: 'K-데코 만들기 / K-Deco Making',
            manmanse: '만만세 체험 / Manmanse Experience',
            pungmul: '풍물 체험 / Pungmul Experience',
            tour: '부평 투어 / Bupyeong Tour',
            expectationLabel: '축제에 대한 기대나 궁금한 점<br><span class="text-sm text-blue-600">Expectations or Questions about the Festival</span>',
            expectationPlaceholder: '자유롭게 작성해주세요... / Share your thoughts...',
            laterButton: '나중에 / Later',
            submitButton: '참여하기 / Submit'
        };
    }

    // 기존 한국어/영어 개별 함수들은 호환성을 위해 유지
    getKoreanContent() {
        return this.getBilingualContent();
    }

    getEnglishContent() {
        return this.getBilingualContent();
    }

    handleSubmit() {
        // 폼 데이터 수집
        const name = document.getElementById('survey-name').value.trim();
        const nationality = document.getElementById('survey-nationality').value.trim();
        const expectations = document.getElementById('survey-expectations').value.trim();
        
        const selectedPrograms = [];
        document.querySelectorAll('.bpf-checkbox input:checked').forEach(cb => {
            selectedPrograms.push(cb.value);
        });

        // 유효성 검사 - 이중언어
        if (!name) {
            alert('이름을 입력해주세요!\nPlease enter your name!');
            return;
        }

        if (!nationality) {
            alert('국적을 입력해주세요!\nPlease enter your nationality!');
            return;
        }

        // 데이터 저장
        this.surveyData = {
            name: name,
            nationality: nationality,
            programs: selectedPrograms,
            expectations: expectations,
            timestamp: new Date().toISOString(),
            language: this.isKorean ? 'ko' : 'en'
        };

        // GA4 이벤트 추적
        if (typeof gtag !== 'undefined') {
            gtag('event', 'survey_completed', {
                event_category: 'BPF_Survey',
                event_label: nationality,
                value: selectedPrograms.length
            });
        }

        // Google Forms 링크로 리디렉션
        this.redirectToGoogleForms();
        
        // 팝업 닫기 및 완료 쿠키 설정
        this.closePopup();
        this.setCookie('bpf_survey_completed', 'true', 30); // 30일간 표시 안함
    }

    redirectToGoogleForms() {
        // 단순히 Google Forms 링크만 새 창에서 열기
        const formUrl = this.surveySubmitUrl;
        window.open(formUrl, '_blank', 'width=800,height=800,scrollbars=yes,resizable=yes');
        
        console.log('✅ Google Forms로 리디렉션:', formUrl);
        
        // 성공 메시지 표시
        alert('🎉 설문 페이지가 새 창에서 열렸습니다!\n🎉 Survey page opened in new window!\n\n새 창에서 설문을 작성해주세요.');
    }

    // 설문 링크 업데이트 메서드
    updateSurveyUrl(newUrl) {
        this.surveySubmitUrl = newUrl;
        localStorage.setItem('bpf_survey_url', newUrl);
        console.log('✅ 설문 링크 업데이트:', newUrl);
    }

    closePopup() {
        const overlay = document.querySelector('.bpf-survey-overlay');
        if (overlay) {
            overlay.classList.add('hide');
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 300);
        }
    }

    // 설정된 URL로 업데이트
    loadSavedUrl() {
        const savedUrl = localStorage.getItem('bpf_survey_url');
        if (savedUrl) {
            this.surveySubmitUrl = savedUrl;
        }
    }
}

// CSS 스타일 자동 추가
const style = document.createElement('style');
style.textContent = `
.bpf-survey-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.bpf-survey-overlay.show {
    opacity: 1;
}

.bpf-survey-overlay.hide {
    opacity: 0;
}

.bpf-survey-popup {
    background: white;
    border-radius: 16px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    transform: translateY(-20px);
    transition: transform 0.3s ease;
}

.bpf-survey-overlay.show .bpf-survey-popup {
    transform: translateY(0);
}

.bpf-survey-header {
    padding: 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 16px 16px 0 0;
}

.bpf-survey-header h3 {
    margin: 0;
    font-size: 1.2em;
    font-weight: bold;
}

.bpf-survey-close {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.bpf-survey-close:hover {
    background: rgba(255, 255, 255, 0.2);
}

.bpf-survey-body {
    padding: 20px;
}

.bpf-survey-desc {
    margin: 0 0 20px 0;
    color: #666;
    font-size: 14px;
    text-align: center;
}

.bpf-form-group {
    margin-bottom: 16px;
}

.bpf-form-group label {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
    color: #333;
    font-size: 14px;
}

.bpf-form-group input,
.bpf-form-group select,
.bpf-form-group textarea {
    width: 100%;
    padding: 10px 12px;
    border: 2px solid #e5e5e5;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.2s;
    box-sizing: border-box;
}

.bpf-form-group input:focus,
.bpf-form-group select:focus,
.bpf-form-group textarea:focus {
    outline: none;
    border-color: #667eea;
}

.bpf-form-group textarea {
    resize: vertical;
    min-height: 60px;
}

.bpf-checkbox-group {
    display: grid;
    gap: 8px;
}

.bpf-checkbox {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    transition: background-color 0.2s;
}

.bpf-checkbox:hover {
    background: #f8f9fa;
}

.bpf-checkbox input[type="checkbox"] {
    width: auto;
    margin-right: 8px;
}

.bpf-form-buttons {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

.bpf-btn-primary,
.bpf-btn-secondary {
    flex: 1;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.bpf-btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.bpf-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.bpf-btn-secondary {
    background: #f8f9fa;
    color: #6c757d;
    border: 1px solid #dee2e6;
}

.bpf-btn-secondary:hover {
    background: #e9ecef;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
    .bpf-survey-popup {
        width: 95%;
        margin: 10px;
    }
    
    .bpf-survey-header {
        padding: 15px;
    }
    
    .bpf-survey-body {
        padding: 15px;
    }
    
    .bpf-form-buttons {
        flex-direction: column;
    }
}
`;
document.head.appendChild(style);

// 전역 변수로 인스턴스 생성
let surveyPopup;

// DOM이 로드되면 팝업 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        surveyPopup = new SurveyPopup();
    });
} else {
    surveyPopup = new SurveyPopup();
}