import React, { useState, useEffect } from 'react';
import { ExternalLink, Shield } from 'lucide-react';
import { CategoryId } from '../types';

interface AdSlotProps {
  id: string;
  type: 'leaderboard' | 'rectangle' | 'skyscraper' | 'native' | 'sticky';
  category?: CategoryId;
}

interface MockAd {
  title: string;
  desc: string;
  cta: string;
  displayUrl: string;
}

const CATEGORY_MOCK_ADS: Record<CategoryId | 'default', MockAd[]> = {
  health: [
    {
      title: '관절 연골 영양제 보스웰리아 특가전',
      desc: '식약처 인증 관절 통증 개선율 92.4%! 선착순 100명 특별 2+1 기회.',
      cta: '혜택 확인하기',
      displayUrl: 'www.jointhealth-well.co.kr/special',
    },
    {
      title: '만 65세 이상 정부 임플란트 지원금 신청 가이드',
      desc: '본인 주소지 매칭 무료 지원 혜택 및 치아 건강 복지 전격 요약 정리.',
      cta: '신청 대상 조회',
      displayUrl: 'subside.dental-assist.or.kr',
    }
  ],
  finance: [
    {
      title: 'CMA 사상 최대 연 3.9% 금리 파킹통장',
      desc: '단 하루만 맡겨도 매일 밤 일복리 이자 지급! 수수료 무제한 무상 면제.',
      cta: '모바일 1분 개설',
      displayUrl: 'www.m-investment-cma.com',
    },
    {
      title: '청년 버팀목 전세자금 대출 자격 모의계산',
      desc: '소득 합산 조건 및 금리 최저 1.5% 우대 혜택 적용 대상 실시간 매칭.',
      cta: '한도 즉시 확인',
      displayUrl: 'www.youth-housing-calc.kr',
    }
  ],
  tips: [
    {
      title: '정부 국고 숨은 미환급금 한방에 조회하기',
      desc: '통신비 할인, 자동차 채권, 과오납 지방세 평균 수령액 36만 원 찾기.',
      cta: '잠자는 돈 검색',
      displayUrl: 'www.findmy-money-all.or.kr',
    },
    {
      title: '여름철 원룸 방수 보일러 결로 솔루션',
      desc: '꿉꿉하고 축축한 벽지 곰팡이, 영구 방습 시공 특가 전국 무료 출장 진단.',
      cta: '무료 견적 받기',
      displayUrl: 'www.clean-room-care.co.kr',
    }
  ],
  cooking: [
    {
      title: '백종원 만능 간장소스 밀키트 60% 특별 세일',
      desc: '오늘 저녁 뭐 먹지 고민 끝! 초간단 5분 백반 조리법 패키지 단독 구성.',
      cta: '한정 패키지 구매',
      displayUrl: 'www.meals-recipe-mall.co.kr',
    }
  ],
  tech: [
    {
      title: '중고 스마트폰 초특가 프리미엄 등급 특급전',
      desc: '배터리 수명 95% 이상 엄선 기종 무상 보증 1년 지원. 최대 70% 할인.',
      cta: '기획전 구경가기',
      displayUrl: 'www.re-smart-galaxy.co.kr',
    }
  ],
  medical: [
    {
      title: '실손의료비 보험료 모바일 다이렉트 긴급 비교',
      desc: '국내 대표 5대 보험사 실비 혜택 요율 일대일 맞춤 견적 5초 완성.',
      cta: '내 실비보험 계산',
      displayUrl: 'www.direct-insure-best.com',
    }
  ],
  travel: [
    {
      title: '베트남 다낭 특가 자유여행 에어텔 완성팩',
      desc: '항공권+바나힐 투어+5스타 오션뷰 리조트 3박 4일 한정 특전 특가.',
      cta: '한정 좌석 예약',
      displayUrl: 'www.travel-explore-danang.io/ko',
    }
  ],
  transport: [
    {
      title: '내 자동차 잠자는 환급금 5분 계좌 이체하기',
      desc: '자동차 등록 시 의무 매입한 지역개발채권 만기 원리금 지금 수령하세요.',
      cta: '미환급금 이체',
      displayUrl: 'carbond-assist.or.kr/find',
    }
  ],
  law: [
    {
      title: '공인중개사 100% 합격 프로젝트 무료 교재 신청',
      desc: '부동산 법률 지식 마스터 클래스. 기초이론 인강 및 핵심 요약본 선착순 배포.',
      cta: '무상 혜택 신청',
      displayUrl: 'www.koreabest-edu.com/license',
    }
  ],
  science: [
    {
      title: '초미세 필터 에어글 공기청정기 리퍼브전',
      desc: 'H14 최고등급 헤파필터 장착. 유해 바이러스 및 먼지 99.9% 완벽 차단.',
      cta: '리퍼브 혜택가 검색',
      displayUrl: 'www.airgle-refurb.co.kr',
    }
  ],
  home: [
    {
      title: '감성 인테리어 조명 및 디자이너 원목 가구 기획전',
      desc: '우리 집 분위기를 바꾸는 북유럽 스타일 모던 조명부터 친환경 원목 침대까지 특가전.',
      cta: '인테리어 소품샵 구경',
      displayUrl: 'www.trendy-home-diy.co.kr',
    }
  ],
  default: [
    {
      title: '구글 애드센스 승인 보장형 맞춤 컨설팅 가이드',
      desc: '고품질 전문 정보 블로그를 위한 SEO 특화 최적화 비법 및 최고급 광고 수익 설정 가이드.',
      cta: '승인 비법 받기',
      displayUrl: 'www.adsense-master-korea.com',
    }
  ]
};

