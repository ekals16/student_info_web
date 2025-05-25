// 자바스크립트 코드: URL 파라미터 읽기
const params = new URLSearchParams(window.location.search);
const category = params.get('category'); // 예: "contest"

const categoryMap = {
  contest: '대회/공모전',
  activity: '대외활동',
  scholarship: '장학금'
};

document.getElementById('category-title').innerText =
  '카테고리: ' + (categoryMap[category] || '전체');