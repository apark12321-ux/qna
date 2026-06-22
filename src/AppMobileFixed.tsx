import './site-structure.css';
import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { faqArticles, faqCategories, type FaqCategory } from './data/faqSeed';

type Filter = '전체' | FaqCategory;
type View = 'home' | 'about' | 'privacy' | 'contact';
type Article = (typeof faqArticles)[number];

const filters: Filter[] = ['전체', ...faqCategories];
const HOME_PER_CATEGORY = 5;
const MAX_RESULTS = 36;

const pages = {
  about: {
    title: '사이트 소개',
    text: [
      '생활정보 Q&A는 지원금, 세금, 집 계약, 금융, 일과 사업, 생활 문제처럼 자주 찾는 정보를 질문과 답변 형태로 정리합니다.',
      '각 글은 핵심 요약, 준비할 자료, 진행 순서, 주의사항, 공식 확인 경로를 중심으로 구성합니다.',
      '제도와 기준은 바뀔 수 있으므로 실제 신청, 납부, 계약 전에는 담당 기관이나 공식 안내에서 최신 기준을 확인해 주세요.'
    ]
  },
  privacy: {
    title: '개인정보처리방침',
    text: [
      '이 사이트는 회원가입 없이 이용할 수 있습니다.',
      '문의나 오류 제보 과정에서 전달된 정보는 답변, 오류 확인, 서비스 개선 목적에 한해 사용됩니다.',
      '불필요한 개인정보는 수집하지 않으며, 법령상 필요한 경우를 제외하고 제3자에게 제공하지 않습니다.'
    ]
  },
  contact: {
    title: '문의',
    text: [
      '잘못된 내용, 오래된 정보, 수정이 필요한 부분이 있으면 문의해 주세요.',
      '문의 시에는 페이지 제목, 문제 내용, 확인이 필요한 부분을 함께 적어주시면 더 정확하게 확인할 수 있습니다.',
      '이 사이트의 정보는 일반적인 생활 정보 정리용이며, 개인별 최종 판단이 필요한 사안은 담당 기관이나 전문가 확인이 필요합니다.'
    ]
  }
} as const;

function splitBody(item: Article) {
  return item.body
    .split('\n\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('# '));
}

function Answer({ item }: { item: Article }) {
  const paragraphs = splitBody(item);

  return (
    <div className="answer-body">
      <p className="answer-summary"><strong>핵심 요약</strong><br />{item.summary}</p>
      <h3>1. 먼저 확인할 조건</h3>
      <p>{paragraphs[0]}</p>
      <h3>2. 준비와 진행 순서</h3>
      <p>{paragraphs[1]}</p>
      <h3>3. 공식 확인 경로</h3>
      <p>{paragraphs[2] ?? item.sourceHint}</p>
      <h3>4. 주의사항</h3>
      <p>{paragraphs[3]}</p>
      <h3>5. 마지막 체크</h3>
      <p>{paragraphs[4]}</p>
    </div>
  );
}

function RelatedPosts({ item, onOpen }: { item: Article; onOpen: (next: Article) => void }) {
  const related = faqArticles
    .filter((candidate) => candidate.category === item.category && candidate.id !== item.id)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="related-box">
      <h3>함께 확인할 질문</h3>
      <div className="related-list">
        {related.map((next) => (
          <button key={next.id} type="button" onClick={() => onOpen(next)}>{next.title}</button>
        ))}
      </div>
    </div>
  );
}

