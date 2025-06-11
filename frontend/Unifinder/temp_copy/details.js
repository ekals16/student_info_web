(() => {
  // 1. URL 파라미터 추출
  const params = new URLSearchParams(window.location.search);
  const sourceUrl = decodeURIComponent(params.get("sourceUrl") || "");
  const categoryKey = params.get("category");

  // 2. 카테고리 키 → 한글 매핑
  const urlCategoryMap = {
    contest: "대회/공모전",
    activity: "대외활동",
    scholarship: "장학금",
    "030110001": "대회/공모전",
    "040110001": "대외활동",
    "030110003": "장학금"
  };

  // 3. fetch로 백엔드에서 전체 데이터 가져오기
  fetch("http://localhost:8080/api/documents")
    .then(res => res.json())
    .then(data => {
      console.log("🔍 현재 페이지 URL:", sourceUrl); // URL 파라미터로 받은 값
      data.forEach(item => {
        console.log("📦 서버 데이터:", item.sourceUrl); // 서버에서 받은 값
      });
      
      // 4. 해당 sourceUrl에 맞는 항목 찾기
      const selectedItem = data.find(item => item.sourceUrl === sourceUrl);

      // 5. 카테고리 이름 출력
      const el = document.getElementById("category-title");
      if (el) {
        el.innerText = "카테고리: " + (urlCategoryMap[categoryKey] || "전체");
      }

      const breadcrumb = document.getElementById("breadcrumb-category");
      if (breadcrumb) {
        breadcrumb.innerText = urlCategoryMap[categoryKey] || "전체 보기";
      }

      // 6. 항목 정보 렌더링
      if (selectedItem) {
        document.getElementById("detail-title").textContent = selectedItem.title || "-";
        document.getElementById("detail-image").src = selectedItem.image || "images/default.png";
        document.getElementById("detail-host").textContent = selectedItem.host || "-";
        document.getElementById("detail-target").textContent = selectedItem.target || "-";
        document.getElementById("detail-period").textContent = selectedItem.application_period || "-";
        document.getElementById("detail-eval").textContent = selectedItem.evaluation_period || "-";
        document.getElementById("detail-location").textContent = selectedItem.location || "-";
        document.getElementById("detail-prize").textContent = selectedItem.prize || "-";
        document.getElementById("detail-method").textContent = selectedItem.application_method || "-";
        document.getElementById("detail-entry").textContent = selectedItem.entry_fee || "-";
        document.getElementById("detail-sourceUrl").href = selectedItem.sourceUrl || "#";
      } else {
        document.getElementById("detail-title").innerText = "공고 정보를 불러올 수 없습니다.";
      }
    })
    .catch(err => {
      console.error("데이터 로드 실패:", err);
      document.getElementById("detail-title").innerText = "서버에서 데이터를 불러오는 데 실패했습니다.";
    });
})();