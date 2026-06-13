import React from 'react';
import { Award, Compass, Film, MapPin } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="flex-grow flex flex-col pb-8 animate-fadeIn">
      {/* Intro Editorial section */}
      <div className="relative h-44 bg-stone-900 border-b border-stone-200 flex flex-col justify-end p-5 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=600"
          alt="Vintage camera equipment"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover brightness-40 sepia-[0.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
        <div className="relative z-10">
          <span className="text-[8px] font-mono tracking-widest text-[#FFFDF9] bg-[#E85C28] px-2 py-0.5 rounded font-bold uppercase">OUR IDENTITY</span>
          <h2 className="text-xl font-sans font-black text-white mt-1.5 tracking-tight">우리가 달리는 이유</h2>
          <p className="text-[10px] text-stone-200 font-mono mt-0.5 flex items-center gap-1">
            <MapPin size={10} className="text-[#E85C28]" /> Cheongju, Republic of Korea
          </p>
        </div>
      </div>

      {/* Main Philosophy statement */}
      <div className="px-5 py-6 space-y-5">
        <div className="space-y-3">
          <p className="font-sans text-[15.5px] font-black text-[#1A1A1A] leading-relaxed text-center italic">
            "청주는 조용한 도시지만,<br/>
            이곳 20대의 삶은 그 어느 곳보다<br/>
            치열하고 눈부십니다."
          </p>
          <div className="w-8 h-1 bg-[#E85C28] mx-auto my-4" />
          <p className="text-xs text-stone-700 leading-relaxed font-sans text-justify font-medium">
            청춘필름은 <b>'모든 평범한 삶에 숨은 다큐멘터리포리아'</b>를 믿습니다. 청주에 살아가며 미래를 고민하고, 사랑하며, 헤매는 20대들의 찬란하지만 어쩌면 위태로운 하루하루를 대충 잊히지 않게 특별한 영상 필름, 사진 스냅, 포토 문학 인터뷰북, 한 장의 소장용 영화 포스터로 기록하는 청년 콘텐츠 크리에이티브 그룹입니다.
          </p>
        </div>

        {/* 3 Pillars of Core Work */}
        <div className="space-y-3 mt-6">
          <h3 className="text-[10px] font-mono tracking-widest text-stone-800 font-black uppercase">CORE VALUES</h3>
          
          {/* Pillar 1 */}
          <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-1 shadow-sm">
            <div className="flex items-center space-x-2 text-[#E85C28]">
              <Film size={15} />
              <h4 className="text-[12px] font-extrabold text-[#1A1A1A]">주인공으로서의 기록</h4>
            </div>
            <p className="text-[10.5px] text-stone-600 font-medium leading-relaxed">
              사설 광고나 정형화된 프로필이 아닙니다. 당신이 살아온 이야기, 고뇌, 웃음이 한 편의 독립 단편 영화나 다큐멘터리가 되도록 기획합니다.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-1 shadow-sm">
            <div className="flex items-center space-x-2 text-stone-800">
              <Compass size={15} />
              <h4 className="text-[12px] font-extrabold text-[#1A1A1A]">밀착형 포토인문학</h4>
            </div>
            <p className="text-[10.5px] text-stone-600 font-medium leading-relaxed">
              단순히 서 있는 외형을 찍는 게 아니라, 깊은 서면 사전 문답과 편안한 차담(인터뷰)을 통해 가장 자연스럽고 깊이 있는 눈빛을 끌어냅니다.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-1 shadow-sm">
            <div className="flex items-center space-x-2 text-emerald-600">
              <Award size={15} />
              <h4 className="text-[12px] font-extrabold text-[#1A1A1A]">청주 지역 아카이빙</h4>
            </div>
            <p className="text-[10.5px] text-stone-600 font-medium leading-relaxed">
              수동, 우암산, 무심천, 대성동 골목길 등 청주만의 따뜻하고 고즈넉한 로컬 풍경 속에 당신의 20대를 담아, 지역 청년들의 문화를 영구 보존합니다.
            </p>
          </div>
        </div>

        {/* Meet the Team Creators */}
        <div className="space-y-4 mt-8 font-sans">
          <h3 className="text-[10px] font-mono tracking-widest text-stone-800 font-black uppercase">CREATIVE TEAM</h3>
          <div className="grid grid-cols-2 gap-3.5">
            {/* Member 1 */}
            <div className="bg-white border border-stone-200 rounded-2xl p-3 text-center flex flex-col items-center shadow-sm">
              <div className="w-14 h-14 rounded-full bg-stone-100 border-2 border-stone-200 overflow-hidden mb-2.5">
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" 
                  alt="Director" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover saturate-50"
                />
              </div>
              <p className="text-[11px] font-extrabold text-stone-900">민 기 (24)</p>
              <p className="text-[8px] text-[#E85C28] font-mono uppercase tracking-wider mt-0.5 font-bold">TEAM LEADER / PD</p>
              <p className="text-[9px] text-stone-500 leading-tight mt-1.5 font-medium">
                "모든 20대의 일상엔 단편 영화 한 편의 밀도가 들어있습니다."
              </p>
            </div>

            {/* Member 2 */}
            <div className="bg-white border border-stone-200 rounded-2xl p-3 text-center flex flex-col items-center shadow-sm">
              <div className="w-14 h-14 rounded-full bg-stone-100 border-2 border-stone-200 overflow-hidden mb-2.5">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" 
                  alt="DoP" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover saturate-50"
                />
              </div>
              <p className="text-[11px] font-extrabold text-stone-900">도 윤 (26)</p>
              <p className="text-[8px] text-stone-800 font-mono uppercase tracking-wider mt-0.5 font-bold">FILM DIRECTOR</p>
              <p className="text-[9px] text-stone-500 leading-tight mt-1.5 font-medium">
                "수동 수암골의 노을 아래서 아날로그 뷰파인더로 청춘을 봅니다."
              </p>
            </div>

            {/* Member 3 */}
            <div className="bg-white border border-stone-200 rounded-2xl p-3 text-center flex flex-col items-center shadow-sm">
              <div className="w-14 h-14 rounded-full bg-stone-100 border-2 border-stone-200 overflow-hidden mb-2.5">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150" 
                  alt="Writer" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover saturate-50"
                />
              </div>
              <p className="text-[11px] font-extrabold text-stone-900">채 원 (23)</p>
              <p className="text-[8px] text-[#E85C28] font-mono uppercase tracking-wider mt-0.5 font-bold">INTERVIEW EDITOR</p>
              <p className="text-[9px] text-stone-500 leading-tight mt-1.5 font-medium">
                "이름 뒤에 가려진 진짜 문장들을 찾아 기록물로 엮어냅니다."
              </p>
            </div>

            {/* Member 4 */}
            <div className="bg-white border border-stone-200 rounded-2xl p-3 text-center flex flex-col items-center shadow-sm">
              <div className="w-14 h-14 rounded-full bg-stone-100 border-2 border-stone-200 overflow-hidden mb-2.5">
                <img 
                  src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150" 
                  alt="Visualist"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover saturate-50"
                />
              </div>
              <p className="text-[11px] font-extrabold text-stone-900">서 준 (25)</p>
              <p className="text-[8px] text-stone-800 font-mono uppercase tracking-wider mt-0.5 font-bold">POSTER DESIGNER</p>
              <p className="text-[9px] text-stone-500 leading-tight mt-1.5 font-medium">
                "한 인물의 서사를 포스터의 빛과 구도로 요약합니다."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