export default function AppMobileFixed() {
  const [filter, setFilter] = useState<Filter>('전체');
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState('');
  const [view, setView] = useState<View>('home');

  const groupLead = filter === '전체'
    ? '지원금, 세금, 계약, 금융, 일과 생활 문제를 빠르게 확인하세요.'
    : `${filter} 관련 질문을 신청 전, 계약 전, 납부 전에 확인하기 쉽게 정리했습니다.`;

  const homeItems = useMemo(() => {
    return faqCategories.flatMap((category) =>
      faqArticles.filter((item) => item.category === category).slice(0, HOME_PER_CATEGORY)
    );
  }, []);

  const items = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const source = keyword || filter !== '전체' ? faqArticles : homeItems;

    return source.filter((item) => {
      const haystack = `${item.title} ${item.summary} ${item.category} ${item.body} ${item.sourceHint}`.toLowerCase();
      const matchCategory = filter === '전체' || item.category === filter;
      return matchCategory && (!keyword || haystack.includes(keyword));
    }).slice(0, MAX_RESULTS);
  }, [filter, homeItems, search]);

  const popularItems = useMemo(() => {
    return faqCategories
      .map((category) => faqArticles.find((item) => item.category === category))
      .filter(Boolean) as Article[];
  }, []);

  useEffect(() => setOpenId(''), [filter, search]);

  const page = view === 'home' ? null : pages[view];
  const moveHome = () => setView('home');
  const chooseFilter = (next: Filter) => { setFilter(next); setSearch(''); setView('home'); };
  const openArticle = (item: Article) => { setFilter(item.category); setSearch(''); setView('home'); setOpenId(item.id); };

  return (
    <div className="app-shell">
      <header className="top-area">
        <div className="brand-row">
          <button type="button" className="site-title" onClick={moveHome} aria-label="홈으로 이동">생활정보 Q&A</button>
          <nav className="top-nav" aria-label="주요 메뉴">
            <button type="button" onClick={moveHome}>홈</button>
            <button type="button" onClick={() => setView('about')}>소개</button>
            <button type="button" onClick={() => setView('contact')}>문의</button>
          </nav>
        </div>
        <p className="hero-copy">필요한 정보를 쉽게 확인하세요. 신청 전, 계약 전, 납부 전 핵심만 정리합니다.</p>
        <label className="search-box">
          <Search size={18} aria-hidden="true" />
          <input value={search} onChange={(event) => { setSearch(event.target.value); setView('home'); }} placeholder="예: 월세 세액공제, 전입신고, 카드 리볼빙" />
        </label>
      </header>

      {view === 'home' ? (
        <>
          <nav className="filter-bar" aria-label="카테고리 선택">
            {filters.map((item) => (
              <button key={item} type="button" className={filter === item ? 'filter-chip active' : 'filter-chip'} onClick={() => chooseFilter(item)}>{item}</button>
            ))}
          </nav>
          <div className="content-layout">
            <main className="content-area">
              <div className="section-head">
                <h1>{search.trim() ? '검색 결과' : filter === '전체' ? '자주 찾는 생활 질문' : filter}</h1>
                <p>{groupLead}</p>
              </div>
              {items.length === 0 ? <div className="empty-card">검색 결과가 없습니다.</div> : (
                <section className="question-list" aria-label="질문 목록">
                  {items.map((item) => {
                    const open = openId === item.id;
                    return (
                      <article key={item.id} className={open ? 'question-card open' : 'question-card'}>
                        <button type="button" className="question-button" onClick={() => setOpenId(open ? '' : item.id)} aria-expanded={open}>
                          <span className="category-name">{item.category}</span>
                          <span className="question-title">{item.title}</span>
                          <ChevronDown className="question-icon" size={20} aria-hidden="true" />
                        </button>
                        {open && <div className="answer-panel"><Answer item={item} /><RelatedPosts item={item} onOpen={openArticle} /></div>}
                      </article>
                    );
                  })}
                </section>
              )}
            </main>
            <aside className="side-panel" aria-label="빠른 이동">
              <section><h2>카테고리</h2><div className="side-link-list">{faqCategories.map((category) => <button key={category} type="button" onClick={() => chooseFilter(category)}>{category}</button>)}</div></section>
              <section><h2>많이 찾는 질문</h2><div className="side-link-list compact">{popularItems.map((item) => <button key={item.id} type="button" onClick={() => openArticle(item)}>{item.title}</button>)}</div></section>
            </aside>
          </div>
        </>
      ) : (
        <main className="content-area single-page"><article className="info-page"><h1>{page?.title}</h1>{page?.text.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</article></main>
      )}

      <footer className="site-footer">
        <button type="button" onClick={() => setView('about')}>사이트 소개</button>
        <button type="button" onClick={() => setView('privacy')}>개인정보처리방침</button>
        <button type="button" onClick={() => setView('contact')}>문의</button>
      </footer>
    </div>
  );
}
