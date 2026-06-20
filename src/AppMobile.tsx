import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { faqCategories, seedFaqArticles, type FaqCategory } from './data/faqSeed';

type Filter = '전체' | FaqCategory;
const filters: Filter[] = ['전체', ...faqCategories];
const HOME_PER_CATEGORY = 2;
const MAX_RESULTS = 24;

function BodyText({ text }: { text: string }) {
  return (
    <div className="answer-body">
      {text.split('\n').map((line, index) => {
        if (line.startsWith('# ')) return <h2 key={index}>{line.slice(2)}</h2>;
        if (line.startsWith('## ')) return <h3 key={index}>{line.slice(3)}</h3>;
        if (line.startsWith('### ')) return <h4 key={index}>{line.slice(4)}</h4>;
        if (!line.trim()) return <div key={index} className="answer-gap" />;
        return <p key={index}>{line}</p>;
      })}
    </div>
  );
}

function pickHomeItems() {
  return faqCategories.flatMap((category) => seedFaqArticles.filter((item) => item.category === category).slice(0, HOME_PER_CATEGORY));
}

export default function AppMobile() {
  const [filter, setFilter] = useState<Filter>('전체');
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState('');

  const items = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const source = keyword || filter !== '전체' ? seedFaqArticles : pickHomeItems();

    return source
      .filter((item) => {
        const categoryOk = filter === '전체' || item.category === filter;
        const text = `${item.title} ${item.summary} ${item.category}`.toLowerCase();
        return categoryOk && (!keyword || text.includes(keyword));
      })
      .slice(0, MAX_RESULTS);
  }, [filter, search]);

  useEffect(() => {
    setOpenId('');
  }, [filter, search]);

  const headline = search.trim() ? '검색 결과' : filter === '전체' ? '많이 찾는 질문' : filter;

  return (
    <div className="app-shell">
      <header className="top-area">
        <h1>모든질문</h1>
        <label className="search-box">
          <Search size={18} aria-hidden="true" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="궁금한 내용을 입력하세요" />
        </label>
      </header>

      <nav className="filter-bar" aria-label="카테고리 선택">
        {filters.map((item) => (
          <button key={item} type="button" className={filter === item ? 'filter-chip active' : 'filter-chip'} onClick={() => setFilter(item)}>
            {item}
          </button>
        ))}
      </nav>

      <main className="content-area">
        <h2>{headline}</h2>

        {items.length === 0 ? (
          <div className="empty-card">검색 결과가 없습니다.</div>
        ) : (
          <section className="question-list">
            {items.map((item) => {
              const open = openId === item.id;
              return (
                <article key={item.id} className={open ? 'question-card open' : 'question-card'}>
                  <button type="button" className="question-button" onClick={() => setOpenId(open ? '' : item.id)} aria-expanded={open}>
                    <span className="category-name">{item.category}</span>
                    <span className="question-title">{item.title}</span>
                    <ChevronDown className="question-icon" size={20} aria-hidden="true" />
                  </button>
                  {open && <div className="answer-panel"><BodyText text={item.body} /></div>}
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}
