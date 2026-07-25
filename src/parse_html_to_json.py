import json
import re
from bs4 import BeautifulSoup

def parse_html_to_discount_json(html_content: str):
    """
    복사한 핫딜/할인 게시글 HTML 텍스트에서 배달 할인 정보를 추출하여
    웹사이트 UI 호환 JSON 구조로 변환하는 스크립트입니다.
    """
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # HTML 내 텍스트 전체 추출
    text = soup.get_text(separator="\n", strip=True)
    
    items = []
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    # 주요 플랫폼 키워드
    platforms = ["배달의민족", "요기요", "쿠팡이츠", "땡겨요", "위메프오"]
    categories = ["치킨", "피자", "버거", "분식/야식", "카페/디저트", "한식/기타"]
    
    current_platform = "배달의민족"
    current_category = "치킨"
    
    for i, line in enumerate(lines):
        # 플랫폼 감지
        for p in platforms:
            if p in line:
                current_platform = p
                break
                
        # 카테고리 감지
        for c in categories:
            if c in line:
                current_category = c
                break
                
        # 할인 문구 감지 (예: "4,000원 할인", "15% 할인")
        if "할인" in line or "원" in line:
            # 브랜드명 추정 (이전 또는 현재 줄)
            brand = "할인 브랜드"
            if i > 0 and len(lines[i-1]) < 20:
                brand = lines[i-1]
            elif len(line) < 30:
                brand = line
                
            brand_id = re.sub(r'[^a-zA-Z0-9]', '', brand.lower()) or "brand"
            
            # 조건 및 카드 할인 추정
            condition = "15,000원 이상 주문 시"
            card_discount = "없음"
            if "카드" in line or "페이" in line:
                card_discount = line
                
            items.append({
                "platform": current_platform,
                "category": current_category,
                "brand": brand,
                "brand_id": brand_id,
                "discount": line if "할인" in line else f"{line} 할인",
                "condition": condition,
                "duration": "오늘 유효",
                "card_discount": card_discount,
                "affiliate_link": "https://m.baemin.com",
                "is_top_ranked": len(items) < 3,
                "couponCode": "",
                "linkNote": "공식 앱 쿠폰 확인"
            })
            
            if len(items) >= 10:
                break
                
    return json.dumps(items, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    sample_html = """
    <div>
        <h2>[배달의민족] BBQ 치킨 4,000원 할인 쿠폰</h2>
        <p>18,000원 이상 주문 시 사용 가능 / 신한카드 2,000원 추가 할인</p>
    </div>
    """
    result_json = parse_html_to_discount_json(sample_html)
    print("=== 변환된 JSON 데이터 ===")
    print(result_json)
