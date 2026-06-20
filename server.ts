import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = Number(process.env.PORT || 3000);
const APP_URL = (process.env.APP_URL || `http://localhost:${PORT}`).replace(/\/$/, '');
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

app.use(express.json({ limit: '1mb' }));

let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') throw new Error('GEMINI_API_KEY is not configured');
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

function normalize(input: unknown) {
  return typeof input === 'string' ? input.replace(/\s+/g, ' ').trim().slice(0, 180) : '';
}

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function previewArticle(question: string, category: string) {
  return `# ${question} 핵심 비교 및 실천 가이드\n\n${category} 분야에서 **${question}**을 확인할 때는 적용 조건, 처리 순서, 예외 상황을 함께 보셔야 합니다. 아래 내용은 개발·미리보기 환경에서도 사이트 흐름을 검수할 수 있도록 작성된 안내형 예시입니다. 실제 공개 전에는 공식 기관, 최신 공지, 전문가 검토를 통해 세부 수치를 반드시 확인해야 합니다.\n\n## 1. 먼저 확인해야 할 기준\n\n- **대상 조건**: 나이, 소득, 지역, 가입 기간, 보유 서류처럼 자격을 좌우하는 조건을 확인합니다.\n- **처리 기한**: 신청 기간, 청구 가능 기간, 갱신 주기, 소멸 시효를 따로 적어 둡니다.\n- **증빙 자료**: 계약서, 영수증, 진료 내역, 납부 확인서 등 필요한 서류를 미리 준비합니다.\n\n## 2. 실행 순서\n\n먼저 공식 안내 페이지에서 기준을 확인하고, 이후 민간 블로그나 커뮤니티 글은 보조 자료로만 사용하는 방식이 안전합니다. 특히 금액, 금리, 지원 한도, 약관, 진료 기준처럼 수시로 바뀌는 정보는 작성일이 오래된 글을 그대로 적용하면 손해가 발생할 수 있습니다.\n\n| 구분 | 우선 확인 항목 | 주의할 점 |\n| :--- | :--- | :--- |\n| 기본 조건 | 대상자, 지역, 기간 | 조건이 하나라도 다르면 결과가 달라질 수 있습니다. |\n| 비용/혜택 | 수수료, 환급액, 지원 한도 | 최신 공고와 약관을 기준으로 재확인해야 합니다. |\n| 절차 | 온라인 신청, 방문 접수 | 본인인증과 증빙 누락이 가장 흔한 지연 원인입니다. |\n| 리스크 | 불이익, 위약금, 거절 사유 | 확정 전 담당 기관 또는 전문가에게 확인하는 것이 좋습니다. |\n\n## 3. 실수하기 쉬운 부분\n\n검색 결과 상단의 요약만 보고 바로 신청하거나 결제하는 방식은 위험합니다. 공식 명칭이 비슷한 서비스, 광고성 랜딩 페이지, 오래된 안내문이 섞여 있을 수 있기 때문입니다.\n\n## 4. 상황별 추천 대응\n\n- 급하게 처리해야 한다면 모바일 인증과 전자문서지갑을 먼저 준비합니다.\n- 금액이 큰 사안이면 상담 기록, 통화 일시, 담당자 이름을 남겨 둡니다.\n- 법률·의료·금융 판단이 필요한 경우 AI 답변을 최종 판단으로 사용하지 말고 전문가 확인을 거칩니다.\n\n### 💡 꿀팁 가이드\n\n1. 검색어에는 제도명과 함께 **2026**, **대상**, **신청 방법**, **주의사항**을 붙이면 최신성 높은 자료를 찾기 쉽습니다.\n2. 신청 전 캡처나 PDF 저장을 해두면 조건 변경 시 근거 자료로 활용할 수 있습니다.\n3. 혜택형 제도는 예산 소진이나 선착순 마감이 있을 수 있으므로 공식 접수 가능 여부를 먼저 확인하십시오.\n\n### ❓ 자주 묻는 질문 (FAQ)\n\n**Q1. 이 글만 보고 바로 신청해도 되나요?**  \nA. 아닙니다. 이 글은 판단 구조를 잡기 위한 안내입니다. 실제 신청, 계약, 치료, 세무, 법률 판단은 공식 기관 자료와 전문가 확인을 기준으로 하셔야 합니다.\n\n**Q2. 최신 정보는 어떻게 확인해야 하나요?**  \nA. 정부24, 홈택스, 복지로, 금융감독원, 국민건강보험공단, 각 지자체 고시처럼 담당 기관의 최신 공지와 민원 상담 창구를 우선 확인하는 방식이 안전합니다.`;
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'all-questions-qna', hasApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') });
});

app.post('/api/generate-answer', async (req, res) => {
  const question = normalize(req.body?.question);
  const category = normalize(req.body?.categoryName) || '생활 정보';
  if (question.length < 4) return res.status(400).json({ error: '질문은 최소 4자 이상 입력해 주십시오.' });

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
    return res.json({ answer: previewArticle(question, category), isMock: true });
  }

  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `카테고리: ${category}\n질문: ${question}\n한국어 Q&A 칼럼을 작성해 주세요.`,
      config: {
        temperature: 0.55,
        systemInstruction: '한국어 지식 포털 편집자처럼 작성한다. # 제목, 도입 요약, ## 소제목 3개 이상, 비교표, 꿀팁 가이드, FAQ를 포함한다. 의료·법률·금융·세무·행정 정보는 공식 확인과 전문가 상담 필요성을 명확히 고지한다. 보장 표현과 허위 출처를 금지한다.'
      }
    });
    res.json({ answer: response.text?.trim() || previewArticle(question, category), isMock: false });
  } catch (error: any) {
    res.status(500).json({ error: 'AI 답변 생성 중 오류가 발생했습니다.', details: process.env.NODE_ENV === 'production' ? undefined : error?.message });
  }
});

app.get('/robots.txt', (_req, res) => res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${APP_URL}/sitemap.xml\n`));
app.get('/sitemap.xml', (_req, res) => {
  const urls = ['/', '/?category=health', '/?category=finance', '/?category=law', '/?category=tips'].map((url) => `<url><loc>${escapeXml(APP_URL + url)}</loc><changefreq>daily</changefreq><priority>${url === '/' ? '1.0' : '0.7'}</priority></url>`).join('');
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
});
app.get('/rss.xml', (_req, res) => res.type('application/rss+xml').send(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>모든질문 QNA</title><link>${escapeXml(APP_URL)}</link><description>한국 생활형 Q&A 지식 칼럼</description><language>ko-KR</language></channel></rss>`));

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }
  app.listen(PORT, '0.0.0.0', () => console.log(`모든질문 QNA server: http://localhost:${PORT}`));
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
