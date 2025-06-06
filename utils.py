# utils.py

import json
import requests
from pathlib import Path
from datetime import datetime

def save_to_json(data: dict, prefix: str = "crawled_data"):
    """
    크롤링된 데이터를 타임스탬프가 포함된 JSON 파일로 저장합니다.
    """
    output_dir = Path("./output")
    output_dir.mkdir(exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = output_dir / f"{prefix}_{timestamp}.json"

    try:
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"\n[저장 완료] 결과가 '{filename}' 파일에 저장되었습니다.")
    except IOError as e:
        print(f"\n[저장 실패] 파일 저장 중 오류 발생: {e}")


def send_to_api(data: dict, api_url: str):
    """
    크롤링된 데이터를 지정된 백엔드 API로 POST 요청을 보내 전송합니다.
    """
    if not data.get("contests") and not data.get("external_activities"):
        print("\n[전송 건너뜀] 전송할 데이터가 없습니다.")
        return

    print(f"\n[API 전송 시작] 백엔드 서버로 데이터를 전송합니다. (URL: {api_url})")
    
    try:
        # requests.post는 딕셔너리를 자동으로 JSON 문자열로 변환해줍니다.
        response = requests.post(api_url, json=data, timeout=15)
        
        # HTTP 오류 코드를 체크하여 예외를 발생시킵니다. (4xx, 5xx 에러)
        response.raise_for_status() 
        
        print(f"[전송 성공] 서버 응답: {response.status_code}")
        # 서버가 JSON 응답을 보낼 경우, 내용을 출력할 수 있습니다.
        # print(response.json())

    except requests.exceptions.RequestException as e:
        print(f"[전송 실패] API 요청 중 오류가 발생했습니다: {e}")
    except Exception as e:
        print(f"[전송 실패] 알 수 없는 오류가 발생했습니다: {e}")