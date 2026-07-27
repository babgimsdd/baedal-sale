import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client strictly on server-side
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }

  // API endpoint for health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", appName: "대한민국 배달 할인 허브" });
  });

  // API endpoint: AI-generated SEO Meta & Summary (Role constraint: AI only handles formatting/summarizing/SEO, never creates products or fake discounts)
  app.post("/api/gemini/seo-summary", async (req, res) => {
    try {
      const { topic, targetApp, region } = req.body;
      if (!ai) {
        return res.status(503).json({
          error: "Gemini API key is not configured.",
          title: `${region || '전국'} ${targetApp || '배달'} 할인 정보`,
          description: `${region || '전국'} 지역의 공식 배달 할인, 무료배달, 카드 혜택 모음입니다.`,
          keywords: ["배달할인", "무료배달", "쿠폰", targetApp || "배달앱"],
          summary: "실시간 공식 확인 가능한 배달 할인 정보입니다."
        });
      }

      const prompt = `
당신은 대한민국 배달 할인 허브의 SEO 및 요약 전담 AI입니다.
절대 없는 상품, 가짜 할인, 허위 URL, 가짜 숫자를 생성하지 마십시오.

요청 정보:
- 검색 키워드/주제: ${topic || '오늘의 배달 할인'}
- 대상 앱: ${targetApp || '전체 배달 앱'}
- 선택 지역: ${region || '전국'}

규칙:
1. 배달 할인을 찾으려는 한국 사용자를 위한 최적의 검색 엔진 제목(title, 30자 이내), 설명(description, 80자 이내), 관련 검색 키워드 5개(keywords), 그리고 신뢰감 주는 한 줄 요약(summary)을 작성하십시오.
2. 거짓 할인이나 존재하지 않는 상품을 지어내지 마십시오.
3. 반드시 아래 JSON 형식으로 응답하십시오.

JSON 형식:
{
  "title": "SEO 메타 제목",
  "description": "SEO 메타 설명",
  "keywords": ["키워드1", "키워드2", "키워드3", "키워드4", "키워드5"],
  "summary": "안내 및 요약 문구"
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text || "{}";
      const parsedData = JSON.parse(responseText);

      res.json(parsedData);
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({
        error: "SEO 생성 실패",
        title: "대한민국 배달 할인 허브",
        description: "실시간 공식 배달 할인, 쿠폰, 무료배달 모음",
        keywords: ["배달할인", "무료배달", "배달의민족", "요기요", "쿠팡이츠"],
        summary: "실시간 공식 할인 정보입니다."
      });
    }
  });

  // Serve Vite in development mode, or static dist in production mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
