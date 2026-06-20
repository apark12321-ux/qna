import React, { useState, useEffect } from 'react';
import { ChevronLeft, Share2, Printer, ThumbsUp, ThumbsDown, Bookmark, Check, Send, User, Calendar, Eye, BookmarkCheck } from 'lucide-react';
import { Article, Comment } from '../types';
import AdSlot from './AdSlot';

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
  onVoteHelpful: (articleId: string, type: 'helpful' | 'unhelpful') => void;
  adsensePrepMode?: boolean;
}

export default function ArticleView({ article, onBack, onVoteHelpful, adsensePrepMode = false }: ArticleViewProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [voted, setVoted] = useState<'helpful' | 'unhelpful' | null>(null);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c1',
      author: '자취청년 박지성',
      content: '진짜 상세하고 정합성 높게 나와 있네요. 세세한 보조 대안까지 표로 기재되어 있어서 한눈에 보입니다. 바로 주거래 앱 켜서 신청했습니다!',
      createdAt: '2026-06-19T05:22:00.000Z',
    },
    {
      id: 'c2',
      author: '리빙마스터 최순희',
      content: '매년 애드센스 서칭하면서 이런 요점 잘 정리한 칼럼을 찾기 힘들었는데, 신뢰가 가는 글입니다. 다른 시리즈 글도 기대하겠습니다.',
      createdAt: '2026-06-19T10:45:00.000Z',
    }
  ]);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  // Scroll to main layout on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [article.id]);

  // Dynamic Headings Core Extractor
  const extractHeadings = (text: string) => {
    const lines = text.split('\n');
    const headings: { text: string; id: string }[] = [];
    lines.forEach((line) => {
      if (line.startsWith('## ')) {
        const title = line.replace('## ', '').replace(/\*/g, '').trim();
        const id = title.replace(/\s+/g, '-').toLowerCase();
        headings.push({ text: title, id });
      }
    });
    return headings;
  };

  const headings = extractHeadings(article.content);

  const handleShare = () => {
    const mockUrl = `${window.location.origin}/article/${article.id}`;
    navigator.clipboard.writeText(mockUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleVote = (type: 'helpful' | 'unhelpful') => {
    if (voted) return;
    setVoted(type);
    onVoteHelpful(article.id, type);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;

    const fresh: Comment = {
      id: `comment-${Date.now()}`,
      author: newCommentName,
      content: newCommentText,
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [...prev, fresh]);
    setNewCommentName('');
    setNewCommentText('');
  };

  // Highly robust custom markdown renderer
  const renderMarkdown = (markdown: string) => {
    const blocks = markdown.split('\n\n');
    let inTable = false;
    let tableRows: string[][] = [];

    return blocks.map((block, blockIndex) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // Render Headings
      if (trimmed.startsWith('# ')) {
        return (
          <h1 key={blockIndex} className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mt-6 mb-4">
            {trimmed.replace('# ', '')}
          </h1>
        );
      }

      if (trimmed.startsWith('## ')) {
        const title = trimmed.replace('## ', '').replace(/\*/g, '').trim();
        const id = title.replace(/\s+/g, '-').toLowerCase();
        return (
          <h2
            key={blockIndex}
            id={id}
            className="text-lg sm:text-xl font-black text-slate-900 tracking-tight pb-2 border-b border-slate-200 mt-8 mb-4 flex items-center gap-2 uppercase"
          >
            <span className="w-1.5 h-5 bg-black inline-block"></span>
            {title}
          </h2>
        );
      }

      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={blockIndex} className="text-base sm:text-lg font-bold text-slate-900 mt-6 mb-3">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      // Check if line contains a Table structure
      if (trimmed.startsWith('|')) {
        const lines = trimmed.split('\n');
        const rows = lines
          .map((line) => line.trim())
          .filter((line) => line.startsWith('|') && line.endsWith('|'))
          .map((line) => {
            return line
              .split('|')
              .map((cell) => cell.trim())
              .filter((cell, idx, arr) => idx > 0 && idx < arr.length - 1);
          });

        // Filter out dividing lines (dashed rows)
        const validRows = rows.filter((row) => !row.every((cell) => cell.includes('---') || cell.includes(':---')));

        if (validRows.length > 0) {
          return (
            <div key={blockIndex} className="overflow-x-auto my-6 border border-slate-200 rounded-xl shadow-sm">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold text-left">
                    {validRows[0].map((cell, idx) => (
                      <th key={idx} className="px-4 py-3 border-r border-slate-200 last:border-0">
                        {cell.replace(/\*\*/g, '')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {validRows.slice(1).map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-slate-50 transition-colors">
                      {row.map((cell, idx) => (
                        <td key={idx} className="px-4 py-3 border-r border-slate-200 last:border-0 leading-relaxed font-medium">
                          {cell.split('**').map((chunk, cIdx) => (cIdx % 2 === 1 ? <strong key={cIdx} className="text-slate-900">{chunk}</strong> : chunk))}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
      }

      // Render Bullet list blocks (e.g. lines starting with * or -)
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const items = trimmed.split('\n').map((line) => line.replace(/^[\*\-]\s+/, '').trim());
        return (
          <ul key={blockIndex} className="list-disc pl-5 my-4 space-y-2 text-slate-700 text-sm sm:text-base leading-relaxed">
            {items.map((item, idx) => {
              // Parse bold inline matches
              const textWithBold = parseInlineMarkdown(item);
              return <li key={idx}>{textWithBold}</li>;
            })}
          </ul>
        );
      }

      // Render Number lists
      if (/^\d+\.\s+/.test(trimmed)) {
        const items = trimmed.split('\n').map((line) => line.replace(/^\d+\.\s+/, '').trim());
        return (
          <ol key={blockIndex} className="list-decimal pl-5 my-4 space-y-2 text-slate-700 text-sm sm:text-base leading-relaxed">
            {items.map((item, idx) => (
              <li key={idx}>{parseInlineMarkdown(item)}</li>
            ))}
          </ol>
        );
      }

      // Normal paragraph handling
      const isQuote = trimmed.startsWith('>');
      if (isQuote) {
        return (
          <blockquote key={blockIndex} className="border-l-4 border-black bg-slate-50 p-4.5 my-5 text-slate-800 text-sm sm:text-base leading-relaxed font-semibold italic">
            {parseInlineMarkdown(trimmed.replace(/^>\s*/, ''))}
          </blockquote>
        );
      }

      return (
        <p key={blockIndex} className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4 text-justify whitespace-pre-line">
          {parseInlineMarkdown(trimmed)}
        </p>
      );
    });
  };

  // Helper parser for bold text inside lists/paragraphs
  const parseInlineMarkdown = (text: string) => {
    const parts = text.split('**');
    return parts.map((part, index) => {
      // Every odd element was surrounded by '**'
      if (index % 2 === 1) {
        // Highlight some special bullet keys or main terms
        if (part.startsWith('[') && part.includes(']')) {
          const bracketSplit = part.split(']');
          const badge = bracketSplit[0].replace('[', '');
          const rest = bracketSplit.slice(1).join(']');
          return (
            <React.Fragment key={index}>
              <span className="bg-sky-100 text-sky-950 font-bold px-1.5 py-0.5 rounded text-xs mr-1">{badge}</span>
              <strong className="text-slate-900">{rest}</strong>
            </React.Fragment>
          );
        }
        return <strong key={index} className="text-slate-950 font-bold">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto items-start animate-fade-in">
      {/* Left sidebar / Floating Widget for Desktop */}
      <div className="hidden lg:block lg:col-span-3 space-y-6">
        <button
          onClick={onBack}
          className="w-full flex items-center justify-center gap-2 bg-black hover:bg-slate-800 text-white py-3.5 px-4 rounded-sm text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4 text-white" /> 목록으로 돌아가기
        </button>

        {headings.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-sm p-5 sticky top-24 shadow-sm text-left">
            <h4 className="font-black text-slate-900 text-xs mb-3 pb-2 border-b border-slate-200 uppercase tracking-widest">
              핵심 목차 (ToC)
            </h4>
            <nav className="space-y-2.5 text-xs">
              {headings.map((h, i) => (
                <a
                  key={i}
                  href={`#${h.id}`}
                  className="block text-slate-600 hover:text-black font-bold transition-colors line-clamp-1 py-1 border-l border-transparent hover:border-black pl-2"
                >
                  {i + 1}. {h.text}
                </a>
              ))}
            </nav>
          </div>
        )}

        <AdSlot id="sidebar-view" type="skyscraper" category={article.categoryId} />
      </div>

      {/* Main Reading Canvas */}
      <div className="lg:col-span-9 space-y-6">
        {/* Mobile top controls */}
        <div className="lg:hidden flex items-center justify-between border-b border-slate-200 pb-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-black text-white bg-black py-2 px-4 rounded-sm uppercase tracking-wider"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-white" /> 전체목록
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-800"
              title="SNS 주소 복사"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-800"
              title="인쇄"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Read Article Details Box */}
        <article className="bg-white border border-slate-200 rounded-sm p-5 sm:p-10 shadow-sm text-left">
          {/* Metadata */}
          <div className="flex items-center flex-wrap gap-2 text-[10px] font-black uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100">
            <span className="bg-blue-600 text-white font-black px-2 py-0.5 rounded-sm">
              {article.categoryName}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> {article.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {new Date(article.createdAt).toLocaleDateString('ko-KR')}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {article.views} VIEWS
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 leading-[1.15] tracking-tight mb-5 italic">
            {article.title}
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed bg-slate-100 border-l-4 border-slate-900 p-4.5 rounded-sm mb-8 font-medium">
            <strong>K-QNA SUMMARY:</strong> {article.summary}
          </p>

          {/* Social Toolbar for Desktop */}
          <div className="hidden lg:flex items-center justify-between border-y border-slate-200 py-3.5 mb-6 text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>약 {article.readingTime}분 분량의 지식 에디터 엄선 기사</span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-black font-black py-2 px-3.5 border border-slate-300 rounded-sm transition-all"
              >
                {copySuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 animate-scale-up" />
                    <span className="text-emerald-600">주소 복사됨!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>주소 복사</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-black font-black py-2 px-3.5 border border-slate-300 rounded-sm transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-slate-700" />
                <span>문서 인쇄</span>
              </button>
            </div>
          </div>

          {/* Core AdSlot Placeholder directly inside the text before the main content blocks */}
          <div className="mb-6">
            <AdSlot id="article-top-ad" type="leaderboard" category={article.categoryId} />
          </div>

          {/* Render parsed contents */}
          <div className="prose max-w-none text-slate-900 font-serif leading-relaxed">
            {renderMarkdown(article.content)}
          </div>

          {/* Middle Article Inline Square Ad to maximize mock earning visualization */}
          <div className="my-8 max-w-sm mx-auto">
            <AdSlot id="article-middle-ad" type="rectangle" category={article.categoryId} />
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-4 border-t border-slate-200 flex flex-wrap gap-2">
              {article.tags.map((tag, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-600 hover:text-black border border-transparent hover:border-slate-300 px-3 py-1 rounded-sm text-xs cursor-pointer font-bold uppercase tracking-wider transition-all">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Dynamic Article Rating Widget */}
          <div className="mt-8 bg-slate-50 rounded-sm p-6 sm:p-8 text-center border border-slate-200">
            <h4 className="font-black text-slate-900 text-base sm:text-lg mb-2 uppercase tracking-wide">이 해답 칼럼이 원하던 해결에 도움을 드렸나요?</h4>
            <p className="text-xs text-slate-500 mb-5 font-medium">보내주신 평점은 한국 지식 엔진 콘텐츠 개선 및 애드센스 우수 칼럼 엄선에 적극 반영됩니다.</p>
            
            <div className="flex items-center justify-center flex-wrap gap-3">
              <button
                onClick={() => handleVote('helpful')}
                disabled={!!voted}
                className={`py-2.5 px-5 rounded-sm text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all outline-none ${
                  voted === 'helpful'
                    ? 'bg-black text-white'
                    : 'bg-white hover:bg-slate-100 text-slate-900 border border-slate-200'
                } ${!!voted && voted !== 'helpful' ? 'opacity-50' : ''}`}
              >
                <ThumbsUp className="w-4 h-4 text-emerald-600" /> 
                도움이 되었습니다 ({article.helpfulCount + (voted === 'helpful' ? 1 : 0)})
              </button>

              <button
                onClick={() => handleVote('unhelpful')}
                disabled={!!voted}
                className={`py-2.5 px-5 rounded-sm text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all outline-none ${
                  voted === 'unhelpful'
                    ? 'bg-black text-white'
                    : 'bg-white hover:bg-slate-100 text-slate-900 border border-slate-200'
                } ${!!voted && voted !== 'unhelpful' ? 'opacity-50' : ''}`}
              >
                <ThumbsDown className="w-4 h-4 text-red-600" />
                아쉬웠습니다 ({article.unhelpfulCount + (voted === 'unhelpful' ? 1 : 0)})
              </button>
            </div>
            
            {voted && (
              <p className="text-xs font-bold text-emerald-600 mt-4 flex items-center justify-center gap-1">
                <BookmarkCheck className="w-4 h-4 text-emerald-600" /> 피드백이 정성껏 제출되었습니다. 감사합니다!
              </p>
            )}
          </div>
        </article>

        {/* Section bottom Leaderboard Placement */}
        {!adsensePrepMode && (
          <AdSlot id="article-bottom-leader" type="leaderboard" category={article.categoryId} />
        )}

        {/* Comments Segment */}
        <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-10 text-left space-y-6 shadow-sm">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest flex items-center gap-2">
              질답 커뮤니티 댓글 ({comments.length})
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">K-QNA DISCUSSION FORUM</span>
          </div>

          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4.5 bg-slate-50 border border-slate-200/40 rounded-sm flex gap-3 text-xs sm:text-sm">
                <div className="w-9 h-9 bg-black text-white flex items-center justify-center rounded-sm shrink-0 font-black text-sm uppercase">
                  {comment.author.charAt(0)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-950">{comment.author}</span>
                    <span className="text-[10px] font-bold text-slate-400">{new Date(comment.createdAt).toLocaleDateString('ko-KR')}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* New comment input form */}
          <form onSubmit={handleAddComment} className="pt-2 space-y-4">
            <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">한 줄 평가 및 피드백 작성하기</h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-1">
                <input
                  type="text"
                  required
                  placeholder="닉네임"
                  className="w-full text-xs font-bold border border-slate-200 rounded-sm p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-slate-900 placeholder-slate-400"
                  value={newCommentName}
                  onChange={(e) => setNewCommentName(e.target.value)}
                />
              </div>
              <div className="sm:col-span-3 relative">
                <input
                  type="text"
                  required
                  placeholder="댓글 내용을 기재해 주세요..."
                  className="w-full text-xs font-medium border border-slate-200 rounded-sm p-3 pr-16 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-slate-900 placeholder-slate-400"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 px-3 py-1.5 text-white bg-black hover:bg-slate-800 rounded-sm font-black text-[10px] uppercase tracking-wider"
                >
                  보내기
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
