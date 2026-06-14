import React, { useState } from 'react';
import { Mail, Phone, Calendar, ClipboardCheck, Trash2, ExternalLink } from 'lucide-react';
import { ProductionApplication, SupporterApplication, Inquiry } from '../types';

interface AdminViewProps {
  productionApps: ProductionApplication[];
  supporterApps: SupporterApplication[];
  inquiries: Inquiry[];
  onUpdateProductionStatus: (id: string, status: ProductionApplication['status']) => Promise<void>;
  onDeleteProduction: (id: string) => Promise<void>;
  onUpdateSupporterStatus: (id: string, status: SupporterApplication['status']) => Promise<void>;
  onDeleteSupporter: (id: string) => Promise<void>;
  onAnswerInquiry: (id: string, reply: string) => Promise<void>;
  onDeleteInquiry: (id: string) => Promise<void>;
}

type AdminTab = 'production' | 'supporter' | 'inquiry';

export default function AdminView({
  productionApps,
  supporterApps,
  inquiries,
  onUpdateProductionStatus,
  onDeleteProduction,
  onUpdateSupporterStatus,
  onDeleteSupporter,
  onAnswerInquiry,
  onDeleteInquiry
}: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('production');
  const [draftReplies, setDraftReplies] = useState<{ [id: string]: string }>({});

  const getMs = (dateVal: any) => {
    if (!dateVal) return 0;
    if (typeof dateVal.toDate === 'function') {
      return dateVal.toDate().getTime();
    }
    if (dateVal.seconds) {
      return dateVal.seconds * 1000;
    }
    const parsed = new Date(dateVal).getTime();
    return isNaN(parsed) ? 0 : parsed;
  };

  const sortedProductionApps = [...productionApps].sort((a, b) => getMs(b.createdAt) - getMs(a.createdAt));
  const sortedSupporterApps = [...supporterApps].sort((a, b) => getMs(b.createdAt) - getMs(a.createdAt));

  const handleStatusChangeProduction = async (id: string, newStatus: any) => {
    try {
      await onUpdateProductionStatus(id, newStatus);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusChangeSupporter = async (id: string, newStatus: any) => {
    try {
      await onUpdateSupporterStatus(id, newStatus);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePostReply = async (id: string) => {
    const text = draftReplies[id];
    if (!text || !text.trim()) {
      alert('답변 문구를 남겨주세요.');
      return;
    }

    try {
      await onAnswerInquiry(id, text);
      alert('답변이 등록되었습니다!');
      setDraftReplies(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleTrashProduction = async (id: string) => {
    if (confirm('이 제작 신청을 영구 제거하시겠습니까?')) {
      await onDeleteProduction(id);
    }
  };

  const handleTrashSupporter = async (id: string) => {
    if (confirm('이 서포터즈 지원서를 영구 제거하시겠습니까?')) {
      await onDeleteSupporter(id);
    }
  };

  const handleTrashInquiry = async (id: string) => {
    if (confirm('이 문의글을 영구 삭제하시겠습니까?')) {
      await onDeleteInquiry(id);
    }
  };

  const formatDate = (ts: any) => {
    if (!ts) return '';
    try {
      if (ts.seconds) {
        return new Date(ts.seconds * 1000).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
      return new Date(ts).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="flex-grow flex flex-col pb-16 animate-fadeIn text-stone-850 bg-[#FDFCF8] font-sans">
      {/* Stats Counter Cards Grid */}
      <div className="p-3 bg-white border-b border-stone-200 grid grid-cols-3 gap-2.5 text-center select-none font-sans shrink-0">
        <div className="bg-[#FDFCF8] p-2.5 rounded-xl border border-stone-150">
          <p className="text-[8.5px] text-stone-500 font-bold uppercase tracking-wide">제작요청</p>
          <p className="text-sm font-black text-stone-900 mt-0.5">{productionApps.length}건</p>
        </div>
        <div className="bg-[#FDFCF8] p-2.5 rounded-xl border border-stone-150">
          <p className="text-[8.5px] text-stone-500 font-bold uppercase tracking-wide">서포터즈</p>
          <p className="text-sm font-black text-[#E85C28] mt-0.5">{supporterApps.length}명</p>
        </div>
        <div className="bg-[#FDFCF8] p-2.5 rounded-xl border border-stone-150">
          <p className="text-[8.5px] text-stone-500 font-bold uppercase tracking-wide">미정Q&A</p>
          <p className="text-sm font-black text-emerald-700 mt-0.5">
            {inquiries.filter(i => !i.reply).length}건
          </p>
        </div>
      </div>

      {/* Sub-Tabs Navigator */}
      <div className="bg-white flex border-b border-stone-200 text-stone-500 text-[11px] shrink-0 font-bold">
        <button
          id="btn-admin-tab-production"
          onClick={() => setActiveTab('production')}
          className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${
            activeTab === 'production' 
              ? 'border-[#E85C28] text-stone-900 bg-stone-50' 
              : 'border-transparent hover:text-stone-900'
          }`}
        >
          제작신청 ({productionApps.length})
        </button>
        <button
          id="btn-admin-tab-supporter"
          onClick={() => setActiveTab('supporter')}
          className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${
            activeTab === 'supporter' 
              ? 'border-[#E85C28] text-stone-900 bg-stone-50' 
              : 'border-transparent hover:text-stone-900'
          }`}
        >
          서포터즈 ({supporterApps.length})
        </button>
        <button
          id="btn-admin-tab-inquiry"
          onClick={() => setActiveTab('inquiry')}
          className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${
            activeTab === 'inquiry' 
              ? 'border-[#E85C28] text-stone-900 bg-stone-50' 
              : 'border-transparent hover:text-stone-900'
          }`}
        >
          문의내역 ({inquiries.length})
        </button>
      </div>

      {/* Primary list body */}
      <div className="p-4 flex-grow overflow-y-auto space-y-4">
        {/* Tab 1: 제작신청 리스트 */}
        {activeTab === 'production' && (
          sortedProductionApps.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-xs">
              접수된 기록 제작 신청이 존재하지 않습니다.
            </div>
          ) : (
            sortedProductionApps.map(item => (
              <div
                id={`admin-production-card-${item.id}`}
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3.5 shadow-xs text-left"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-[8.5px] font-mono font-bold tracking-widest text-[#E85C28] uppercase">
                      REQUEST NO. {item.id.slice(0, 8)}
                    </span>
                    <h4 className="text-xs font-black text-stone-900 mt-1 truncate leading-snug">
                      {item.storyTitle}
                    </h4>
                  </div>
                  
                  {/* Status chip dropdown */}
                  <select
                    id={`select-status-production-${item.id}`}
                    value={item.status}
                    onChange={e => handleStatusChangeProduction(item.id, e.target.value as any)}
                    className="bg-stone-50 border border-stone-250 text-stone-900 text-[10px] rounded p-1.5 font-bold focus:outline-none focus:border-[#E85C28] shrink-0"
                  >
                    <option value="received">📥 대기 (received)</option>
                    <option value="reviewed">✍️ 검토 (reviewed)</option>
                    <option value="contacted">📞 연락 (contacted)</option>
                    <option value="completed">🎉 완료 (completed)</option>
                    <option value="accepted">✓ 확정 (accepted)</option>
                    <option value="declined">✕ 보류 (declined)</option>
                  </select>
                </div>

                <div className="text-[10.5px] text-stone-650 leading-relaxed bg-stone-50 p-2.5 rounded-lg border border-stone-150 font-medium">
                  {item.storyDetails}
                </div>

                {/* Sub-details */}
                <div className="grid grid-cols-2 gap-2 text-[9.5px] text-stone-550 font-mono mt-2.5 border-t border-stone-100 pt-2 font-bold">
                  <p className="flex items-center gap-1 min-w-0">
                    <Mail size={12} className="text-[#E85C28] shrink-0" />
                    <span className="truncate">{item.email}</span>
                  </p>
                  <p className="flex items-center gap-1 justify-end min-w-0">
                    <Phone size={12} className="text-[#E85C28] shrink-0" />
                    <span className="truncate">{item.phone}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <ClipboardCheck size={12} className="text-[#E85C28] shrink-0" />
                    <span>형태: <b className="text-[#E85C28] uppercase font-sans font-bold">{item.preferredType}</b></span>
                  </p>
                  <p className="flex items-center gap-1 justify-end">
                    <Calendar size={12} className="text-[#E85C28] shrink-0" />
                    <span>{formatDate(item.createdAt)}</span>
                  </p>
                </div>

                {/* Trash trigger */}
                <div className="flex justify-between items-center border-t border-stone-100 pt-2.5">
                  <span className="text-[10px] text-stone-600 font-bold">
                    신청인 : <span className="text-stone-900 font-black">{item.applicantName}</span> (만 {item.age}세)
                  </span>
                  
                  <button
                    id={`trash-production-${item.id}`}
                    onClick={() => handleTrashProduction(item.id)}
                    className="p-1.5 rounded-lg bg-stone-50 hover:bg-red-50 hover:text-[#E85C28] text-stone-400 transition cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )
        )}

        {/* Tab 2: 서포터즈 목록 리스트 */}
        {activeTab === 'supporter' && (
          sortedSupporterApps.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-xs">
              접수된 서포터즈 지원서가 존재하지 않습니다.
            </div>
          ) : (
            sortedSupporterApps.map(item => (
              <div
                id={`admin-supporter-card-${item.id}`}
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3.5 shadow-xs text-left"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-black text-stone-900 flex items-center gap-1.5 flex-wrap">
                      {item.applicantName} 
                      <span className="text-[10px] text-stone-500 font-bold">(만 {item.age}세)</span>
                    </h4>
                    <p className="text-[9.5px] text-[#E85C28] font-sans font-black mt-1 italic truncate">
                      "{item.introduction}"
                    </p>
                  </div>

                  <select
                    id={`select-status-supporter-${item.id}`}
                    value={item.status}
                    onChange={e => handleStatusChangeSupporter(item.id, e.target.value as any)}
                    className="bg-stone-50 border border-stone-250 text-stone-900 text-[10px] rounded p-1.5 font-bold focus:outline-none focus:border-[#E85C28] shrink-0"
                  >
                    <option value="received">📥 대기 (received)</option>
                    <option value="reviewed">✍️ 검토 (reviewed)</option>
                    <option value="contacted">📞 연락 (contacted)</option>
                    <option value="completed">🎉 완료 (completed)</option>
                    <option value="accepted">✓ 합격 (accepted)</option>
                    <option value="declined">✕ 불합격 (declined)</option>
                  </select>
                </div>

                {/* Additional Supporter Sub-Fields */}
                <div className="grid grid-cols-2 gap-2 text-[10px] bg-stone-50/50 p-2.5 rounded-lg border border-stone-150 font-sans">
                  <div>
                    <span className="text-stone-450 font-bold block text-[8px] uppercase tracking-wider">사는 지역</span>
                    <span className="text-stone-900 font-bold">{item.region || '미입력'}</span>
                  </div>
                  <div>
                    <span className="text-stone-450 font-bold block text-[8px] uppercase tracking-wider">참여 가능 요일</span>
                    <span className="text-stone-900 font-bold">{item.availableDays || '미입력'}</span>
                  </div>
                  <div className="col-span-2 border-t border-stone-100 pt-1.5 mt-0.5">
                    <span className="text-stone-450 font-bold block text-[8px] uppercase tracking-wider">관심 및 희망 분야</span>
                    <span className="text-[#E85C28] font-black">{item.interests || '미입력'}</span>
                  </div>
                </div>

                <div className="space-y-1 bg-stone-50 p-2.5 rounded-lg border border-stone-150 text-[10px]">
                  <p className="text-[#E85C28] font-black uppercase tracking-wider text-[8px]">지원동기 및 참여포부</p>
                  <p className="text-stone-700 font-sans font-semibold leading-relaxed whitespace-pre-wrap">{item.motive}</p>
                </div>

                {/* Sub-contacts */}
                <div className="grid grid-cols-2 gap-2 text-[9.5px] text-stone-550 font-mono mt-2.5 border-t border-stone-100 pt-2 font-bold">
                  <p className="flex items-center gap-1 min-w-0">
                    <Mail size={12} className="text-[#E85C28] shrink-0" />
                    <span className="truncate">{item.email}</span>
                  </p>
                  <p className="flex items-center gap-1 justify-end min-w-0">
                    <Phone size={12} className="text-[#E85C28] shrink-0" />
                    <span className="truncate">{item.phone}</span>
                  </p>
                  {item.instagramUrl ? (
                    <a
                      href={item.instagramUrl.startsWith('http') ? item.instagramUrl : `https://instagram.com/${item.instagramUrl.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-pink-600 hover:underline inline-flex min-w-0"
                    >
                      <ExternalLink size={12} className="shrink-0 text-pink-500" />
                      <span className="truncate">{item.instagramUrl}</span>
                    </a>
                  ) : (
                    <p className="text-stone-400 font-bold">인스타 연동 없음</p>
                  )}
                  <p className="flex items-center gap-1 justify-end">
                    <Calendar size={12} className="text-[#E85C28] shrink-0" />
                    <span>{formatDate(item.createdAt)}</span>
                  </p>
                </div>

                <div className="flex justify-end border-t border-stone-100 pt-2.5">
                  <button
                    id={`trash-supporter-${item.id}`}
                    onClick={() => handleTrashSupporter(item.id)}
                    className="p-1.5 rounded-lg bg-stone-50 hover:bg-red-50 hover:text-[#E85C28] text-stone-400 transition cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )
        )}

        {/* Tab 3: 문의 및 Q&A 답변작성 */}
        {activeTab === 'inquiry' && (
          inquiries.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-xs">
              접수된 포럼 질문이 존재하지 않습니다.
            </div>
          ) : (
            inquiries.map(item => (
              <div
                id={`admin-inquiry-card-${item.id}`}
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3 shadow-xs text-left"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1.5 text-[9px] font-mono text-stone-500 font-bold flex-wrap">
                      <span>작성: {item.writerName}</span>
                      <span>•</span>
                      <span className="truncate">메일: {item.email}</span>
                      <span>•</span>
                      <span>날짜: {formatDate(item.createdAt)}</span>
                    </div>
                    <h4 className="text-xs font-black text-stone-900 mt-1 truncate leading-snug">
                      {item.subject}
                    </h4>
                  </div>
                  
                  {item.reply ? (
                    <span className="text-[8.5px] bg-[#E85C28] text-white font-black px-1.5 py-0.5 rounded inline-flex shrink-0">
                      ✓ 완료 (replied)
                    </span>
                  ) : (
                    <span className="text-[8.5px] bg-red-50 border border-red-100 text-[#E85C28] font-black px-1.5 py-0.5 rounded inline-flex shrink-0 animate-pulse">
                      답변 대기
                    </span>
                  )}
                </div>

                <div className="text-[10.5px] bg-stone-50 p-2.5 rounded-lg border border-stone-150 leading-relaxed text-stone-750 font-medium">
                  {item.message}
                </div>

                {/* Sub replying console */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-2 mt-2">
                  <p className="text-[8.5px] text-[#E85C28] uppercase tracking-wider font-sans font-black">공식 답변문 (Reply Writer)</p>
                  
                  <textarea
                    id={`draft-reply-${item.id}`}
                    value={draftReplies[item.id] !== undefined ? draftReplies[item.id] : item.reply || ''}
                    onChange={e => {
                      const text = e.target.value;
                      setDraftReplies(prev => ({ ...prev, [item.id]: text }));
                    }}
                    placeholder="피드백 답변글을 작성해 주세요..."
                    rows={3}
                    className="w-full bg-white text-stone-955 text-xs p-2 rounded-lg border border-stone-250 focus:outline-none focus:border-[#E85C28] font-semibold font-sans leading-relaxed"
                  />

                  <div className="flex justify-between items-center pt-1.5">
                    <button
                      id={`trash-inquiry-${item.id}`}
                      onClick={() => handleTrashInquiry(item.id)}
                      className="text-stone-400 hover:text-[#E85C28] p-1 cursor-pointer"
                      title="문의글 영구 삭제"
                    >
                      <Trash2 size={13} />
                    </button>

                    <button
                      id={`submit-reply-${item.id}`}
                      onClick={() => handlePostReply(item.id)}
                      className="bg-[#E85C28] hover:bg-stone-900 text-white text-[10px] font-black px-3.5 py-2 rounded-lg transition cursor-pointer"
                    >
                      답변글 게시/수정
                    </button>
                  </div>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}
