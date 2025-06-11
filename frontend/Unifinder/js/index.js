document.addEventListener("DOMContentLoaded", () => {
  const predictedPrograms = [
    {
      title: "SSAFY 11기 모집",
      host: "삼성전자 주관, 고용노동부 후원",
      period: "2025.05.06 ~ 2025.06.04 (예상)",
      target: "대학 졸업 예정자 및 미취업자",
      field: "SW 개발·백엔드",
      type: "코딩 집중 교육",
      sourceUrl: "https://www.ssafy.com/ksp/jsp/swp/swpMain.jsp"
    },
    {
      title: "K-Digital Training: AI 빅데이터 과정",
      host: "고용노동부 / 멀티캠퍼스",
      period: "2025.06.01 ~ 2025.08.30 (예정)",
      target: "IT 분야 취업 희망자 (청년 우대)",
      field: "AI, 빅데이터 분석",
      type: "국비 교육",
      sourceUrl: "https://www.k-digitaltraining.or.kr/"
    },
    {
      title: "청년 마이크로 프로젝트 2025",
      host: "서울청년센터 & 지역 창업기관",
      period: "2025.07 예정 (~ 지역별 상이)",
      target: "만 19~34세 청년 (서울 거주자 우대)",
      field: "기획, UX리서치, 영상제작 등",
      type: "실무 프로젝트",
      sourceUrl: "https://youth.seoul.go.kr"
    },
    {
      title: "우아한테크코스 8기 모집",
      host: "우아한형제들",
      period: "2025.08~09 모집 예상",
      target: "개발자 취업 준비생",
      field: "웹 개발 (Java, Spring 등)",
      type: "교육 + 실습 프로젝트",
      sourceUrl: "https://woowacourse.github.io"
    }
  ];

  const container = document.getElementById("predicted-list");
  
  predictedPrograms.forEach(item => {
    const div = document.createElement('div');
    div.className = 'job-thumb d-flex mb-4';
    div.innerHTML = `
      <div class="job-body d-flex flex-wrap flex-auto justify-content-between align-items-start ms-4 w-100">
        <div class="mb-3 flex-grow-1">
          <h4 class="job-title mb-lg-0">
            <a href="details.html?sourceUrl=${encodeURIComponent(item.sourceUrl)}" class="job-title-link"> [${item.type}] ${item.title}</a>
          </h4>
          <p class="job-location mb-1">
            <i class="custom-icon bi-geo-alt me-1"></i> ${item.host}
          </p>
          <div class="d-flex flex-wrap align-items-center gap-3">
            <p class="job-date mb-0">
              <i class="custom-icon bi-clock me-1"></i> ${item.period}
            </p>
            <p class="job-price mb-0">
              <i class="custom-icon bi-person me-1"></i> ${item.target}
            </p>
          </div>
        </div>
        <div class="d-flex align-items-center justify-content-end gap-2">
          <div class="d-flex flex-wrap justify-content-end me-5">
            ${[item.field, item.type].map(tag => `
              <p class="mb-0 ms-2"><a href="#" class="badge">${tag.trim()}</a></p>
            `).join('')}
          </div>
          <div class="job-section-btn-wrap">
            <a href="${item.sourceUrl}" target="_blank" rel="noopener noreferrer" class="custom-btn btn">자세히 보기</a>
          </div>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
});