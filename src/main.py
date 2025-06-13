# main.py

from datetime import datetime
from config import CATEGORIES, API_ENDPOINT
from crawler import crawl_category
from utils import save_to_json, send_to_api

def main():
    """
    메인 실행 함수: 크롤링 -> 데이터 취합 -> 파일 저장 -> API 전송
    """
    print(f"크롤링을 시작합니다. (시작 시각: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')})")
    
    all_crawled_data = {}

    # config에 정의된 카테고리별로 크롤링 실행
    for cat_name, cat_info in CATEGORIES.items():
        print(f"\n--- {cat_name.upper()} 크롤링 시작 ---")
        int_gbn = cat_info["int_gbn"]
        category_results = []
        for bcode in cat_info["bcodes"]:
            print(f"\n[카테고리 코드: {bcode}]")
            items = crawl_category(int_gbn, bcode)
            category_results.extend(items)
            print(f"  - 수집된 항목 수: {len(items)}개")
        
        all_crawled_data[cat_name] = category_results
        print(f"\n--- {cat_name.upper()} 카테고리 크롤링 완료 (총 {len(category_results)}개) ---")

    # 최종 취합 데이터 구조화
    final_data = {
        "crawled_at": datetime.now().isoformat(),
        "contests": all_crawled_data.get("contests", []),
        "external_activities": all_crawled_data.get("external_activities", [])
    }
    
    # 1. 결과를 JSON 파일로 저장
    save_to_json(final_data)
    
    # 2. 결과를 백엔드 API로 전송
    send_to_api(final_data, API_ENDPOINT)

    print(f"\n모든 작업이 완료되었습니다. (종료 시각: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')})")


if __name__ == "__main__":
    main()