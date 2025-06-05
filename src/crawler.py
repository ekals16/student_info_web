import requests
from bs4 import BeautifulSoup
import time
import json
import re
from datetime import datetime
from pathlib import Path

field = {
    "제목": "title",
    "이미지": "image",
    "주최 . 주관": "host",
    "대표분야": "category",
    "참가대상": "target",
    "접수기간": "application_period",
    "심사기간": "evaluation_period",
    "활동기간": "activity_period",
    "대회지역": "location",
    "활동지역": "location",
    "활동혜택": "benefits",
    "시상내역": "prize",
    "홈페이지": "source",
    "접수방법": "application_method",
    "접수하기": "apply",
    "참가비용": "entry_fee"
}

today = datetime.today()
headers = {'User-Agent': 'Mozilla/5.0'}

# Contests (대회 및 공모전)
# bcode: 세부 카테고리 [문학•문예, 네이밍•슬로건, 학문•과학•IT, 스포츠, 미술•디자인•웹툰, 음악•콩쿠르•댄스, 사진•영상•영화제, 아이디어•건축•창업, 요리•뷰티•배우•오디션, The 다양한 분야]
contest_bcode = ['030110001','030210001','030310001','030810001','030610001','030910001','031210001','031410001','031610001','031810001']
contests = {}

for bcode in contest_bcode:
    print(f"\n카테고리: {bcode}")
    contests[bcode] = []  # 카테고리별 리스트 생성

    page = 1
    max_due_per_page = 12  # 페이지 당 항목 수

    while True:
        print(f"페이지: {page}")
        view_links = []
        due_count_this_page = 0
        list_url = f"https://www.contestkorea.com/sub/list.php?int_gbn=1&Txt_bcode={bcode}&page={page}"
        res = requests.get(list_url, headers=headers)
        soup = BeautifulSoup(res.text, 'html.parser')

        contest_items = soup.select(".list_style_2 > ul > li > div > a")

        for a in contest_items:
            href = a.get("href")
            title_span = a.select_one("span.txt")
            title = title_span.get_text(strip=True) if title_span else ""
            full_url = "https://www.contestkorea.com/sub/" + href
            view_links.append({
                "title": title,
                "url": full_url
            })

        for link in view_links:
            detail_res = requests.get(link["url"], headers=headers)
            detail_soup = BeautifulSoup(detail_res.text, 'html.parser')
            details = detail_soup.select(".txt_area > table > tbody > tr")
            
            detail_data = {}
            detail_data[field["제목"]] = link["title"]

            # 이미지 url
            img_tag = detail_soup.select_one(".img_area > div > img")
            if img_tag and img_tag.has_attr("src"):
                img_src = img_tag["src"]
                if not img_src.startswith("http"):
                    img_src = "https://www.contestkorea.com" + img_src
                detail_data[field["이미지"]] = img_src

            skip_due = False

            for row in details:
                th = row.find('th')
                td = row.find('td')
                if not th or not td:
                    continue

                key = th.get_text(strip=True)
                value = td.get_text(separator=' ', strip=True)
                value = re.sub(r'\s+', ' ', value).strip()

                if not key or key == "콘코 SNS 공유":
                    continue

                # 마감된 항목 제외
                if key in ["접수기간", "심사기간"]:
                    date_match = re.search(r'(\d{2,4}\.\d{2}\.\d{2})\s*~\s*(\d{2,4}\.\d{2}\.\d{2})', value)
                    if date_match:
                        end_str = date_match.group(2)
                        if end_str.count('.') == 2 and len(end_str.split('.')[0]) == 2:
                            end_str = f"{today.year}.{end_str}"
                        try:
                            end_date = datetime.strptime(end_str, "%Y.%m.%d")
                        except ValueError:
                            continue  # 날짜 형식 이상 시 건너뜀

                        if end_date < today:
                            skip_due = True
                            due_count_this_page += 1
                            break  # 상세 항목 루프 탈출

                # 출처 url
                a_tag = td.find('a')
                if a_tag and a_tag.has_attr('href'):
                    link_href = a_tag['href']
                    if not link_href.startswith("http"):
                        link_href = "https://www.contestkorea.com" + link_href
                    value += f"({link_href})"

                # 한글 → 영문 매핑 후 저장
                if key in field:
                    mapped_key = field[key]
                    detail_data[mapped_key] = value

            # view_detail_area 내부 h2/p 쌍 크롤링 → details dict에 저장
            detail_section = detail_soup.select_one(".view_detail_area")
            details_dict = {}
            if detail_section:
                h2_tags = detail_section.select("h2")
                for h2 in h2_tags:
                    key = h2.get_text(strip=True)
                    next_p = h2.find_next_sibling("p")
                    if next_p:
                        value = next_p.get_text(separator=' ', strip=True)
                        value = re.sub(r'\s+', ' ', value).strip()
                        details_dict[key] = value

            detail_data["details"] = details_dict  # "details" 키로 추가

            if skip_due:
                continue  # 이 항목만 스킵하고 다음 항목으로
        
            # 대상: 대학생, 대학원생, 일반인, 해당자 인 항목 필터링
            if field["참가대상"] in detail_data:
                if not any(kw in detail_data[field["참가대상"]] for kw in ["누구나", "대학생", "대학원생", "일반인", "해당자 ▶"]):
                    continue

            contests[bcode].append(detail_data)
            

        # 페이지 내 마감 항목이 12개 이상이면 크롤링 종료
        if due_count_this_page >= max_due_per_page:
            print(f"📌 {page} 페이지에서 마감 항목이 {due_count_this_page}개 발견되어 크롤링 종료합니다.")
            break

        page += 1  # 다음 페이지로
        time.sleep(0.5)

