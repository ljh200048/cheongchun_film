import React, { useState } from 'react';
import { Mail, Phone, Calendar, ClipboardCheck, Trash2, ExternalLink, Edit } from 'lucide-react';
import { ProductionApplication, SupporterApplication, Inquiry, Notice } from '../types';

interface AdminViewProps {
  productionApps: ProductionApplication[];
  supporterApps: SupporterApplication[];
  inquiries: Inquiry[];
  notices: Notice[];
  onUpdateProductionStatus: (id: string, status: ProductionApplication['status']) => Promise<void>;
  onDeleteProduction: (id: string) => Promise<void>;
  onUpdateSupporterStatus: (id: string, status: SupporterApplication['status']) => Promise<void>;
  onDeleteSupporter: (id: string) => Promise<void>;
  onAnswerInquiry: (id: string, reply: string) => Promise<void>;
  onDeleteInquiry: (id: string) => Promise<void>;
  onAddNotice: (data: Omit<Notice, 'id' | 'createdAt'>) => Promise<void>;
  onEditNotice: (id: string, data: Partial<Notice>) => Promise<void>;
  onDeleteNotice: (id: string) => Promise<void>;
}

type AdminTab = 'production' | 'supporter' | 'inquiry' | 'notice';

export default function AdminView({
  productionApps,
  supporterApps,
  inquiries,
  notices,
  onUpdateProductionStatus,
  onDeleteProduction,
  onUpdateSupporterStatus,
  onDeleteSupporter,
  onAnswerInquiry,
  onDeleteInquiry,
  onAddNotice,
  onEditNotice,
  onDeleteNotice
}: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('production');
  const [draftReplies, setDraftReplies] = useState<{ [id: string]: string }>({});

  // Notice Form Fields State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeCategory, setNoticeCategory] = useState('일반');
  const [noticeIsPublic, setNoticeIsPublic] = useState(true);
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);

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
  const sortedNotices = [...notices].sort((a, b) => getMs(b.createdAt) - getMs(a.createdAt));

  const resetNoticeForm = () => {
    setNoticeTitle('');
    setNoticeContent('');
    setNoticeCategory('일반');
    setNoticeIsPublic(true);
    setEditingNoticeId(null);
  };

  const handleNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) {
      alert('제목과 내용을 모두 입력해 주세요.');
      return;
    }

    try {
      const pkg = {
        title: noticeTitle.trim(),
        content: noticeContent.trim(),
        category: noticeCategory,
        isPublic: noticeIsPublic,
        isPublished: noticeIsPublic
      };

      if (editingNoticeId) {
        await onEditNotice(editingNoticeId, pkg);
        resetNoticeForm();
      } else {
        await onAddNotice(pkg);
        resetNoticeForm();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartEditNotice = (item: Notice) => {
    setEditingNoticeId(item.id);
    setNoticeTitle(item.title);
    setNoticeContent(item.content);
    setNoticeCategory(item.category || '일반');
    setNoticeIsPublic(item.isPublic !== false);
  };

  const handleRemoveNotice = async (id: string) => {
    if (confirm('이 공지사항을 정말 영구 삭제하시겠습니까?')) {
      try {
        await onDeleteNotice(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

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
      <div className="p-3 bg-white border-b border-stone-200 grid grid-cols-4 gap-2 text-center select-none font-sans shrink-0">
        <div className="bg-[#FDFCF8] p-2 rounded-lg border border-stone-150">
          <p className="text-[7.5px] text-stone-500 font-bold uppercase tracking-wide">제작요청</p>
          <p className="text-xs font-black text-stone-900 mt-0.5">{productionApps.length}건</p>
        </div>
        <div className="bg-[#FDFCF8] p-2 rounded-lg border border-stone-150">
          <p className="text-[7.5px] text-stone-500 font-bold uppercase tracking-wide">서포터즈</p>
          <p className="text-xs font-black text-[#E85C28] mt-0.5">{supporterApps.length}명</p>
        </div>
        <div className="bg-[#FDFCF8] p-2 rounded-lg border border-stone-150">
          <p className="text-[7.5px] text-stone-500 font-bold uppercase tracking-wide">미정Q&A</p>
          <p className="text-xs font-black text-emerald-750 mt-0.5">
            {inquiries.filter(i => !i.reply).length}건
          </p>
        </div>
        <div className="bg-[#FDFCF8] p-2 rounded-lg border border-stone-150">
          <p className="text-[7.5px] text-stone-500 font-bold uppercase tracking-wide">공지사항</p>
          <p className="text-xs font-black text-sky-700 mt-0.5">{notices.length}개</p>
        </div>
      </div>

      {/* Sub-Tabs Navigator */}
      <div className="bg-white flex border-b border-stone-200 text-stone-500 text-[10.5px] shrink-0 font-bold">
        <button
          id="btn-admin-tab-production"
          onClick={() => setActiveTab('production')}
          className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${
            activeTab === 'production' 
              ? 'border-[#E85C28] text-stone-900 bg-stone-50' 
              : 'border-transparent hover:text-stone-900'
          }`}
        >
          제작 ({productionApps.length})
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
          onClick={() => {
            setActiveTab('inquiry');
          }}
          className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${
            activeTab === 'inquiry' 
              ? 'border-[#E85C28] text-stone-900 bg-stone-50' 
              : 'border-transparent hover:text-stone-900'
          }`}
        >
          Q&A ({inquiries.length})
        </button>
        <button
          id="btn-admin-tab-notice"
          onClick={() => {
            setActiveTab('notice');
          }}
          className={`flex-1 py-3 text-center border-b-2 transition-all cursor-pointer ${
            activeTab === 'notice' 
              ? 'border-[#E85C28] text-stone-900 bg-stone-50' 
              : 'border-transparent hover:text-stone-900'
          }`}
        >
          공지 ({notices.length})
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
                    <option value="received">📥 접수됨</option>
                    <option value="contacted">📞 연락완료</option>
                    <option value="reviewed">🔄 진행중</option>
                    <option value="completed">✅ 완료</option>
                    <option value="accepted">✓ 확정</option>
                    <option value="declined">✕ 보류</option>
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
                    <option value="received">📥 접수됨</option>
                    <option value="contacted">📞 연락완료</option>
                    <option value="reviewed">🔄 진행중</option>
                    <option value="completed">✅ 완료</option>
                    <option value="accepted">✓ 합격</option>
                    <option value="declined">✕ 불합격</option>
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

        {/* Tab 4: 공지사항 작성 및 관리 */}
        {activeTab === 'notice' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Notice Create/Edit Form */}
            <form onSubmit={handleNoticeSubmit} className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3.5 shadow-sm text-left">
              <h4 className="text-xs font-black text-stone-900 tracking-tight uppercase flex items-center gap-1.5 border-b border-stone-100 pb-2">
                <span className="text-[#E85C28]">📢</span> 
                {editingNoticeId ? '공지사항 수정하기' : '새로운 공지사항 작성'}
              </h4>
              
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-[8.5px] uppercase font-bold text-stone-500 mb-1">공지사항 제목</label>
                  <input
                    type="text"
                    value={noticeTitle}
                    onChange={e => setNoticeTitle(e.target.value)}
                    placeholder="공지 제목을 입력하세요 (예: 청춘필름 가을 모집 안내)"
                    className="w-full bg-stone-50 border border-stone-250 text-stone-900 text-xs rounded-lg p-2.5 font-bold focus:outline-none focus:border-[#E85C28]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[8.5px] uppercase font-bold text-stone-500 mb-1">카테고리</label>
                    <select
                      value={noticeCategory}
                      onChange={e => setNoticeCategory(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-250 text-stone-900 text-xs rounded-lg p-2.5 font-bold focus:outline-none focus:border-[#E85C28]"
                    >
                      <option value="일반">일반</option>
                      <option value="행사">행사</option>
                      <option value="모집">모집</option>
                      <option value="안내">안내</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[8.5px] uppercase font-bold text-stone-500 mb-1">작성 공개 설정</label>
                    <select
                      value={noticeIsPublic ? 'true' : 'false'}
                      onChange={e => setNoticeIsPublic(e.target.value === 'true')}
                      className="w-full bg-stone-50 border border-stone-250 text-stone-900 text-xs rounded-lg p-2.5 font-bold focus:outline-none focus:border-[#E85C28]"
                    >
                      <option value="true">🔓 즉시 공개 (Published)</option>
                      <option value="false">🔒 비공개 저장 (Private Draft)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[8.5px] uppercase font-bold text-stone-500 mb-1">공지 세부 내용</label>
                  <textarea
                    value={noticeContent}
                    onChange={e => setNoticeContent(e.target.value)}
                    placeholder="공지 사항의 자세한 배경, 일정, 장소 등의 혜택을 입력해주세요..."
                    rows={5}
                    className="w-full bg-stone-50 border border-stone-250 text-stone-900 text-xs rounded-lg p-2.5 font-semibold focus:outline-none focus:border-[#E85C28] leading-relaxed"
                    required
                  />
                </div>

                <div className="flex space-x-2 pt-1 border-t border-stone-100 mt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#E85C28] hover:bg-stone-900 text-white font-black p-2.5 rounded-lg text-[10.5px] tracking-wider transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
                  >
                    {editingNoticeId ? '공지사항 수정 완료' : '새로운 공지사항 게시'}
                  </button>
                  {editingNoticeId && (
                    <button
                      type="button"
                      onClick={resetNoticeForm}
                      className="bg-stone-150 hover:bg-stone-250 text-stone-900 font-bold p-2.5 rounded-lg text-[10.5px] transition duration-200 cursor-pointer"
                    >
                      취소
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* List of Notices under Admin notices management */}
            <div className="space-y-3 pt-2">
              <h4 className="text-[10px] font-black text-stone-500 tracking-wider uppercase pl-1">
                게시 중인 공지 목록 (최신순)
              </h4>

              {sortedNotices.length === 0 ? (
                <div className="text-center py-12 text-stone-500 text-xs bg-white rounded-xl border border-stone-200">
                  게시된 아카이브 공지사항이 아직 존재하지 않습니다.
                </div>
              ) : (
                sortedNotices.map(item => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3.5 shadow-xs text-left"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 text-[9px] font-sans font-black flex-wrap gap-y-1">
                          <span className="bg-[#E85C28]/10 text-[#E85C28] px-1.5 py-0.5 rounded text-[8px] font-black uppercase">
                            {item.category || '일반'}
                          </span>
                          <span className="text-stone-300">•</span>
                          <span className="text-stone-500 font-mono font-bold flex items-center gap-0.5">
                            <Calendar size={10} />
                            {formatDate(item.createdAt)}
                          </span>
                          <span className="text-stone-300">•</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${item.isPublic !== false ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-stone-500'}`}>
                            {item.isPublic !== false ? '공개됨' : '비공개'}
                          </span>
                        </div>
                        
                        <h5 className="text-xs font-black text-stone-900 mt-2 truncate leading-snug">
                          {item.title}
                        </h5>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEditNotice(item)}
                          className="p-1.5 rounded-lg bg-stone-50 hover:bg-stone-150 text-stone-600 transition cursor-pointer"
                          title="공지 수정"
                        >
                          <Edit size={11} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveNotice(item.id)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-[#E85C28] transition cursor-pointer"
                          title="공지 삭제"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>

                    <div className="text-[10px] text-stone-650 leading-relaxed font-sans font-medium whitespace-pre-wrap line-clamp-3 bg-stone-50 p-2.5 rounded-lg border border-stone-150">
                      {item.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
