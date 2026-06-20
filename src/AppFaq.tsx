import { useMemo, useState } from 'react';
import { BookOpen, Search } from 'lucide-react';
import { faqCategories, seedFaqArticles, seedFaqTotal, type FaqCategory } from './data/faqSeed';

type Filter = '전체' | FaqCategory;
const filters: Filter[] = ['전체', ...faqCategories];

function Markdown({ text }: { text: string }) {
  return <div className="article-body">{text.split('\n').map((line, index) => {
    if (line.startsWith('# ')) return <h1 key={index}>{line.slice(2)}</h1>;
    if (line.startsWith('## ')) return <h2 key={index}>{line.slice(3)}</h2>;
    if (line.startsWith('### ')) return <h3 key={index}>{line.slice(4)}</h3>;
    if (line.startsWith('- ')) return <p key={index} className="bullet">{line}</p>;
    if (/^\d+\.\s/.test(line)) return <p key={index} className="bullet">- {line}</p>;
    if (!line.trim()) return <div key={index} className="gap" />;
    return <p key={index}>{line}</p>;
  })}</div>;
}

export default function AppFaq() {
  const [filter, setFilter] = useState<Filter>('전체');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(seedFaqArticles[0]?.id || '');

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return seedFaqArticles.filter((item) => {
      const sameCategory = filter === '전체' || item.category === filter;
      const sameKeyword = !keyword || `${item.title} ${item.summary} ${item.category}`.toLowerCase().includes(keyword);
      return sameCategory && sameKeyword;
    });
  }, [filter, search]);

  const selected = seedFaqArticles.find((item) => item.id === selectedId) || filtered[0] || seedFaqArticles[0];

  return <div className="min-h-screen">
    <header className="hero">
      <div className="badge">FAQ {seedFaqTotal.toLocaleString('ko-KR')}개</div>
      <h1>모든질문 QNA</h1>
      <div className="form-card">
        <div className="row">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="검색어를 입력하세요" />
        </div>
      </div>
    </header>

    <main className="layout">
      <aside className="panel">
        <div className="section-title"><Search size={18} /> 카테고리</div>
        <div className="chips">{filters.map((item) => <button className={filter === item ? 'active' : ''} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div>
      </aside>

      <section className="content">
        <div className="list">
          <div className="section-title"><BookOpen size={18} /> FAQ 목록 · {filtered.length.toLocaleString('ko-KR')}개</div>
          {filtered.map((item) => <button className="card" key={item.id} onClick={() => setSelectedId(item.id)}>
            <div className="meta"><span>{item.category}</span><span>기본 FAQ</span></div>
            <h2>{item.title}</h2>
            <p>{item.summary}</p>
          </button>)}
        </div>
        {selected && <article className="article panel">
          <div className="meta"><span>{selected.category}</span><span>기본 FAQ</span></div>
          <Markdown text={selected.body} />
        </article>}
      </section>
    </main>
  </div>;
}
