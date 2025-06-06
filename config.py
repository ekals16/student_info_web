# config.py

# 요청 시 사용할 HTTP 헤더
headers = {'User-Agent': 'Mozilla/5.0'}

# 크롤링할 웹사이트의 기본 URL 템플릿
BASE_URL = "https://www.contestkorea.com"
LIST_URL = f"{BASE_URL}/sub/list.php?int_gbn={{int_gbn}}&Txt_bcode={{bcode}}&page={{page}}"

# 백엔드 API 엔드포인트 주소
API_ENDPOINT = "!!!!!!!!!!"

# 크롤링할 카테고리 코드
# '1': 대회 및 공모전, '2': 대외활동
CATEGORIES = {
    "contests": {
        "int_gbn": "1",
        "bcodes": [ '030110001'
        #    '030110001', '030210001', '030310001', '030810001',
        #    '030610001', '030910001', '031210001', '031410001',
        #    '031610001', '031810001'
        ]
    },
    "external_activities": {
        "int_gbn": "2",
        "bcodes": [ '040110001'
        #    '040110001', '040210001', '040310001', '040710001',
        #    '040410001', '040510001', '040610001'
        ]
    }
}

# 웹사이트의 한글 필드명과 DB에 저장할 영문 필드명 매핑
FIELD_MAP = {
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

# 필터링할 참가대상 키워드
TARGET_KEYWORDS = ["누구나", "대학생", "대학원생", "일반인", "해당자 ▶"]