export default function AdSlot({ id, type, category }: AdSlotProps) {
  // Select a mock ad based on category or fallback to default
  const getAd = (): MockAd => {
    const list = (category && CATEGORY_MOCK_ADS[category]) || CATEGORY_MOCK_ADS.default;
    return list[0] || CATEGORY_MOCK_ADS.default[0];
  };

  const ad = getAd();

  const classesByType = {
    leaderboard: 'w-full min-h-[90px] border border-slate-200 bg-slate-50 p-3 sm:px-6 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-3 overflow-hidden text-left relative',
    rectangle: 'w-full min-h-[250px] border border-slate-200 bg-slate-50/50 p-5 rounded-sm flex flex-col justify-between text-left relative overflow-hidden',
    skyscraper: 'hidden lg:flex w-[160px] min-h-[600px] border border-slate-200 bg-slate-50/50 p-4 rounded-sm flex-col justify-between text-left sticky top-24 relative overflow-hidden',
    native: 'w-full border border-slate-200 bg-slate-50/50 p-4 rounded-sm flex items-start gap-4 text-left relative overflow-hidden',
    sticky: 'fixed bottom-0 left-0 right-0 z-40 bg-black border-t border-slate-850 p-2 text-white flex items-center justify-between text-left',
  };

  if (type === 'sticky') {
    return (
      <div id={`ad-${id}`} className={classesByType.sticky}>
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between px-4 text-xs">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className="bg-white text-black font-black px-1.5 py-0.5 rounded-sm text-[9px] uppercase tracking-wider">스폰서</span>
            <span className="font-bold truncate text-zinc-200">{ad.title} — {ad.desc}</span>
          </div>
          <a
            href={`https://${ad.displayUrl}`}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex-shrink-0 bg-white hover:bg-slate-200 text-black font-black px-3.5 py-1.5 rounded-sm transition-colors ml-4 whitespace-nowrap flex items-center gap-1 uppercase text-[10px] tracking-wider"
          >
            {ad.cta} <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`ad-${id}`}
      className={`${classesByType[type]} group relative hover:border-slate-400 transition-all cursor-pointer`}
      onClick={() => window.open(`https://${ad.displayUrl}`, '_blank')}
    >
      {/* Small AdSense Badge Indicator */}
      <div className="absolute top-1 right-2 flex items-center gap-1 text-[9px] text-slate-400 select-none uppercase tracking-wider font-bold">
        <Shield className="w-2.5 h-2.5 text-blue-600" />
        <span>AD • SPONSOR</span>
      </div>

      {type === 'leaderboard' && (
        <>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black rounded-sm uppercase tracking-wider text-[10px] shrink-0 select-none">
              스폰서
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-sm flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                {ad.title} <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </h4>
              <p className="text-xs text-slate-600 line-clamp-1 mt-0.5 font-medium">{ad.desc}</p>
              <span className="text-[10px] text-slate-400 block font-mono">{ad.displayUrl}</span>
            </div>
          </div>
          <button className="w-full sm:w-auto bg-black hover:bg-slate-800 text-white font-black text-xs py-2 px-4 rounded-sm whitespace-nowrap transition-colors select-none uppercase tracking-widest text-[10px]">
            {ad.cta}
          </button>
        </>
      )}

      {type === 'rectangle' && (
        <>
          <div className="flex flex-col gap-3">
            <span className="self-start text-[10px] bg-black text-white font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">AD</span>
            <div>
              <h4 className="font-black text-slate-950 text-[15px] leading-snug group-hover:text-blue-600 transition-colors flex items-center justify-between gap-1">
                {ad.title}
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">{ad.desc}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <span className="text-[10px] text-slate-400 font-mono block">{ad.displayUrl}</span>
            <button className="w-full bg-black hover:bg-slate-800 text-white font-black text-xs py-2.5 rounded-sm transition-colors text-center select-none uppercase tracking-widest">
              {ad.cta}
            </button>
          </div>
        </>
      )}

      {type === 'skyscraper' && (
        <>
          <div className="flex flex-col gap-4">
            <span className="self-start text-[9px] bg-black text-white font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">SPONSOR AD</span>
            <div className="w-full aspect-square rounded-sm bg-slate-900 text-white flex items-center justify-center font-black text-xs uppercase tracking-widest">
              추천 제휴
            </div>
            <div>
              <h4 className="font-black text-slate-950 text-sm leading-tight group-hover:text-blue-600 transition-colors flex items-center gap-1">
                {ad.title}
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">{ad.desc}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-auto">
            <span className="text-[9px] text-slate-400 font-mono block truncate">{ad.displayUrl}</span>
            <button className="w-full bg-black hover:bg-slate-800 text-white font-black text-xs py-2 rounded-sm transition-colors text-center select-none uppercase tracking-widest text-[9px]">
              {ad.cta}
            </button>
          </div>
        </>
      )}

      {type === 'native' && (
        <>
          <div className="w-16 h-16 bg-slate-200 rounded-sm shrink-0 flex items-center justify-center font-black text-slate-700 text-xs uppercase tracking-widest select-none">
            광고
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-black text-slate-950 text-sm truncate flex items-center gap-1.5 group-hover:text-blue-600">
              {ad.title} <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </h4>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-normal font-medium">{ad.desc}</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-[10px] text-slate-400 font-mono">{ad.displayUrl}</span>
              <span className="text-[10px] text-black font-black border-b border-black uppercase tracking-wider">{ad.cta}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
