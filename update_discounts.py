import os
import json
import time
import requests
from bs4 import BeautifulSoup
from google import genai
from google.genai import types

# ==============================================================================
# 💰 [제휴 마케팅 / 파트너스 수익 링크 설정 (Affiliate Tracking Configuration)]
# 본인이 발급받은 쿠팡 파트너스 및 배달앱 추천/수익용 단축 링크(URL)를 입력하세요.
# 깃허브 시크릿(Secrets)으로 등록하거나, 아래 URL 변수를 직접 수정하시면 자동 반영됩니다.
# ==============================================================================
COUPANG_EATS_TRACKING_URL = os.environ.get("COUPANG_EATS_AFFILIATE_URL", "https://link.coupang.com/a/sample_eats")
BAEMIN_TRACKING_URL = os.environ.get("BAEMIN_AFFILIATE_URL", "https://m.baemin.com")
YOGIYO_TRACKING_URL = os.environ.get("YOGIYO_AFFILIATE_URL", "https://www.yogiyo.co.kr")
DDANGYO_TRACKING_URL = os.environ.get("DDANGYO_AFFILIATE_URL", "https://www.ddangyo.com")
DOEAT_TRACKING_URL = os.environ.get("DOEAT_AFFILIATE_URL", "https://doeat.io")
SPECIAL_DELIVERY_TRACKING_URL = os.environ.get("SPECIAL_DELIVERY_AFFILIATE_URL", "https://www.specialdelivery.or.kr")
DAAGURO_TRACKING_URL = os.environ.get("DAAGURO_AFFILIATE_URL", "https://daaguro.com")
MUKKAEBI_TRACKING_URL = os.environ.get("MUKKAEBI_AFFILIATE_URL", "https://www.mukkebi.com")
DONGBAEK_TRACKING_URL = os.environ.get("DONGBAEK_AFFILIATE_URL", "https://www.dongbaektong.com")

AFFILIATE_CONFIG = {
    "쿠팡이츠": COUPANG_EATS_TRACKING_URL,
    "배민": BAEMIN_TRACKING_URL,
    "요기요": YOGIYO_TRACKING_URL,
    "땡겨요": DDANGYO_TRACKING_URL,
    "두잇": DOEAT_TRACKING_URL,
    "배달특급": SPECIAL_DELIVERY_TRACKING_URL,
    "대구로": DAAGURO_TRACKING_URL,
    "먹깨비": MUKKAEBI_TRACKING_URL,
    "동백통": DONGBAEK_TRACKING_URL,
}

def fetch_delivery_deals_text():
    """
    공개된 할인 정보 커뮤니티 및 핫딜 페이지의 텍스트를 합법적으로 수집합니다.
    (배달 앱 본사 서버 직접 크롤링이 아닌 공개 정보 공유 텍스트 기반)
    """
    urls = [
        "https://m.ppomppu.co.kr/new/bbs_list.php?id=ppomppu", # 공개 핫딜 게시판
    ]
    
    collected_texts = []
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    for url in urls:
        try:
            res = requests.get(url, headers=headers, timeout=10)
            if res.status_code == 200:
                soup = BeautifulSoup(res.text, "html.parser")
                lines = soup.get_text().split("\n")
                filtered = [
                    l.strip() for l in lines 
                    if any(k in l for k in ["배달", "배민", "요기요", "쿠팡이츠", "땡겨요", "먹깨비", "두잇", "배달특급", "대구로", "동백통", "치킨", "피자", "버거", "할인", "쿠폰"])
                    and len(l.strip()) > 5
                ]
                collected_texts.extend(filtered[:40])
        except Exception as e:
            print(f"웹 수집 중 참고 오류 (대체 시드 데이터 사용): {e}")

    # 기본 수집 데이터 (전국 공통 및 지역 특화 앱 핫딜 정보 예시)
    default_text = """
    [전국 공통 앱 핫딜]
    [배민] BBQ 황금올리브 치킨 4,000원 브랜드관 쿠폰팩 할인 (18,000원 이상, 신한카드 2,000원 추가 할인)
    [쿠팡이츠] 맘스터치 싸이버거 세트 3,000원 즉시 할인 (15,000원 이상, 카카오페이 1,000원 할인, 와우회원 중복)
    [요기요] 도미노피자 포장 주문 7,000원 할인 (요기패스 추가 2,000원 할인)
    [땡겨요] 처갓집양념치킨 5,000원 첫주문 할인 쿠폰 (15,000원 이상 주문 시)
    [먹깨비] 공차 타피오카 밀크티 3,000원 신규쿠폰 할인
    
    [지역 특화 앱 핫딜]
    [두잇] 관악/구로 지역 한정 굽네치킨 5,000원 팀배달 무료배송 할인
    [배달특급] 경기도 지역 화성/수원 수제버거 4,000원 지역화폐 차이 추가할인
    [대구로] 대구광역시 대구로 수성구 족발 5,000원 첫주문 쿠폰
    [동백통] 부산광역시 동백전 연계 부산진구 밀면 3,000원 할인
    """
    
    full_content = "\n".join(collected_texts) + "\n" + default_text
    return full_content[:4000]

