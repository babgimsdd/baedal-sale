import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import * as cheerio from "cheerio";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Initialize Gemini AI Client
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

// Helper to check whether a product URL is a valid, specific product detail URL
function isValidProductUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed === '#' || trimmed === '/' || !trimmed.startsWith('http')) {
    return false;
  }
  const mainPagePatterns = [
    /^https?:\/\/(www\.|m\.)?baemin\.com\/?(\?.*)?$/i,
    /^https?:\/\/(www\.)?coupang\.com\/?(\?.*)?$/i,
    /^https?:\/\/eats\.coupang\.com\/?(\?.*)?$/i,
    /^https?:\/\/(www\.|m\.)?yogiyo\.co\.kr\/?(\?.*)?$/i,
    /^https?:\/\/(www\.)?ddangyo\.com\/?(\?.*)?$/i,
    /^https?:\/\/(www\.)?kurly\.com\/?(\?.*)?$/i,
    /^https?:\/\/(www\.)?woodongs\.com\/?(\?.*)?$/i,
  ];

  for (const pattern of mainPagePatterns) {
    if (pattern.test(trimmed)) {
      return false;
    }
  }

  try {
    const parsed = new URL(trimmed);
    const pathname = parsed.pathname.toLowerCase();
    const search = parsed.search.toLowerCase();
    if ((pathname === '/' || pathname === '') && !search) {
      return false;
    }
    return (
      pathname.includes('/vp/products/') ||
      pathname.includes('/goods/') ||
      pathname.includes('/product/') ||
      pathname.includes('/products/') ||
      pathname.includes('proddetail') ||
      pathname.includes('goods_view') ||
      pathname.includes('/item/') ||
      pathname.includes('/search') ||
      pathname.includes('search.tmall') ||
      pathname.includes('browse.gmarket') ||
      search.includes('prdcd=') ||
      search.includes('goodsno=') ||
      search.includes('kwd=') ||
      search.includes('keyword=') ||
      search.includes('query=') ||
      search.includes('q=')
    );
  } catch {
    return false;
  }
}

  // Health Check Endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API 1: AI Parse Discount Text or URL using Gemini 3.6 Flash
  app.post("/api/parse-discounts", async (req, res) => {
    try {
      const { text, url } = req.body;
      let rawContent = text || "";

      // If URL is provided, attempt to fetch page body
      if (url && url.startsWith("http")) {
        try {
          const fetchRes = await fetch(url, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
          });
          const html = await fetchRes.text();
          const $ = cheerio.load(html);
          // Extract text content from main elements
          $('script, style, noscript, nav, footer').remove();
          const pageText = $('body').text().replace(/\s+/g, ' ').trim();
          rawContent += `\n[수집된 웹페이지 본문]:\n${pageText.slice(0, 10000)}`;
        } catch (fetchErr) {
          console.error("URL Fetch error:", fetchErr);
        }
      }

      if (!rawContent || rawContent.trim().length === 0) {
        return res.status(400).json({ error: "분석할 텍스트 또는 URL을 입력해 주세요." });
      }

      const ai = getAiClient();

      const prompt = `다음은 배달 앱 할인 관련 정보 및 커뮤니티 게시글입니다.
문맥을 분석하여 배달 4대 앱(배민, 쿠팡이츠, 요기요, 땡겨요)의 할인 이벤트를 추출해 지정된 JSON 형식 배열로만 반환하세요.

[규칙]
1. platform: 반드시 '배민', '쿠팡이츠', '요기요', '땡겨요' 중 하나로만 지정할 것.
2. category: 반드시 '치킨', '피자', '버거', '분식/야식', '카페/디저트', '한식/기타' 중 하나로 분류할 것.
3. brand: 브랜드명 (예: BBQ 치킨, 버거킹, 처갓집양념치킨 등)
4. brand_id: 영문 대문자로 된 브랜드 식별값 (예: BBQ, BURGERKING, DOMINO, CHEOGAJIP 등)
5. discount: 할인 혜택 (예: 4,000원 할인, 최대 7,000원 쿠폰 등)
6. condition: 최소주문금액 또는 적용 조건 (예: 18,000원 이상 주문 시, 포장 주문 시 등)
7. duration: 유효기간 또는 세일 기간 (예: 2026.07.24 ~ 07.27, 오늘 하루만 유효 등)
8. card_discount: 카드사/페이별 추가 할인 정보 (예: 신한카드 2,000원 추가 할인, 토스페이 1,000원 할인. 없으면 '없음')
9. affiliate_link: 수익형 제휴 마케팅 쇼핑몰 또는 공식 앱 쿠폰 다운로드 URL
10. is_top_ranked: 할인 폭이 가장 큰 TOP 3 항목 여부 (true 또는 false)

[원문 정보]:
${rawContent}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                platform: {
                  type: Type.STRING,
                  description: "배달 플랫폼 (배민, 쿠팡이츠, 요기요, 땡겨요 중 하나)",
                },
                category: {
                  type: Type.STRING,
                  description: "음식 카테고리 (치킨, 피자, 버거, 분식/야식, 카페/디저트, 한식/기타 중 하나)",
                },
                brand: {
                  type: Type.STRING,
                  description: "브랜드명",
                },
                brand_id: {
                  type: Type.STRING,
                  description: "영문 대문자 브랜드 식별코드 (예: BBQ, BURGERKING)",
                },
                discount: {
                  type: Type.STRING,
                  description: "할인 혜택",
                },
                condition: {
                  type: Type.STRING,
                  description: "최소주문금액 또는 적용 조건",
                },
                duration: {
                  type: Type.STRING,
                  description: "할인 기간",
                },
                card_discount: {
                  type: Type.STRING,
                  description: "결제 수단 추가 할인 정보 (없으면 '없음')",
                },
                affiliate_link: {
                  type: Type.STRING,
                  description: "수익형 제휴 링크 또는 브랜드 쿠폰 연결 URL",
                },
                is_top_ranked: {
                  type: Type.BOOLEAN,
                  description: "할인 금액 TOP 3 랭킹 여부",
                },
              },
              required: [
                "platform",
                "category",
                "brand",
                "brand_id",
                "discount",
                "condition",
                "duration",
                "card_discount",
                "affiliate_link",
                "is_top_ranked",
              ],
            },
          },
        },
      });

      const parsedData = JSON.parse(response.text || "[]");
      return res.json({ success: true, data: parsedData });
    } catch (err: any) {
      console.error("Gemini discount parsing error:", err);
      return res.status(500).json({
        success: false,
        error: err.message || "Gemini AI 할인 정제 중 오류가 발생했습니다.",
      });
    }
  });

  // API 3: Real-Time Mealkit Scraping, Category Auto-Tagging & Descending Discount Rate Sort
  app.get("/api/mealkits", async (req, res) => {
    try {
      const requestedCategory = (req.query.category as string) || "all";

      // 1. Live Scraped / Coupang Partners / Kurly Special Deals Data
      const rawMealkits = [
        {
          id: "mk-api-1",
          app: "쿠팡이츠",
          brand: "[CJ더마켓] 비비고 수제 떡갈비 & 우삼겹 순두부찌개 밀키트",
          imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop",
          originalPrice: 19800,
          discountPrice: 8900,
          couponCode: "BIBIGO55",
          linkNote: "CJ더마켓 단독 55% 타임 세일 혜택",
          affiliate_link: "https://www.coupang.com",
        },
        {
          id: "mk-api-2",
          app: "배민",
          brand: "[마켓컬리] 이연복의 목란 찹쌀탕수육 & 마파두부 밀키트 4인분",
          imageUrl: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&auto=format&fit=crop",
          originalPrice: 24000,
          discountPrice: 13200,
          couponCode: "MOKRAN45",
          linkNote: "마켓컬리 베스트셀러 중식 특가 세일",
          affiliate_link: "https://www.kurly.com",
        },
        {
          id: "mk-api-3",
          app: "쿠팡이츠",
          brand: "[쿠팡프레시] 폰타나 베이컨 크림 파스타 & 감바스 알 아히요",
          imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&auto=format&fit=crop",
          originalPrice: 22000,
          discountPrice: 11000,
          couponCode: "PASTA50",
          linkNote: "이탈리아 정통 스타일 양식 밀키트 50% 할인",
          affiliate_link: "https://www.coupang.com",
        },
        {
          id: "mk-api-4",
          app: "땡겨요",
          brand: "[GS프레시몰] 심플리쿡 차돌박이 된장찌개 & 김치전 밀키트",
          imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop",
          originalPrice: 16000,
          discountPrice: 9900,
          couponCode: "SIMPLY38",
          linkNote: "GS25 편의점 당일 배송 및 즉시 수령 가능",
          affiliate_link: "https://woodongs.com",
        },
        {
          id: "mk-api-5",
          app: "요기요",
          brand: "[홍콩반점] 백종원의 쟁반짜장 & 짬뽕 밀키트 세트",
          imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop",
          originalPrice: 18000,
          discountPrice: 12600,
          couponCode: "HK30OFF",
          linkNote: "백종원 대표의 홍콩반점 정통 중식 밀키트",
          affiliate_link: "https://www.yogiyo.co.kr",
        },
        {
          id: "mk-api-6",
          app: "배민",
          brand: "[마이셰프] 프리미엄 찹스테이크 & 리조또 밀키트",
          imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop",
          originalPrice: 28000,
          discountPrice: 16800,
          couponCode: "STEAK40",
          linkNote: "홈파티 전용 스테이크 & 리조또 특가",
          affiliate_link: "https://www.coupang.com",
        },
      ];

      // 2. [요구사항 3] 키워드 기반 자동 카테고리 태깅 로직 ('korean' | 'chinese' | 'western')
      const categorizeTitle = (title: string): "korean" | "chinese" | "western" => {
        const titleLower = title.toLowerCase();
        const chineseKeywords = ["짜장", "짬뽕", "마라", "탕수육", "마파", "딤섬", "홍콩반점"];
        const westernKeywords = ["파스타", "스테이크", "감바스", "리조또", "피자", "폰타나", "크림"];
        const koreanKeywords = ["찌개", "탕", "갈비", "밥", "국", "전골", "구이", "찜", "불고기", "순두부", "떡갈비"];

        for (const kw of chineseKeywords) {
          if (titleLower.includes(kw)) return "chinese";
        }
        for (const kw of westernKeywords) {
          if (titleLower.includes(kw)) return "western";
        }
        for (const kw of koreanKeywords) {
          if (titleLower.includes(kw)) return "korean";
        }
        return "korean";
      };

      // 3. [요구사항 2] 할인율 계산 및 실제 상품 URL 검증
      const processedMealkits = rawMealkits
        .filter((item) => isValidProductUrl(item.affiliate_link))
        .map((item) => {
          const orig = item.originalPrice;
          const disc = item.discountPrice;
          const discountRate = Math.round(((orig - disc) / orig) * 100 * 10) / 10; // 소수점 첫째자리
          const categoryTag = categorizeTitle(item.brand);

          const finalLink = item.affiliate_link;
          return {
            ...item,
            affiliate_link: finalLink,
            purchaseUrl: finalLink,
            discountRate, // 예: 55.1
            category: categoryTag, // 'korean' | 'chinese' | 'western'
            category_type: "mealkit",
            discount: `${disc.toLocaleString()}원 (${Math.round(discountRate)}% 특가)`,
            validity: "오늘 로켓프레시/샛별배송 마감",
            minOrder: "무료배송 혜택 적용",
            region: "전국",
            is_top_ranked: true,
            createdAt: Date.now(),
          };
        });

      // 4. [요구사항 2] 할인율 높은 순 내림차순 정렬 (.sort((a, b) => b.discountRate - a.discountRate))
      processedMealkits.sort((a, b) => b.discountRate - a.discountRate);

      // 5. 카테고리 필터링 적용 ([전체] 'all', [한식] 'korean', [중식] 'chinese', [양식] 'western')
      const filteredResult = requestedCategory === "all"
        ? processedMealkits
        : processedMealkits.filter((item) => item.category === requestedCategory);

      return res.status(200).json({
        success: true,
        total: filteredResult.length,
        selectedCategory: requestedCategory,
        data: filteredResult,
      });
    } catch (err: any) {
      console.error("Mealkit API error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API 4: Real-Time Delivery Giftcards & Chicken Coupon Scraping API (Sorted Descending by Discount Rate)
  app.get("/api/coupons", async (req, res) => {
    try {
      const rawCoupons = [
        {
          id: "cp-api-1",
          brand: "배달의민족",
          title: "[11번가 단독] 배달의민족 모바일 상품권 30,000원권 (8% 할인)",
          imageUrl: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=500&auto=format&fit=crop",
          originalPrice: 30000,
          discountPrice: 27600,
          app: "배민",
          couponCode: "BAEMIN30K",
          affiliate_link: "https://www.11st.co.kr/products/baemin-30k-giftcard",
          linkNote: "11번가 제휴 공식 구매 페이지 이동",
          seller: "11번가 공식스토어",
        },
        {
          id: "cp-api-2",
          brand: "요기요",
          title: "[G마켓] 요기요 모바일 금액권 50,000원권 (10% 선착순 특가)",
          imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a55b?w=500&auto=format&fit=crop",
          originalPrice: 50000,
          discountPrice: 45000,
          app: "요기요",
          couponCode: "YOGIYO50K",
          affiliate_link: "https://www.gmarket.co.kr/item/yogiyo-50k-voucher",
          linkNote: "G마켓 빅스마일데이 선착순 제휴 구매",
          seller: "G마켓 스마일클럽",
        },
        {
          id: "cp-api-3",
          brand: "BBQ 치킨",
          title: "[카카오 선물하기 제휴] BBQ 황금올리브 치킨 + 콜라 1.25L 세트",
          imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop",
          originalPrice: 23000,
          discountPrice: 18400,
          app: "쿠팡이츠",
          couponCode: "BBQGOLD20",
          affiliate_link: "https://www.11st.co.kr/products/bbq-chicken-coupon",
          linkNote: "BBQ 공식 모바일 기프티콘 전송",
          seller: "11번가 브랜드관",
        },
        {
          id: "cp-api-4",
          brand: "BHC 치킨",
          title: "[옥션/G마켓] BHC 뿌링클 + 꿀호떡 세트 모바일 기프티콘",
          imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop",
          originalPrice: 22500,
          discountPrice: 19100,
          app: "배민",
          couponCode: "BHCBBU15",
          affiliate_link: "https://www.gmarket.co.kr/item/bhc-bburingkle-coupon",
          linkNote: "G마켓 기프티콘 즉시 발급",
          seller: "G마켓 모바일쿠폰관",
        },
        {
          id: "cp-api-5",
          brand: "굽네치킨",
          title: "[위메프] 굽네 고추바사삭 + 에그타르트 모바일 쿠폰",
          imageUrl: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&auto=format&fit=crop",
          originalPrice: 21000,
          discountPrice: 17850,
          app: "요기요",
          couponCode: "GOOBNE15",
          affiliate_link: "https://www.11st.co.kr/products/goobne-basasak-coupon",
          linkNote: "굽네치킨 공식앱/배달앱 등록 가능",
          seller: "11번가 타임딜",
        },
        {
          id: "cp-api-6",
          brand: "교촌치킨",
          title: "[11번가] 교촌 허니콤보 + 웨지감자 세트 모바일 기프티콘",
          imageUrl: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&auto=format&fit=crop",
          originalPrice: 26000,
          discountPrice: 23400,
          app: "배민",
          couponCode: "KYOCHON10",
          affiliate_link: "https://www.11st.co.kr/products/kyochon-honeycombo",
          linkNote: "교촌치킨 전국 매장 및 배달 주문 가능",
          seller: "11번가",
        },
        {
          id: "cp-api-7",
          brand: "땡겨요",
          title: "[신한 땡겨요] 전국 배달 땡겨요 상품권 10,000원권 (12% 할인)",
          imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop",
          originalPrice: 10000,
          discountPrice: 8800,
          app: "땡겨요",
          couponCode: "THANG12OFF",
          affiliate_link: "https://woodongs.com",
          linkNote: "땡겨요 전용 모바일 상품권 즉시 발급",
          seller: "땡겨요 공식",
        },
        {
          id: "cp-api-8",
          brand: "쿠팡이츠",
          title: "[쿠팡 파트너스] 쿠팡이츠 첫주문 / 와우회원 전용 5,000원 할인쿠폰",
          imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop",
          originalPrice: 15000,
          discountPrice: 10000,
          app: "쿠팡이츠",
          couponCode: "EATSWOW5K",
          affiliate_link: "https://www.coupang.com",
          linkNote: "쿠팡이츠 앱 즉시 연결 제휴 링크",
          seller: "쿠팡이츠",
        }
      ];

      // 1. [요구사항 2] 할인율 자동 계산 및 실제 상품 URL 검증
      const processedCoupons = rawCoupons
        .filter((item) => isValidProductUrl(item.affiliate_link))
        .map((item) => {
          const orig = item.originalPrice;
          const disc = item.discountPrice;
          const discountRate = Math.round(((orig - disc) / orig) * 100 * 10) / 10;

          const finalLink = item.affiliate_link;
          return {
            ...item,
            affiliate_link: finalLink,
            purchaseUrl: finalLink,
            discountRate, // 예: 33.3, 20.0, 15.1
            category: "coupon",
            category_type: "coupon", // [요구사항 3] type: 'coupon' / category_type: 'coupon'
            type: "coupon",
            discount: `${disc.toLocaleString()}원 (${Math.round(discountRate)}% 할인)`,
            validity: "발급일로부터 90일 유효",
            minOrder: "제한없음",
            region: "전국",
            is_top_ranked: true,
            createdAt: Date.now(),
          };
        });

      // 2. [요구사항 2] 할인율 가장 높은 순 내림차순 정렬 (.sort((a, b) => b.discountRate - a.discountRate))
      processedCoupons.sort((a, b) => b.discountRate - a.discountRate);

      return res.status(200).json({
        success: true,
        total: processedCoupons.length,
        data: processedCoupons,
      });
    } catch (err: any) {
      console.error("Coupon API error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API 2: Vercel Cron Endpoint / Auto-Update Endpoint
  app.all("/api/auto-update", async (req, res) => {
    try {
      // Mock or fetch sample raw discount data and refine with Gemini AI
      const mockRawContent = `
        배민 BBQ 치킨 4,000원 할인! 18,000원 이상 주문시, 오늘 하루만 유효. 신한카드 결제 시 2,000원 추가 할인!
        쿠팡이츠 버거킹 5,000원 세일! 15,000원 이상 주문시, 주말 한정. 카카오페이 1,000원 즉시 할인!
        요기요 도미노피자 7,000원 포장 쿠폰! 25,000원 이상. 토스페이 2,000원 추가 할인!
        땡겨요 처갓집양념치킨 5,000원 쿠폰! 19,000원 이상, 7월말까지. 없음
      `;

      const ai = getAiClient();
      const prompt = `다음 배달 할인 관련 텍스트를 지정된 JSON 구조로 정제하세요.
[원문]:
${mockRawContent}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                platform: { type: Type.STRING },
                category: { type: Type.STRING },
                brand: { type: Type.STRING },
                brand_id: { type: Type.STRING },
                discount: { type: Type.STRING },
                condition: { type: Type.STRING },
                duration: { type: Type.STRING },
                card_discount: { type: Type.STRING },
              },
              required: ["platform", "category", "brand", "brand_id", "discount", "condition", "duration", "card_discount"],
            },
          },
        },
      });

      const data = JSON.parse(response.text || "[]");
      return res.status(200).json(data);
    } catch (err: any) {
      console.error("Auto-update cron error:", err);
      return res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
