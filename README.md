# 모든질문 QNA

## 기능

- 질문 입력 후 Q&A 생성
- 생성 글 브라우저 저장
- 카테고리·검색 필터
- 상세 보기와 도움됨 투표
- robots.txt, sitemap.xml, rss.xml 제공

## 실행

```bash
npm install
cp .env.example .env.local
npm run dev
```

## 빌드

```bash
npm run lint
npm run build
npm start
```

## 환경 변수

```bash
GEMINI_API_KEY="..."
GEMINI_MODEL="gemini-2.5-flash"
APP_URL="https://your-domain.com"
PORT="3000"
```
