import { useEffect, useMemo, useState } from 'react';
import { BookOpen, FileText, Loader2, Search, Sparkles, ThumbsUp } from 'lucide-react';

type Category = '전체' | '건강' | '재정' | '생활 팁' | '기술' | '요리' | '의료' | '여행' | '교통' | '법률' | '과학';
type Article = { id: string; question: string; title: string; summary: string; category: Category; body: string; createdAt: string; helpful: number; isMock?: boolean };

const STORAGE_KEY = 'all-questions-qna:articles:v1';
const categories: Category[] = ['전체', '건강', '재정', '생활 팁', '기술', '요리', '의료', '여행', '교통', '법률', '과학'];
const samples = ['퇴직금은 정확히 어떤 기준으로 계산하나요?', '전세 계약 만료 전에 이사하면 보증금은 언제 돌려받나요?', '개인사업자 폐업 전에 꼭 확인해야 할 것은 무엇인가요?'];

function makeId() { return `qna-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
function readSaved(): Article[] { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; } }
function writeSaved(items: Article[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
function extractTitle(text: string, fallback: string) { return text.split('\n').find((line) => line.startsWith('# '))?.replace(/^#\s+/, '').slice(0, 90) || fallback; }
function extractSummary(text: string, fallback: string) { return text.replace(/^# .+$/m, '').split('\n').map((line) => line.trim()).find((line) => line.length > 70 && !line.startsWith('#') && !line.startsWith('|'))?.replace(/\*\*/g, '').slice(0, 180) || fallback; }
function quality(text: string) { return [text.length > 1200, (text.match(/^##\s+/gm) || []).length >= 3, text.includes('|'), /FAQ|자주 묻는 질문/.test(text), /공식|전문가|확인|최신/.test(text)].filter(Boolean).length * 20; }

function Markdown({ text }: { text: string }) {
  const lines = text.split('\n');
  return <div className="article-body">{lines.map((line, i) => {
    if (line.startsWith('# ')) return <h1 key={i}>{line.slice(2)}</h1>;
    if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>;
    if (line.startsWith('### ')) return <h3 key={i}>{line.slice(4)}</h3>;
    if (line.startsWith('|')) return <pre key={i}>{line}</pre>;
    if (line.startsWith('- ')) return <p key={i} className="bullet">{line}</p>;
    if (!line.trim()) return <div key={i} className="gap" />;
    return <p key={i}>{line}</p>;
  })}</div>;
}

export default function App() {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState<Category>('생활 팁');
  const [filter, setFilter] = useState<Category>('전체');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<Article[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(false);
  const [adPreview, setAdPreview] = useState(false);

  useEffect(() => setItems(readSaved()), []);
  const selected = items.find((item) => item.id === selectedId);
  const filtered = useMemo(() => items.filter((item) => (filter === '전체' || item.category === filter) && `${item.title} ${item.question} ${item.summary}`.toLowerCase().includes(search.toLowerCase())), [items, filter, search]);

  async function generate(input = question) {
    const text = input.trim();
    if (text.length < 4 || loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate-answer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: text, categoryName: category }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || '생성 실패');
      const body = json.answer as string;
      const article: Article = { id: makeId(), question: text, title: extractTitle(body, text), summary: extractSummary(body, text), category, body, createdAt: new Date().toISOString(), helpful: 0, isMock: json.isMock };
      const next = [article, ...items].slice(0, 80);
      setItems(next); writeSaved(next); setSelectedId(article.id); setQuestion('');
    } catch (error: any) {
      alert(error?.message || '생성 중 오류가 발생했습니다.');
    } finally { setLoading(false); }
  }

  function vote(id: string) {
    const next = items.map((item) => item.id === id ? { ...item, helpful: item.helpful + 1 } : item);
    setItems(next); writeSaved(next);
  }

  function copy(text: string) { navigator.clipboard?.writeText(text); }

  return <div className="min-h-screen">
    <header className="hero">
      <div className="badge"><Sparkles size={16} /> AI Q&A Knowledge Portal</div>
      <h1>모든질문 QNA</h1>
      <p>한국 생활형 질문을 검색 유입용 저장형 Q&A 칼럼으로 정리합니다. 공식 확인이 필요한 영역은 고지와 체크리스트를 함께 제공합니다.</p>
      <div className="form-card">
        <div className="row">
          <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>{categories.filter((c) => c !== '전체').map((c) => <option key={c}>{c}</option>)}</select>
          <input value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && generate()} placeholder="예: 전세 계약 만료 전에 이사하면 보증금은 언제 돌려받나요?" />
          <button onClick={() => generate()} disabled={loading}>{loading ? <Loader2 className="spin" size={18} /> : '글 생성'}</button>
        </div>
        <div className="samples">{samples.map((sample) => <button key={sample} onClick={() => generate(sample)}>{sample}</button>)}</div>
      </div>
    </header>

    <main className="layout">
      <aside className="panel">
        <div className="section-title"><Search size={18} /> 검색·필터</div>
        <input className="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="검색어" />
        <div className="chips">{categories.map((c) => <button className={filter === c ? 'active' : ''} key={c} onClick={() => setFilter(c)}>{c}</button>)}</div>
        <label className="toggle"><input type="checkbox" checked={adPreview} onChange={(e) => setAdPreview(e.target.checked)} /> 광고 미리보기</label>
        {adPreview && <div className="ad">AdSense Preview<br />콘텐츠 승인 전에는 빈 광고보다 클린 모드를 권장합니다.</div>}
      </aside>

      <section className="content">
        {selected ? <article className="article panel">
          <button className="ghost" onClick={() => setSelectedId('')}>← 목록으로</button>
          <div className="meta"><span>{selected.category}</span><span>{new Date(selected.createdAt).toLocaleString('ko-KR')}</span><span>품질 {quality(selected.body)}점</span>{selected.isMock && <span>Preview</span>}</div>
          <Markdown text={selected.body} />
          <div className="actions"><button onClick={() => vote(selected.id)}><ThumbsUp size={16} /> 도움됨 {selected.helpful}</button><button onClick={() => copy(selected.body)}>본문 복사</button></div>
          <p className="notice">의료·법률·금융·세무·행정 정보는 실제 실행 전 공식 기관과 전문가 확인이 필요합니다.</p>
        </article> : <div className="list">
          <div className="section-title"><BookOpen size={18} /> 저장된 Q&A 칼럼</div>
          {filtered.length === 0 && <div className="empty"><FileText size={32} /> 아직 생성된 글이 없습니다. 위 입력창에서 첫 질문을 생성해 보세요.</div>}
          {filtered.map((item) => <button className="card" key={item.id} onClick={() => setSelectedId(item.id)}><div className="meta"><span>{item.category}</span><span>품질 {quality(item.body)}점</span></div><h2>{item.title}</h2><p>{item.summary}</p></button>)}
        </div>}
      </section>

      <aside className="panel policies">
        <h3>운영 고지</h3>
        <p>생성형 AI 답변은 정보 탐색 보조용입니다. 확정 판단, 계약, 치료, 투자, 세무 신고는 공식 자료를 기준으로 검토하십시오.</p>
        <h3>문의</h3>
        <p>운영자 정보와 연락처는 배포 전 실제 서비스 기준으로 수정하십시오.</p>
      </aside>
    </main>
  </div>;
}
