document.addEventListener('DOMContentLoaded', function () {

// 자바스크립트 코드: URL 파라미터 읽기
const params = new URLSearchParams(window.location.search);
const category = params.get('category'); // 예: "contest", 없으면 "전체 보기"

const categoryMap = {
  contest: '대회/공모전',
  activity: '대외활동',
  scholarship: '장학금'
};

document.getElementById('category-title').innerText =
  '카테고리: ' + (categoryMap[category] || '전체');

document.getElementById('breadcrumb-category').innerText =
categoryMap[category] || '전체 보기';
});

  // 전체 보기일 경우: /api/documents
  // 카테고리 있을 경우: /api/documents/search?... 호출
let url = '/api/documents';
if (category) {
  url = `/api/documents/search?category=${category}`;
}

//비동기 요청 처리 -> 데이터 받아서 출력
// *renderResults()함수는 따로 구현 필요*
fetch(url)
  .then(res => res.json())
  .then(data => {
    renderResults(data); // ← 데이터 렌더링 함수
  });