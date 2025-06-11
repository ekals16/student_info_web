// 전역 선언
const urlCategoryMap = {
  contest: '대회/공모전',
  activity: '대외활동',
  scholarship: '장학금'
};

const dataCategoryMap = {
  "030110001": "대회/공모전",
  "040110001": "대외활동",
  "030110003": "장학금",
  "ALL": "전체"
};

const categoryKeyMap = {
  contest: "030110001",
  activity: "040110001",
  scholarship: "030110003",
  all: "ALL" //추가
};

//대외활동 때문에 추가한 부분
const categoryOptionMap = {
  contest: [
    "문학·문예", "네이밍·슬로건", "학문·과학·IT", "스포츠",
    "미술·디자인·웹툰", "음악·콩쿠르·댄스", "사진·영상·영화제",
    "아이디어·건축·창업", "요리·뷰티·배우·오디션", "The다양한분야"
  ],
  activity: [
    "서포터즈·기사단", "체험·탐방·봉사·동아리", "서평단·참여단·평가단·자문단",
    "기획·홍보·마케팅", "교육·강연·멘토링·세미나", "전시·박람·행사·축제", "그외"
  ]
}

let currentKeyword = '';
let currentOption = '';

// ✅ 여기! 전역에 선언
function normalizeCategory(str) {
  return str?.replace(/[\u00B7\u2022]/g, "·");
}

function filterData(dataMap, categoryKey, keyword = '', selectedOption = '') {
  const keywordExists = keyword !== '';
  const optionExists = selectedOption !== '' && !selectedOption.includes("전체");

  // 1. 소스 데이터 선택
  const sourceList = categoryKey === "ALL"
    ? Object.values(dataMap).flat()
    : dataMap[categoryKey] || [];

  // 2. 필터링 적용
  const filteredList = sourceList.filter(item => {
    console.log("🔎 검사 중인 제목:", item.title);  // ✅ 여기에 추가
    const titleMatch = !keywordExists || item.title?.toLowerCase().includes(keyword.toLowerCase());
    const optionMatch = !optionExists || (item.category && item.category.includes(selectedOption));
    return titleMatch && optionMatch;
  });

  // 3. 반환 (항상 현재 카테고리 키 기준)
  return {
    [categoryKey]: filteredList
  };
}

