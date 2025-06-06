# crawler.py

import requests
from bs4 import BeautifulSoup
import re
from datetime import datetime
import time
from urllib.parse import urljoin

from config import headers, BASE_URL, LIST_URL, FIELD_MAP, TARGET_KEYWORDS

def scrape_detail_page(url: str) -> dict | None:
    """
    개별 공모전/대외활동 상세 페이지를 크롤링하여 데이터를 반환합니다.
    마감된 활동일 경우 None을 반환합니다.
    """
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        detail_data = {}
        today = datetime.today()

        # 기본 정보 테이블 파싱
        rows = soup.select(".txt_area > table > tbody > tr")
        for row in rows:
            th = row.find('th')
            td = row.find('td')
            if not th or not td or "콘코 SNS 공유" in th.get_text():
                continue

            key = th.get_text(strip=True)
            value = re.sub(r'\s+', ' ', td.get_text(separator=' ', strip=True)).strip()

            # 마감일 체크 (접수기간, 심사기간 기준)
            if key in ["접수기간", "심사기간"]:
                date_match = re.search(r'(\d{2,4}\.\d{2}\.\d{2})\s*~\s*(\d{2,4}\.\d{2}\.\d{2})', value)
                if date_match:
                    end_str = date_match.group(2)
                    if len(end_str.split('.')[0]) == 2:
                        end_str = f"{today.year}.{end_str}"
                    end_date = datetime.strptime(end_str, "%Y.%m.%d")
                    if end_date < today:
                        return None # 마감된 항목이므로 None 반환

            # 홈페이지 링크 추출
            a_tag = td.find('a')
            if a_tag and a_tag.has_attr('href'):
                link_href = a_tag['href']
                if not link_href.startswith("http"):
                    link_href = BASE_URL + link_href
                value += f"({link_href})"

            if key in FIELD_MAP:
                detail_data[FIELD_MAP[key]] = value

        # 참가대상 필터링
        if "target" in detail_data and not any(kw in detail_data["target"] for kw in TARGET_KEYWORDS):
            return None

        # 이미지 URL 파싱
        img_tag = soup.select_one(".img_area > div > img")
        if img_tag and img_tag.has_attr("src"):
            img_src = img_tag["src"]
            detail_data["image"] = img_src if img_src.startswith("http") else BASE_URL + img_src

        # 상세 내용(h2/p) 파싱
        detail_section = soup.select_one(".view_detail_area")
        details_dict = {}
        if detail_section:
            for h2 in detail_section.select("h2"):
                key = h2.get_text(strip=True)
                p = h2.find_next_sibling("p")
                if p:
                    details_dict[key] = re.sub(r'\s+', ' ', p.get_text(separator=' ', strip=True)).strip()
        detail_data["details"] = details_dict

        return detail_data

    except requests.RequestException as e:
        print(f"  [오류] 상세 페이지 요청 실패: {url}, {e}")
        return None
    except Exception as e:
        print(f"  [오류] 상세 페이지 파싱 실패: {url}, {e}")
        return None


def crawl_category(int_gbn: str, bcode: str) -> list[dict]:
    """
    주어진 카테고리(bcode)의 모든 페이지를 순회하며 데이터를 크롤링합니다.
    """
    all_items = []
    page = 26
    max_due_per_page = 12 # 한 페이지에 마감된 항목이 12개 이상이면 다음 카테고리로 이동

    while True:
        print(f" > 페이지 : {page}")
        list_url = LIST_URL.format(int_gbn=int_gbn, bcode=bcode, page=page)
        
        try:
            res = requests.get(list_url, headers=headers)
            res.raise_for_status()
            soup = BeautifulSoup(res.text, 'html.parser')
        except requests.RequestException as e:
            print(f"  [오류] 목록 페이지 요청 실패: {list_url}, {e}")
            break

        items = soup.select(".list_style_2 > ul > li > div > a")
        if not items:
            print("  - 목록 없음, 해당 카테고리 크롤링 종료.")
            break

        due_count_this_page = 0
        for item_link in items:
            href = item_link.get("href")
            title = item_link.select_one("span.txt").get_text(strip=True)
            detail_url = urljoin(list_url, href)

            scraped_data = scrape_detail_page(detail_url)
            time.sleep(0.2) # 서버 부하를 줄이기 위한 지연

            if scraped_data:
                scraped_data["title"] = title # 목록의 제목이 더 정확하므로 덮어쓰기
                all_items.append(scraped_data)
            else:
                due_count_this_page += 1
        
        if due_count_this_page >= max_due_per_page:
            print(f"  📌 마감 항목 {due_count_this_page}개 확인, 다음 카테고리로 이동합니다.")
            break
        
        page += 1

    return all_items