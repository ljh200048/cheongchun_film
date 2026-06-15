import React, { useState } from 'react';
import { Sparkles, CheckCircle } from 'lucide-react';
import { CategoryType } from '../types';

interface RequestProductionViewProps {
  onSubmit: (data: {
    applicantName: string;
    age: number;
    phone: string;
    email: string;
    storyTitle: string;
    storyDetails: string;
    preferredType: CategoryType;
    privacyConsent: boolean;
  }) => Promise<void>;
  onNavigateToPrivacy?: () => void;
}

export default function RequestProductionView({ onSubmit, onNavigateToPrivacy }: RequestProductionViewProps) {
  // Input fields state
  const [applicantName, setApplicantName] = useState('');
  const [age, setAge] = useState<number>(24);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [instagramId, setInstagramId] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredPlace, setPreferredPlace] = useState('');
  const [storyTitle, setStoryTitle] = useState('');
  const [storyDetails, setStoryDetails] = useState('');
  const [preferredType, setPreferredType] = useState<CategoryType>('video');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!applicantName || !phone || !email || !storyTitle || !storyDetails) {
      alert('필수 기입 항목들을 모두 채워주세요.');
      return;
    }

    if (!privacyConsent) {
      alert('개인정보 수집 및 이용에 동의해야 신청할 수 있습니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit directly to productionApplications via onSubmit prop
      await onSubmit({
        applicantName,
        age: Number(age),
        phone,
        email,
        storyTitle,
        storyDetails,
        preferredType,
        privacyConsent
      });

      alert('제작 신청이 완료되었습니다.');
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      alert('신청 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-6 text-center animate-fadeIn text-stone-800 bg-[#FDFCF8]">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center mb-5 animate-bounce shadow">
          <CheckCircle size={32} />
        </div>
        
        <span className="text-[9px] font-sans font-black bg-[#E85C28] text-white px-2 py-0.5 rounded uppercase tracking-wider">ARCHIVE TICKET ISSUED</span>
        <h3 className="font-sans text-lg font-black text-stone-900 mt-2.5">이야기가 성공적으로 접수되었습니다.</h3>
        
        <p className="text-[11px] text-stone-605 leading-relaxed mt-3 max-w-xs px-2 font-sans font-bold">
          청주 청춘들의 따뜻한 마음을 소중히 전해주셔서 깊이 감사드립니다. 기재해 주신 연락처를 기반으로 <b>3일 이내에 담당 고정 크리에이터가 직접 연락</b>해 편안한 오프라인 차담 일정을 매칭하겠습니다.
        </p>

        <div className="w-full bg-white p-5 rounded-3xl border border-stone-200 mt-6 text-left space-y-2.5 max-w-xs font-sans text-xs shadow-sm text-stone-800">
          <p className="flex justify-between border-b border-stone-100 pb-1.5">
            <span className="text-stone-550 font-bold">신청분야</span>
            <span className="text-stone-900 font-black uppercase text-[11px]">{preferredType === 'video' ? '📽️ 다큐영상' : preferredType === 'photo' ? '📷 포토스냅' : preferredType === 'interview' ? '✍️ 인터뷰북' : '🎨 기록포스터'}</span>
          </p>
          <p className="flex justify-between border-b border-stone-100 pb-1.5">
            <span className="text-stone-550 font-bold">신청인</span>
            <span className="text-stone-900 font-extrabold">{applicantName} (만 {age}세)</span>
          </p>
          <p className="flex justify-between">
            <span className="text-stone-550 font-bold">스토리제안</span>
            <span className="text-stone-900 font-black max-w-[150px] truncate">{storyTitle}</span>
          </p>
        </div>

        <button
          id="production-success-back-home"
          onClick={() => setIsSuccess(false)}
          className="mt-8 px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#E85C28] text-white font-bold rounded-xl text-xs transition duration-200 cursor-pointer shadow-sm"
        >
          새로운 신청 작성하기
        </button>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col pb-12 animate-fadeIn text-stone-800 font-sans">
      {/* Visual background header */}
      <div className="relative h-44 bg-stone-900 border-b border-stone-250 flex flex-col justify-end p-5 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600"
          alt="Vintage couple hugging on sunset"
          referrerPolicy="no-referrer"
          className="absolute inset-x-0 inset-y-0 w-full h-full object-cover brightness-40 saturate-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
        <div className="relative z-10">
          <span className="text-[8px] font-sans font-black bg-[#E85C28] text-white px-2 py-0.5 rounded uppercase tracking-wider">STORY SUBMISSION</span>
          <h2 className="text-xl font-sans font-black text-white mt-1.5 tracking-tight">당신의 이야기를 필름으로</h2>
          <p className="text-[10px] text-stone-200 font-medium">로그인 없이 몇 가지 질문에 편히 답하며 신청할 수 있어요.</p>
        </div>
      </div>

      {/* Narrative Guide note */}
      <div className="p-4">
        <div className="bg-white p-4.5 rounded-2xl border border-stone-200 space-y-2.5 shadow-sm text-stone-800">
          <h4 className="text-[11.5px] font-black text-stone-950 flex items-center gap-1.5">
            <Sparkles size={11} className="text-[#E85C28]" />
            어떤 마음으로 신청하든 좋습니다
          </h4>
          <p className="text-[10.5px] text-stone-600 leading-relaxed text-justify font-medium">
            대단한 업적이나 화려한 경력이 아니어도 괜찮습니다. 군대 전역 후의 갈림길, 소소한 취미에 빠진 일상, 대학 졸업을 앞둔 막연함, 청주 고향에서만 느꼈던 편안한 감정 등 당신만의 이야기를 영상, 사진, 인터뷰로 남겨보세요.
          </p>
        </div>
      </div>

      {/* Main Form Fields */}
      <form onSubmit={handleSubmit} className="px-4 space-y-4">
        {/* Row Contact Block */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-605">신청자 이름 *</label>
            <input
              type="text"
              value={applicantName}
              onChange={e => setApplicantName(e.target.value)}
              placeholder="예: 홍길동"
              className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28] focus:ring-1 focus:ring-[#E85C28]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-605">만 나이 *</label>
            <input
              type="number"
              value={age}
              onChange={e => setAge(Number(e.target.value))}
              className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28]"
              min="10"
              max="120"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-605">연락처 *</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="010-1234-5678"
              className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-605">이메일 주소 *</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="gildong@gmail.com"
              className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28]"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-605">인스타그램 아이디 / SNS (선택)</label>
          <input
            type="text"
            value={instagramId}
            onChange={e => setInstagramId(e.target.value)}
            placeholder="@cheongjun_film"
            className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-605">희망 제작 날짜 (선택)</label>
            <input
              type="date"
              value={preferredDate}
              onChange={e => setPreferredDate(e.target.value)}
              className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-605">희망 제작 장소 (선택)</label>
            <input
              type="text"
              value={preferredPlace}
              onChange={e => setPreferredPlace(e.target.value)}
              placeholder="예: 수암골, 무심천"
              className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28]"
            />
          </div>
        </div>

        {/* Story Category Selector Widget */}
        <div className="space-y-1.5">
          <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-605">바라는 기록의 형태 *</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'video', label: '🎞️ 영상', desc: '다큐멘터리' },
              { id: 'photo', label: '📷 스냅', desc: '밀착스냅' },
              { id: 'interview', label: '✍️ 글로', desc: '인터뷰집' },
              { id: 'poster', label: '🎨 포스터', desc: '커스텀포스터' }
            ].map(type => (
              <button
                type="button"
                key={type.id}
                onClick={() => setPreferredType(type.id as CategoryType)}
                className={`py-2 px-1 rounded-xl border text-center transition cursor-pointer ${
                  preferredType === type.id
                    ? 'bg-[#E85C28] border-[#E85C28] text-white shadow-xs'
                    : 'bg-white border-stone-200 hover:border-stone-400 text-stone-605'
                }`}
              >
                <p className="text-[11px] font-black leading-none">{type.label}</p>
                <p className="text-[8px] opacity-75 font-sans font-bold mt-1 scale-90">{type.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Project story details */}
        <div className="space-y-1">
          <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-605">나의 스투디오 이야기 제목 *</label>
          <input
            type="text"
            value={storyTitle}
            onChange={e => setStoryTitle(e.target.value)}
            placeholder="스물셋, 방황하던 무심천 아래서 내가 마주친 것들"
            className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28]"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-605 font-sans">구체적인 나만의 사연과 감성 소개 *</label>
          <textarea
            value={storyDetails}
            onChange={e => setStoryDetails(e.target.value)}
            placeholder="이야기 나누고 싶은 소재, 평소 가지고 있던 감정이나 고민, 함께 가고 싶은 청주의 아지트나 장소를 편히 써 주세요..."
            rows={5}
            className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28] leading-relaxed"
            required
          />
        </div>

        {/* 개인정보 수집 및 이용 동의 */}
        <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-2xl space-y-3">
          <div className="text-[10px] leading-relaxed text-stone-600 space-y-1 bg-white p-3 rounded-xl border border-stone-150 shadow-inner">
            <div className="flex justify-between items-center border-b border-stone-100 pb-1 mb-1">
              <p className="font-extrabold text-stone-900 text-[10.5px]">개인정보 수집 및 이용 동의 안내</p>
              {onNavigateToPrivacy && (
                <button
                  type="button"
                  onClick={onNavigateToPrivacy}
                  className="text-[9.5px] font-bold text-[#E85C28] hover:underline cursor-pointer"
                >
                  개인정보 처리방침 보기
                </button>
              )}
            </div>
            <p>• <strong>수집 항목:</strong> 이름, 연락처, 이메일, 인스타그램 계정/SNS, 신청 내용</p>
            <p>• <strong>이용 목적:</strong> 신청 확인, 일정 및 장소 조율, 제작/상담 응답</p>
            <p>• <strong>보관 기간:</strong> <span className="text-[#E85C28] font-bold">신청일로부터 1년</span> (이후 즉시 파기)</p>
          </div>
          <label className="flex items-start gap-2 cursor-pointer group select-none">
            <input
              type="checkbox"
              checked={privacyConsent}
              onChange={e => setPrivacyConsent(e.target.checked)}
              className="mt-0.5 rounded border-stone-300 text-[#E85C28] focus:ring-[#E85C28] h-4 w-4 accent-[#E85C28] cursor-pointer"
            />
            <span className="text-[11.5px] font-bold text-stone-800 group-hover:text-stone-950 transition-colors">
              개인정보 수집 및 이용에 동의합니다. <span className="text-[#E85C28] font-black ml-0.5">*</span>
            </span>
          </label>
        </div>

        {/* Form Submission button */}
        <button
          type="submit"
          id="submit-production-req"
          disabled={isSubmitting}
          className="w-full bg-[#E85C28] disabled:opacity-50 text-white font-bold p-3 rounded-xl text-xs tracking-widest uppercase transition-all duration-300 mt-4 shadow-sm cursor-pointer"
        >
          {isSubmitting ? '전원 켜고 필름 전송 중...' : '나의 감정 필름 전송하기'}
        </button>
      </form>
    </div>
  );
}