// 페이지 단위 렌더링
function renderResults(dataMap, category, categoryMap, currentPage = 1, itemsPerPage = 10) {
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

  // ✅ 최신순 정렬 (cTime 기준 내림차순)
fullList.sort((a, b) => new Date(b.ctime) - new Date(a.ctime));

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
            <a href="details.html?sourceUrl=${encodeURIComponent(item.sourceUrl)}" class="job-title-link"> [${categoryMap[category] || '전체'}] ${item.title}</a>
          </h4>
          <p class="job-location mb-1">
            <i class="custom-icon bi-geo-alt me-1"></i> ${item.host}
          </p>
          <div class="d-flex flex-wrap align-items-center gap-3">
            <p class="job-date mb-0">
              <i class="custom-icon bi-clock me-1"></i> ${item.application_period}
            </p>
            <p class="job-price mb-0">
              <i class="custom-icon bi-person me-1"></i> ${item.target}
            </p>
          </div>
        </div>
        <div class="d-flex align-items-center justify-content-end gap-2">
          <div class="d-flex flex-wrap justify-content-end me-5">
            ${item.category?.split(',').map(tag => `
              <p class="mb-0 ms-2"><a href="${item.sourceUrl}" class="badge">${tag.trim()}</a></p>
            `).join('')}
          </div>
          <div class="job-section-btn-wrap">
            <a href="details.html?sourceUrl=${encodeURIComponent(item.sourceUrl)}&category=${category}" class="custom-btn btn">자세히 보기</a>
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

  const maxButtons = 5;
  const startPage = Math.floor((currentPage - 1) / maxButtons) * maxButtons + 1;
  const endPage = Math.min(startPage + maxButtons - 1, totalPages);

  const prev = document.createElement("li");
  prev.className = `page-item ${startPage === 1 ? "disabled" : ""}`;
  prev.innerHTML = `<a class="page-link" href="#">‹</a>`;
  prev.addEventListener("click", () => {
    if (startPage > 1) {
      const filtered = filterData(window.fullDataMap, category, currentKeyword, currentOption);
      renderPagination(filtered, category, categoryMap, startPage - 1, itemsPerPage);
      renderResults(filtered, category, categoryMap, startPage - 1, itemsPerPage);
    }
  });
  pagination.appendChild(prev);

  for (let i = startPage; i <= endPage; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === currentPage ? "active" : ""}`;
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.addEventListener("click", () => {
      const filtered = filterData(window.fullDataMap, category, currentKeyword, currentOption);
      renderResults(filtered, category, categoryMap, i, itemsPerPage);
      renderPagination(filtered, category, categoryMap, i, itemsPerPage);
    });
    pagination.appendChild(li);
  }

  const next = document.createElement("li");
  next.className = `page-item ${endPage === totalPages ? "disabled" : ""}`;
  next.innerHTML = `<a class="page-link" href="#">›</a>`;
  next.addEventListener("click", () => {
    if (endPage < totalPages) {
      const filtered = filterData(window.fullDataMap, category, currentKeyword, currentOption);
      renderPagination(filtered, category, categoryMap, endPage + 1, itemsPerPage);
      renderResults(filtered, category, categoryMap, endPage + 1, itemsPerPage);
    }
  });
  pagination.appendChild(next);
}

//중복 제거 함수 (title+host+application_period)
function removeDuplicates(list) {
  const seen = new Set();
  return list.filter(item => {
    const key = `${item.title}_${item.host}_${item.application_period}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}


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


  // ✅ UI 텍스트 설정
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

  // ✅ 백엔드에서 JSON 데이터 fetch
  fetch("./data.json")
    .then(response => response.json())
    .then(allList => {
        console.log("📦 백엔드에서 받아온 데이터:", allList); // ✅ 이 줄 추가!
        console.log("첫 데이터 확인:", allList[0]);
      // 데이터 구조를 category별로 분류
      const dataMap = {
        "030110001": [],
        "040110001": [],
        "030110003": []
      };

      allList.forEach(item => {
        if (dataMap[item.code]) {
          dataMap[item.code].push(item);
        }
      });

      window.fullDataMap = dataMap;

      const filtered = filterData(dataMap, selectedKey);
      renderResults(filtered, selectedKey, dataCategoryMap);
      renderPagination(filtered, selectedKey, dataCategoryMap, 1, 10);

      document.getElementById("search-button").addEventListener("click", function () {
        const keyword = document.getElementById("job-title").value.trim();
        const selectedOptionText = document.getElementById("category-options").selectedOptions[0].text;

        currentKeyword = keyword;
        currentOption = selectedOptionText;

        const flatList = Object.values(window.fullDataMap).flat();

        const categoryParam = new URLSearchParams(window.location.search).get("category");
        const categoryKey = categoryKeyMap[categoryParam];

        const normalizedSelected = normalizeCategory(selectedOptionText);

        const filteredList = flatList.filter(item => {
          const titleMatch = !keyword || item.title?.toLowerCase().includes(keyword.toLowerCase());

          const itemCategoryNorm = normalizeCategory(item.category);

          // ✅ "전체"가 아닌 경우만 정밀 비교
          const categoryMatch =
            !normalizedSelected || normalizedSelected.includes("전체") ||
            (Array.isArray(categoryOptionMap[categoryParam]) &&
              categoryOptionMap[categoryParam].some(opt =>
                itemCategoryNorm?.includes(normalizeCategory(opt)) &&
                normalizedSelected.includes(normalizeCategory(opt))
              ));

          return titleMatch && categoryMatch;
        });

        const deduplicatedList = removeDuplicates(filteredList);

        console.log("🔮 입력 키워드:", keyword);
        console.log("📁 선택 카테고리명:", selectedOptionText);
        console.log("📦 전체 데이터 수:", flatList.length);
        console.log("✅ 필터된 결과 수 (중복 제거 후):", deduplicatedList.length);

        const filteredMap = { [categoryKey]: deduplicatedList };
        renderResults(filteredMap, categoryKey, dataCategoryMap);
        renderPagination(filteredMap, categoryKey, dataCategoryMap, 1, 10);
      });
          })
    .catch(error => {
      console.error("데이터 불러오기 실패:", error);
    });
    
    /*
      // ✅ 검색 기능 (서버 검색 API 사용)
      document.querySelector('form.hero-form').addEventListener('submit', function (e) {
        e.preventDefault();
        */

        // ✅ 인기 키워드 클릭 → 서버 검색 API 사용
      document.querySelectorAll('#popular-keywords a').forEach(a => {
        a.addEventListener('click', e => {
          e.preventDefault();
          const word = a.innerText;
          document.getElementById("job-title").value = word;

          const selectedOptionText = document.getElementById("category-options").selectedOptions[0].text;
          currentKeyword = word;
          currentOption = selectedOptionText;

          const flatList = Object.values(window.fullDataMap).flat();
          const categoryParam = new URLSearchParams(window.location.search).get("category");
          const categoryKey = categoryKeyMap[categoryParam];
          const normalizedSelected = normalizeCategory(selectedOptionText);

          const filteredList = flatList.filter(item => {
            const titleMatch = item.title?.toLowerCase().includes(word.toLowerCase());
            const itemCategoryNorm = normalizeCategory(item.category);
            const categoryMatch =
              !normalizedSelected || normalizedSelected.includes("전체") ||
              (Array.isArray(categoryOptionMap[categoryParam]) &&
                categoryOptionMap[categoryParam].some(opt =>
                  itemCategoryNorm?.includes(normalizeCategory(opt)) &&
                  normalizedSelected.includes(normalizeCategory(opt))
                ));
            return titleMatch && categoryMatch;
          });

          const deduplicatedList = removeDuplicates(filteredList);
          const filteredMap = { [categoryKey]: deduplicatedList };
          renderResults(filteredMap, categoryKey, dataCategoryMap);
          renderPagination(filteredMap, categoryKey, dataCategoryMap, 1, 10);
        });
      }); 
    })
    .catch(error => {
      console.error("데이터 불러오기 실패:", error);
  });