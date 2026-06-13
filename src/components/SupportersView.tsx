import React, { useState } from 'react';
import { CheckCircle, Star, Instagram } from 'lucide-react';

interface SupportersViewProps {
  onSubmit: (data: {
    applicantName: string;
    age: number;
    phone: string;
    email: string;
    introduction: string;
    motive: string;
    instagramUrl?: string;
    region: string;
    interests: string;
    availableDays: string;
  }) => Promise<void>;
}

export default function SupportersView({ onSubmit }: SupportersViewProps) {
  // Supporter submission form state
  const [applicantName, setApplicantName] = useState('');
  const [age, setAge] = useState<number>(24);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [motive, setMotive] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [region, setRegion] = useState('');
  const [interests, setInterests] = useState('기획/촬영 Crew');
  const [availableDays, setAvailableDays] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!applicantName || !phone || !email || !introduction || !motive || !region || !interests || !availableDays) {
      alert('필수 입력 항목들을 전부 작성해주시기 바랍니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        applicantName,
        age: Number(age),
        phone,
        email,
        introduction,
        motive,
        instagramUrl: instagramUrl || undefined,
        region,
        interests,
        availableDays
      });
      alert('서포터즈 신청이 완료되었습니다.');
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      alert('접수 중 오류가 발생했습니다. 네트워크 신호를 확인해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-6 text-center animate-fadeIn text-stone-800 bg-[#FDFCF8]">
        <div className="w-16 h-16 rounded-full bg-red-50 text-[#E85C28] border border-red-100 flex items-center justify-center mb-5 animate-bounce shadow">
          <CheckCircle size={32} />
        </div>
        
        <span className="text-[9px] font-sans font-black bg-[#E85C28] text-white px-2 py-0.5 rounded uppercase tracking-wider">SUPPORTER NOMINATION CARD</span>
        <h3 className="font-sans text-lg font-black text-stone-900 mt-2.5">서포터즈 지원이 접수되었습니다!</h3>
        
        <p className="text-[11px] text-stone-605 leading-relaxed mt-3 max-w-xs px-2 font-sans font-bold">
          청춘필름의 여정에 날개를 달아주셔서 대단히 감사드립니다. 지원자님의 따뜻한 동기와 특기는 서류 검토 기간 동안 하나하나 소중히 읽어볼 예정입니다.<br/> 
          <b>모집 마감일 후, 개별적인 합격 안내 및 오리엔테이션 일정을 문자와 메일로 알려드리겠습니다.</b>
        </p>

        <div className="w-full bg-white p-5 rounded-3xl border border-stone-200 mt-6 text-left space-y-2.5 max-w-xs font-sans text-xs shadow-sm text-stone-800">
          <p className="flex justify-between border-b border-stone-100 pb-1.5">
            <span className="text-stone-550 font-bold">지원 분야</span>
            <span className="text-[#E85C28] font-sans font-black">청춘기록 서포터즈 Crew</span>
          </p>
          <p className="flex justify-between">
            <span className="text-stone-550 font-bold">지원자명</span>
            <span className="text-stone-900 font-extrabold">{applicantName} (만 {age}세)</span>
          </p>
        </div>

        <button
          id="supporters-success-back-home"
          onClick={() => setIsSuccess(false)}
          className="mt-8 px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#E85C28] text-white font-bold rounded-xl text-xs transition duration-200 cursor-pointer shadow-sm"
        >
          새로운 지원서 작성하기
        </button>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col pb-12 animate-fadeIn text-stone-850 font-sans">
      {/* Editorial cover photo design */}
      <div className="relative h-44 bg-stone-900 border-b border-stone-250 flex flex-col justify-end p-5 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=600"
          alt="Vintage group of dreamers"
          referrerPolicy="no-referrer"
          className="absolute inset-x-0 inset-y-0 w-full h-full object-cover brightness-40 sepia-[0.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
        <div className="relative z-10">
          <span className="text-[8px] font-sans font-black bg-[#E85C28] text-white px-2 py-0.5 rounded uppercase tracking-wider">MEMBER RECRUITMENT</span>
          <h2 className="text-xl font-sans font-black text-white mt-1.5 tracking-tight">청춘필름의 크루가 되어주세요</h2>
          <p className="text-[10px] text-stone-200 font-medium">세상을 따뜻하게 인화하는 로컬 서포터즈 모집</p>
        </div>
      </div>

      {/* Recruits Guidelines widget */}
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-4.5 space-y-2.5 text-stone-800 shadow-sm">
          <h4 className="text-[11.5px] font-black text-stone-950 flex items-center gap-1.5 font-sans">
            <Star size={12} className="text-[#E85C28]" />
            활동 혜택 및 미션 안내
          </h4>
          <ul className="text-[10px] text-stone-600 space-y-1.5 font-sans font-medium list-disc list-inside">
            <li><b>기획/촬영 Crew</b>: 20대 대상 다큐멘터리 기획 및 촬영 보조</li>
            <li><b>스토리/글종 Crew</b>: 사전 만답 주도 및 인터뷰 대화 정리 및 아카이브집 제작</li>
            <li><b>혜택</b>: 아날로그 카메라 및 현상 인화비 무상 지원, 활동 증명 수료증 등</li>
          </ul>
        </div>
      </div>

      {/* Supporter Registration Form */}
      <form onSubmit={handleSubmit} className="px-4 space-y-4">
        {/* Name and Age grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-605">지원자 성함 *</label>
            <input
              type="text"
              value={applicantName}
              onChange={e => setApplicantName(e.target.value)}
              placeholder="예: 성춘향"
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

        {/* Contacts grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-605">연락처 *</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="010-9876-5432"
              className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-605">이메일 *</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="chunhyang@daum.net"
              className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28]"
              required
            />
          </div>
        </div>

        {/* Region and Available Days Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-605">사는 지역 *</label>
            <input
              type="text"
              value={region}
              onChange={e => setRegion(e.target.value)}
              placeholder="예: 청주시 상당구"
              className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-605">참여 가능 요일 *</label>
            <input
              type="text"
              value={availableDays}
              onChange={e => setAvailableDays(e.target.value)}
              placeholder="예: 주말 전체, 평일 저녁"
              className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28]"
              required
            />
          </div>
        </div>

        {/* Interests Selector */}
        <div className="space-y-1">
          <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-605 font-sans">관심 분야 *</label>
          <select
            value={interests}
            onChange={e => setInterests(e.target.value)}
            className="w-full bg-white border border-stone-250 rounded-lg p-[#A59E92] p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28] h-[38px]"
            required
          >
            <option value="기획/촬영 Crew">기획/촬영 Crew (다큐멘터리 기획 및 촬영 보조)</option>
            <option value="스토리/인터뷰 Crew">스토리/인터뷰 Crew (만담 주도, 녹취 및 아카이빙)</option>
            <option value="현상/인화 Crew">현상/인화 Crew (아날로그 인화 및 스튜디오 서포트)</option>
            <option value="홍보/디자인 Crew">홍보/디자인 Crew (SNS 관리, 홍보물 및 아카이브집 제작)</option>
          </select>
        </div>

        {/* Self Intro */}
        <div className="space-y-1">
          <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-605 font-sans">한 줄 자기소개 *</label>
          <input
            type="text"
            value={introduction}
            onChange={e => setIntroduction(e.target.value)}
            placeholder="예: 청춘을 따스함과 글솜씨로 기록하고 싶은 문예창작 전공 대학생입니다."
            className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28]"
            required
          />
        </div>

        {/* Motive Details */}
        <div className="space-y-1">
          <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-605 font-sans">지원 동기 및 하고 싶은 활동 *</label>
          <textarea
            value={motive}
            onChange={e => setMotive(e.target.value)}
            placeholder="청춘필름에서 어떠한 분야(촬영 보조, 기획 진행, 인터뷰 편집 등)에 기여하고 싶은지 서술해 주세요..."
            rows={5}
            className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28] leading-relaxed"
            required
          />
        </div>

        {/* Instagram */}
        <div className="space-y-1">
          <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-605 font-mono flex items-center gap-1">
            <Instagram size={11} className="text-[#E85C28]" />
            인스타그램 ID / 포트폴리오 URL (선택)
          </label>
          <input
            type="text"
            value={instagramUrl}
            onChange={e => setInstagramUrl(e.target.value)}
            placeholder="@your_instagram_id"
            className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28]"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          id="submit-supporters-form"
          disabled={isSubmitting}
          className="w-full bg-[#E85C28] disabled:opacity-50 text-white font-bold p-3 rounded-xl text-xs tracking-widest uppercase transition-all duration-300 mt-6 shadow-sm cursor-pointer"
        >
          {isSubmitting ? '서류 안전 봉합 및 전송 중...' : '청춘 크루 지원표 제출하기'}
        </button>
      </form>
    </div>
  );
}
