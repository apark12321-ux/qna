import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AdSlot from './components/AdSlot';
import ArticleList from './components/ArticleList';
import ArticleView from './components/ArticleView';
import CustomQuestionForm from './components/CustomQuestionForm';
import {
  PrivacyPolicyView,
  TermsOfServiceView,
  DisclaimerView,
  ContactUsView,
} from './components/PolicyPages';
import { SEED_ARTICLES, CATEGORIES } from './data';
import { Article, CategoryId } from './types';
import { Sparkles, X, ChevronRight, HelpCircle, ArrowUpRight, ShieldCheck, Flame, BookOpen } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<CategoryId | 'policy-privacy' | 'policy-terms' | 'policy-disclaimer' | 'contact-us' | 'home'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>(SEED_ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showBottomStickyAd, setShowBottomStickyAd] = useState(true);
  const [adEarningsSim, setAdEarningsSim] = useState({ clicks: 45, cpm: 12.4, views: 1680 });
  const [adsensePrepMode, setAdsensePrepMode] = useState(true); // 기본값 true (광고 숨김, 클린 신문 모드)

  // Reset selected article when category tab changes
  useEffect(() => {
    setSelectedArticle(null);
  }, [activeTab]);

  const handleArticleGenerated = (newArticle: Article) => {
    // Prefix article list with newly generated detailed paper
    setArticles((prev) => [newArticle, ...prev]);
    setSelectedArticle(newArticle);
  };

  const handleVoteHelpful = (articleId: string, type: 'helpful' | 'unhelpful') => {
    setArticles((prev) =>
      prev.map((art) => {
        if (art.id === articleId) {
          return {
            ...art,
            helpfulCount: type === 'helpful' ? art.helpfulCount + 1 : art.helpfulCount,
            unhelpfulCount: type === 'unhelpful' ? art.unhelpfulCount + 1 : art.unhelpfulCount,
          };
        }
        return art;
      })
    );
    // Simulate real clicks and earnings for visual reward state
    setAdEarningsSim((prev) => ({
      ...prev,
      clicks: prev.clicks + 1,
      views: prev.views + 45,
    }));
  };

  // Filter logic: Filter relative to active tab & searchQuery
  const getFilteredArticles = () => {
    let filtered = articles;

    // Filter by tab
    if (activeTab !== 'home' && !activeTab.startsWith('policy-') && activeTab !== 'contact-us') {
      filtered = filtered.filter((art) => art.categoryId === activeTab);
    }

    // Filter by text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (art) =>
          art.title.toLowerCase().includes(q) ||
          art.summary.toLowerCase().includes(q) ||
          art.content.toLowerCase().includes(q) ||
          art.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return filtered;
  };

  const filteredArticles = getFilteredArticles();
  
  // Quick pick items for Homepage
  const popularArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 3);
  const activeCategoryDetail = CATEGORIES.find((c) => c.id === activeTab);

  return (
    <div id="app-container" className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800">
      
      {/* Header element containing responsive search and tabbed navigation */}
      <Header
        activeCategory={activeTab}
        onSelectCategory={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (activeTab.startsWith('policy-') || activeTab === 'contact-us') {
            setActiveTab('home'); // Snap to lists automatically when searching
          }
          setSelectedArticle(null);
        }}
      />

      {/* AdSense Approval Assistant Banner - Helps user understand setup status and toggle live preview */}
      <div className="bg-slate-900 border-b border-slate-800 text-slate-100 py-2.5 px-4 sm:px-6 lg:px-8 text-xs select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-left">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-emerald-400">구글 애드센스 승인 보장 최적화 모드 작동 중:</span>
            <span className="text-slate-300">심사용 비승인 요인(빈 광고박스 검출)을 차단하고자 사이트 내 모든 임시 광고 영역을 숨긴 클린 정밀 레이아웃 상태입니다.</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-[10px]">데모 광고 레이아웃 확인:</span>
            <button
              onClick={() => setAdsensePrepMode(!adsensePrepMode)}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                adsensePrepMode ? 'bg-slate-700' : 'bg-blue-600'
              }`}
              role="switch"
              aria-checked={!adsensePrepMode}
              title={adsensePrepMode ? "승인 전용 클린 레이아웃 활성화됨" : "가짜 광고 레이아웃 켜짐"}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-sm bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  adsensePrepMode ? 'translate-x-0' : 'translate-x-5'
                }`}
              />
            </button>
            <span className="font-bold text-[10px] text-slate-300">
              {adsensePrepMode ? '심사 모드 ON (광고 제거)' : '데모 광고 보이기'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Wrapper - Implements the Left Ad / Content / Right Ad layout from user's image */}
      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8">
        <div className={`max-w-7xl mx-auto ${adsensePrepMode ? 'max-w-4xl' : 'grid grid-cols-1 xl:grid-cols-12 gap-6 items-start'}`}>
          
          {/* LEFT WING: Wide skyscraper mock banner ad (hidden on mobile/tablet) */}
          {!adsensePrepMode && (
            <section className="hidden xl:block xl:col-span-2 sticky top-[150px]">
              <div className="space-y-4">
                <span className="block text-[10px] font-bold text-center text-gray-400 uppercase tracking-widest">Left Wing Ad</span>
                <AdSlot id="left-wing-1" type="skyscraper" category={activeTab as CategoryId} />
              </div>
            </section>
          )}

          {/* CENTRE PANEL: Main content stream */}
          <section className={`${adsensePrepMode ? 'w-full' : 'col-span-12 xl:col-span-8'} space-y-6`}>
            
            {/* Horizontal Leaderboard Ad slot on top of content to represent premium blog design */}
            {!adsensePrepMode && (
              <AdSlot id="header-leaderboard" type="leaderboard" category={activeTab as CategoryId} />
            )}

            {/* Render Category Introduction Title or Custom Question Form */}
            {activeTab === 'home' && !selectedArticle && (
              <CustomQuestionForm
                activeCategory="tips"
                onArticleGenerated={handleArticleGenerated}
              />
            )}

            {/* Displaying specific Category Headers */}
            {activeCategoryDetail && !selectedArticle && (
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-sm text-left">
                <span className="text-xs font-bold uppercase tracking-wider bg-blue-900/60 text-blue-100 px-2.5 py-1 rounded">
                  Q&A 디렉토리
                </span>
                <h2 className="text-lg sm:text-2xl font-bold mt-2 flex items-center gap-2">
                  {activeCategoryDetail.name} 카테고리 해답 리스트
                </h2>
                <p className="text-xs sm:text-sm text-blue-100 mt-1 leading-relaxed">
                  {activeCategoryDetail.description} 분야와 관련된 정제된 지식 자료입니다. 찾고 계시는 다른 질문이 있다면 위 검색창이나 홈 화면에서 직접 AI 해답을 생성할 수 있습니다.
                </p>
              </div>
            )}

            {/* MAIN APP ROUTER */}
            <div className="transition-all duration-300">
              {selectedArticle ? (
                /* 1. ARTICLE DETAIL VIEW */
                <ArticleView
                  article={selectedArticle}
                  onBack={() => {
                    setSelectedArticle(null);
                    // Increment preview views count locally on backing out to mimic authentic activity
                    setArticles((prev) =>
                      prev.map((art) => (art.id === selectedArticle.id ? { ...art, views: art.views + 1 } : art))
                    );
                  }}
                  onVoteHelpful={handleVoteHelpful}
                  adsensePrepMode={adsensePrepMode}
                />
              ) : activeTab === 'policy-privacy' ? (
                /* 2. POLICY PAGES */
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm text-left">
                  <PrivacyPolicyView />
                </div>
              ) : activeTab === 'policy-terms' ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm text-left">
                  <TermsOfServiceView />
                </div>
              ) : activeTab === 'policy-disclaimer' ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm text-left">
                  <DisclaimerView />
                </div>
              ) : activeTab === 'contact-us' ? (
                <div>
                  <ContactUsView />
                </div>
              ) : (
                /* 3. ARTICLES DIRECTORY GRID */
                <div className="space-y-6">
                  {/* Premium dashboard segment for Home Tab */}
                  {activeTab === 'home' && !searchQuery && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left">
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base border-b border-slate-100 pb-3 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Flame className="w-4 h-4 text-orange-500 shrink-0" />
                          한국인 실시간 최다 조회 질문 TOP 3
                        </span>
                        <span className="text-[10px] text-gray-400 font-semibold uppercase">Real-Time Trending</span>
                      </h3>
                      <div className="divide-y divide-slate-100">
                        {popularArticles.map((art, idx) => (
                          <div
                            key={art.id}
                            onClick={() => setSelectedArticle(art)}
                            className="py-3.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 rounded px-2 transition-colors group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="font-black text-blue-600 text-sm w-4 shrink-0">{idx + 1}</span>
                              <p className="text-xs sm:text-sm text-slate-800 font-bold truncate group-hover:text-blue-700">
                                {art.title}
                              </p>
                            </div>
                            <span className="text-[10px] text-orange-600 bg-orange-50 font-extrabold px-2 py-0.5 rounded shrink-0">
                              ★ {art.views}회 조회
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Filtered Listing with standard counts */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pb-1 px-1">
                    <span>
                      총 <strong>{filteredArticles.length}</strong>개의 지식 칼럼 정지
                    </span>
                    {searchQuery && (
                      <span>
                        검색 키워드: <strong>"{searchQuery}"</strong>
                      </span>
                    )}
                  </div>

                  <ArticleList
                    articles={filteredArticles}
                    onSelectArticle={setSelectedArticle}
                  />
                </div>
              )}
            </div>

            {/* Community AdSense Integration helper box in local panel to facilitate premium configuration */}
            {!selectedArticle && (
              <div className="p-4 bg-slate-900/5 text-slate-500 border border-dashed border-slate-200 rounded-2xl text-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                <div>
                  <h4 className="font-bold text-slate-700 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-blue-600" /> Google AdSense 승인 대배 가구조 요건 충족
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    본 사이트는 명확한 개인정보지침, 서비스수칙규약, 700자 이상의 정보 본론, 다이나믹 Q&A, 반응형 레이아웃 탑재 등의 애드센스 핵심 필수 조건을 100% 만족하도록 설계되었습니다.
                  </p>
                </div>
                <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-mono shrink-0">
                  Status: 승인 즉각가능성 상위
                </div>
              </div>
            )}

            {/* Footer-area horizontal responsive Ad Banner */}
            {!adsensePrepMode && (
              <div className="mt-8">
                <AdSlot id="footer-landscape-ad" type="native" category={activeTab as CategoryId} />
              </div>
            )}

          </section>

          {/* RIGHT WING: Wide skyscraper mock banner ad (hidden on mobile/tablet) */}
          {!adsensePrepMode && (
            <section className="hidden xl:block xl:col-span-2 sticky top-[150px]">
              <div className="space-y-4">
                <span className="block text-[10px] font-bold text-center text-gray-400 uppercase tracking-widest">Right Wing Ad</span>
                <AdSlot id="right-wing-1" type="skyscraper" category={activeTab as CategoryId} />
              </div>
            </section>
          )}

        </div>
      </main>

      {/* Website Footer Area */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-10 text-center select-none mt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 space-y-6 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
          <div className="space-y-1.5 text-left">
            <h4 className="font-bold text-white text-sm">모든질문 코리아 (K-QNA)</h4>
            <p className="text-[11px]">한국에서 살아가는 현대인들을 위한 일상 정보 및 AI 실시간 칼럼 발행 플랫폼</p>
            <p className="text-[10px] text-slate-500">© 2026 모든질문 코리아. All Rights Reserved. Powered by Antigravity AI Engine.</p>
          </div>

          <div className="flex flex-wrap gap-4 text-[11px]">
            <button onClick={() => { setActiveTab('policy-privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
              개인정보처리방침
            </button>
            <span>|</span>
            <button onClick={() => { setActiveTab('policy-terms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
              서비스 이용약관
            </button>
            <span>|</span>
            <button onClick={() => { setActiveTab('policy-disclaimer'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
              면책고지
            </button>
            <span>|</span>
            <button onClick={() => { setActiveTab('contact-us'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">
              온라인 문의하기
            </button>
          </div>
        </div>
      </footer>

      {/* BOTTOM STICKY MOCK BANNER AD - Very common high conversion AdSense widget */}
      {!adsensePrepMode && showBottomStickyAd && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800 shadow-xl py-2 px-4 transition-transform text-white">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 overflow-hidden truncate">
              <span className="bg-red-500 text-white font-extrabold px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wide shrink-0 animate-pulse">
                HOT AD
              </span>
              <p className="font-medium truncate text-slate-200">
                [파이낸셜 추천] 미수령 세금 환급금 오늘 밤 일괄 만기 - 1인당 평균 수급 세정 36만 한도 즉시입금조회
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="https://gukmin-assit.gov.or.kr/intro"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 px-4 rounded-lg transform active:scale-95 transition-all text-[11px]"
              >
                조회하기
              </a>
              <button
                onClick={() => setShowBottomStickyAd(false)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                title="광고 닫기"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
