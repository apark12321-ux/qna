import React from 'react';
import { CornerUpLeft, MessageSquare, Flame, Clock, Heart, Eye } from 'lucide-react';
import { Article } from '../types';

interface ArticleListProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export default function ArticleList({ articles, onSelectArticle }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12 px-4 border border-dashed border-slate-200 bg-slate-50 rounded-2xl">
        <p className="text-gray-500 font-medium">검색 결과에 맞는 질문과 아티클이 아직 존재하지 않습니다.</p>
        <p className="text-xs text-slate-400 mt-2">상단의 AI 실시간 지식 생성 엔진을 이용해 새로운 해답을 즉석 발행해 보관해 보세요!</p>
      </div>
    );
  }

  // Formatting helper for relative date
  const formatKoreanDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date('2026-06-19T20:45:26-07:00'); // Consistent reference date
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 0) return '오늘';
      if (diffDays === 1) return '어제';
      if (diffDays < 7) return `${diffDays}일 전`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    } catch {
      return '최근';
    }
  };

  return (
    <div className="space-y-4">
      {articles.map((article) => {
        const isNew = new Date(article.createdAt).getTime() > new Date('2026-06-18').getTime();

        return (
          <div
            key={article.id}
            onClick={() => onSelectArticle(article)}
            className="group bg-white border border-slate-200 hover:border-slate-900 p-5 rounded-sm flex items-center justify-between gap-4 cursor-pointer transition-all text-left shadow-sm"
          >
            {/* Left Portion: Decorative Round Q&A Arrow Button */}
            <div className="flex items-center gap-4 min-w-0">
              <div 
                className="w-11 h-11 bg-slate-100 text-slate-800 group-hover:bg-black group-hover:text-white rounded-sm flex items-center justify-center shrink-0 transition-all"
                aria-hidden="true"
              >
                <CornerUpLeft className="w-4 h-4 transform rotate-90" />
              </div>

              {/* Middle Portion: Title and details */}
              <div className="min-w-0">
                <div className="flex items-center flex-wrap gap-2 mb-1.5">
                  <span className="text-[9px] bg-slate-900 text-white font-black px-2 py-0.5 rounded-sm uppercase tracking-wider">
                    {article.categoryName}
                  </span>
                  {isNew && (
                    <span className="text-[9px] bg-red-600 text-white font-black px-1.5 py-0.2 rounded-sm tracking-wide animate-pulse">
                      NEW
                    </span>
                  )}
                  {article.isGenerated && (
                    <span className="text-[9px] bg-blue-600 text-white font-black px-1.5 py-0.2 rounded-sm tracking-wide uppercase">
                      AI EDITORIAL
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-slate-950 group-hover:text-blue-600 transition-colors text-sm sm:text-base leading-snug line-clamp-1">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1 hidden sm:block font-medium">
                  {article.summary}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 font-bold uppercase tracking-wider">
                  <span>{article.author}</span>
                  <span>•</span>
                  <span>{formatKoreanDate(article.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Right Portion: Stats Indicators redesigned with sophisticated editorial design */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Slate-100 stat box for View Count */}
              <div 
                className="w-14 sm:w-16 h-12 rounded-sm bg-slate-100 hover:bg-slate-200 border border-slate-200/60 text-slate-800 flex flex-col items-center justify-center text-center transition-all"
                title={`${article.views}회 조회`}
              >
                <span className="font-black text-xs sm:text-base leading-none text-black">{article.views}</span>
                <span className="text-[8px] sm:text-[9px] mt-1 font-black uppercase tracking-wider text-slate-400">VIEWS</span>
              </div>

              {/* Pitch-black stat box for Read Time */}
              <div 
                className="w-14 sm:w-16 h-12 rounded-sm bg-black text-white hover:bg-slate-800 flex flex-col items-center justify-center text-center transition-all"
                title={`읽기 소요 시간 약 ${article.readingTime}분`}
              >
                <span className="font-black text-xs sm:text-base leading-none">{article.readingTime}m</span>
                <span className="text-[8px] sm:text-[9px] mt-1 font-black uppercase tracking-wider text-slate-400">READ</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
