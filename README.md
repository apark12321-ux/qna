# 모든질문 QNA

한국 생활형 질문을 저장형 Q&A 칼럼으로 정리하는 React + Express 기반 MVP입니다.

## 기능

- 질문 입력 후 Q&A 칼럼 생성
- Gemini API 키가 없을 때도 미리보기 글 생성
- 생성 글 브라우저 localStorage 저장
- 카테고리·검색 필터
- 상세 보기, 도움됨 투표, 복사
- robots.txt, sitemap.xml, rss.xml 제공
- 개인정보처리방침, 이용약관, 면책고지, 문의 영역 포함

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
