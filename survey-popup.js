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
        
        // 설문 링크는 나중에 업데이트
        this.surveySubmitUrl = 'https://forms.gle/YOUR-FORM-ID'; // 사용자가 제공할 링크
        
        this.init();
    }

    detectLanguage() {
        const path = window.location.pathname;
        const lang = navigator.language || navigator.userLanguage;
        return path.includes('/ko.html') || path === '/' || lang.startsWith('ko');
    }

    init() {
        // 쿠키 확인 - 이미 참여했으면 표시 안함
        if (this.getCookie('bpf_survey_completed')) {
            return;
        }

        // 페이지 로드 후 2초 뒤 팝업 표시
        setTimeout(() => {
            this.showPopup();
        }, 2000);
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
        
        const content = this.isKorean ? this.getKoreanContent() : this.getEnglishContent();
        
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

                        <!-- 국적 선택 -->
                        <div class="bpf-form-group">
                            <label>${content.nationalityLabel}</label>
                            <select id="survey-nationality">
                                <option value="">${content.selectNationality}</option>
                                <option value="KR">🇰🇷 ${content.korea}</option>
                                <option value="US">🇺🇸 USA</option>
                                <option value="JP">🇯🇵 Japan</option>
                                <option value="CN">🇨🇳 China</option>
                                <option value="VN">🇻🇳 Vietnam</option>
                                <option value="TH">🇹🇭 Thailand</option>
                                <option value="PH">🇵🇭 Philippines</option>
                                <option value="OTHER">${content.other}</option>
                            </select>
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

    getKoreanContent() {
        return {
            title: '🎪 부평 풍물 글로벌존 오픈!',
            description: '축제 시작을 기념해 간단한 설문에 참여해주세요! (30초 소요)',
            nameLabel: '이름',
            namePlaceholder: '이름을 입력해주세요',
            nationalityLabel: '국적',
            selectNationality: '국적을 선택해주세요',
            korea: '대한민국',
            other: '기타',
            programLabel: '관심있는 프로그램 (다중선택 가능)',
            kContent: 'K-콘텐츠 체험',
            kDeco: 'K-데코 만들기',
            manmanse: '만만세 체험',
            pungmul: '풍물 체험',
            tour: '부평 투어',
            expectationLabel: '축제에 대한 기대나 궁금한 점',
            expectationPlaceholder: '자유롭게 작성해주세요...',
            laterButton: '나중에',
            submitButton: '참여하기'
        };
    }

    getEnglishContent() {
        return {
            title: '🎪 Bupyeong Pungmul Global Zone Open!',
            description: 'Join our quick survey to celebrate the festival launch! (Takes 30 seconds)',
            nameLabel: 'Name',
            namePlaceholder: 'Enter your name',
            nationalityLabel: 'Nationality',
            selectNationality: 'Select your nationality',
            korea: 'South Korea',
            other: 'Other',
            programLabel: 'Programs of Interest (Multiple selection allowed)',
            kContent: 'K-Content Experience',
            kDeco: 'K-Deco Making',
            manmanse: 'Manmanse Experience',
            pungmul: 'Pungmul Experience',
            tour: 'Bupyeong Tour',
            expectationLabel: 'Expectations or Questions about the Festival',
            expectationPlaceholder: 'Share your thoughts...',
            laterButton: 'Later',
            submitButton: 'Submit'
        };
    }

    handleSubmit() {
        // 폼 데이터 수집
        const name = document.getElementById('survey-name').value.trim();
        const nationality = document.getElementById('survey-nationality').value;
        const expectations = document.getElementById('survey-expectations').value.trim();
        
        const selectedPrograms = [];
        document.querySelectorAll('.bpf-checkbox input:checked').forEach(cb => {
            selectedPrograms.push(cb.value);
        });

        // 유효성 검사
        if (!name) {
            alert(this.isKorean ? '이름을 입력해주세요!' : 'Please enter your name!');
            return;
        }

        if (!nationality) {
            alert(this.isKorean ? '국적을 선택해주세요!' : 'Please select your nationality!');
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

        // 외부 설문 링크로 리디렉션 (사용자가 제공할 링크)
        this.redirectToExternalSurvey();
        
        // 팝업 닫기 및 완료 쿠키 설정
        this.closePopup();
        this.setCookie('bpf_survey_completed', 'true', 30); // 30일간 표시 안함
    }

    redirectToExternalSurvey() {
        // 사용자가 제공할 설문 링크로 이동
        // 데이터를 URL 파라미터로 전달 (선택사항)
        const params = new URLSearchParams({
            name: this.surveyData.name,
            nationality: this.surveyData.nationality,
            programs: this.surveyData.programs.join(','),
            lang: this.surveyData.language
        });
        
        // 새 창에서 설문 링크 열기
        window.open(`${this.surveySubmitUrl}?${params.toString()}`, '_blank');
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

    // 설문 링크 업데이트 메서드 (사용자가 호출할 수 있음)
    updateSurveyUrl(newUrl) {
        this.surveySubmitUrl = newUrl;
        console.log('Survey URL updated:', newUrl);
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