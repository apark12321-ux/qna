import './site-structure.css';
import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { faqArticles, faqCategories, type FaqCategory } from './data/faqSeed';

type Filter = '전체' | FaqCategory;
type View = 'home' | 'about' | 'privacy' | 'contact';
type Article = (typeof faqArticles)[number];

const filters: Filter[] = ['전체', ...faqCategories];
const HOME_PER_CATEGORY = 1;
const MAX_RESULTS = 36;

const pages = {
  about: {
    title: '사이트 소개',
    text: [
      '생활정보 Q&A는 일상에서 자주 찾는 행정, 세금, 복지, 금융, 부동산, 교통 정보를 질문과 답변 형태로 정리합니다.',
      '신청, 납부, 계약, 방문처럼 실제 행동이 필요한 상황에서 먼저 확인할 내용을 쉽게 볼 수 있도록 구성했습니다.',
      '제도와 기준은 바뀔 수 있으므로 최종 신청 전에는 담당 기관이나 공식 안내 페이지를 함께 확인하는 것이 좋습니다.'
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
      '사이트 정보는 일반적인 생활 정보 정리용이며, 개인별 최종 판단이 필요한 사안은 담당 기관이나 전문가 확인이 필요합니다.'
    ]
  }
} as const;

function Answer({ text }: { text: string }) {
  return (
    <div className="answer-body">
      {text.split('\n').map((line, index) => {
        if (line.startsWith('# ')) return <h2 key={index}>{line.slice(2)}</h2>;
        if (line.startsWith('## ')) return <h3 key={index}>{line.slice(3)}</h3>;
        if (!line.trim()) return <div key={index} className="answer-gap" />;
        return <p key={index}>{line}</p>;
      })}
    </div>
  );
}

function RelatedPosts({ item, onOpen }: { item: Article; onOpen: (next: Article) => void }) {
  const related = faqArticles.filter((candidate) => candidate.category === item.category && candidate.id !== item.id).slice(0, 4);
  if (related.length === 0) return null;
  return (
    <div className="related-box">
      <h3>관련 질문</h3>
      <div className="related-list">
        {related.map((next) => <button key={next.id} type="button" onClick={() => onOpen(next)}>{next.title}</button>)}
      </div>
    </div>
  );
}

export default function AppMobileFixed() {
  const [filter, setFilter] = useState<Filter>('전체');
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState('');
  const [view, setView] = useState<View>('home');

  const items = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const homeItems = faqCategories.flatMap((category) => faqArticles.filter((item) => item.category === category).slice(0, HOME_PER_CATEGORY));
    const source = keyword || filter !== '전체' ? faqArticles : homeItems;
    return source.filter((item) => {
      const categoryOk = filter === '전체' || item.category === filter;
      const haystack = `${item.title} ${item.summary} ${item.category} ${item.body}`.toLowerCase();
      return categoryOk && (!keyword || haystack.includes(keyword));
    }).slice(0, MAX_RESULTS);
  }, [filter, search]);

  const popularItems = useMemo(() => faqCategories.map((category) => faqArticles.find((item) => item.category === category)).filter(Boolean) as Article[], []);
  useEffect(() => setOpenId(''), [filter, search]);

  const headline = search.trim() ? '검색 결과' : filter === '전체' ? '자주 찾는 생활 질문' : filter;
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
        <label className="search-box">
          <Search size={18} aria-hidden="true" />
          <input value={search} onChange={(event) => { setSearch(event.target.value); setView('home'); }} placeholder="궁금한 내용을 입력하세요" />
        </label>
      </header>

      {view === 'home' ? (
        <>
          <nav className="filter-bar" aria-label="카테고리 선택">
            {filters.map((item) => <button key={item} type="button" className={filter === item ? 'filter-chip active' : 'filter-chip'} onClick={() => chooseFilter(item)}>{item}</button>)}
          </nav>
          <div className="content-layout">
            <main className="content-area">
              <h1>{headline}</h1>
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
                        {open && <div className="answer-panel"><Answer text={item.body} /><RelatedPosts item={item} onOpen={openArticle} /></div>}
                      </article>
                    );
                  })}
                </section>
              )}
            </main>
            <aside className="side-panel" aria-label="빠른 이동">
              <section><h2>카테고리</h2><div className="side-link-list">{faqCategories.slice(0, 8).map((category) => <button key={category} type="button" onClick={() => chooseFilter(category)}>{category}</button>)}</div></section>
              <section><h2>많이 찾는 질문</h2><div className="side-link-list compact">{popularItems.slice(0, 5).map((item) => <button key={item.id} type="button" onClick={() => openArticle(item)}>{item.title}</button>)}</div></section>
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
