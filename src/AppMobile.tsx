import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { faqCategories, seedFaqArticles, seedFaqTotal, type FaqCategory } from './data/faqSeed';

type Filter = '전체' | FaqCategory;
const filters: Filter[] = ['전체', ...faqCategories];
const PAGE_SIZE = 30;

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

export default function AppMobile() {
  const [filter, setFilter] = useState<Filter>('전체');
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState(seedFaqArticles[0]?.id || '');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return seedFaqArticles.filter((item) => {
      const categoryOk = filter === '전체' || item.category === filter;
      const text = `${item.title} ${item.summary} ${item.category}`.toLowerCase();
      return categoryOk && (!keyword || text.includes(keyword));
    });
  }, [filter, search]);

  const visible = filtered.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setOpenId(filtered[0]?.id || '');
  }, [filter, search, filtered]);

  return (
    <div className="mobile-shell">
      <header className="mobile-header">
        <div className="brand-row">
          <div>
            <p className="eyebrow">생활 FAQ</p>
            <h1>모든질문</h1>
          </div>
          <div className="total-pill">{seedFaqTotal.toLocaleString('ko-KR')}</div>
        </div>
        <div className="search-wrap">
          <Search size={19} aria-hidden="true" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="궁금한 내용을 검색하세요" />
        </div>
      </header>

      <nav className="category-rail" aria-label="카테고리">
        {filters.map((item) => (
          <button key={item} type="button" className={filter === item ? 'category-chip active' : 'category-chip'} onClick={() => setFilter(item)}>
            {item}
          </button>
        ))}
      </nav>

      <main className="faq-page">
        <section className="result-summary">
          <strong>{filter}</strong>
          <span>{filtered.length.toLocaleString('ko-KR')}개</span>
        </section>

        <section className="faq-stack">
          {visible.map((item) => {
            const open = openId === item.id;
            return (
              <article key={item.id} className={open ? 'faq-item open' : 'faq-item'}>
                <button type="button" className="faq-trigger" onClick={() => setOpenId(open ? '' : item.id)} aria-expanded={open}>
                  <span className="faq-meta">{item.category}</span>
                  <span className="faq-title">{item.title}</span>
                  <span className="faq-summary">{item.summary}</span>
                  <ChevronDown className="faq-chevron" size={22} aria-hidden="true" />
                </button>
                {open && <div className="faq-answer"><BodyText text={item.body} /></div>}
              </article>
            );
          })}
        </section>

        {visibleCount < filtered.length && (
          <button type="button" className="load-more" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>더 보기</button>
        )}
      </main>
    </div>
  );
}
