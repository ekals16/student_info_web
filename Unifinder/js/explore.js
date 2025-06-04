document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category'); // contest, activity, scholarship

  const categoryMap = {
    contest: '대회/공모전',
    activity: '대외활동',
    scholarship: '장학금'
  };

  // UI 텍스트 설정
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

  // 제목/빵조각 업데이트
  document.getElementById('category-title').innerText =
    '카테고리: ' + (categoryMap[category] || '전체');

  document.getElementById('breadcrumb-category').innerText =
    categoryMap[category] || '전체 보기';

  const settings = uiSettings[category] || uiSettings.contest;

  // UI 제목
  document.getElementById('search-heading').innerText = settings.heading;

  // placeholder 설정
  document.getElementById('job-title').placeholder = settings.placeholder;

  // 옵션 변경
  const selectEl = document.getElementById('category-options');
  selectEl.innerHTML = `<option selected>${settings.defaultText}</option>`;
  settings.options.forEach(opt => {
    const optionEl = document.createElement('option');
    optionEl.text = opt;
    selectEl.appendChild(optionEl);
  });

  // 키워드 변경
  const keywordsEl = document.getElementById('popular-keywords');
  keywordsEl.innerHTML = '';
  settings.keywords.forEach(word => {
    const a = document.createElement('a');
    a.href = 'job-listings.html';
    a.className = 'badge';
    a.innerText = word;
    keywordsEl.appendChild(a);
  });

  // API 주소 설정
  let url = '/api/documents';
  if (category) {
    url = `/api/documents/search?category=${category}`;
  }

  // fetch 실행
  fetch(url)
    .then(res => res.json())
    .then(data => {
      renderResults(data); // ← 여기는 이미 있는 함수
    });
});