import os
import json
import google.generativeai as genai
from subprocess import run

# 1. 구글 AI 스튜디오 제미나이 키 설정
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_KEY:
    print("구글 제미나이 API 키가 등록되지 않았습니다.")
    exit(1)

genai.configure(api_key=GEMINI_KEY)

# 2. 임시 주소 설정 (추후 대표님의 파트너스/링크프라이스 주소로 교체하는 자리)
COUPANG_TRACKING_URL = "https://coupang.com"
BAEMIN_TRACKING_URL = "#"

# 3. 임시 실시간 샘플 데이터 생성 (깃허브 연동 보안 테스트용)
# 깃허브 보안 권한이 완벽히 뚫리면 이 데이터가 버셀 웹사이트에 즉시 반영됩니다.
realtime_sample_data = [
    {
        "platform": "배민",
        "category": "치킨",
        "brand": "처갓집 양념치킨 (실시간)",
        "discount": "4,500원 할인",
        "condition": "17,000원 이상 주문 시",
        "link": BAEMIN_TRACKING_URL
    },
    {
        "platform": "쿠팡",
        "category": "피자",
        "brand": "도미노피자 (실시간)",
        "discount": "무료 배달 + 3,000원",
        "condition": "와우 멤버십 전용 혜택",
        "link": COUPANG_TRACKING_URL
    }
]

# 4. 정제된 데이터를 JSON 파일로 저장
with open("discounts.json", "w", encoding="utf-8") as f:
    json.dump(realtime_sample_data, f, ensure_ascii=False, indent=2)

print("할인 데이터 수집 및 JSON 파일 생성 완료!")

# 5. [🌟 에러 해결 핵심] 보안 토큰을 활용한 깃허브 자동 저장(Push) 명령
# 이 코드가 들어가야 깃허브가 128 에러를 내지 않고 문을 열어줍니다.
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
if GITHUB_TOKEN:
    repo = os.getenv("GITHUB_REPOSITORY")
    remote_url = f"https://x-access-token:{GITHUB_TOKEN}@://github.com{repo}.git"
    
    run(["git", "config", "user.name", "github-actions[bot]"])
    run(["git", "config", "user.email", "41898282+github-actions[bot]@://github.com"])
    run(["git", "remote", "set-url", "origin", remote_url])
    run(["git", "add", "discounts.json"])
    
    # 변경 사항이 있을 때만 저장
    result = run(["git", "status", "--porcelain"], capture_output=True, text=True)
    if result.stdout.strip():
        run(["git", "commit", "-m", "AI 실시간 배달 할인 데이터 자동 업데이트"])
        run(["git", "push", "origin", "main"])
        print("깃허브 저장소에 최신 할인 데이터 업데이트 완료!")
    else:
        print("변경된 할인 데이터가 없어 저장을 건너뜁니다.")
else:
    print("GITHUB_TOKEN이 없어 자동 저장을 진행하지 않습니다.")
