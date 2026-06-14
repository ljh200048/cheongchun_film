import React, { useState } from 'react';
import { HelpCircle, Lock, Trash2, ShieldCheck, ChevronRight, Send, CheckCircle2, Inbox } from 'lucide-react';
import { Inquiry } from '../types';

interface InquiryViewProps {
  inquiries: Inquiry[];
  isAdmin: boolean;
  onAdd: (data: { name: string; phone: string; email: string; category: string; message: string }) => Promise<void>;
}

const CATEGORY_OPTIONS = [
  { value: '제작', label: '🎥 청춘 필름 제작 문의' },
  { value: '서포터즈', label: '🤝 로컬 서포터즈 문의' },
  { value: '협업', label: '🎉 제휴 및 비즈니스 협업' },
  { value: '기타', label: '💡 기타 일반 문의' }
];

const STATUS_MAP = {
  received: { label: '접수됨', color: 'bg-stone-100 text-stone-700 border-stone-200' },
  checking: { label: '확인중', color: 'bg-sky-50 text-sky-700 border-sky-100' },
  completed: { label: '답변완료', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  onhold: { label: '보류', color: 'bg-amber-50 text-amber-700 border-amber-100' }
};

export default function InquiryView({ inquiries, isAdmin, onAdd }: InquiryViewProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('제작');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim() || !message.trim()) {
      alert('필수 입력 항목을 모두 채워주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        category,
        message: message.trim()
      });
      // Reset form
      setName('');
      setPhone('');
      setEmail('');
      setCategory('제작');
      setMessage('');
    } catch (err) {
      // Alerting is handled in onAdd callback (App.tsx)
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (ts: any) => {
    if (!ts) return '';
    try {
      if (ts.seconds) {
        return new Date(ts.seconds * 1000).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      return new Date(ts).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="flex-grow flex flex-col pb-12 animate-fadeIn text-stone-850 relative bg-[#FDFCF8]">
      {/* Upper header */}
      <div className="px-4 py-3 bg-white border-b border-stone-200 flex justify-between items-center shrink-0">
        <span className="text-[10px] uppercase font-sans tracking-wider text-stone-800 font-extrabold flex items-center gap-1.5">
          <HelpCircle size={13} className="text-[#E85C28]" />
          <span>1:1 청춘 소통 채널</span>
        </span>
        {isAdmin && (
          <span className="bg-emerald-50 text-emerald-700 text-[8.5px] font-bold px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
            <ShieldCheck size={10} />
            <span>관리자 모드</span>
          </span>
        )}
      </div>

      {!isAdmin ? (
        /* Regular User: Form only */
        <div className="p-5 max-w-lg mx-auto w-full space-y-6">
          <div className="text-center space-y-1 select-none pt-2">
            <h3 className="font-sans text-sm font-black text-stone-900 tracking-tight">어떤 고민이나 질문이든 들려주세요</h3>
            <p className="text-[10px] text-stone-500 font-medium">청춘필름 크리에이터와 1:1로 빠르게 소통하실 수 있습니다.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-stone-200 p-5 space-y-4 shadow-xs text-left">
            {/* Name field */}
            <div className="space-y-1">
              <label className="block text-[9.5px] uppercase font-sans font-bold tracking-wider text-stone-500 mb-0.5">작성인 성함 *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="성함 혹은 닉네임을 입력하세요"
                className="w-full bg-stone-50 border border-stone-250 rounded-xl p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28] font-bold"
                required
              />
            </div>

            {/* Grid for Contact / Email */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[9.5px] uppercase font-sans font-bold tracking-wider text-stone-500 mb-0.5">연락처 *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  className="w-full bg-stone-50 border border-stone-250 rounded-xl p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28] font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[9.5px] uppercase font-sans font-bold tracking-wider text-stone-500 mb-0.5">이메일 주소 *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-stone-50 border border-stone-250 rounded-xl p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28] font-bold"
                  required
                />
              </div>
            </div>

            {/* Category selection */}
            <div className="space-y-1">
              <label className="block text-[9.5px] uppercase font-sans font-bold tracking-wider text-stone-500 mb-0.5">문의 분류 *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-stone-50 border border-stone-250 rounded-xl p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28] font-bold"
              >
                {CATEGORY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Message payload */}
            <div className="space-y-1">
              <label className="block text-[9.5px] uppercase font-sans font-bold tracking-wider text-stone-500 mb-0.5">문의 내용 *</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="문의하실 구체적인 사연이나 질문 내용을 편하게 적어주세요. 신속하고 친절하게 답변드리겠습니다."
                rows={5}
                className="w-full bg-stone-50 border border-stone-250 rounded-xl p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28] leading-relaxed font-sans"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#E85C28] hover:bg-stone-950 disabled:opacity-50 text-white font-extrabold p-3 rounded-2xl text-xs tracking-widest uppercase transition-all duration-300 mt-6 shadow-sm cursor-pointer flex items-center justify-center space-x-1.5 active:scale-[0.98]"
            >
              <Send size={13} />
              <span>{isSubmitting ? '전송 처리 중...' : '문의하기 및 전송'}</span>
            </button>
          </form>

          {/* Micro layout spacing */}
          <div className="text-center select-none font-mono text-[8.5px] text-stone-400">
            CHUNGCHUN FILM 1:1 SECURE DIALOGUE UNIT
          </div>
        </div>
      ) : (
        /* Admin User: List of inquiries and Detail drawer */
        <div className="flex-grow flex flex-col bg-[#FDFCF8]">
          <div className="p-4 bg-amber-50/50 border-b border-stone-200 text-left select-none">
            <p className="text-[10px] font-sans font-bold text-amber-800 leading-normal">
              💡 관리자용 빠른 보관함: 현재 아카이브에 접수된 {inquiries.length}건의 모든 1:1 Q&A를 실시간으로 모니터링하고 가공할 수 있습니다.
            </p>
          </div>

          <div className="divide-y divide-stone-150 bg-white">
            {inquiries.length === 0 ? (
              <div className="py-20 text-center text-stone-500 font-sans text-xs bg-[#FDFCF8] flex flex-col items-center justify-center space-y-2">
                <Inbox size={24} className="text-stone-300" />
                <span>데이터베이스에 접수된 1:1 문의글이 아직 없습니다.</span>
              </div>
            ) : (
              inquiries.map(item => {
                const statusMeta = STATUS_MAP[item.status] || { label: item.status, color: 'bg-stone-100 text-stone-700' };
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedInquiry(item)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-50 transition select-none cursor-pointer border-b border-stone-150"
                  >
                    <div className="space-y-1.5 flex-1 pr-4 min-w-0">
                      <div className="flex items-center space-x-2 text-[9px] font-mono font-bold text-stone-500">
                        <span className="bg-stone-100 text-stone-600 px-1 py-0.5 rounded text-[8px] font-bold">
                          {item.category || '일반'}
                        </span>
                        <span>•</span>
                        <span>{item.name}님</span>
                        <span>•</span>
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                      
                      <h4 className="font-sans text-[12.5px] font-extrabold text-[#1A1A1A] truncate leading-snug">
                        {item.message.slice(0, 50)}...
                      </h4>

                      <div className="flex items-center space-x-1.5 mt-1">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8.5px] border font-bold ${statusMeta.color}`}>
                          {statusMeta.label}
                        </span>
                      </div>
                    </div>

                    <ChevronRight size={14} className="text-stone-400 shrink-0" />
                  </button>
                );
              })
            )}
          </div>

          {/* Quick Details overlay modal for admin inside Inquiry list */}
          {selectedInquiry && (
            <div className="fixed inset-0 bg-[#FDFCF8] z-55 overflow-y-auto flex flex-col p-4 animate-fadeIn">
              <div className="flex items-center justify-between mb-4 border-b border-stone-200 pb-2 shrink-0">
                <span className="text-[10px] font-mono font-extrabold text-stone-800 uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-[#E85C28]" />
                  <span>INQUIRY SHEET: {selectedInquiry.id.slice(0, 10)}</span>
                </span>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-800 hover:text-[#E85C28] transition duration-200 cursor-pointer"
                >
                  X
                </button>
              </div>

              <div className="space-y-5 max-w-lg mx-auto w-full pb-10 text-left">
                <div className="bg-white p-5 rounded-3xl border border-stone-200 space-y-4 shadow-sm">
                  <div className="flex flex-col space-y-1 border-b border-stone-100 pb-3">
                    <span className="text-[8px] tracking-widest uppercase text-white bg-[#E85C28] px-2 py-0.5 rounded font-sans font-black self-start">
                      {selectedInquiry.category || '일반'}
                    </span>
                    <h3 className="font-sans text-xs font-black text-stone-900 mt-2">
                      {selectedInquiry.name}님의 1:1 상담서
                    </h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-stone-500 font-sans font-semibold pt-1">
                      <span>연락처: {selectedInquiry.phone}</span>
                      <span>이메일: {selectedInquiry.email}</span>
                      <span>접수일: {formatDate(selectedInquiry.createdAt)}</span>
                      {selectedInquiry.updatedAt && (
                        <span>수정일: {formatDate(selectedInquiry.updatedAt)}</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-[9px] uppercase font-sans font-bold tracking-wider text-stone-400 mb-1">상세 전송 메세지</h5>
                    <p className="text-[11.5px] text-stone-800 leading-relaxed font-sans whitespace-pre-wrap font-medium">
                      {selectedInquiry.message}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                  <p className="text-[9px] text-[#E85C28] font-bold">⚠️ 빠른 관리 정보</p>
                  <p className="text-[10px] text-stone-600 leading-normal font-sans font-medium">
                    해당 접수건의 진행 상태를 가공하거나 영구 삭제를 진행하실 수 있습니다. 상세 제어 단은 메인 페이지 오른쪽 위의 [관리자 제어 단]에서 더욱 풍부하게 제공됩니다.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
