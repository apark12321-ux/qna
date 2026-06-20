import React from 'react';
import { Search, Home, Heart, Coins, Lightbulb, Cpu, ChefHat, Stethoscope, Compass, Car, Scale, Atom, ShieldCheck, Mail, FileText, AlertTriangle } from 'lucide-react';
import { CategoryId, CategoryInfo } from '../types';
import { CATEGORIES } from '../data';

interface HeaderProps {
  activeCategory: CategoryId | 'policy-privacy' | 'policy-terms' | 'policy-disclaimer' | 'contact-us' | 'home';
  onSelectCategory: (category: CategoryId | 'policy-privacy' | 'policy-terms' | 'policy-disclaimer' | 'contact-us' | 'home') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart,
  Coins,
  Lightbulb,
  Cpu,
  ChefHat,
  Stethoscope,
  Compass,
  Car,
  Scale,
  Atom,
};

export default function Header({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-50">
      {/* Upper Brand & Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div 
          onClick={() => onSelectCategory('home')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 bg-black flex items-center justify-center rounded-sm shadow-sm group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-xl tracking-tighter">Q</span>
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-slate-900 uppercase">
              모든질문 <span className="text-blue-600">QNA</span>
            </h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] -mt-1">K-QNA EDITORIAL DIRECTORY</p>
          </div>
        </div>

        {/* Search Input Box consistent with design */}
        <div className="relative w-full max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="궁금한 질문이나 키워드를 검색하세요..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-100 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all border border-slate-200/60"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Policy & Info links redesigned as editorial labels with small uppercase letters */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <button
            onClick={() => onSelectCategory('policy-privacy')}
            className={`hover:text-blue-600 transition-colors py-1 px-1 flex items-center gap-1 ${activeCategory === 'policy-privacy' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>개인정보처리방침</span>
          </button>
          <button
            onClick={() => onSelectCategory('policy-terms')}
            className={`hover:text-blue-600 transition-colors py-1 px-1 flex items-center gap-1 ${activeCategory === 'policy-terms' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span>이용약관</span>
          </button>
          <button
            onClick={() => onSelectCategory('policy-disclaimer')}
            className={`hover:text-blue-600 transition-colors py-1 px-1 flex items-center gap-1 ${activeCategory === 'policy-disclaimer' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
          >
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>면책고지</span>
          </button>
          <button
            onClick={() => onSelectCategory('contact-us')}
            className={`hover:text-blue-600 transition-colors py-1 px-1 flex items-center gap-1 ${activeCategory === 'contact-us' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
          >
            <Mail className="w-3.5 h-3.5 shrink-0" />
            <span>문의제안</span>
          </button>
        </div>
      </div>

      {/* Main Categories Navigation Bar - Clean, high contrast editorial layout instead of solid blue */}
      <div className="bg-slate-50 border-t border-slate-200 select-none">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-none">
          <nav className="flex space-x-1 sm:space-x-1.5 py-2 min-w-max">
            {/* Home Tab */}
            <button
              onClick={() => onSelectCategory('home')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-sm text-xs font-black uppercase tracking-[0.1em] transition-all ${
                activeCategory === 'home'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200 hover:text-black'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>홈</span>
            </button>

            {/* Category Elements */}
            {CATEGORIES.map((cat) => {
              const IconComp = ICON_MAP[cat.icon] || Lightbulb;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-sm text-xs font-black uppercase tracking-[0.1em] transition-all ${
                    activeCategory === cat.id
                      ? 'bg-black text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200/80 hover:text-black'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5 shrink-0 text-current" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
