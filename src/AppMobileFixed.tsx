import './site-structure.css';
import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { faqArticles, type FaqCategory } from './data/faqSeed';

type Cluster = '전체' | '지원금·신청' | '세금·환급' | '집·계약' | '금융·보험' | '일·사업' | '생활·교통';
type View = 'home' | 'about' | 'privacy' | 'contact';
type Article = (typeof faqArticles)[number];

const categoryGroups: Record<Exclude<Cluster, '전체'>, FaqCategory[]> = {
  '지원금·신청': ['행정·민원', '복지·지원금', '건강보험·의료', '가족·육아·교육'],
  '세금·환급': ['세금·연말정산'],
  '집·계약': ['부동산·전월세', '생활·소비자', '법률·분쟁'],
  '금융·보험': ['금융·보험'],
  '일·사업': ['취업·노동', '창업·사업자'],
  '생활·교통': ['자동차·교통', '통신·디지털', '여행·여가', '안전·재난']
};

const filters: Cluster[] = ['전체', ...Object.keys(categoryGroups)] as Cluster[];
const HOME_PER_GROUP = 5;
const MAX_RESULTS = 36;

const pages = {
  about: {
    title: '사이트 소개',
    text: [
      '생활정보 Q&A는 신청, 환급, 계약, 생활비, 교통, 소비자 문제처럼 일상에서 자주 찾는 정보를 질문과 답변 형태로 정리합니다.',
      '각 글은 먼저 확인할 내용, 준비할 자료, 진행 순서, 주의할 점을 중심으로 구성합니다.',
      '제도와 기준은 바뀔 수 있으므로 최종 신청 전에는 담당 기관이나 공식 안내 페이지에서 최신 기준을 확인하는 것이 좋습니다.'
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

function getCluster(category: FaqCategory): Exclude<Cluster, '전체'> {
  const found = Object.entries(categoryGroups).find(([, categories]) => categories.includes(category));
  return (found?.[0] ?? '생활·교통') as Exclude<Cluster, '전체'>;
}

function isInCluster(item: Article, filter: Cluster) {
  if (filter === '전체') return true;
  return categoryGroups[filter].includes(item.category);
}

function Answer({ item }: { item: Article }) {
  const paragraphs = item.body
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('# '));

  return (
    <div className="answer-body">
      <p className="answer-summary"><strong>핵심:</strong> {item.summary}</p>
      <h3>먼저 확인할 것</h3>
      <p>{paragraphs[0]}</p>
      <h3>준비와 진행 순서</h3>
      <p>{paragraphs[1]}</p>
      <h3>주의할 점</h3>
      <p>{paragraphs[2]}</p>
      <h3>최종 확인</h3>
      <p>{paragraphs[3] ?? '신청, 납부, 계약, 신고 후에는 접수번호와 처리 예정일을 따로 기록해 두는 것이 좋습니다.'}</p>
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
  const [filter, setFilter] = useState<Cluster>('전체');
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState('');
  const [view, setView] = useState<View>('home');

  const groupLead = filter === '전체'
    ? '신청, 환급, 계약, 생활 문제를 빠르게 확인하세요.'
    : `${filter} 관련 질문을 상황별로 정리했습니다.`;

  const homeItems = useMemo(() => {
    return (Object.keys(categoryGroups) as Exclude<Cluster, '전체'>[]).flatMap((group) => {
      const categories = categoryGroups[group];
      return faqArticles.filter((item) => categories.includes(item.category)).slice(0, HOME_PER_GROUP);
    });
  }, []);

  const items = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const source = keyword || filter !== '전체' ? faqArticles : homeItems;
    return source.filter((item) => {
      const haystack = `${item.title} ${item.summary} ${item.category} ${getCluster(item.category)} ${item.body}`.toLowerCase();
      return isInCluster(item, filter) && (!keyword || haystack.includes(keyword));
    }).slice(0, MAX_RESULTS);
  }, [filter, homeItems, search]);

  const popularItems = useMemo(() => {
    return (Object.keys(categoryGroups) as Exclude<Cluster, '전체'>[])
      .map((group) => faqArticles.find((item) => categoryGroups[group].includes(item.category)))
      .filter(Boolean) as Article[];
  }, []);

  useEffect(() => setOpenId(''), [filter, search]);

  const page = view === 'home' ? null : pages[view];
  const moveHome = () => setView('home');
  const chooseFilter = (next: Cluster) => { setFilter(next); setSearch(''); setView('home'); };
  const openArticle = (item: Article) => { setFilter(getCluster(item.category)); setSearch(''); setView('home'); setOpenId(item.id); };

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
        <p className="hero-copy">필요한 생활 정보를 신청 전, 계약 전, 납부 전에 바로 확인하세요.</p>
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
                          <span className="category-name">{getCluster(item.category)} · {item.category}</span>
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
              <section><h2>카테고리</h2><div className="side-link-list">{filters.filter((item) => item !== '전체').map((group) => <button key={group} type="button" onClick={() => chooseFilter(group)}>{group}</button>)}</div></section>
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
