# Unifinder

> 대학생을 위한 대회/공모전·대외활동·장학금 정보 탐색 플랫폼

## 개요

Unifinder는 흩어진 다양한 공공 정보(대회/공모전, 대외활동, 장학금 등)를 통합해  
학생들이 키워드 검색과 카테고리 필터링을 통해 쉽고 빠르게 탐색할 수 있도록 만든  
웹사이트 기반 탐색 도구입니다.

본 프로젝트는 GitHub Pages를 통해 정적으로 호스팅됩니다.  
👉 [사이트 바로가기](https://ekals16.github.io/student_info_web/)

---

## 주요 기능

- 키워드 검색 및 카테고리별 필터링 기능  
- 최신순 정렬, 페이지네이션 구현  
- 크롤링한 공고 데이터를 `data.json`으로 변환 후 클라이언트에서 렌더링  
- 자세히 보기 클릭 시 `details.html`로 연결되어 상세 내용 확인 가능  
- 추후 매년 반복되는 프로젝트 예측 안내 기능 포함

---

## 기술 스택

| 영역 | 사용 기술 |
|------|-----------|
| 프론트엔드 | HTML, CSS, JavaScript |
| 템플릿 기반 | Tooplate 2134 Gotto Job |
| 데이터 처리 | Python 크롤러 (별도 repo 또는 수동 처리 후 JSON 변환) |
| 배포 | GitHub Pages (`main` 브랜치에서 정적 호스팅) |

---

## 프로젝트 구조

student_info_web/
├── index.html # 메인 페이지
├── job-listings.html # 공고 리스트 페이지
├── details.html # 개별 공고 상세 페이지
├── data.json # 정적 JSON 데이터 (크롤링 결과)
├── js/ # 주요 렌더링 로직 (explore.js, details.js)
├── css/, fonts/, images/ # 디자인 및 정적 파일

- 크롤링 자동화는 실제 서비스에 적용되지는 않으며, JSON 정적 파일 기반으로 동작합니다.