def process_with_gemini(raw_text):
    """
    Gemini 2.5 Flash API를 활용하여 텍스트를 프론트엔드 규격 JSON으로 정제합니다.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("CRITICAL: GEMINI_API_KEY 환경변수가 설정되지 않았습니다.")
        return None

    client = genai.Client(api_key=api_key)

    prompt = f"""
다음은 인터넷에서 수집된 전국 공통 및 지역 특화 배달 앱 할인 정보 원문입니다.
이 텍스트를 분석하여 최신 배달 할인 목록 8~12개를 규격화된 JSON 배열로 생성해 주세요.

[앱 구분 규칙]:
- app 필드는 다음 중 정확히 하나를 선택해야 합니다:
  1) 전국 공통 앱: "배민", "쿠팡이츠", "요기요", "땡겨요", "먹깨비"
  2) 지역 특화 앱: "두잇", "배달특급", "대구로", "동백통"

[요구사항 JSON 항목 규격]:
- id: 문자열 ID (예: "1", "2")
- app: "배민", "쿠팡이츠", "요기요", "땡겨요", "먹깨비", "두잇", "배달특급", "대구로", "동백통" 중 선택
- brand: 브랜드명 및 매장지점명 (예: BBQ 치킨 관악점, 맘스터치, 도미노피자, 굽네치킨 신림점 등)
- brand_id: 영문 소문자 식별자 (예: bbq, momstouch, domino, goobne 등)
- discount: 할인 내용 (예: "4,000원 할인", "무료배달 + 3,000원 쿠폰")
- validity: 유효기간 (예: "오늘 하루만 유효", "2026.07.24 ~ 07.27")
- minOrder: 최소주문금액 (예: "18,000원 이상 주문 시")
- category: "치킨", "피자", "버거", "분식/야식", "카페/디저트", "한식/기타" 중 하나
- region: 적용 지역 (예: "전국", "서울 관악구", "경기 성남시", "대구 수성구", "부산 부산진구")
- card_discount: 카드/결제 추가 할인 (없으면 "없음")
- affiliate_link: 브랜드 공식 앱/웹 주문 주소 또는 제휴 딥링크
- is_top_ranked: 할인 혜택이 가장 뛰어난 상위 3개 항목만 true, 나머지 false
- couponCode: 쿠폰코드 (없으면 빈 문자열 "")
- linkNote: 혜택 관련 꿀팁 설명 (예: "리뷰이벤트 치즈볼 증정 / 포장 2,000원 추가할인")
- createdAt: 현재 타임스탬프 밀리초 (숫자)

