import React, { useState } from 'react';
import { Calendar, Plus, X, Trash2, Edit, Megaphone } from 'lucide-react';
import { Notice } from '../types';

interface NoticeViewProps {
  notices: Notice[];
  isAdmin: boolean;
  onAdd: (data: Omit<Notice, 'id' | 'createdAt'>) => Promise<void>;
  onEdit: (id: string, data: Partial<Notice>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  selectedNotice: Notice | null;
  setSelectedNotice: (notice: Notice | null) => void;
}

export default function NoticeView({
  notices,
  isAdmin,
  onAdd,
  onEdit,
  onDelete,
  selectedNotice,
  setSelectedNotice
}: NoticeViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Notice | null>(null);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('일반');
  const [isPublic, setIsPublic] = useState(true);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle('');
    setContent('');
    setCategory('일반');
    setIsPublic(true);
    setShowAddModal(true);
  };

  const handleOpenEdit = (item: Notice, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem(item);
    setTitle(item.title);
    setContent(item.content);
    setCategory(item.category || '일반');
    setIsPublic(item.isPublic !== false);
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      const pkg = { title, content, category, isPublic };
      if (editingItem) {
        await onEdit(editingItem.id, pkg);
      } else {
        await onAdd(pkg);
      }
      setShowAddModal(false);
      setEditingItem(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('이 공지사항을 정말 삭제하시겠습니까?')) {
      try {
        await onDelete(id);
        if (selectedNotice?.id === id) {
          setSelectedNotice(null);
        }
      } catch (err) {
        console.error(err);
      }
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
    <div className="flex-grow flex flex-col pb-12 animate-fadeIn text-stone-800 relative">
      {/* Dynamic Admin Notification controls banner */}
      {isAdmin && (
        <div className="px-4 py-3 bg-[#E85C28]/10 border-b border-[#E85C28]/25 flex justify-between items-center z-10 select-none font-sans">
          <span className="text-[10.5px] text-stone-850 font-extrabold">관리자 전용 공지 제어기</span>
          <button
            id="admin-add-notice-btn"
            onClick={handleOpenAdd}
            className="flex items-center space-x-1 bg-[#E85C28] hover:bg-stone-900 text-white px-3 py-1.5 rounded text-[10.5px] font-bold transition duration-200 cursor-pointer"
          >
            <Plus size={13} />
            <span>공지 등록</span>
          </button>
        </div>
      )}

      {/* Notices List */}
      <div className="space-y-4 p-4">
        {(() => {
          const displayedNotices = isAdmin ? notices : notices.filter(item => item.isPublic !== false);
          if (displayedNotices.length === 0) {
            return (
              <div className="py-16 text-center text-stone-500 font-sans text-xs leading-relaxed">
                게시된 공지사항이 아직 없습니다.
              </div>
            );
          }
          return displayedNotices.map((item) => (
            <div
              id={`notice-card-${item.id}`}
              key={item.id}
              onClick={() => setSelectedNotice(item)}
              className="group p-4 bg-white rounded-xl border border-stone-200 hover:border-[#E85C28] transition duration-300 cursor-pointer text-left shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1.5 flex-1 pr-4">
                  <div className="flex items-center space-x-2 text-[9px] font-mono font-bold text-[#E85C28] tracking-wider uppercase flex-wrap gap-y-1">
                    <span className="bg-[#E85C28]/10 text-[#E85C28] px-1.5 py-0.5 rounded text-[8px] font-black">
                      {item.category || '일반'}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="flex items-center space-x-1 font-black">
                      <Calendar size={10} />
                      <span>{formatDate(item.createdAt)}</span>
                    </span>
                    {isAdmin && (
                      <>
                        <span className="text-stone-300">•</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${item.isPublic !== false ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-stone-500'}`}>
                          {item.isPublic !== false ? '공개' : '비공개'}
                        </span>
                      </>
                    )}
                  </div>
                  <h4 className="font-sans text-[13px] font-black text-stone-900 group-hover:text-[#E85C28] transition-colors line-clamp-1 leading-snug pt-1">
                    {item.title}
                  </h4>
                  <p className="text-[10.5px] text-stone-600 font-sans font-medium line-clamp-1">
                    {item.content}
                  </p>
                </div>

                {isAdmin && (
                  <div className="flex items-center space-x-1 shrink-0 z-10" onClick={e => e.stopPropagation()}>
                    <button
                      id={`edit-notice-${item.id}`}
                      onClick={(e) => handleOpenEdit(item, e)}
                      className="p-1 rounded bg-stone-100 hover:bg-stone-205 text-stone-700 transition cursor-pointer"
                    >
                      <Edit size={10} />
                    </button>
                    <button
                      id={`delete-notice-${item.id}`}
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1 rounded bg-red-50 hover:bg-red-100 text-[#E85C28] transition cursor-pointer"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ));
        })()}
      </div>

      {/* Notices Detail Overlay Modal */}
      {selectedNotice && (
        <div className="absolute inset-0 bg-[#FDFCF8] z-50 overflow-y-auto flex flex-col p-4 animate-fadeIn">
          <div className="flex items-center justify-between mb-4 border-b border-stone-200 pb-2 select-none">
            <span className="text-[9px] font-sans font-black text-stone-850 uppercase tracking-widest flex items-center gap-1">
              <Megaphone size={11} className="text-[#E85C28]" />
              CHUNGCHUN NOTICE INDEX
            </span>
            <button
              id="close-notice-detail"
              onClick={() => setSelectedNotice(null)}
              className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-800 hover:text-[#E85C28] transition duration-200 cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-stone-200 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 select-none flex-wrap">
                <span className="bg-[#E85C28]/10 text-[#E85C28] px-1.5 py-0.5 rounded text-[8.5px] font-extrabold font-mono uppercase">
                  {selectedNotice.category || '일반'}
                </span>
                <span className="text-[9px] text-stone-500 font-sans font-bold block">
                  게시일 : {formatDate(selectedNotice.createdAt)}
                </span>
                {isAdmin && (
                  <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold ${selectedNotice.isPublic !== false ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-stone-500'}`}>
                    {selectedNotice.isPublic !== false ? '공개' : '비공개'}
                  </span>
                )}
              </div>
              <h3 className="font-sans text-base font-black text-stone-900 leading-tight border-b border-stone-100 pb-3">
                {selectedNotice.title}
              </h3>
              <div className="text-[11px] text-stone-750 leading-relaxed font-sans whitespace-pre-wrap text-justify pt-1 font-medium">
                {selectedNotice.content}
              </div>
            </div>

            <div className="text-center font-mono text-[9px] text-stone-400 pb-4 font-bold">
              CHUNGCHUN FILM MANAGEMENT OPERATIONS
            </div>
          </div>
        </div>
      )}

      {/* Admin Add/Edit Notice Overlay Drawer */}
      {showAddModal && (
        <div className="absolute inset-0 bg-[#FDFCF8] z-55 flex flex-col p-5 animate-slideUp">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4 select-none header-wrapper shrink-0">
            <h3 className="text-xs font-sans tracking-widest text-stone-900 font-black uppercase">
              {editingItem ? 'EDIT APERIODIC BULLETIN' : 'PUBLISH APERIODIC BULLETIN'}
            </h3>
            <button
              id="close-notice-add-modal"
              onClick={() => {
                setShowAddModal(false);
                setEditingItem(null);
              }}
              className="text-stone-605 hover:text-[#E85C28] transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-grow space-y-4 font-sans text-stone-850 overflow-y-auto">
            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-sans font-bold tracking-wider text-stone-600">공지사항 제목</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="예: 제2회 수암골 골목 청춘 아카이브 야외 사진회 안내"
                className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28] focus:ring-1 focus:ring-[#E85C28]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-sans font-bold tracking-wider text-stone-600">공지사항 카테고리</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-white border border-[#D1CFCE] rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28]"
                  required
                >
                  <option value="일반">일반</option>
                  <option value="행사">행사</option>
                  <option value="모집">모집</option>
                  <option value="안내">안내</option>
                </select>
              </div>

              <div className="space-y-1 flex flex-col justify-center">
                <label className="block text-[10px] uppercase font-sans font-bold tracking-wider text-stone-600 mb-2">공개 여부</label>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={e => setIsPublic(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#E85C28]"></div>
                  <span className="ml-2.5 text-xs font-semibold text-stone-800">
                    {isPublic ? '공개로 게시' : '비공개로 저장'}
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-sans font-bold tracking-wider text-stone-600">공지사항 세부 내용</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="공지의 상세 일정, 오프라인 장소 및 전달 사항을 자세히 작성해주세요..."
                rows={8}
                className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28] leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              id="submit-notice-form"
              className="w-full bg-[#E85C28] hover:bg-stone-900 text-white font-bold p-3 rounded-xl text-xs tracking-widest uppercase transition-all duration-300 mt-6 shadow-sm cursor-pointer shrink-0"
            >
              {editingItem ? '공지사항 수정 완료' : '새로운 공지사항 게시'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
