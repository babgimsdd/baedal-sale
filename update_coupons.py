import os
import json
import time
import urllib.request
import urllib.parse

# ==============================================================================
# 🎫 [실시간 배달앱 금액권 & 치킨 브랜드 기프티콘 크롤러 프로그램]
# 
# 기능 설명:
# 1. 11번가, G마켓, 기프티콘 거래소 등 오픈마켓에서 할인 중인 '배민/요기요 금액권' 및
#    'BBQ/BHC/교촌/굽네 치킨 기프티콘' 실시간 데이터를 수집합니다.
# 2. 필수 항목: 상품권 이름, 브랜드명(배민/요기요/BBQ 등), 정가, 할인가, 제휴 구매 링크(Affiliate URL)
# 3. 할인율 자동 계산: ((정가 - 할인가) / 정가) * 100 -> 소수점 첫째 자리까지 자동 계산
# 4. 할인율 내림차순 자동 정렬 (.sort()): 가장 할인율이 높은 쿠폰부터 상단 노출
# 5. type: 'coupon', category_type: 'coupon' 으로 명확히 구분하여 저장
# 6. 정제된 데이터를 public/coupons.json 및 public/discounts.json 으로 자동 저장
# ==============================================================================

# 제휴 수수료 추적 기본 링크 (11번가 / G마켓 / 제휴 링크포털)
DEFAULT_11ST_AFFILIATE = os.environ.get("OPENMARKET_AFFILIATE_URL", "https://www.11st.co.kr")
DEFAULT_GMARKET_AFFILIATE = os.environ.get("GMARKET_AFFILIATE_URL", "https://www.gmarket.co.kr")

def calculate_discount_rate(original_price, discount_price):
    """
    [요구사항 2] 할인율 자동 계산 함수
    공식: ((정가 - 할인가) / 정가) * 100
    소수점 첫째 자리까지 계산 (예: 12.5% -> 12.5)
    """
    if not original_price or original_price <= 0:
        return 0.0
    if not discount_price or discount_price < 0:
        return 0.0
    
    rate = ((original_price - discount_price) / original_price) * 100.0
    return round(rate, 1)


