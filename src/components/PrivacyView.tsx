import React from 'react';
import { ShieldCheck, Mail, Calendar, FileText } from 'lucide-react';

interface PrivacyViewProps {
  onBack?: () => void;
}

export default function PrivacyView({ onBack }: PrivacyViewProps) {
  return (
    <div className="flex-grow flex flex-col pb-8 animate-fadeIn">
      {/* Editorial Header */}
      <div className="relative h-44 bg-stone-900 border-b border-stone-200 flex flex-col justify-end p-5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-stone-900" />
        <div className="relative z-10 space-y-1">
          <span className="text-[8px] font-mono tracking-widest text-[#FFFDF9] bg-[#E85C28] px-2 py-0.5 rounded font-bold uppercase">SECURITY & PRIVACY</span>
          <h2 className="text-xl font-sans font-black text-white mt-1 tracking-tight">개인정보 처리방침</h2>
          <p className="text-[10px] text-stone-300 font-sans tracking-tight">
            청춘필름은 이용자의 개인정보 수집 및 보호를 매우 중요하게 생각합니다.
          </p>
        </div>
      </div>

      {/* Main Document Content */}
      <div className="px-5 py-6 space-y-6 text-stone-800 font-sans">
        {/* Intro */}
        <div className="text-xs leading-relaxed text-stone-600 font-medium">
          본 개인정보 처리방침은 청춘필름(이하 '서비스')에서 제공하는 제작 신청, 서포터즈 지원 및 1:1 질문방(이하 '신청 및 문의 서비스') 서비스 이용에 필요한 최소한의 개인정보를 수집하고 올바르게 취급하는 목적을 명시합니다.
        </div>

        {/* 1. Collection details */}
        <div className="space-y-2 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-1.5 text-[#E85C28]">
            <FileText size={14} className="shrink-0" />
            <h3 className="text-xs font-black text-stone-900">1. 수집하는 개인정보 항목</h3>
          </div>
          <p className="text-[11px] leading-relaxed text-stone-600 font-medium">
            청춘필름의 원활한 촬영 제작 신청, 로컬 크루 지원, 문의 처리를 위해 아래와 같은 개인정보가 안전하게 수집됩니다:
          </p>
          <ul className="text-[11px] list-disc list-inside text-stone-700 font-semibold space-y-0.5 pl-1.5">
            <li>필수 항목: 이름, 연락처(휴대폰 번호), 이메일 주소, 신청 내용</li>
            <li>선택 항목: 인스타그램 계정/SNS URL, 지원 분야 및 선호 장르</li>
          </ul>
        </div>

        {/* 2. Usage purpose */}
        <div className="space-y-2 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-1.5 text-stone-800">
            <ShieldCheck size={14} className="shrink-0" />
            <h3 className="text-xs font-black text-stone-900">2. 수집 및 이용 목적</h3>
          </div>
          <p className="text-[11px] leading-relaxed text-stone-700 font-medium">
            수집된 개인정보는 타 용도로 활용되지 않으며 오직 다음 세 가지 목적의 원활한 업무 처리를 지원하기 위해서만 활용됩니다:
          </p>
          <ol className="text-[11px] list-decimal list-inside text-stone-700 font-semibold space-y-0.5 pl-1.5">
            <li>제작 신청에 따른 내용 확인, 촬영 및 일정 조율</li>
            <li>로컬 크루 서포터즈 지원 서류 검토 및 합격 여부 개별 응답/연락</li>
            <li>1:1 익명 질문글/상담에 대한 검토 결과 피드백 및 안내</li>
          </ol>
        </div>

        {/* 3. Retaining period */}
        <div className="space-y-2 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-1.5 text-[#E85C28]">
            <Calendar size={14} className="shrink-0" />
            <h3 className="text-xs font-black text-stone-900">3. 개인정보 보관 및 파기 기간</h3>
          </div>
          <p className="text-[11px] leading-relaxed text-stone-700 font-medium">
            이용자의 개인정보는 수집된 후 수시 파기 또는 아래의 기한까지 안전하게 보안 서버 내에만 유지 및 보존됩니다:
          </p>
          <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-xl text-[10.5px] leading-relaxed text-stone-600 font-semibold">
            • 보관 범위: 입력 항목 일체<br />
            • 보유 기간: <strong className="text-[#E85C28]">신청 완료일(또는 제출 완료일)로부터 1년</strong><br />
            • 보관 완료 후에는 복구할 수 없는 방식으로 안전하게 완전 파기됩니다.
          </div>
        </div>

        {/* 4. Contact/Help */}
        <div className="space-y-2 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-1.5 text-stone-800">
            <Mail size={14} className="shrink-0" />
            <h3 className="text-xs font-black text-stone-900">4. 개인정보 보호 문의 및 이메일</h3>
          </div>
          <p className="text-[11px] leading-relaxed text-stone-700 font-medium">
            사용자는 언제든지 자신의 개인정보 수집 동의를 철회하거나, 저장된 신청 기록의 확인 및 수정을 요구할 수 있습니다. 개인정보 자산 관련 문의사항 및 파기 요청은 다음 담당 채널을 이용해 주시면 신속하게 점검해 응답해 드리겠습니다.
          </p>
          <div className="bg-[#E85C28]/5 border border-[#E85C28]/20 p-3 rounded-xl flex items-center justify-between">
            <div className="flex flex-col text-[10px]">
              <span className="text-stone-500 font-mono">DEDICATED EMAIL</span>
              <span className="text-stone-900 font-extrabold text-[11.5px] mt-0.5">lch200048@gmail.com</span>
            </div>
            <a 
              href="mailto:lch200048@gmail.com" 
              className="bg-stone-900 text-white font-bold text-[9px] px-2.5 py-1.5 rounded-lg shrink-0 tracking-wider hover:bg-[#E85C28] transition-colors"
            >
              이메일 전송
            </a>
          </div>
        </div>

        {/* Action Button */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-full bg-stone-900 hover:bg-[#E85C28] text-white font-bold p-3 rounded-xl text-xs tracking-widest uppercase transition-all duration-300 mt-4 shadow-sm cursor-pointer"
          >
            뒤로 돌아가기
          </button>
        )}
      </div>
    </div>
  );
}
