import { ArrowRight, Film, Heart, Sparkles, Megaphone, FileText, Calendar, Compass } from 'lucide-react';
import { ViewType, Portfolio } from '../types';

interface HomeViewProps {
  onNavigate: (view: ViewType) => void;
  featuredPortfolios: Portfolio[];
  onSelectPortfolio: (item: Portfolio) => void;
}

export default function HomeView({ onNavigate, featuredPortfolios, onSelectPortfolio }: HomeViewProps) {
  return (
    <div className="flex-grow flex flex-col pb-8">
      {/* Cinematic Cover Intro Banner */}
      <div className="relative h-64 bg-stone-900 border-b border-stone-200 flex flex-col justify-end p-5 overflow-hidden">
        {/* Cinematic Backdrop Image */}
        <img 
          src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600"
          alt="Youth Film Background"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover brightness-45 saturate-75 xl:scale-105 transition-transform duration-700"
        />
        {/* Vintage Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
        
        {/* Humanized Editorial Label */}
        <div className="relative z-10 space-y-1.5 animate-fadeIn">
          <span className="inline-block text-[8px] font-mono tracking-widest text-[#FFFDF9] uppercase bg-[#E85C28] px-2.5 py-1 rounded-full border border-white/20 font-bold">
            Cheongju Youth Documenters
          </span>
          <h1 className="text-2xl font-sans font-black text-white tracking-tight leading-tight mt-1">
            가장 찬란한 순간,<br/>
            영원한 필름으로.
          </h1>
          <p className="text-[11px] text-stone-200 font-sans font-medium leading-relaxed max-w-[280px]">
            청춘필름은 청주 20대의 진솔한 목소리와 일상을 영상, 사진, 인터뷰로 기록합니다.
          </p>
        </div>
      </div>

      {/* Floating Spotlight Indicators */}
      <div className="mx-4 -mt-3 relative z-30 bg-white rounded-2xl border border-stone-200 p-4 flex justify-around items-center text-center shadow-md">
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wider font-sans">기록 대상</span>
          <span className="font-sans text-[13px] font-extrabold text-[#1A1A1A] mt-0.5">청주 20대</span>
        </div>
        <div className="h-6 w-px bg-stone-200" />
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wider font-sans">핵심 파트</span>
          <span className="font-sans text-[13px] font-extrabold text-[#1A1A1A] mt-0.5">다큐멘터리</span>
        </div>
        <div className="h-6 w-px bg-stone-200" />
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wider font-sans">누적 청춘</span>
          <span className="font-sans text-[13px] font-extrabold text-[#E85C28] mt-0.5">120+ 명</span>
        </div>
      </div>

      {/* Primary Shortcut Actions */}
      <div className="px-4 mt-6">
        <h3 className="text-[10px] uppercase tracking-wider text-stone-800 font-mono font-black mb-3.5 flex items-center gap-1.5">
          <Compass size={14} className="text-[#E85C28]" />
          Quick Archive Application
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Quick Apply 1: Production */}
          <button 
            id="apply-production-shortcut"
            onClick={() => onNavigate('apply_production')}
            className="group relative h-28 bg-white hover:bg-stone-50 border border-stone-200 hover:border-[#E85C28]/40 rounded-2xl p-4 text-left flex flex-col justify-between overflow-hidden transition-all duration-300 shadow-sm cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform duration-300">
              <Film size={44} className="text-[#E85C28]" />
            </div>
            <div className="w-8 h-8 rounded-full bg-[#E85C28]/10 flex items-center justify-center text-[#E85C28] group-hover:bg-[#E85C28] group-hover:text-white transition-all duration-300">
              <Sparkles size={14} />
            </div>
            <div>
              <h4 className="text-[13px] font-extrabold text-stone-900 tracking-tight group-hover:text-[#E85C28] transition-colors">
                내 청춘 기록 신청
              </h4>
              <p className="text-[9px] text-stone-500 font-sans font-bold mt-1 flex items-center gap-1">
                영상·사진·포토인문학 <ArrowRight size={10} />
              </p>
            </div>
          </button>

          {/* Quick Apply 2: Supporters */}
          <button 
            id="apply-supporters-shortcut"
            onClick={() => onNavigate('apply_supporters')}
            className="group relative h-28 bg-white hover:bg-stone-50 border border-stone-200 hover:border-stone-900/30 rounded-2xl p-4 text-left flex flex-col justify-between overflow-hidden transition-all duration-300 shadow-sm cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform duration-300">
              <Heart size={44} className="text-stone-800" />
            </div>
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-800 group-hover:bg-stone-950 group-hover:text-white transition-all duration-300">
              <Heart size={14} />
            </div>
            <div>
              <h4 className="text-[13px] font-extrabold text-stone-900 tracking-tight group-hover:text-stone-950 transition-colors">
                서포터즈 모집 신청
              </h4>
              <p className="text-[9px] text-stone-500 font-sans font-bold mt-1 flex items-center gap-1">
                기획·촬영·인터뷰 팀원 <ArrowRight size={10} />
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Featured Film Archive Slider / Highlights */}
      <div className="mt-8 px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] uppercase tracking-wider text-stone-800 font-mono font-black flex items-center gap-1.5">
            <Film size={14} className="text-[#E85C28]" />
            Featured Archive
          </h3>
          <button 
            id="view-all-portfolio"
            onClick={() => onNavigate('portfolio')} 
            className="text-[10px] text-stone-500 hover:text-[#E85C28] font-black flex items-center gap-0.5 transition-colors font-sans cursor-pointer"
          >
            전체 보기 <ArrowRight size={10} />
          </button>
        </div>

        {featuredPortfolios.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500 font-sans text-xs leading-relaxed">
            새로운 필름이 인화 중입니다.<br/>
            조금만 기다려주세요!
          </div>
        ) : (
          <div className="flex space-x-4 overflow-x-auto pb-2 scroll-smooth select-none snap-x" id="highlights-container">
            {featuredPortfolios.slice(0, 4).map((item) => (
              <div 
                id={`featured-card-${item.id}`}
                key={item.id}
                onClick={() => onSelectPortfolio(item)}
                className="snap-start w-52 shrink-0 bg-white rounded-2xl border border-stone-250 overflow-hidden group cursor-pointer hover:border-[#E85C28] transition-all duration-300"
              >
                {/* Image Cover Container */}
                <div className="relative h-32 bg-stone-100 overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 saturate-[0.85]"
                  />
                  <span className="absolute bottom-2 left-2 text-[8px] tracking-widest uppercase text-white bg-[#E85C28] px-2 py-0.5 rounded-sm font-sans z-10 font-black">
                    {item.category === 'video' ? 'VIDEO' : item.category === 'photo' ? 'PHOTO' : item.category === 'interview' ? 'STORY' : 'POSTER'}
                  </span>
                </div>
                {/* Mini descriptions */}
                <div className="p-3">
                  <span className="text-[8px] font-mono font-bold text-[#E85C28] block uppercase tracking-wider">
                    {item.creatorAge ? `만 ${item.creatorAge}세의 목소리` : '청춘 아카이브'}
                  </span>
                  <h4 className="font-sans text-[12px] font-extrabold text-[#1A1A1A] truncate mt-0.5 group-hover:text-[#E85C28] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-stone-600 line-clamp-1 mt-1 font-sans font-medium leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Quick Grid Menu */}
      <div className="px-4 mt-8 flex flex-col space-y-2.5">
        <h3 className="text-[10px] uppercase tracking-wider text-stone-800 font-mono font-black flex items-center gap-1.5 mb-1">
          <Megaphone size={14} className="text-[#E85C28]" />
          Interactive Desk
        </h3>
        
        {/* Row Menu: Introductions */}
        <button 
          id="nav-to-about"
          onClick={() => onNavigate('about')}
          className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-stone-200 hover:border-stone-900/35 hover:bg-stone-50 transition-all text-left cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
              <Megaphone size={15} />
            </div>
            <div>
              <p className="text-[12px] font-extrabold text-stone-900">청춘필름의 역사 및 소개</p>
              <p className="text-[9px] text-stone-500 font-sans font-medium mt-0.5">우리가 누구이며 왜 20대를 기록하는지</p>
            </div>
          </div>
          <ArrowRight size={14} className="text-[#1A1A1A]/30" />
        </button>

        {/* Row Menu: Notices */}
        <button 
          id="nav-to-notice"
          onClick={() => onNavigate('notice')}
          className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-stone-200 hover:border-stone-900/35 hover:bg-stone-50 transition-all text-left cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center shrink-0">
              <Calendar size={15} />
            </div>
            <div>
              <p className="text-[12px] font-extrabold text-stone-900">공지사항 & 소통방</p>
              <p className="text-[9px] text-stone-500 font-sans font-medium mt-0.5">최신 공고, 전시 일정 및 주요 행사</p>
            </div>
          </div>
          <ArrowRight size={14} className="text-[#1A1A1A]/30" />
        </button>

        {/* Row Menu: inquiries */}
        <button 
          id="nav-to-inquiry"
          onClick={() => onNavigate('inquiry')}
          className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-stone-200 hover:border-stone-900/35 hover:bg-stone-50 transition-all text-left cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-700 border border-pink-100 flex items-center justify-center shrink-0">
              <FileText size={15} />
            </div>
            <div>
              <p className="text-[12px] font-extrabold text-stone-900">익명 1:1 문의 / Q&A</p>
              <p className="text-[9px] text-stone-500 font-sans font-medium mt-0.5">기록 문의와 비밀글 비밀번호 간편 연동</p>
            </div>
          </div>
          <ArrowRight size={14} className="text-[#1A1A1A]/30" />
        </button>
      </div>
    </div>
  );
}
