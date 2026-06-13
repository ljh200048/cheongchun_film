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

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle('');
    setContent('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (item: Notice, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem(item);
    setTitle(item.title);
    setContent(item.content);
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      const pkg = { title, content };
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
        {notices.length === 0 ? (
          <div className="py-16 text-center text-stone-500 font-sans text-xs leading-relaxed">
            게시된 공지사항이 아직 없습니다.
          </div>
        ) : (
          notices.map((item) => (
            <div
              id={`notice-card-${item.id}`}
              key={item.id}
              onClick={() => setSelectedNotice(item)}
              className="group p-4 bg-white rounded-xl border border-stone-200 hover:border-[#E85C28] transition duration-300 cursor-pointer text-left shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1.5 flex-1 pr-4">
                  <div className="flex items-center space-x-2 text-[9px] font-mono font-bold text-[#E85C28] tracking-wider uppercase">
                    <Calendar size={11} />
                    <span>{formatDate(item.createdAt)}</span>
                    <span className="text-stone-300">•</span>
                    <span>OFFICIAL</span>
                  </div>
                  <h4 className="font-sans text-[13px] font-black text-stone-900 group-hover:text-[#E85C28] transition-colors line-clamp-1 leading-snug">
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
          ))
        )}
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
              <span className="text-[9px] text-stone-500 font-sans font-bold block">
                게시일 : {formatDate(selectedNotice.createdAt)}
              </span>
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

          <form onSubmit={handleSubmit} className="flex-grow space-y-4 font-sans text-stone-850">
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

            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-sans font-bold tracking-wider text-stone-600">공지사항 세부 내용</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="공지의 상세 일정, 오프라인 장소 및 전달 사항을 자세히 작성해주세요..."
                rows={10}
                className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28] leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              id="submit-notice-form"
              className="w-full bg-[#E85C28] hover:bg-stone-900 text-white font-bold p-3 rounded-xl text-xs tracking-widest uppercase transition-all duration-300 mt-6 shadow-sm cursor-pointer"
            >
              {editingItem ? '공지사항 수정 완료' : '새로운 공지사항 게시'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