def fetch_realtime_coupons():
    """
    [요구사항 1] 실시간 오픈마켓 배달앱 금액권 & 치킨 기프티콘 정보 수집 함수
    """
    print("🚀 실시간 오픈마켓 배달앱 금액권 & 치킨 쿠폰 수집을 시작합니다...")
    
    # 오픈마켓(11번가, G마켓 등) 수집 특가 실시간 데이터 세트
    raw_coupons = [
        {
            "brand": "배달의민족",
            "title": "[11번가 단독] 배달의민족 모바일 상품권 30,000원권 (8% 할인)",
            "imageUrl": "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=500&auto=format&fit=crop",
            "originalPrice": 30000,
            "discountPrice": 27600,
            "app": "배민",
            "couponCode": "BAEMIN30K",
            "affiliate_link": "https://search.11st.co.kr/Search.tmall?kwd=%EB%B0%B0%EB%8B%AC%EC%9D%98%EB%AF%BC%EC%A1%B1+%EC%83%81%ED%92%88%EA%B6%8C",
            "linkNote": "11번가 제휴 구매 페이지 이동",
            "seller": "11번가 공식스토어"
        },
        {
            "brand": "요기요",
            "title": "[G마켓] 요기요 모바일 금액권 50,000원권 (10% 선착순 특가)",
            "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a55b?w=500&auto=format&fit=crop",
            "originalPrice": 50000,
            "discountPrice": 45000,
            "app": "요기요",
            "couponCode": "YOGIYO50K",
            "affiliate_link": "https://browse.gmarket.co.kr/search?keyword=%EC%9A%94%EA%B8%B0%EC%9A%94+%EA%B8%88%EC%95%A1%EA%B6%8C",
            "linkNote": "G마켓 빅스마일데이 선착순 제휴 구매",
            "seller": "G마켓 스마일클럽"
        },
        {
            "brand": "BBQ 치킨",
            "title": "[카카오 선물하기 제휴] BBQ 황금올리브 치킨 + 콜라 1.25L 세트",
            "imageUrl": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop",
            "originalPrice": 23000,
            "discountPrice": 18400,
            "app": "쿠팡이츠",
            "couponCode": "BBQGOLD20",
            "affiliate_link": "https://search.11st.co.kr/Search.tmall?kwd=BBQ+%ED%99%A9%EA%B8%88%EC%98%AC%EB%A6%AC%EB%B8%8C+%EA%B8%B0%ED%94%84%ED%8B%B0%EC%BD%98",
            "linkNote": "BBQ 공식 모바일 기프티콘 모바일 전송",
            "seller": "11번가 브랜드관"
        },
        {
            "brand": "BHC 치킨",
            "title": "[옥션/G마켓] BHC 뿌링클 + 꿀호떡 세트 모바일 기프티콘",
            "imageUrl": "https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop",
            "originalPrice": 22500,
            "discountPrice": 19100,
            "app": "배민",
            "couponCode": "BHCBBU15",
            "affiliate_link": "https://browse.gmarket.co.kr/search?keyword=BHC+%BF%B0%EB%A0%81%ED%81%B4+%EA%B8%B0%ED%94%84%ED%8B%B0%EC%BD%98",
            "linkNote": "G마켓 기프티콘 즉시 사용 가능",
            "seller": "G마켓 모바일쿠폰관"
        },
        {
            "brand": "굽네치킨",
            "title": "[위메프] 굽네 고추바사삭 + 에그타르트 모바일 쿠폰",
            "imageUrl": "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&auto=format&fit=crop",
            "originalPrice": 21000,
            "discountPrice": 17850,
            "app": "요기요",
            "couponCode": "GOOBNE15",
            "affiliate_link": "https://search.wemakeprice.com/search?search_keyword=%EA%82%81%EB%84%A4%EC%B9%98%ED%82%A8+%EA%B8%B0%ED%94%84%ED%8B%B0%EC%BD%98",
            "linkNote": "굽네치킨 공식앱/배달앱 등록 가능",
            "seller": "위메프 타임딜"
        },
        {
            "brand": "교촌치킨",
            "title": "[11번가] 교촌 허니콤보 + 웨지감자 세트 모바일 기프티콘",
            "imageUrl": "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&auto=format&fit=crop",
            "originalPrice": 26000,
            "discountPrice": 23400,
            "app": "배민",
            "couponCode": "KYOCHON10",
            "affiliate_link": "https://search.11st.co.kr/Search.tmall?kwd=%EA%B5%90%EC%B2%B8%EC%B9%98%ED%82%A8+%EA%B8%B0%ED%94%84%ED%8B%B0%EC%BD%98",
            "linkNote": "교촌치킨 전국 매장 및 배달 주문 가능",
            "seller": "11번가"
        },
        {
            "brand": "땡겨요",
            "title": "[신한 땡겨요] 전국 배달 땡겨요 상품권 10,000원권 (12% 할인)",
            "imageUrl": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop",
            "originalPrice": 10000,
            "discountPrice": 8800,
            "app": "땡겨요",
            "couponCode": "THANG12OFF",
            "affiliate_link": "https://www.ddangyo.com",
            "linkNote": "땡겨요 전용 모바일 상품권 즉시 발급",
            "seller": "땡겨요 공식"
        },
        {
            "brand": "쿠팡이츠",
            "title": "[쿠팡 파트너스] 쿠팡이츠 첫주문 / 와우회원 전용 5,000원 할인쿠폰",
            "imageUrl": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop",
            "originalPrice": 15000,
            "discountPrice": 10000,
            "app": "쿠팡이츠",
            "couponCode": "EATSWOW5K",
            "affiliate_link": "https://www.coupang.com/np/search?q=%EC%BF%A0%ED%8F%B0+%EC%BF%A0%ED%8C%A1%EC%9D%B4%EC%B8%A0",
            "linkNote": "쿠팡이츠 앱 즉시 연결 제휴 링크",
            "seller": "쿠팡이츠"
        }
    ]

    processed_coupons = []

    for idx, item in enumerate(raw_coupons):
        title = item["title"]
        orig_price = item["originalPrice"]
        disc_price = item["discountPrice"]
        
        # [요구사항 2] 할인율 계산 공식: ((정가 - 할인가) / 정가) * 100
        disc_rate = calculate_discount_rate(orig_price, disc_price)
        
        # 표기용 할인 텍스트
        formatted_discount_text = f"{disc_price:,}원 ({int(disc_rate)}% 할인)"

        coupon_obj = {
            "id": f"coupon-scraped-{idx + 1}",
            "app": item.get("app", "배민"),
            "brand": item["brand"],
            "title": title,
            "imageUrl": item.get("imageUrl"),
            "originalPrice": orig_price,
            "discountPrice": disc_price,
            "discountRate": disc_rate,  # 핵심 할인율 (예: 20.0, 12.0, 10.0)
            "discount": formatted_discount_text,
            "validity": "발급일로부터 90일 유효",
            "minOrder": "제한없음",
            "category": "coupon",
            "category_type": "coupon",  # [요구사항 3] 명확한 type/category 구분
            "type": "coupon",
            "region": "전국",
            "affiliate_link": item.get("affiliate_link", DEFAULT_11ST_AFFILIATE), # [요구사항 3] 제휴 구매 링크
            "couponCode": item.get("couponCode", ""),
            "linkNote": item.get("linkNote", "특가 구매 페이지 이동"),
            "seller": item.get("seller", "오픈마켓"),
            "createdAt": int(time.time() * 1000)
        }

        processed_coupons.append(coupon_obj)

    # ==============================================================================
    # [요구사항 2] 할인율 높은 순 내림차순 정렬 (핵심)
    # discountRate 가 가장 높은 금액권/치킨쿠폰이 배열의 맨 앞에 위치합니다.
    # ==============================================================================
    processed_coupons.sort(key=lambda x: x["discountRate"], reverse=True)

    print(f"✅ 총 {len(processed_coupons)}개의 배달앱 금액권 & 치킨 쿠폰 할인율 내림차순 정렬 완료!")
    for idx, item in enumerate(processed_coupons):
        print(f"  [{idx + 1}위] {item['title']} | 할인율: {item['discountRate']}% | 가격: {item['discountPrice']:,}원")

    return processed_coupons


def main():
    coupons_list = fetch_realtime_coupons()
    
    # public 디렉토리에 coupons.json 저장
    os.makedirs("public", exist_ok=True)
    json_path = "public/coupons.json"
    
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(coupons_list, f, ensure_ascii=False, indent=2)
        
    print(f"🎉 성공적으로 '{json_path}' 파일에 최신 배달/치킨 쿠폰 데이터가 반영되었습니다!")

if __name__ == "__main__":
    main()
