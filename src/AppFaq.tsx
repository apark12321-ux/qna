import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Search } from 'lucide-react';
import { faqCategories, seedFaqArticles, seedFaqTotal, type FaqCategory } from './data/faqSeed';

type Filter = '전체' | FaqCategory;

const filters: Filter[] = ['전체', ...faqCategories];

function Markdown({ text }: { text: string }) {
  return (
    <div className="article-body">
      {text.split('\n').map((line, index) => {
        if (line.startsWith('# ')) return <h1 key={index}>{line.slice(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={index}>{line.slice(3)}</h2>;
        if (line.startsWith('### ')) return <h3 key={index}>{line.slice(4)}</h3>;
        if (line.startsWith('- ')) return <p key={index} className="bullet">{line}</p>;
        if (/^\d+\.\s/.test(line)) return <p key={index} className="bullet">- {line}</p>;
        if (!line.trim()) return <div key={index} className="gap" />;
        return <p key={index}>{line}</p>;
      })}
    </div>
  );
}

export default function AppFaq() {
  const [filter, setFilter] = useState<Filter>('전체');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(seedFaqArticles[0]?.id || '');

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return seedFaqArticles.filter((item) => {
      const sameCategory = filter === '전체' || item.category === filter;
      const haystack = `${item.title} ${item.summary} ${item.category}`.toLowerCase();
      const sameKeyword = !keyword || haystack.includes(keyword);
      return sameCategory && sameKeyword;
    });
  }, [filter, search]);

  useEffect(() => {
    if (!filtered.length) return;
    if (!filtered.some((item) => item.id === selectedId)) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const selected = filtered.find((item) => item.id === selectedId) || filtered[0] || seedFaqArticles[0];

  return (
    <div className="app-shell">
      <header className="hero compact-hero">
        <div className="badge">FAQ {seedFaqTotal.toLocaleString('ko-KR')}개</div>
        <h1>모든질문 QNA</h1>
        <div className="form-card search-card">
          <label className="sr-only" htmlFor="faq-search">검색어</label>
          <input
            id="faq-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="검색어를 입력하세요"
            autoComplete="off"
          />
        </div>
      </header>

      <main className="faq-layout">
        <aside className="panel category-panel" aria-label="카테고리 선택">
          <div className="section-title"><Search size={18} /> 카테고리</div>
          <div className="chips">
            {filters.map((item) => (
              <button
                type="button"
                className={filter === item ? 'active' : ''}
                key={item}
                onClick={() => setFilter(item)}
                aria-pressed={filter === item}
              >
                {item}
              </button>
            ))}
          </div>
        </aside>

        <section className="faq-content">
          <div className="list panel list-panel">
            <div className="section-title"><BookOpen size={18} /> FAQ 목록 · {filtered.length.toLocaleString('ko-KR')}개</div>
            {!filtered.length && <div className="empty">검색 결과가 없습니다.</div>}
            {filtered.map((item) => (
              <button
                type="button"
                className={`card faq-card ${selected?.id === item.id ? 'selected' : ''}`}
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                aria-pressed={selected?.id === item.id}
              >
                <div className="meta"><span>{item.category}</span><span>FAQ</span></div>
                <h2>{item.title}</h2>
                <p>{item.summary}</p>
              </button>
            ))}
          </div>

          {selected && (
            <article className="article panel detail-panel">
              <div className="meta"><span>{selected.category}</span><span>FAQ</span></div>
              <Markdown text={selected.body} />
            </article>
          )}
        </section>
      </main>
    </div>
  );
}