[수집된 원문 텍스트]:
{raw_text}
"""

    models_to_try = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]
    response = None
    for model_name in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2,
                )
            )
            if response and response.text:
                break
        except Exception as err:
            print(f"모델 {model_name} 호출 실패, 다음 모델로 시도합니다: {err}")

    if not response or not response.text:
        print("Gemini API 모든 모델 호출 실패")
        return None

    try:
        data = json.loads(response.text)
        
        # timestamp 및 어필리에이트 제휴 링크 보정
        current_ms = int(time.time() * 1000)
        for idx, item in enumerate(data):
            if "id" not in item:
                item["id"] = str(idx + 1)
            item["createdAt"] = current_ms
            
            # app 필드 표준화 보정 (배달의민족 -> 배민)
            app_name = item.get("app", "배민")
            if app_name == "배달의민족":
                app_name = "배민"
                item["app"] = "배민"

            # 어필리에이트/파스너스 수익 추적 링크 자동 주입
            if app_name in AFFILIATE_CONFIG and AFFILIATE_CONFIG[app_name]:
                item["affiliate_link"] = AFFILIATE_CONFIG[app_name]

        return data
    except Exception as e:
        print(f"Gemini API 처리 중 오류 발생: {e}")
        return None

def generate_blog_post_with_gemini(refined_data):
    """
    수집된 핫딜 데이터를 기반으로 네이버/티스토리 블로그 포스팅용 친절한 자동 마케팅 원고를 생성합니다.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    site_url = os.environ.get("VERCEL_SITE_URL", "https://your-app.vercel.app")
    if not api_key or not refined_data:
        return None, None

    client = genai.Client(api_key=api_key)
    today_str = time.strftime("%Y년 %m월 %d일", time.localtime())

    prompt = f"""
당신은 대한민국 최고의 배달 핫딜 정보 전문 블로거입니다.
아래 정리된 최신 배달 할인 JSON 데이터를 바탕으로 네이버 블로그에 포스팅할 매력적이고 읽기 쉬운 원고를 작성해 주세요.

[포스팅 규칙]:
1. 제목: "[오늘의 배달 할인] {today_str} 우리 동네 배달앱 혜택/무료배달 총정리 (배민, 쿠팡, 요기요, 땡겨요)"
2. 본문 톤앤매너:
   - 친절하고 위트 있는 블로그 이웃 말투 (~해요, ~입니다, ~ 놓치지 마세요!)
   - 가독성을 위해 적절한 이모지와 줄바꿈 사용
3. 필수 포함 내용:
   - 오늘 할인 폭이 가장 큰 TOP 3 혜택 추천 (브랜드, 할인 금액, 적용 조건)
   - 주요 전국 공통 배달앱(배민, 쿠팡이츠, 요기요, 땡겨요)과 지역 특화 배달앱(두잇, 배달특급 등) 혜택 요약
   - 리뷰 이벤트, 포장 할인, 카드사 추가 할인 꿀팁 언급
4. 본문 맨 마지막 문단:
   - 다음 링크를 반드시 그대로 포함해 주세요:
     "👉 우리 동네 실시간 배달 할인 정보 1초 만에 확인하기: {site_url}"

[오늘의 배달 할인 데이터 JSON]:
{json.dumps(refined_data, ensure_ascii=False, indent=2)}
"""

    models_to_try = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]
    response = None
    for model_name in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.7,
                )
            )
            if response and response.text:
                break
        except Exception as err:
            print(f"블로그 마케팅 모델 {model_name} 호출 실패: {err}")

    if not response or not response.text:
        return None, None

    try:
        blog_content = response.text
        blog_title = f"[오늘의 배달 할인] {today_str} 우리 동네 배달앱 혜택/무료배달 총정리"
        return blog_title, blog_content
    except Exception as e:
        print(f"블로그 포스팅 생성 중 오류 발생: {e}")
        return None, None

def publish_to_naver_blog(title, content):
    """
    네이버 블로그 Open API (또는 Webhook) 환경변수가 설정되어 있는 경우 자동으로 블로그에 포스팅을 발행합니다.
    """
    client_id = os.environ.get("NAVER_CLIENT_ID")
    client_secret = os.environ.get("NAVER_CLIENT_SECRET")
    blog_id = os.environ.get("NAVER_BLOG_ID")

    if not client_id or not client_secret or not blog_id:
        print("💡 [참고] 네이버 블로그 API 변수가 설정되지 않아, blog_post.txt 에 원고만 자동 저장합니다.")
        return False

    url = f"https://openapi.naver.com/v1/blog/writePost.json"
    headers = {
        "X-Naver-Client-Id": client_id,
        "X-Naver-Client-Secret": client_secret,
    }
    data = {
        "title": title,
        "contents": content
    }

    try:
        res = requests.post(url, headers=headers, data=data, timeout=10)
        if res.status_code == 200:
            print("🚀 [성공] 네이버 블로그에 포스팅이 자동 발행되었습니다!")
            return True
        else:
            print(f"네이버 블로그 자동 발행 응답: {res.status_code} - {res.text}")
            return False
    except Exception as e:
        print(f"네이버 블로그 자동 발행 중 오류: {e}")
        return False

def evaluate_notification_triggers(refined_data):
    """
    [직관적 2가지 절대 알림 조건]:
    1. 평소 가격보다 무조건 결제 금액이 싸지는 경우 (할인 쿠폰 또는 타임 세일 혜택)
    2. 배달비가 0원이 되는 경우 (무료 배달 혜택)

    찜한 카테고리별로 위 2가지 조건 중 하나라도 만족하는 핫딜 목록을 자동 매칭하여 알림 메시지를 구성합니다.
    """
    categories = ["치킨", "피자", "버거", "분식/야식", "카페/디저트", "한식/기타"]
    notifications = []

    for cat in categories:
        cat_deals = [item for item in refined_data if item.get("category") == cat]
        matching_deals = []
        for deal in cat_deals:
            disc_text = deal.get("discount", "")
            link_note = deal.get("linkNote", "")
            # 조건 1: 할인 금액/쿠폰 적용 (예: ~원 할인) OR 조건 2: 무료배달 적용
            has_discount = "할인" in disc_text or "쿠폰" in disc_text
            has_free_delivery = "무료배달" in disc_text or "무료 배달" in disc_text or "무료배송" in disc_text or "무료배달" in link_note
            
            if has_discount or has_free_delivery:
                matching_deals.append(deal)

        if matching_deals:
            top_deal = matching_deals[0]
            brand_name = top_deal.get("brand", cat)
            disc_summary = top_deal.get("discount", "특가 혜택")
            msg = f"🔔 [알림] 지금 찜하신 '{cat}' 카테고리에 혜택이 떴어요!\n👉 {brand_name}: {disc_summary}\n지금 늦기 전에 확인하세요!"
            notifications.append({
                "category": cat,
                "triggered": True,
                "matchedCount": len(matching_deals),
                "sampleBrand": brand_name,
                "message": msg
            })

    return notifications

