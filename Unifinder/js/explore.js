// ✅ 전역 선언
const urlCategoryMap = {
  contest: '대회/공모전',
  activity: '대외활동',
  scholarship: '장학금'
};

const dataCategoryMap = {
  "030110001": "대회/공모전",
  "030110002": "대외활동",
  "030110003": "장학금"
};

const categoryKeyMap = {
  contest: "030110001",
  activity: "030110002",
  scholarship: "030110003"
};

// ✅ 결과 렌더링 함수
function renderResults(dataMap, category, categoryMap) {
  const container = document.getElementById('job-results');
  container.innerHTML = '';

  Object.values(dataMap).forEach(arr => {
    arr.forEach(item => {
      const div = document.createElement('div');
      div.className = 'job-thumb d-flex mb-4';
      div.innerHTML = `
        <div class="job-body d-flex flex-wrap flex-auto justify-content-between align-items-start ms-4 w-100">
          <div class="mb-3 flex-grow-1">
            <h4 class="job-title mb-lg-0">
              <a href="details.html?source=${encodeURIComponent(item.source)}" class="job-title-link"> [${categoryMap[category] || '전체'}] ${item.title}</a>
            </h4>
            <p class="job-location mb-1">
              <i class="custom-icon bi-geo-alt me-1"></i> ${item.host}
            </p>
            <div class="d-flex flex-wrap align-items-center gap-3">
              <p class="job-date mb-0">
                <i class="custom-icon bi-clock me-1"></i> ${item.submission_period}
              </p>
              <p class="job-price mb-0">
                <i class="custom-icon bi-cash me-1"></i> ${item.target}
              </p>
            </div>
          </div>
          <div class="d-flex align-items-center justify-content-end gap-2">
            <div class="d-flex flex-wrap justify-content-end me-5">
              ${item.category?.split(',').map(tag => `
                <p class="mb-0 ms-2"><a href="${item.source}" class="badge">${tag.trim()}</a></p>
              `).join('')}
            </div>
            <div class="job-section-btn-wrap">
              <a href="details.html?source=${encodeURIComponent(item.source)}&category=${category}" class="custom-btn btn">자세히 보기</a>
            </div>
          </div>
        </div>
      `;
      container.appendChild(div);
    });
  });
}

// ✅ 페이지 로드시 실행
document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category'); // ex: 'contest'

  const selectedKey = categoryKeyMap[category];

  const uiSettings = {
    contest: {
      heading: "원하는 대회·공모전을 찾아보세요",
      placeholder: "찾고 싶은 대회/공모전 이름",
      defaultText: "대회/공모전 분야 선택",
      options: [
        '문학·문예', '네이밍·슬로건', '학문·과학·IT', '스포츠',
        '미술·디자인·웹툰', '음악·콩쿠르·댄스', '사진·영상·영화제',
        '아이디어·건축·창업', '요리·뷰티·배우·오디션', '그외', '전체 대회/공모전 현황'
      ],
      keywords: ['에세이', '창업', '영상']
    },
    activity: {
      heading: "참여하고 싶은 대외활동을 찾아보세요",
      placeholder: "찾고 싶은 대외활동 이름",
      defaultText: "대외활동 분야 선택",
      options: ['서포터즈·기사단', '체험·탐방·봉사·동아리', '서평단·참여단·평가단·자문단', '기획·홍보·마케팅', '교육·강연·멘토링·세미나', '전시·박람·행사·축제','그외','전체 대외활동현황'],
      keywords: ['서포터즈', '홍보', '기획']
    },
    scholarship: {
      heading: "받을 수 있는 장학금을 찾아보세요",
      placeholder: "찾고 싶은 장학금 이름",
      defaultText: "장학금 분야 선택",
      options: ['소득연계형 국가장학금', '우수인재 장학금', '취업연계 및 근로 장학금', '기부 및 복권기금 장학금', '전문기술 및 특성화 장학금'],
      keywords: ['성적우수', '저소득층', '근로']
    }
  };

  // ✅ UI 텍스트 반영
  document.getElementById('category-title').innerText =
    '카테고리: ' + (urlCategoryMap[category] || '전체');

  document.getElementById('breadcrumb-category').innerText =
    urlCategoryMap[category] || '전체 보기';

  const settings = uiSettings[category] || uiSettings.contest;

  document.getElementById('search-heading').innerText = settings.heading;
  document.getElementById('job-title').placeholder = settings.placeholder;

  const selectEl = document.getElementById('category-options');
  selectEl.innerHTML = `<option selected>${settings.defaultText}</option>`;
  settings.options.forEach(opt => {
    const optionEl = document.createElement('option');
    optionEl.text = opt;
    selectEl.appendChild(optionEl);
  });

  const keywordsEl = document.getElementById('popular-keywords');
  keywordsEl.innerHTML = '';
  settings.keywords.forEach(word => {
    const a = document.createElement('a');
    a.href = 'job-listings.html';
    a.className = 'badge';
    a.innerText = word;
    keywordsEl.appendChild(a);
  });

  // ✅ 현재는 mockData로 테스트
  const mockData = {
    "030110001": [
      {
        title: "제40회 전국향토문화 공모전",
        source: "https://www.contestkorea.com/job-details.html",
        host: "문화체육관광부 · 한국문화원연합회",
        category: "문학, 문예",
        target: "누구나 · 초등학생 · 중학생",
        submission_period: "2025.05.22 ~ 2025.07.13"
      },
      {
        title: "환경 그림 공모전",
        source: "https://www.ecocontest.com/job-details.html",
        host: "환경부",
        category: "환경, 그림, 예술",
        target: "초등학생",
        submission_period: "2025.06.01 ~ 2025.07.15"
      }
    ],
    "030110002": [
      {
        title: "청년 창업 아이디어 대회",
        source: "https://startuphub.kr/job-details.html",
        host: "중소벤처기업부",
        category: "창업, 아이디어, 발표",
        target: "대학생 · 일반인",
        submission_period: "2025.06.01 ~ 2025.06.30"
      },
      {
        title: "청소년 정책 서포터즈",
        source: "https://www.youth.go.kr/job-details.html",
        host: "여성가족부",
        category: "정책, 대외활동",
        target: "중고등학생 · 대학생",
        submission_period: "2025.05.10 ~ 2025.06.10"
      }
    ],
    "030110003": [
      {
        title: "해외봉사 프로그램 모집",
        source: "https://volunteer.go.kr/job-details.html",
        host: "KOICA",
        category: "봉사, 대외활동",
        target: "대학생 · 일반인",
        submission_period: "2025.05.15 ~ 2025.06.15"
      },
      {
        title: "국가우수장학금 신청 안내",
        source: "https://www.kosaf.go.kr/job-details.html",
        host: "한국장학재단",
        category: "장학금, 우수학생",
        target: "대학생",
        submission_period: "2025.04.01 ~ 2025.04.30"
      }
    ]
  };

  const selectedData = mockData[selectedKey] || [];
  renderResults({ [selectedKey]: selectedData }, selectedKey, dataCategoryMap);
});