# External Activities (대외활동)
# bcode: 세부 카테고리 [서포터즈•기자단, 체험•탐방•봉사•동아리, 서평단•참여단•평가단•자문단, 기획•홍보•마케팅, 교육•강연•멘토링•세미나, 전시•박람•행사•축제, The 다양한 대외활동]
ea_bcode = ['040110001','040210001','040310001','040710001','040410001','040510001','040610001']
ea = {}

for bcode in ea_bcode:
    print(f"\n카테고리: {bcode}")
    ea[bcode] = []  # 카테고리별 리스트 생성

    page = 1
    max_due_per_page = 12  # 페이지 당 마감 항목 기준

    while True:
        print(f"페이지: {page}")
        list_url = f"https://www.contestkorea.com/sub/list.php?int_gbn=2&Txt_bcode={bcode}&page={page}"
        res = requests.get(list_url, headers=headers)
        soup = BeautifulSoup(res.text, 'html.parser')

        ea_items = soup.select(".list_style_2 > ul > li > div > a")

        view_links = []
        for a in ea_items:
            href = a.get("href")
            title_span = a.select_one("span.txt")
            title = title_span.get_text(strip=True) if title_span else ""
            full_url = "https://www.contestkorea.com/sub/" + href
            view_links.append({
                "title": title,
                "url": full_url
            })

        due_count_this_page = 0  # 이번 페이지 마감 항목 수

        for link in view_links:
            detail_res = requests.get(link["url"], headers=headers)
            detail_soup = BeautifulSoup(detail_res.text, 'html.parser')
            details = detail_soup.select(".txt_area > table > tbody > tr")

            detail_data = {}
            detail_data[field["제목"]] = link["title"]

            # 이미지 url
            img_tag = detail_soup.select_one(".img_area > div > img")
            if img_tag and img_tag.has_attr("src"):
                img_src = img_tag["src"]
                if not img_src.startswith("http"):
                    img_src = "https://www.contestkorea.com" + img_src
                detail_data[field["이미지"]] = img_src

            skip_due = False

            for row in details:
                th = row.find('th')
                td = row.find('td')
                if not th or not td:
                    continue

                key = th.get_text(strip=True)
                value = td.get_text(separator=' ', strip=True)
                value = re.sub(r'\s+', ' ', value).strip()

                if not key or key == "콘코 SNS 공유":
                    continue

                # 접수 마감된 항목 제외
                if key in ["접수기간"]:
                    date_match = re.search(r'(\d{2,4}\.\d{2}\.\d{2})\s*~\s*(\d{2,4}\.\d{2}\.\d{2})', value)
                    if date_match:
                        end_str = date_match.group(2)
                        if end_str.count('.') == 2 and len(end_str.split('.')[0]) == 2:
                            end_str = f"{today.year}.{end_str}"
                        try:
                            end_date = datetime.strptime(end_str, "%Y.%m.%d")
                        except ValueError:
                            continue

                        if end_date < today:
                            skip_due = True
                            due_count_this_page += 1
                            break # 상세 항목 루프

                # 출처 url
                a_tag = td.find('a')
                if a_tag and a_tag.has_attr('href'):
                    link_href = a_tag['href']
                    if not link_href.startswith("http"):
                        link_href = "https://www.contestkorea.com" + link_href
                    value += f"({link_href})"
                # 한글 → 영문 매핑 후 저장
                if key in field:
                    mapped_key = field[key]
                    detail_data[mapped_key] = value

            # view_detail_area 내부 h2/p 쌍 크롤링 → details dict에 저장
            detail_section = detail_soup.select_one(".view_detail_area")
            details_dict = {}
            if detail_section:
                h2_tags = detail_section.select("h2")
                for h2 in h2_tags:
                    key = h2.get_text(strip=True)
                    next_p = h2.find_next_sibling("p")
                    if next_p:
                        value = next_p.get_text(separator=' ', strip=True)
                        value = re.sub(r'\s+', ' ', value).strip()
                        details_dict[key] = value

            detail_data["details"] = details_dict  # "details" 키로 추가
                        
            if skip_due:
                continue  # 이 항목만 스킵하고 다음 항목으로
            
            # 대상: 대학생, 대학원생, 일반인, 해당자 인 항목 필터링
            if field["참가대상"] in detail_data:
                if not any(kw in detail_data[field["참가대상"]] for kw in ["누구나", "대학생", "대학원생", "일반인", "해당자 ▶"]):
                    continue

            ea[bcode].append(detail_data)

        # 페이지 내 마감 항목이 12개 이상이면 크롤링 종료
        if due_count_this_page >= max_due_per_page:
            print(f"📌 {page} 페이지에서 마감 항목이 {due_count_this_page}개 발견되어 크롤링 종료합니다.")
            break

        page += 1  # 다음 페이지로
        time.sleep(0.5)
        
output_dir = Path("./output")
output_dir.mkdir(exist_ok=True)

timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
filename = output_dir / f"contestkorea_{timestamp}.json"

all_data = {
"contests": contests,
"external_activities": ea,
"crawled_at": datetime.now().isoformat()
}

with open(filename, "w", encoding="utf-8") as f:
    json.dump(all_data, f, ensure_ascii=False, indent=2)

print(f"\n✅ 크롤링 완료, 결과를 '{filename}' 에 저장했습니다.")
print(f"종료 시각: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
