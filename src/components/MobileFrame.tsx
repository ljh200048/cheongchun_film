import React from 'react';
import { Wifi, Battery, ChevronLeft, ShieldCheck, Film } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  bottomNav?: React.ReactNode;
  currentViewTitle: string;
  onBack?: () => void;
  isAdminMode: boolean;
  onAdminToggle: () => void;
  productionApps?: any[];
  supporterApps?: any[];
  inquiries?: any[];
}

export default function MobileFrame({ 
  children, 
  bottomNav,
  currentViewTitle, 
  onBack,
  isAdminMode,
  onAdminToggle,
  productionApps = [],
  supporterApps = [],
  inquiries = []
}: MobileFrameProps) {
  // Simple currentTime state
  const [time, setTime] = React.useState('12:00');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const getRecentLogs = () => {
    const list: { name: string; type: string; ago: string; isNew?: boolean }[] = [];

    productionApps.forEach(item => {
      list.push({
        name: item.applicantName ? item.applicantName[0] + '○' + (item.applicantName[2] || item.applicantName[1] || '우') : '신청자',
        type: '제작 신청',
        ago: '최근 접수',
        isNew: item.status === 'received'
      });
    });

    supporterApps.forEach(item => {
      list.push({
        name: item.applicantName ? item.applicantName[0] + '○' + (item.applicantName[2] || item.applicantName[1] || '호') : '지원자',
        type: '서포터즈',
        ago: '최근 접수',
        isNew: item.status === 'received'
      });
    });

    inquiries.forEach(item => {
      list.push({
        name: item.writerName ? item.writerName[0] + '○' + (item.writerName[2] || item.writerName[1] || '진') : '질문자',
        type: '문의글',
        ago: '최근 접수',
        isNew: !item.reply
      });
    });

    if (list.length === 0) {
      return [
        { name: '김○우', type: '제작 신청', ago: '2시간 전', isNew: true },
        { name: '이○호', type: '서포터즈', ago: '5시간 전', isNew: false },
        { name: '박○진', type: '문의', ago: '1일 전', isNew: false }
      ];
    }

    return list.slice(0, 3);
  };

  const logs = getRecentLogs();

  return (
    <div className="min-h-screen bg-[#ECE9E0] font-sans flex items-center justify-center p-4 lg:p-12 transition-colors duration-500 relative overflow-hidden text-[#1A1A1A]">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute -left-40 -top-40 w-96 h-96 rounded-full bg-vintage-accent opacity-5 blur-3xl pointer-events-none" />
      <div className="absolute -right-40 -bottom-40 w-96 h-96 rounded-full bg-vintage-accent opacity-5 blur-3xl pointer-events-none" />

      {/* Decorative Film Edge Holes - brutalist print design accents */}
      <div className="absolute left-4 top-0 bottom-0 w-2 flex flex-col justify-around opacity-15 pointer-events-none hidden xl:flex">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="w-2 h-3 bg-[#1A1A1A] rounded-sm" />
        ))}
      </div>
      <div className="absolute right-4 top-0 bottom-0 w-2 flex flex-col justify-around opacity-15 pointer-events-none hidden xl:flex">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="w-2 h-3 bg-[#1A1A1A] rounded-sm" />
        ))}
      </div>

      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-8 xl:gap-12 relative z-10">
        
        {/* Left Column: Bold Typography Display Title */}
        <div className="flex-1 flex flex-col justify-between py-6 self-stretch text-left max-w-lg hidden lg:flex font-serif">
          <div>
            <h1 className="text-[100px] leading-[0.85] font-black text-[#1A1A1A] uppercase tracking-tighter select-none font-sans">
              Youth<br/>Film
            </h1>
            <p className="mt-8 text-lg text-[#1A1A1A]/80 max-w-sm font-sans font-light leading-relaxed">
              청주, 가장 빛나는 스무 살의 이야기를 영상과 사진으로 기록하는 다큐멘터리 팀, <span className="font-bold text-[#1A1A1A]">청춘필름</span>입니다.
            </p>
          </div>

          <div className="space-y-4 mt-12">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#E85C28] text-white text-[10px] font-bold font-sans rounded-full uppercase tracking-widest animate-pulse">
                Status
              </span>
              <span className="text-xs font-sans font-medium text-[#1A1A1A]/75">2026 청춘 레코드 및 사연 선발 중</span>
            </div>
            <div className="h-[1px] w-48 bg-[#1A1A1A]/15"></div>
            <div className="flex gap-4 text-[#1A1A1A]/40 font-sans text-[10px] uppercase tracking-widest font-bold">
              <span>Documentary</span>
              <span>•</span>
              <span>Archive</span>
              <span>•</span>
              <span>Cheongju</span>
            </div>
          </div>
        </div>

        {/* Center Column: Main Smartphone Shell Device Wrapper */}
        <div 
          id="smartphone-shell"
          className="relative w-full sm:w-[380px] lg:w-[365px] h-[100vh] sm:h-[820px] lg:h-[720px] sm:rounded-[48px] sm:border-[8px] sm:border-[#1A1A1A] bg-[#1A1A1A] flex flex-col shadow-[0_30px_70px_-15px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-300 relative shrink-0"
        >
          {/* Film grain effect */}
          <div className="grain-overlay absolute inset-0 z-50 pointer-events-none opacity-[0.03]" />
          
          {/* System Bar (Camera punch & Indicators) */}
          <div className="bg-[#1A1A1A] px-6 pt-3 pb-2 text-[10px] text-white/90 font-mono flex justify-between items-center select-none z-40 shrink-0 relative">
            <span className="font-semibold tracking-tight">{time}</span>
            
            {/* Virtual Notch */}
            <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-1.5 h-3.5 w-24 bg-stone-900 rounded-full flex items-center justify-end px-3">
              <div className="w-1.5 h-1.5 rounded-full bg-stone-700" />
            </div>

            <div className="flex items-center space-x-1.5">
              <Wifi size={11} className="opacity-90" />
              <Battery size={11} className="opacity-90" />
            </div>
          </div>

          {/* Dynamic App Shell Header */}
          <div className="bg-white border-b border-stone-150 px-4 h-14 flex items-center justify-between z-40 select-none shrink-0 relative">
            <div className="flex items-center space-x-2">
              {onBack ? (
                <button 
                  id="header-back-button"
                  onClick={onBack} 
                  className="p-1 -ml-1 text-[#1A1A1A] hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
                  aria-label="뒤로가기"
                >
                  <ChevronLeft size={20} />
                </button>
              ) : (
                <Film size={15} className="text-[#E85C28] shrink-0" />
              )}
              <h2 className="font-sans text-xs font-bold text-[#1A1A1A] tracking-tight uppercase">
                {currentViewTitle}
              </h2>
            </div>

            <button 
              id="admin-padlock-toggle"
              onClick={onAdminToggle}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[9px] transition-all duration-300 font-bold ${
                isAdminMode 
                  ? 'bg-[#E85C28] text-white shadow-sm' 
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900'
              }`}
            >
              <ShieldCheck size={11} />
              <span>{isAdminMode ? '관리모드' : '관리인증'}</span>
            </button>
          </div>

          {/* Main Application Area (Viewport Scrollable Inside Device frame) */}
          <div className="flex-1 overflow-y-auto bg-[#FDFCF8] flex flex-col relative" id="app-viewport-inner">
            {children}
          </div>

          {/* Render fixed bottomNav here outside of scroll container! */}
          {bottomNav}
        </div>

        {/* Right Column: Interactive Real-Time Admin Status Panel */}
        <div className="w-64 py-6 self-stretch flex flex-col justify-between text-left hidden lg:flex">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-white shadow-sm">
            <p className="text-[9px] font-sans uppercase tracking-[0.15em] text-[#1A1A1A]/40 mb-3 font-bold">Admin Panel Preview</p>
            <h3 className="text-xs font-extrabold text-[#1A1A1A] mb-4 font-sans uppercase tracking-tight">최근 등록 현황</h3>
            
            <div className="space-y-3.5">
              {logs.map((log, idx) => (
                <div key={idx} className="flex justify-between items-start text-left">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[#1A1A1A]">{log.name}</p>
                    <p className="text-[10px] text-stone-500 font-sans">{log.type} • {log.ago}</p>
                  </div>
                  {log.isNew && <span className="w-2.5 h-2.5 rounded-full bg-[#E85C28] mt-1" />}
                </div>
              ))}
            </div>

            <button 
              onClick={onAdminToggle}
              className="w-full mt-6 py-2.5 bg-[#1A1A1A] hover:bg-[#E85C28] text-white rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              실시간 현황 관리하기
            </button>
          </div>

          <div className="bg-[#485335] p-6 rounded-3xl text-[#FDFCF8] shadow-sm relative overflow-hidden mt-6">
            <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8"/>
              </svg>
            </div>
            <p className="text-[9px] font-sans uppercase tracking-widest opacity-60 mb-2 font-bold">Our Mission</p>
            <p className="text-sm font-serif italic text-[#FDFCF8] leading-relaxed">
              “청주의 가장 아름다운 오늘을 차분히 아카이빙하여 아름다운 내일의 청춘 유산으로 남깁니다.”
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
