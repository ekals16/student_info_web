// 전역 선언
const urlCategoryMap = {
  contest: '대회/공모전',
  activity: '대외활동',
  scholarship: '장학금'
};

const dataCategoryMap = {
  "030110001": "대회/공모전",
  "030110002": "대외활동",
  "030110003": "장학금",
  "ALL": "전체"
};

const categoryKeyMap = {
  contest: "030110001",
  activity: "030110002",
  scholarship: "030110003",
  all: "ALL" //추가
};

// 페이지 단위 렌더링
function renderResults(dataMap, category, categoryMap, currentPage = 1, itemsPerPage = 2) {
  const container = document.getElementById('job-results');
  container.innerHTML = '';

  // all인 경우 데이터 전부 합치기
  let fullList = [];
  if (category === "ALL") {
    Object.values(dataMap).forEach(arr => {
      fullList = fullList.concat(arr);
    });
  } else {
    fullList = dataMap[category] || [];
  }

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageList = fullList.slice(start, end);

  pageList.forEach(item => {
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
}

function renderPagination(dataMap, category, categoryMap, currentPage, itemsPerPage) {
  let totalItems = 0;
  if (category === "ALL") {
    Object.values(dataMap).forEach(arr => totalItems += arr.length);
  } else {
    totalItems = dataMap[category]?.length || 0;
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = '';

  // prev
  const prev = document.createElement("li");
  prev.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
  prev.innerHTML = `<a class="page-link" href="#">Prev</a>`;
  prev.addEventListener("click", () => {
    if (currentPage > 1) {
      renderResults(dataMap, category, categoryMap, currentPage - 1, itemsPerPage);
      renderPagination(dataMap, category, categoryMap, currentPage - 1, itemsPerPage);
    }
  });
  pagination.appendChild(prev);

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === currentPage ? "active" : ""}`;
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.addEventListener("click", () => {
      renderResults(dataMap, category, categoryMap, i, itemsPerPage);
      renderPagination(dataMap, category, categoryMap, i, itemsPerPage);
    });
    pagination.appendChild(li);
  }

  const next = document.createElement("li");
  next.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
  next.innerHTML = `<a class="page-link" href="#">Next</a>`;
  next.addEventListener("click", () => {
    if (currentPage < totalPages) {
      renderResults(dataMap, category, categoryMap, currentPage + 1, itemsPerPage);
      renderPagination(dataMap, category, categoryMap, currentPage + 1, itemsPerPage);
    }
  });
  pagination.appendChild(next);
}


const mockData = {
  "030110001": [ // 대회/공모전
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
    },
    {
      title: "청소년 영상 공모전",
      source: "https://youthmedia.go.kr/job-details.html",
      host: "한국청소년미디어협회",
      category: "영상, 창작",
      target: "중학생 · 고등학생",
      submission_period: "2025.06.10 ~ 2025.07.20"
    },
    {
      title: "AI 아이디어 챌린지",
      source: "https://ai-contest.kr/job-details.html",
      host: "과학기술정보통신부",
      category: "AI, 창의, 기술",
      target: "대학생 · 일반인",
      submission_period: "2025.05.01 ~ 2025.06.30"
    },
    {
      title: "전국 고등학생 시 공모전",
      source: "https://poetrycontest.kr/job-details.html",
      host: "한국문예협회",
      category: "문학, 시, 창작",
      target: "고등학생",
      submission_period: "2025.04.15 ~ 2025.06.15"
    }
  ],
  "030110002": [ // 대외활동
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
    },
    {
      title: "문화재 지킴이 봉사단",
      source: "https://heritage.or.kr/job-details.html",
      host: "문화재청",
      category: "문화, 봉사, 유적",
      target: "대학생",
      submission_period: "2025.04.01 ~ 2025.05.31"
    },
    {
      title: "지역사회 청년 멘토링",
      source: "https://mentoring.kr/job-details.html",
      host: "서울시 청년청",
      category: "멘토링, 교육",
      target: "대학생 · 직장인",
      submission_period: "2025.03.15 ~ 2025.05.20"
    },
    {
      title: "에코 리더 체험단",
      source: "https://eco-leader.kr/job-details.html",
      host: "환경부",
      category: "환경, 체험",
      target: "중고등학생",
      submission_period: "2025.04.20 ~ 2025.06.01"
    }
  ],
  "030110003": [ // 장학금
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
    },
    {
      title: "이공계열 특별 장학금",
      source: "https://sciencefund.kr/job-details.html",
      host: "한국연구재단",
      category: "이공계, 장학금",
      target: "이공계 대학생",
      submission_period: "2025.06.01 ~ 2025.07.01"
    },
    {
      title: "저소득층 교육지원 장학금",
      source: "https://eduhope.kr/job-details.html",
      host: "교육부",
      category: "저소득층, 교육지원",
      target: "중고등학생 · 대학생",
      submission_period: "2025.03.01 ~ 2025.04.10"
    },
    {
      title: "농촌인재 장학금",
      source: "https://ruralfund.or.kr/job-details.html",
      host: "농림축산식품부",
      category: "농촌, 지역인재",
      target: "농촌 거주 대학생",
      submission_period: "2025.04.10 ~ 2025.06.10"
    }
  ]
};

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category');
  const selectedKey = categoryKeyMap[category];

  const uiSettings = {
    contest: {
      heading: "원하는 대회·공모전을 찾아보세요",
      placeholder: "찾고 싶은 대회/공모전 이름",
      defaultText: "대회/공모전 분야 선택",
      options: ['문학·문예', '네이밍·슬로건', '학문·과학·IT', '스포츠', '미술·디자인·웹툰', '음악·콩쿠르·댄스', '사진·영상·영화제', '아이디어·건축·창업', '요리·뷰티·배우·오디션', '그외', '전체 대회/공모전 현황'],
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
    },
    all: {
  heading: "전체 공고를 확인해보세요",
  placeholder: "검색어를 입력하세요",
  defaultText: "분야 전체",
  options: [],
  keywords: []
}
  };

  // UI 텍스트 설정
  document.getElementById('category-title').innerText = '카테고리: ' + (urlCategoryMap[category] || '전체');
  document.getElementById('breadcrumb-category').innerText = urlCategoryMap[category] || '전체 보기';

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

const currentPage = 1;
const itemsPerPage = 2;

// ✅ 이거로 바꾸기
const selectedDataMap =
  selectedKey === "ALL" ? mockData : { [selectedKey]: mockData[selectedKey] };

renderResults(selectedDataMap, selectedKey, dataCategoryMap, currentPage, itemsPerPage);
renderPagination(selectedDataMap, selectedKey, dataCategoryMap, currentPage, itemsPerPage);

});