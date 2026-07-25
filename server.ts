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
