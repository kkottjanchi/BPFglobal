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
        
        // 자체 수집 시스템 - 외부 링크 불필요!
        this.storageKey = 'bpf_survey_responses';
        
        this.init();
    }

    detectLanguage() {
        const path = window.location.pathname;
        const lang = navigator.language || navigator.userLanguage;
        return path.includes('/ko.html') || path === '/' || lang.startsWith('ko');
    }

    init() {
        // 관리자가 팝업을 비활성화했는지 확인
        if (localStorage.getItem('bpf_popup_disabled') === 'true') {
            return;
        }

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

        // 자체 수집 시스템에 데이터 저장
        this.saveSurveyResponse();
        
        // 성공 메시지 표시
        this.showSuccessMessage();
        
        // 팝업 닫기 및 완료 쿠키 설정
        setTimeout(() => {
            this.closePopup();
        }, 2000);
        this.setCookie('bpf_survey_completed', 'true', 30); // 30일간 표시 안함
    }

    saveSurveyResponse() {
        // 기존 응답들 불러오기
        const existingResponses = this.getSurveyResponses();
        
        // 새 응답 추가
        const newResponse = {
            id: 'resp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            ...this.surveyData,
            timestamp: new Date().toISOString(),
            submittedAt: new Date().toLocaleString('ko-KR', {
                timeZone: 'Asia/Seoul',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }),
            userAgent: navigator.userAgent,
            pageUrl: window.location.href
        };
        
        existingResponses.push(newResponse);
        
        // LocalStorage에 저장
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(existingResponses));
            console.log('✅ 설문 응답 저장 완료:', newResponse);
        } catch (error) {
            console.error('❌ 설문 응답 저장 실패:', error);
            // 백업으로 sessionStorage 사용
            sessionStorage.setItem(this.storageKey, JSON.stringify(existingResponses));
        }
    }

    getSurveyResponses() {
        try {
            const data = localStorage.getItem(this.storageKey) || sessionStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('응답 데이터 로드 실패:', error);
            return [];
        }
    }

    showSuccessMessage() {
        const popup = document.querySelector('.bpf-survey-popup');
        if (popup) {
            const successMessage = this.isKorean ? 
                '🎉 설문 참여 완료!<br>소중한 의견 감사합니다!' : 
                '🎉 Survey Completed!<br>Thank you for your feedback!';
            
            popup.innerHTML = `
                <div class="bpf-survey-header">
                    <h3>${this.isKorean ? '설문 완료' : 'Survey Complete'}</h3>
                </div>
                <div class="bpf-survey-body" style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 18px; color: #28a745; margin-bottom: 20px;">
                        ${successMessage}
                    </div>
                    <div style="font-size: 14px; color: #666;">
                        ${this.isKorean ? '응답이 안전하게 저장되었습니다.' : 'Your response has been saved securely.'}
                    </div>
                </div>
            `;
        }
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

    // 관리자용: 수집된 응답 조회 메서드
    getAllResponses() {
        return this.getSurveyResponses();
    }

    // 관리자용: CSV 다운로드 메서드
    downloadResponsesAsCSV() {
        const responses = this.getSurveyResponses();
        if (responses.length === 0) {
            alert(this.isKorean ? '저장된 응답이 없습니다.' : 'No responses found.');
            return;
        }

        const headers = [
            'ID', '이름/Name', '국적/Nationality', '관심프로그램/Programs', 
            '기대사항/Expectations', '언어/Language', '제출시간/Submitted', 
            '페이지URL/Page URL'
        ];

        const csvContent = [
            headers.join(','),
            ...responses.map(r => [
                r.id,
                `"${r.name}"`,
                r.nationality,
                `"${r.programs.join(';')}"`,
                `"${(r.expectations || '').replace(/"/g, '""')}"`,
                r.language || 'unknown',
                r.submittedAt,
                `"${r.pageUrl || ''}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `BPF_Survey_Responses_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log(`📥 CSV 다운로드 완료: ${responses.length}개 응답`);
    }

    // 관리자용: 응답 통계 조회
    getResponseStats() {
        const responses = this.getSurveyResponses();
        const stats = {
            total: responses.length,
            nationalities: {},
            programs: {},
            languages: { ko: 0, en: 0 },
            lastSubmitted: responses.length > 0 ? responses[responses.length - 1].submittedAt : null
        };

        responses.forEach(r => {
            // 국적 통계
            stats.nationalities[r.nationality] = (stats.nationalities[r.nationality] || 0) + 1;
            
            // 프로그램 통계
            r.programs.forEach(prog => {
                stats.programs[prog] = (stats.programs[prog] || 0) + 1;
            });
            
            // 언어 통계
            if (r.language === 'ko') stats.languages.ko++;
            else stats.languages.en++;
        });

        return stats;
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