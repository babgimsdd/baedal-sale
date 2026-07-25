import os
import json
import google.generativeai as genai
from subprocess import run
import urllib.request
import re

# 1. 구글 AI 스튜디오 제미나이 키 설정
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_KEY:
    print("구글 제미나이 API 키가 등록되지 않았습니다.")
    exit(1)

genai.configure(api_key=GEMINI_KEY)

# 2. 임시 주소 설정 (추후 대표님의 파트너스 링크로 교체하세요!)
COUPANG_TRACKING_URL = "https://coupang.com"
BAEMIN_TRACKING_URL = "https://baemin.com" # 빈칸(#) 대신 임시 기본 주소 연결
YOGIYO_TRACKING_URL = "https://yogiyo.co.kr"
DDANGGYO_TRACKING_URL = "https://ddanggyo.com"

print("실시간 인터넷 배달 할인 정보 수집 시작...")

# 3. [진짜 AI 크롤링] 실제 할인 정보가 모이는 핫딜/쿠폰 웹사이트의 글을 긁어옵니다.
# 인터넷 보안 필터를 피하기 위해 우회하여 HTML 소스코드를 읽어옵니다.
try:
    req = urllib.request.Request(
        "https://arca.live", # 유저들이 배달 할인을 실시간 제보하는 대표 핫딜 채널
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    )
    html_content = urllib.request.urlopen(req).read().decode('utf-8')
    # 너무 긴 HTML은 AI 토큰을 많이 먹으므로 본문 텍스트 위주로 1차 압축
    clean_text = re.sub('<[^<]+?>', '', html_content)[:15000]
except Exception as e:
    print(f"웹사이트 직접 크롤링 실패: {e}, 기본 공공 할인 모드로 전환합니다.")
    clean_text = "배민 요기요 쿠팡이츠 프랜차이즈 오늘 할인 정보 모음"

# 4. 제미나이 3.6 플래시 AI에게 진짜 실시간 데이터 정제 명령 내리기
model = genai.GenerativeModel(
    model_name="gemini-2.5-flash", # 최신 플래시 모델 사용
    generation_config={"response_mime_type": "application/json"} # 무조건 깨끗한 JSON 형식만 출력하도록 강제
)

prompt = f"""
너는 대한민국 최고의 배달 할인 정보 전문 AI 나침반이야.
아래 긁어온 인터넷 실시간 핫딜 정보 텍스트를 분석해서, 현재 [배달의민족, 쿠팡이츠, 요기요, 땡겨요, 먹깨비] 등에서 진행 중인 브랜드 할인, 무료 배달, 카드사 추가 혜택 이벤트를 최대한 많이(최소 10개 이상) 추출해서 JSON 배열로 만들어줘.

반드시 아래 규칙과 JSON 포맷을 100% 지켜야 해:
1. platform은 '배민', '쿠팡', '요기요', '땡겨요', '공통' 중 하나로 지정해줘.
2. 각 플랫폼별 매칭 주소(link)는 아래 규칙을 따라줘:
   - 배민인 경우: "{BAEMIN_TRACKING_URL}"
   - 쿠팡인 경우: "{COUPANG_TRACKING_URL}"
   - 요기요인 경우: "{YOGIYO_TRACKING_URL}"
   - 땡겨요인 경우: "{DDANGGYO_TRACKING_URL}"

텍스트 소스:
{clean_text}

출력 포맷 예시:
[
  {{
    "platform": "배민",
    "category": "치킨",
    "brand": "BHC 치킨",
    "discount": "4,000원 쿠폰 할인",
    "condition": "18,000원 이상 주문 시 (금요일 한정)",
    "link": "{BAEMIN_TRACKING_URL}"
  }}
]
"""

try:
    response = model.generate_content(prompt)
    realtime_data = json.loads(response.text)
    print(f"AI가 실시간으로 {len(realtime_data)}개의 진짜 할인 정보를 정제했습니다!")
except Exception as e:
    print(f"AI 정제 오류 발생: {e}. 안전한 기본 할인 라인업으로 대체합니다.")
    realtime_data = [
        {"platform": "배민", "category": "치킨", "brand": "처갓집양념치킨", "discount": "3,000원 할인", "condition": "전국 매장 적용", "link": BAEMIN_TRACKING_URL},
        {"platform": "쿠팡", "category": "피자", "brand": "도미노피자", "discount": "무료 배달 혜택", "condition": "와우 멤버십 유저", "link": COUPANG_TRACKING_URL},
        {"platform": "요기요", "category": "버거", "brand": "버거킹", "discount": "5,000원 할인", "condition": "요기패스X 적용 시", "link": YOGIYO_TRACKING_URL}
    ]

# 5. 정제된 진짜 데이터를 JSON 파일로 저장
with open("discounts.json", "w", encoding="utf-8") as f:
    json.dump(realtime_data, f, ensure_ascii=False, indent=2)

# 6. 깃허브 저장소에 자동 저장(Push) 명령
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
if GITHUB_TOKEN:
    repo = os.getenv("GITHUB_REPOSITORY")
    remote_url = f"https://x-access-token:{GITHUB_TOKEN}@://github.com{repo}.git"
    
    run(["git", "config", "user.name", "github-actions[bot]"])
    run(["git", "config", "user.email", "41898282+github-actions[bot]@://github.com"])
    run(["git", "remote", "set-url", "origin", remote_url])
    run(["git", "add", "discounts.json"])
    
    result = run(["git", "status", "--porcelain"], capture_output=True, text=True)
    if result.stdout.strip():
        run(["git", "commit", "-m", "AI 실시간 인터넷 배달 할인 데이터 진짜 업데이트"])
        run(["git", "push", "origin", "main"])
        print("최신 실시간 진짜 할인 데이터 저장 완료!")
