import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

// Parse JSON request bodies
app.use(express.json());

// Lazy GoogleGenAI client getter
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API endpoint to generate search engine ready high-quality answers
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasApiKey: !!process.env.GEMINI_API_KEY });
});

app.post('/api/generate-answer', async (req, res) => {
  const { question, categoryName } = req.body;

  if (!question || typeof question !== 'string') {
    res.status(400).json({ error: '질문 내용을 입력해 주십시오.' });
    return;
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === '') {
      // If no valid key is provided, we return a simulated high-quality response
      // to guarantee usability in any sandbox environment, but alert the client.
      console.warn('GEMINI_API_KEY is not configured or placeholder. Returning optimized simulated article.');
      
      const simulatedText = `# [시뮬레이션 해답] ${question}

## 1. 개요 및 주요 맥락 정리
안녕하세요! 질문해주신 **"${question}"**에 대하여 한국 생활 인프라와 빅데이터 분석을 토대로 가장 명쾌하고 실행 가능한 핵심 지침을 정리해 드리겠습니다. 

본 칼럼은 검색엔진(SEO)에 최적화된 형식으로 구성되어 있으며, 실생활에서 즉각 활용할 수 있는 단계별 가이드와 핵심 팁, 가독성 높은 비교 표를 제공합니다.

---

## 2. 핵심 단계별 실천 행동 요령

* **[1단계] 정확한 현황 파악 및 인프라 매핑**: 질문하신 분야에 최우선 적용되는 주무 부처(금융감독원, 보건복지부, 자치행정처 등)의 가용 정보를 조회합니다.
* **[2단계] 가성비 극대화 및 지원금 혜택 추적**: 정부나 지자체의 다양한 매칭 펀드, 청년 우대 통장 및 비과세 보조 혜택에 적용을 검토합니다.
* **[3단계] 모바일 다이렉트 창구를 통한 신속 접수**: 방문 지연을 막기 위해 지정 국문 앱(정부24, 스마트 홈택스 등)을 통해 무방문 비대면 모바일 등록을 실행합니다.

| 질문 요점 핵심 대응 방안 비교 도표 |
| :--- | :--- |
| **속성**: 신속한 처리 | **대응 방법**: 가급적 비대면 모바일 간편인증 및 전자증명서 위임 처리를 우선할 것. |
| **비용**: 비용 최소화 | **대응 방법**: 정부 국고 매칭 보조금 및 신용카드 제휴 할인 매커니즘을 적극 활용. |
| **안정성**: 법적 리스크 소거 | **대응 방법**: 정식 하이퍼링크를 포함한 정부 공표 보도자료나 부동산 3대 보증 제도를 대조할 것. |

---

## 3. 핵심 주의사항 및 리스크 예방책

누구나 실수하기 쉬운 취약 구역을 정밀 봉쇄하기 위한 관리 수칙입니다.
- **기한 엄수**: 대다수의 국가 혜택이나 환급 제도는 청구 유효시효(자동차 채권 10년, 실비 청구 3년 등)를 내포하므로 지체 없이 개시하십시오.
- **인증 무한반복 방지**: 안전을 위해 사용 중인 모든 모바일 금융 수단을 하나의 주거래 공동인증 채널로 통합 결속해 주시기 바랍니다.

---

## 4. 💡 꿀팁 가이드
1. **스마트 알림 수신 동의**: 국민비서 서비스(구삐)를 구독하시면 세금, 교통 법규 위반, 환급금 기한 등 까짓 잊기 쉬운 의무 공지들이 무료 카카오톡 문자로 선제 알림 배달됩니다.
2. **지자체별 복지 맵 비교**: 서울, 경기, 경북 등 본인이 주소지를 둔 각 광역의회 공식 웹에 올라오는 전입 청년 지원 사업을 수시로 키워드 모니터하십시오.
3. **가입 전 서류 준비 디지털 단일화**: 정부24 앱의 '전자문서지갑'을 개방하면 종이 출력 없이 공공 서류를 즉시 전송할 수 있습니다.

---

## 5. ❓ 자주 묻는 질문 (FAQ)

**Q1. 본인의 조건이 해당되는지 안전하고 간편하게 자가 진단하는 방법이 있나요?**
A. 당연히 있습니다. 보건복지부가 제공하는 '복지로' 공식 포털의 모의계산 탭 또는 인터넷 스마트 위택스를 이용하여 주민등록 기준을 가입해 주시면 세전 연봉, 재산 합산 대비 합격 여부가 수치로 표시됩니다.

**Q2. 관련 기한을 놓쳤을 경우 소급 적용이 가능합니까?**
A. 사안에 따라 사후 소급 가능 여부가 크게 엇갈립니다. 정기 세무 청구 누락은 5년 안으로 경정청구를 소명하면 가산 이자 분까지 되돌려 받을 수 있으나, 선착순 소진 형태의 한정 청년 바우처는 당해 기수가 종료되면 영구 소멸되므로 신속한 조치가 답입니다.

*(※ 본 정보 포털은 한국 실정에 맞춘 최신 가이드를 신속 전수하고자 마련된 지식 채널입니다. 이 서비스는 AI 기술 지원을 바탕으로 작성되었으므로 공식 사이트의 세부 지침을 사전 검증하시기를 진심으로 권장합니다.)*`;

      res.json({
        answer: simulatedText,
        isMock: true,
        warning: 'GEMINI_API_KEY가 설정되지 않아 SEO 최적화 시뮬레이션 기반 해답을 정교하게 생성했습니다. Secrets 패널에 올바른 API 키를 등록하면 완벽한 실시간 AI 답변 생성이 동작합니다.'
      });
      return;
    }

    const ai = getGeminiClient();
    
    // Detailed system prompt optimized for AdSense high-quality, high-dwell-time indexing 
    const systemPrompt = `너는 한국 실정에 아주 밝은 지식 전문 AI 에디터(블로거)이자 정보 길잡이이다. 한국에서 살아가는 사람들이 궁금해하는 다양한 질문에 대해 최고 품질의 블로그 기사 형태의 답변을 생성해야 한다. 구글 애드센스 승인을 받기에 최적화된 높은 가치의 콘텐츠를 작성해줘.

다음 서식 요건을 철저히 엄수할 것:
- 반드시 친절하고 명확한 존댓말(~입니다, ~하셔야 합니다)을 쓸 것.
- 답변은 절대 지나치게 짧게 단답형으로 끝내지 말고, 최소 1500자 이상의 충분하고 상세한 분량으로 기사를 서술할 것.
- 글의 구성은 반드시 다음과 같은 마크다운 구조를 갖출 것:
  1. 제목 (# 대제목 형태로 작성, 매력적인 기사 타이틀)
  2. 요약글 (가장 먼저 핵심 결론이나 현황을 요약하는 문단)
  3. 3개 이상의 구체적인 소주제 (## 소주제 제목)와 상세한 본문 글. 본문 글에는 적당히 글머리표(*, -)나 번호목록(1., 2.)을 사용하여 가독성을 높일 것.
  4. 하나의 상세한 비교 표 또는 요점 보드 (마크다운 테이블 형태로 표 구성)를 포함할 것.
  5. 핵심 팁 3가지 요약 (### 💡 꿀팁 가이드).
  6. 자주 묻는 질문 (### ❓ 자주 묻는 질문 (FAQ))을 최소 2개 이상 질답 형태로 추가할 것.
- 지식의 깊이가 깊고 인용 가능한 정보(법률, 공용기관 명칭 등)를 활용하여 정교하게 작성할 것.
- 기술적인 마진 클러터나 Tech-Larping 요소(Port:3000, Ping, 시스템 로깅 등)는 본 콘텐츠에 절대 포함하지 마십시오. 오로지 최종 독자가 신뢰할 수 있는 완벽한 가이드 기사로만 승부합니다.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `분동 카테고리 : ${categoryName || '일반 지식'}
질문 내용 : "${question}"
위의 질문에 대해 시스템 요건에 맞춰 최고의 가치를 드리는 구글 상위 노출용 SEO 칼럼 포스트를 만들어 주세요.`,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const markdownText = response.text || '';
    res.json({
      answer: markdownText,
      isMock: false
    });

  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: '답변 생성 과정 중 예상치 못한 지연 오류가 드러났습니다.',
      details: error.message
    });
  }
});

// Implement Vite middleware in development or static hosting in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`모든질문 코리아 fullstack server running on http://localhost:${PORT}`);
  });
}

startServer();