def generate_seo_files(site_url, refined_data):
    """
    검색엔진(구글, 네이버, 다음)이 자동으로 내 사이트의 최신 배달 할인 정보를 긁어가도록
    robots.txt, sitemap.xml, rss.xml 을 자동 생성합니다.
    """
    os.makedirs("public", exist_ok=True)
    
    # 1. robots.txt 생성
    robots_txt = f"""User-agent: *
Allow: /
Sitemap: {site_url}/sitemap.xml
"""
    with open("public/robots.txt", "w", encoding="utf-8") as f:
        f.write(robots_txt)

    # 2. sitemap.xml 생성
    now_iso = time.strftime("%Y-%m-%dT%H:%M:%S+09:00", time.localtime())
    sitemap_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>{site_url}/</loc>
    <lastmod>{now_iso}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
"""
    with open("public/sitemap.xml", "w", encoding="utf-8") as f:
        f.write(sitemap_xml)

    # 3. rss.xml 자동 피드 생성 (네이버 뷰 / 구글 소식지 / RSS 리더 크롤링용)
    rss_items = ""
    for item in refined_data[:10]:
        brand = item.get("brand", "배달할인")
        disc = item.get("discount", "혜택")
        app = item.get("app", "배달앱")
        rss_items += f"""    <item>
      <title>[{app}] {brand} - {disc}</title>
      <link>{site_url}/</link>
      <description>{app}에서 진행 중인 {brand} {disc} 혜택 정보입니다.</description>
      <pubDate>{time.strftime("%a, %d %b %Y %H:%M:%S +0900", time.localtime())}</pubDate>
      <guid>{site_url}/#deal-{item.get("id", "0")}</guid>
    </item>
"""
    rss_xml = f"""<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>오늘의 배달 할인 나침반</title>
    <link>{site_url}</link>
    <description>실시간 배민, 쿠팡이츠, 요기요, 땡겨요, 두잇 할인 배달비 0원 정보</description>
    <language>ko-KR</language>
{rss_items}  </channel>
</rss>
"""
    with open("public/rss.xml", "w", encoding="utf-8") as f:
        f.write(rss_xml)

    print("   - SEO 자동 노출용 robots.txt, sitemap.xml, rss.xml 생성 완료!")

def main():
    print("1. 핫딜 배달 정보 수집 및 텍스트 파싱...")
    raw_text = fetch_delivery_deals_text()
    
    print("2. Gemini AI 모델로 전국/지역 배달앱 JSON 데이터 변환 중...")
    refined_data = process_with_gemini(raw_text)
    
    if refined_data:
        os.makedirs("public/data", exist_ok=True)
        with open("public/discounts.json", "w", encoding="utf-8") as f:
            json.dump(refined_data, f, ensure_ascii=False, indent=2)
        with open("public/data/discounts.json", "w", encoding="utf-8") as f:
            json.dump(refined_data, f, ensure_ascii=False, indent=2)
        print(f"3. 성공! 총 {len(refined_data)}개 핫딜 항목이 public/discounts.json 및 public/data/discounts.json 에 업데이트되었습니다.")

        site_url = os.environ.get("VERCEL_SITE_URL", "https://vercel.app")
        generate_seo_files(site_url, refined_data)

        # 2가지 조건 기반 푸시 알림 평가
        notifs = evaluate_notification_triggers(refined_data)
        with open("public/notifications_payload.json", "w", encoding="utf-8") as f:
            json.dump(notifs, f, ensure_ascii=False, indent=2)
        print(f"   - 직관적 알림 조건 평가 완료 ({len(notifs)}개 카테고리 알림 발송 조건 충족)")

        # 마케팅 자동화: 블로그 포스팅 원고 생성 및 자동 발행
        print("4. 📣 AI 자동 마케팅: 블로그 포스팅 원고 작성 중...")
        title, blog_content = generate_blog_post_with_gemini(refined_data)
        if title and blog_content:
            with open("public/daily_blog_post.txt", "w", encoding="utf-8") as f:
                f.write(f"=== {title} ===\n\n{blog_content}")
            print("   - public/daily_blog_post.txt 에 마케팅 포스팅 저장 완료!")
            
            # 네이버 블로그 API 자동 발행 시도
            publish_to_naver_blog(title, blog_content)
    else:
        print("업데이트 실패 (기존 데이터 유지)")

if __name__ == "__main__":
    main()

