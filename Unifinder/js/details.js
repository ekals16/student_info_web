(() => {
  // 1. URL 파라미터 추출
  const params = new URLSearchParams(window.location.search);
  const source = decodeURIComponent(params.get("source") || "");
  const categoryKey = params.get("category");

  // 2. 카테고리 키 → 한글 매핑
  const urlCategoryMap = {
    contest: "대회/공모전",
    activity: "대외활동",
    scholarship: "장학금",
     "030110001": "대회/공모전",
  "030110002": "대외활동",
  "030110003": "장학금"
  };

  // 3. mockData (서버 연결 전까지 임시 데이터)
  const mockData = {
    "030110001": [ // contest
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
    "030110002": [ // activity
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
    "030110003": [ // scholarship
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

  // 4. 전체 mockData에서 해당 source 값을 가진 항목 찾기
  let selectedItem = null;
  Object.values(mockData).forEach(arr => {
    arr.forEach(item => {
      if (item.source === source) {
        selectedItem = item;
      }
    });
  });

  // 5. 상단 카테고리 출력 (안전한 DOM 접근)
  const el = document.getElementById("category-title");
  if (el) {
    el.innerText = "카테고리: " + (urlCategoryMap[categoryKey] || "전체");
  }

  const breadcrumb = document.getElementById("breadcrumb-category");
  if (breadcrumb) {
    breadcrumb.innerText = urlCategoryMap[categoryKey] || "전체 보기";
  }

  // 6. 상세 정보 렌더링
  if (selectedItem) {
    document.getElementById("detail-title").innerText = selectedItem.title;
    document.getElementById("detail-host").innerText = selectedItem.host;
    document.getElementById("detail-period").innerText = selectedItem.submission_period;
    document.getElementById("detail-target").innerText = selectedItem.target;
    document.getElementById("detail-category").innerText = selectedItem.category;
  } else {
    document.getElementById("detail-title").innerText = "공고 정보를 불러올 수 없습니다.";
  }
})();