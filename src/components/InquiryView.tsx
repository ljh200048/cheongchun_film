import React, { useState } from 'react';
import { HelpCircle, Lock, Key, Plus, X, CornerDownRight, ChevronRight } from 'lucide-react';
import { Inquiry } from '../types';

interface InquiryViewProps {
  inquiries: Inquiry[];
  isAdmin: boolean;
  onAdd: (data: Omit<Inquiry, 'id' | 'status' | 'createdAt'>) => Promise<void>;
}

export default function InquiryView({ inquiries, isAdmin, onAdd }: InquiryViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  
  // Custom passcode block state
  const [promptPasscode, setPromptPasscode] = useState(false);
  const [enteredPasscode, setEnteredPasscode] = useState('');
  const [parentTarget, setParentTarget] = useState<Inquiry | null>(null);
  const [passcodeError, setPasscodeError] = useState(false);

  // New Inquiry Fields State
  const [writerName, setWriterName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInquiryClick = (item: Inquiry) => {
    if (isAdmin) {
      setSelectedInquiry(item);
      return;
    }

    if (item.isSecret) {
      setParentTarget(item);
      setEnteredPasscode('');
      setPasscodeError(false);
      setPromptPasscode(true);
    } else {
      setSelectedInquiry(item);
    }
  };

  const handlePasscodeVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentTarget) return;

    if (enteredPasscode === parentTarget.password) {
      setSelectedInquiry(parentTarget);
      setPromptPasscode(false);
      setParentTarget(null);
    } else {
      setPasscodeError(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!writerName || !email || !subject || !message) {
      alert('필수 사항들을 모두 작성해주세요.');
      return;
    }

    if (isSecret && !password) {
      alert('비밀글 설정 시 비밀번호는 필수입니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd({
        writerName,
        email,
        subject,
        message,
        isSecret,
        password: isSecret ? password : undefined
      });
      setShowAddModal(false);
      
      // Reset
      setWriterName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setIsSecret(false);
      setPassword('');
      alert('문의가 접수되었습니다.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Safe Date Converter Helper
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
    <div className="flex-grow flex flex-col pb-12 animate-fadeIn text-stone-850 relative">
      <div className="px-4 py-3 bg-white border-b border-stone-200 flex justify-between items-center shrink-0">
        <span className="text-[10px] uppercase font-sans tracking-wider text-stone-800 font-extrabold">독립 1:1 Q&A 포럼</span>
        <button
          id="trigger-add-inquiry-btn"
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 bg-[#E85C28] hover:bg-stone-900 text-white px-3.5 py-1.5 rounded-full text-[11px] font-bold transition duration-200 cursor-pointer"
        >
          <Plus size={13} />
          <span>질문 남기기</span>
        </button>
      </div>

      {/* Inquiries Bulletins List */}
      <div className="divide-y divide-stone-150 bg-white">
        {inquiries.length === 0 ? (
          <div className="py-16 text-center text-stone-550 font-sans text-xs leading-relaxed bg-[#FDFCF8]">
            게시판에 접수된 질문이 아직 존재하지 않습니다.
          </div>
        ) : (
          inquiries.map(item => (
            <button
              id={`inquiry-row-${item.id}`}
              key={item.id}
              onClick={() => handleInquiryClick(item)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-50 transition select-none cursor-pointer border-b border-stone-150"
            >
              <div className="space-y-1.5 flex-1 pr-4 min-w-0">
                <div className="flex items-center space-x-2 text-[9px] font-mono font-bold text-stone-500">
                  <span>{item.writerName[0]}*필름</span>
                  <span className="text-stone-300">•</span>
                  <span>{formatDate(item.createdAt)}</span>
                </div>
                
                <div className="flex items-center space-x-1.5">
                  {item.isSecret && <Lock size={12} className="text-[#E85C28] shrink-0" />}
                  <h4 className="font-sans text-[12.5px] font-extrabold text-[#1A1A1A] truncate leading-snug">
                    {item.subject}
                  </h4>
                </div>

                <div className="flex items-center space-x-1.5 text-[10px] mt-1">
                  {item.status === 'replied' ? (
                    <span className="inline-flex items-center text-emerald-800 font-bold bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded text-[8.5px] tracking-tight">
                      ✓ 답장 완료
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-stone-600 bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded text-[8.5px] tracking-tight font-bold">
                      접수 대기
                    </span>
                  )}
                </div>
              </div>

              <ChevronRight size={14} className="text-stone-400 shrink-0" />
            </button>
          ))
        )}
      </div>

      {/* Inquiry Detail Overlay */}
      {selectedInquiry && (
        <div className="absolute inset-0 bg-[#FDFCF8] z-55 overflow-y-auto flex flex-col p-4 animate-fadeIn">
          <div className="flex items-center justify-between mb-4 border-b border-stone-200 pb-2">
            <span className="text-[10px] font-sans font-black text-stone-850 uppercase tracking-widest flex items-center gap-1">
              <HelpCircle size={11} className="text-[#E85C28]" />
              INQUIRY DISPATCH DISCLOSURE
            </span>
            <button
              id="close-inquiry-detail"
              onClick={() => setSelectedInquiry(null)}
              className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-800 hover:text-[#E85C28] transition duration-200 cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          <div className="space-y-4">
            {/* User message */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 space-y-3 shadow-sm">
              <div className="flex justify-between items-center text-[9px] text-stone-500 font-sans font-bold">
                <span>작성자: {selectedInquiry.writerName}</span>
                <span>접수일: {formatDate(selectedInquiry.createdAt)}</span>
              </div>
              <h3 className="font-sans text-base font-black text-[#1A1A1A] leading-tight border-b border-stone-100 pb-2.5">
                {selectedInquiry.subject}
              </h3>
              <p className="text-[11.5px] text-stone-700 leading-relaxed font-sans whitespace-pre-wrap pt-2 font-medium">
                {selectedInquiry.message}
              </p>
            </div>

            {/* Admin Response Thread */}
            {selectedInquiry.reply ? (
              <div className="bg-amber-50/70 p-5 rounded-3xl border border-amber-200 space-y-3 text-left shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-sans font-black text-[#E85C28] tracking-widest uppercase flex items-center gap-1">
                    <CornerDownRight size={11} className="text-[#E85C28]" />
                    CHUNGCHUN FILM REPLY
                  </span>
                  <span className="text-[8.5px] bg-[#E85C28] text-white font-black px-1.5 py-0.5 rounded uppercase">
                    OFFICIAL
                  </span>
                </div>
                <p className="text-[11.5px] text-stone-800 leading-relaxed font-sans font-medium whitespace-pre-wrap">
                  {selectedInquiry.reply}
                </p>
              </div>
            ) : (
              <div className="p-6 text-center bg-white rounded-3xl border border-dashed border-stone-300 text-[10.5px] text-stone-500 font-sans leading-relaxed font-bold">
                담당 크리에이터가 지원자님의 메세지를 검토 중이며,<br/>
                조금만 기다려주시면 정성 담긴 답변을 드리겠습니다.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Secret Inquiry Numeric Passcode Entry Sheet */}
      {promptPasscode && parentTarget && (
        <div className="absolute inset-0 bg-[#FDFCF8]/95 backdrop-blur-sm z-60 flex items-center justify-center p-6 animate-fadeIn select-none">
          <form 
            onSubmit={handlePasscodeVerify}
            className="w-full max-w-xs bg-white border border-stone-250 rounded-3xl p-6 text-center space-y-5 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => {
                setPromptPasscode(false);
                setParentTarget(null);
                setPasscodeError(false);
              }}
              className="absolute top-4 right-4 text-stone-400 hover:text-[#E85C28] transition cursor-pointer"
            >
              <X size={15} />
            </button>

            <div className="w-12 h-12 rounded-full bg-red-50 text-[#E85C28] flex items-center justify-center mx-auto border border-red-100 shadow-sm">
              <Lock size={18} />
            </div>

            <div className="space-y-1">
              <h3 className="font-sans text-[14px] font-black text-stone-900">비밀글 잠금 해제</h3>
              <p className="text-[10px] text-stone-500 font-bold">글 작성 시 입력하신 패스워드를 입력해 주세요.</p>
            </div>

            <input
              type="password"
              value={enteredPasscode}
              onChange={e => {
                setEnteredPasscode(e.target.value);
                setPasscodeError(false);
              }}
              placeholder="••••"
              className="w-full text-center tracking-widest bg-stone-50 border border-stone-250 rounded-xl p-3 focus:outline-none focus:border-[#E85C28] text-stone-950 text-lg font-black"
              required
              maxLength={16}
              autoFocus
            />

            {passcodeError && (
              <p className="text-[9.5px] text-[#E85C28] font-bold animate-shake font-sans">
                ⚠️ 패스워드가 올바르지 않습니다.
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#E85C28] text-white hover:bg-stone-900 font-bold p-2.5 rounded-xl text-xs tracking-widest uppercase transition duration-200 cursor-pointer shadow-sm"
            >
              잠금 해제 확인
            </button>
          </form>
        </div>
      )}

      {/* Add Inquiry modal */}
      {showAddModal && (
        <div className="absolute inset-0 bg-[#FDFCF8] z-55 flex flex-col p-5 animate-slideUp">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4 select-none header-wrapper shrink-0">
            <h3 className="text-xs font-sans tracking-widest text-stone-900 font-black uppercase">
              LEAVING NEW QUESTION SHEET
            </h3>
            <button
              id="close-add-inquiry-modal"
              onClick={() => {
                setShowAddModal(false);
                setWriterName('');
                setEmail('');
                setSubject('');
                setMessage('');
                setIsSecret(false);
                setPassword('');
              }}
              className="text-stone-500 hover:text-[#E85C28] transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto space-y-4 text-stone-850 pr-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-sans font-bold tracking-wider text-stone-600">작성자 닉네임 *</label>
                <input
                  type="text"
                  value={writerName}
                  onChange={e => setWriterName(e.target.value)}
                  placeholder="예: 스물다섯필름"
                  className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-sans font-bold tracking-wider text-stone-600">회신 이메일 주소 *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-sans font-bold tracking-wider text-stone-600">문의 제목 *</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="스물두살인데 참여 가능한 대상인가요?"
                className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-sans font-bold tracking-wider text-stone-600">문의 상세 질의 *</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="비제작 문의, 행사 제안 및 협업 제의 등 질문 내용을 자유롭게 기재해 주세요..."
                rows={4}
                className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28] leading-relaxed"
                required
              />
            </div>

            {/* Privacy switches */}
            <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-[11.5px] font-sans font-extrabold text-stone-900">비밀글로 격리 설정</h5>
                  <p className="text-[9px] text-stone-500 font-sans font-medium leading-none mt-1">작성자와 관리자만 비밀번호를 통해 확인 가능</p>
                </div>
                <input
                  type="checkbox"
                  id="checkbox-secret-switch"
                  checked={isSecret}
                  onChange={e => setIsSecret(e.target.checked)}
                  className="w-4 h-4 rounded text-[#E85C28] focus:ring-[#E85C28] bg-white border-stone-300 shrink-0 cursor-pointer"
                />
              </div>

              {isSecret && (
                <div className="space-y-1 mt-2.5 animate-slideDown">
                  <label className="block text-[10px] uppercase font-sans font-bold tracking-wider text-stone-600">비밀글 비밀번호 (4자리 이상) *</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="임시 암호 입력"
                    className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28] font-bold"
                    maxLength={16}
                    required={isSecret}
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              id="submit-inquiry-req"
              disabled={isSubmitting}
              className="w-full bg-[#E85C28] disabled:opacity-50 text-white font-bold p-3 rounded-xl text-xs tracking-widest uppercase transition-all duration-300 mt-6 shadow-sm cursor-pointer"
            >
              {isSubmitting ? '전송 채널 연결 중...' : '원클릭 1:1 비밀 문의 전송'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
