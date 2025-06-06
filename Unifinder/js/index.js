document.addEventListener('DOMContentLoaded', function () {
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
      }
    ],
    "030110003": [ // 장학금
      {
        title: "국가우수장학금 신청 안내",
        source: "https://www.kosaf.go.kr/job-details.html",
        host: "한국장학재단",
        category: "장학금, 우수학생",
        target: "대학생",
        submission_period: "2025.04.01 ~ 2025.07.05"
      },
      {
        title: "농촌인재 장학금",
        source: "https://ruralfund.or.kr/job-details.html",
        host: "농림축산식품부",
        category: "농촌, 지역인재",
        target: "농촌 거주 대학생",
        submission_period: "2025.04.10 ~ 2025.07.10"
      }
    ]
  };

  const container = document.getElementById("latest-jobs");
  if (!container) return;

  // 데이터 합치고 최신순 정렬
  const allList = Object.values(mockData).flat();

  const sorted = allList.sort((a, b) => {
    const aEnd = new Date(a.submission_period.split('~')[1].trim());
    const bEnd = new Date(b.submission_period.split('~')[1].trim());
    return bEnd - aEnd; // 최신 마감일이 앞으로
  });

  const top5 = sorted.slice(0, 5);

  // 렌더링
  top5.forEach(item => {
    const div = document.createElement("div");
    div.className = "job-thumb d-flex mb-4";

    div.innerHTML = `
      <div class="job-image-wrap bg-white shadow-lg">
        <img src="images/logos/google.png" class="job-image img-fluid" alt="">
      </div>

      <div class="job-body d-flex flex-wrap flex-auto align-items-center ms-4">
        <div class="mb-3">
          <h4 class="job-title mb-lg-0">
            <a href="details.html?source=${encodeURIComponent(item.source)}" class="job-title-link">[${item.category.split(',')[0]}] ${item.title}</a>
          </h4>
          <div class="d-flex flex-wrap align-items-center">
            <p class="job-location mb-0"><i class="custom-icon bi-geo-alt me-1"></i> ${item.host}</p>
            <p class="job-date mb-0"><i class="custom-icon bi-clock me-1"></i> ${item.submission_period}</p>
            <p class="job-price mb-0"><i class="custom-icon bi-cash me-1"></i> ${item.target}</p>
          </div>
        </div>
        <div class="job-section-btn-wrap">
          <a href="details.html?source=${encodeURIComponent(item.source)}" class="custom-btn btn">자세히 보기</a>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
});

