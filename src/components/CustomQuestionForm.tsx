import React, { useState } from 'react';
import { HelpCircle, Sparkles, Loader2, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { CategoryId } from '../types';

interface CustomQuestionFormProps {
  onArticleGenerated: (article: {
    id: string;
    categoryId: CategoryId;
    categoryName: string;
    title: string;
    summary: string;
    content: string;
    views: number;
    readingTime: number;
    createdAt: string;
    author: string;
    tags: string[];
    helpfulCount: number;
    unhelpfulCount: number;
    isGenerated: boolean;
  }) => void;
  activeCategory: CategoryId;
}

const KOREAN_LOADING_MESSAGES = [
  '지식 에디터 AI가 최상의 신뢰도 데이터를 취합하는 중...',
  '한국 법률 및 공용 포털 인프라 대응 가이드 작성 중...',
  '검색엔진 최적화(SEO)를 고려한 가독성 헤더를 구조화하는 중...',
  '비교 분석을 돕기 위해 친절한 마크다운 테이블을 편집하는 중...',
  '독자들이 자주 묻는 질문(FAQ)과 실용 꿀팁 요약본을 설계하는 중...',
  '최종 검수를 거쳐 1,500자 상당의 완벽한 정보 복합체 칼럼을 발행하는 중...'
];

export default function CustomQuestionForm({ onArticleGenerated, activeCategory }: CustomQuestionFormProps) {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState<CategoryId>('tips');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoNotice, setInfoNotice] = useState<string | null>(null);

  const predefinedQuestions: { text: string; cat: CategoryId }[] = [
    { text: '청년도약계좌 조건 및 금리 중도해지 대안', cat: 'finance' },
    { text: '운전면허 벌점 조회 및 소멸 10점 차감 교육 요령', cat: 'transport' },
    { text: '알뜰폰 허브 가입 절차 및 유심 기기 연동 방법', cat: 'tech' },
    { text: '상처 소독약 종류(과산화수소, 빨간약, 아쿠아) 용도 비교', cat: 'medical' },
  ];

  const triggerStepInterval = (isRunning: boolean) => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % KOREAN_LOADING_MESSAGES.length);
    }, 3000);
    return interval;
  };

  const handleGenerate = async (e: React.FormEvent, customQ?: string) => {
    e.preventDefault();
    const query = (customQ || question).trim();
    if (!query) {
      setErrorMsg('질문 내용을 빈칸 없이 채워주세요!');
      return;
    }

    setLoading(true);
    setLoadingStep(0);
    setErrorMsg('');
    setInfoNotice(null);

    const intervalId = triggerStepInterval(true);

    try {
      const response = await fetch('/api/generate-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: query,
          categoryName: getCategoryName(category),
        }),
      });

      if (!response.ok) {
        throw new Error('서버 통신 중 예상치 않은 에러가 발생했습니다.');
      }

      const data = await response.json();
      
      if (data.warning) {
        setInfoNotice(data.warning);
      }

      const generatedId = `gen-${Date.now()}`;
      onArticleGenerated({
        id: generatedId,
        categoryId: category,
        categoryName: getCategoryName(category),
        title: query.endsWith('?') ? query : `${query} 핵심 비교 및 실천 가이드`,
        summary: `${query}에 대한 가장 정확한 행정, 금융, 생활 인프라 지식을 요약 정리한 실전 검수 칼럼입니다.`,
        content: data.answer,
        views: 1,
        readingTime: Math.min(12, Math.max(4, Math.ceil(data.answer.length / 400))),
        createdAt: new Date().toISOString(),
        author: '모든질문 코리아 AI 지식인',
        tags: [category, '실생활지식', 'AI추천', '검증완료'],
        helpfulCount: 0,
        unhelpfulCount: 0,
        isGenerated: true,
      });

      if (!customQ) {
        setQuestion('');
      }
    } catch (error: any) {
      console.error(error);
      setErrorMsg('해답을 가져오는 과정에 지연이 감지되었습니다. 인터넷 상태를 보시고 잠시 후 다시 조치해 주시기 바랍니다.');
    } finally {
      if (intervalId) clearInterval(intervalId);
      setLoading(false);
    }
  };

  const getCategoryName = (catId: CategoryId): string => {
    switch (catId) {
      case 'health': return '건강';
      case 'finance': return '재정';
      case 'tips': return '생활 팁';
      case 'tech': return '기술';
      case 'cooking': return '요리';
      case 'medical': return '의료';
      case 'travel': return '여행';
      case 'transport': return '운송';
      case 'law': return '법률';
      case 'science': return '과학';
      default: return '일반 지식';
    }
  };

  return (
    <div className="bg-slate-950 text-white rounded-lg p-6 sm:p-10 shadow-sm relative overflow-hidden border border-slate-800">
      {/* Decorative clean editorial pattern indicator */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white text-black flex items-center justify-center rounded-sm font-black text-lg">
            <Sparkles className="w-5 h-5 animate-pulse text-black" />
          </div>
          <div>
            <span className="text-xs font-bold text-blue-500 tracking-[0.2em] uppercase">실시간 지식 생성 엔진 • TODAY'S DEEP DIVE</span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight uppercase font-display mt-0.5">
              세상의 모든 질문, <span className="text-slate-400 italic font-medium">실시간 AI 칼럼</span>
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed max-w-2xl font-medium">
          한국에 거주하는 사람들을 위해 마련된 지식망입니다. 지식 분류를 선택하고 궁금증(건강, 재약, 자동차, 청년 혜택, 연말정산 등)을 자유롭게 입력하면, 구글 애드센스 규격에 충족하는 심층적인 정보성 오리지널 칼럼이 즉각 발행됩니다.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3.5 bg-red-950/40 border border-red-900/60 rounded-sm text-xs text-red-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {infoNotice && (
          <div className="mb-4 p-3.5 bg-amber-950/40 border border-amber-900/60 rounded-sm text-xs text-amber-200">
            <p className="font-bold flex items-center gap-1.5 mb-1 text-amber-300">
              <Sparkles className="w-3.5 h-3.5" /> 안내 고지 (Notice)
            </p>
            <p className="leading-relaxed">{infoNotice}</p>
          </div>
        )}

        {loading ? (
          <div className="py-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-slate-800 border-t-white animate-spin">
              <Loader2 className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <p className="font-black text-sm tracking-widest text-white uppercase">AI 에디팅 기사 제작 중</p>
              <p className="text-xs text-slate-400 min-h-[40px] px-4 animate-fade-in transition-all">
                {KOREAN_LOADING_MESSAGES[loadingStep]}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => handleGenerate(e)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">지식 카테고리</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryId)}
                  className="w-full text-xs font-bold bg-slate-900 border border-slate-800 rounded-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 text-white uppercase tracking-wider"
                >
                  <option value="health">건강 / HEALTH</option>
                  <option value="finance">재정 / FINANCE</option>
                  <option value="tips">생활 팁 / LIFE TIPS</option>
                  <option value="tech">기술 / TECH</option>
                  <option value="cooking">요리 / COOKING</option>
                  <option value="medical">의료 / MEDICAL</option>
                  <option value="travel">여행 / TRAVEL</option>
                  <option value="transport">운송 / AUTO</option>
                  <option value="law">법률 / LAW</option>
                  <option value="science">과학 / SCIENCE</option>
                </select>
              </div>

              <div className="sm:col-span-9">
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">궁금한 질문이나 키워드 입력</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="예: 청년도약계좌 조건 및 중도해지 대안, 알뜰폰 가입 절차..."
                    className="w-full text-xs bg-slate-900 border border-slate-800 rounded-sm p-3 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-slate-500 text-white font-medium"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 p-1.5 rounded-sm bg-white hover:bg-slate-200 text-black transition-all shadow-sm flex items-center justify-center font-bold"
                    title="질문 생성"
                  >
                    <BookOpen className="w-4 h-4 text-black" />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-900">
              <span className="block text-[11px] font-bold text-slate-400 mb-2.5 uppercase tracking-wider">💡 실시간 트렌드 질문 제안</span>
              <div className="flex flex-wrap gap-2">
                {predefinedQuestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      setCategory(item.cat);
                      handleGenerate(e, item.text);
                    }}
                    className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3.5 py-1.5 rounded-full transition-colors text-slate-300 font-bold tracking-tight hover:text-white flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-3 h-3 text-blue-500" />
                    <span>{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
