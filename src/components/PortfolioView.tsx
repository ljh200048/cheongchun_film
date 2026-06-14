import React, { useRef, useState } from 'react';
import { Plus, X, Edit, Trash2, Camera, Link, MonitorPlay, Calendar } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { Portfolio } from '../types';

interface PortfolioViewProps {
  portfolios: Portfolio[];
  isAdmin: boolean;
  onAdd: (data: Omit<Portfolio, 'id' | 'createdAt'>) => Promise<void>;
  onEdit: (id: string, data: Partial<Portfolio>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  selectedPortfolio: Portfolio | null;
  setSelectedPortfolio: (item: Portfolio | null) => void;
}

const CATEGORIES: { value: string | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: '인터뷰', label: '🎙️ 인터뷰' },
  { value: '행사', label: '🎉 행사' },
  { value: '릴스', label: '📱 릴스' },
  { value: '포스터', label: '🖼️ 포스터' },
  { value: '서포터즈', label: '🤝 서포터즈' },
  { value: '기타', label: '💡 기타' }
];

export default function PortfolioView({
  portfolios,
  isAdmin,
  onAdd,
  onEdit,
  onDelete,
  selectedPortfolio,
  setSelectedPortfolio
}: PortfolioViewProps) {
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Portfolio | null>(null);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('인터뷰');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [creatorAge, setCreatorAge] = useState<number>(24);
  const [isCompilingImage, setIsCompilingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Time conversion utility
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

  // Sort portfolios by createdAt (newest first)
  const sortedPortfolios = [...portfolios].sort((a, b) => getMs(b.createdAt) - getMs(a.createdAt));

  // Category filter
  const filteredItems = sortedPortfolios.filter(item => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  // Handle image file upload to Firebase Storage with local compression
  const handleImageUploadAndCompress = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isAdmin) {
      alert('관리자만 이미지를 업로드할 수 있습니다.');
      return;
    }

    setIsCompilingImage(true);

    const uploadToStorage = async (fileToUpload: Blob | File, originalName: string) => {
      try {
        const sanitizedName = originalName.replace(/[^a-zA-Z0-9.]/g, '_');
        const filename = `portfolios/${Date.now()}_${sanitizedName}`;
        const storageRef = ref(storage, filename);
        const snapshot = await uploadBytes(storageRef, fileToUpload);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        
        setThumbnailUrl(downloadUrl);
        alert('이미지가 업로드되었습니다.');
      } catch (err) {
        console.error('Firebase Storage upload error: ', err);
        alert('이미지 업로드에 실패했습니다. 다시 시도해 주세요.');
      } finally {
        setIsCompilingImage(false);
      }
    };

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) {
              uploadToStorage(blob, file.name);
            } else {
              uploadToStorage(file, file.name);
            }
          }, 'image/jpeg', 0.82);
        } else {
          uploadToStorage(file, file.name);
        }
      };
      img.onerror = () => {
        uploadToStorage(file, file.name);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      uploadToStorage(file, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle('');
    setCategory('인터뷰');
    setDescription('');
    setThumbnailUrl('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=400');
    setVideoUrl('');
    setCreatorAge(24);
    setShowAddModal(true);
  };

  const handleOpenEdit = (item: Portfolio, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category || '인터뷰');
    setDescription(item.description);
    setThumbnailUrl(item.thumbnailUrl || item.imageUrl || '');
    setVideoUrl(item.videoUrl || '');
    setCreatorAge(item.creatorAge || 24);
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !thumbnailUrl.trim()) {
      alert('제목, 설명, 썸네일 이미지를 모두 입력해 주세요.');
      return;
    }

    try {
      const pkg = {
        title: title.trim(),
        category,
        description: description.trim(),
        thumbnailUrl: thumbnailUrl.trim(),
        imageUrl: thumbnailUrl.trim(), // backward compatibility support
        videoUrl: videoUrl.trim() || undefined,
        creatorAge: creatorAge ? Number(creatorAge) : undefined
      };

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

  const handleDeleteItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('이 포트폴리오를 삭제하시겠습니까?')) {
      try {
        await onDelete(id);
        if (selectedPortfolio?.id === id) {
          setSelectedPortfolio(null);
        }
      } catch (err) {
        console.error(err);
      }
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
    <div className="flex-grow flex flex-col pb-12 animate-fadeIn relative text-stone-850">
      {/* Category Slider Tabs */}
      <div className="sticky top-0 bg-[#FDFCF8] z-20 px-4 py-3 border-b border-stone-200 flex space-x-2 overflow-x-auto select-none no-scrollbar shrink-0">
        {CATEGORIES.map(cat => (
          <button
            id={`tab-category-${cat.value}`}
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-1.5 rounded-full text-xs transition-all duration-300 font-sans font-bold whitespace-nowrap shrink-0 cursor-pointer border ${
              activeCategory === cat.value
                ? 'bg-[#E85C28] text-white border-[#E85C28] shadow-sm'
                : 'bg-white text-stone-600 border-stone-200 hover:text-stone-900 hover:border-stone-400'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Admin Floating Trigger */}
      {isAdmin && (
        <div className="px-4 py-3 bg-[#E85C28]/10 border-b border-[#E85C28]/25 flex justify-between items-center z-10 font-sans">
          <span className="text-[10.5px] text-stone-800 font-extrabold">관리자 전용 포트폴리오 제어기</span>
          <button
            id="admin-add-portfolio-btn"
            onClick={handleOpenAdd}
            className="flex items-center space-x-1 bg-[#E85C28] hover:bg-stone-900 text-white px-3 py-1.5 rounded text-[10.5px] font-bold transition duration-200 cursor-pointer"
          >
            <Plus size={13} />
            <span>필름 추가</span>
          </button>
        </div>
      )}

      {/* Portfolio Polaroids Display */}
      <div className="p-4 grid grid-cols-2 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-2 py-16 text-center text-stone-500 font-sans text-xs leading-relaxed">
            해당 카테고리에 인화된 필름이 아직 없습니다.
          </div>
        ) : (
          filteredItems.map(item => (
            <div
              id={`portfolio-item-${item.id}`}
              key={item.id}
              onClick={() => setSelectedPortfolio(item)}
              className="group bg-white rounded-2xl border border-stone-200 p-3 flex flex-col cursor-pointer transition-all duration-300 hover:border-[#E85C28] hover:shadow-md"
            >
              {/* Cover layout */}
              <div className="relative w-full aspect-square bg-stone-100 border border-stone-150 rounded-xl overflow-hidden shrink-0">
                <img
                  src={item.thumbnailUrl || item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 saturate-[0.85]"
                />
                
                {/* Embedded Video Symbol */}
                {item.videoUrl && (
                  <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 backdrop-blur-sm shadow flex items-center justify-center text-white border border-white/20">
                    <MonitorPlay size={11} className="text-[#E85C28] animate-pulse" />
                  </div>
                )}
              </div>

              {/* Bottom Notes */}
              <div className="pt-3 pb-1 text-left flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-sans text-[12px] font-black text-stone-900 tracking-tight line-clamp-1 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[9px] font-mono text-[#E85C28] mt-1 font-bold uppercase tracking-wider">
                    {item.category || '기타'}
                  </p>
                </div>
                
                <div className="flex items-center justify-between border-t border-stone-100 mt-2.5 pt-2">
                  <span className="text-[9px] text-stone-500 font-sans font-bold">
                    {item.creatorAge ? `만 ${item.creatorAge}세` : '20대 청춘'}
                  </span>
                  
                  {isAdmin && (
                    <div className="flex items-center space-x-1.5 z-10">
                      <button
                        id={`edit-portfolio-${item.id}`}
                        onClick={(e) => handleOpenEdit(item, e)}
                        className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer"
                      >
                        <Edit size={10} />
                      </button>
                      <button
                        id={`delete-portfolio-${item.id}`}
                        onClick={(e) => handleDeleteItem(item.id, e)}
                        className="p-1 rounded bg-red-50 hover:bg-red-100 text-[#E85C28] transition cursor-pointer"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cinematic Detail overlay Overlay Modal */}
      {selectedPortfolio && (
        <div className="fixed inset-0 bg-[#FDFCF8] z-50 overflow-y-auto flex flex-col p-4 animate-fadeIn">
          {/* Header Controls */}
          <div className="flex items-center justify-between mb-4 border-b border-stone-200 pb-2">
            <span className="text-[9px] font-mono text-stone-800 font-extrabold tracking-widest uppercase">
              CHEONGJU ARCHIVE NO. {selectedPortfolio.id.slice(0, 8)}
            </span>
            <button
              id="close-details-overlay"
              onClick={() => setSelectedPortfolio(null)}
              className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-800 hover:text-[#E85C28] hover:border-stone-300 transition duration-200 cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          {/* Core Content Body */}
          <div className="space-y-5 max-w-2xl mx-auto w-full pb-12">
            {/* Embedded video player or Poster */}
            {selectedPortfolio.videoUrl ? (
              <div className="rounded-2xl overflow-hidden border border-stone-200 bg-black aspect-video relative flex items-center justify-center group shadow-md">
                <iframe
                  id="youtube-player"
                  src={
                    selectedPortfolio.videoUrl.includes('youtube.com') || selectedPortfolio.videoUrl.includes('youtu.be')
                      ? `https://www.youtube.com/embed/${selectedPortfolio.videoUrl.split('v=')[1] || selectedPortfolio.videoUrl.split('/').pop()}`
                      : selectedPortfolio.videoUrl
                  }
                  title={selectedPortfolio.title}
                  className="w-full h-full"
                  allowFullScreen
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 flex items-center justify-center shadow-md">
                <img
                  src={selectedPortfolio.thumbnailUrl || selectedPortfolio.imageUrl}
                  alt={selectedPortfolio.title}
                  referrerPolicy="no-referrer"
                  className="w-full object-cover saturate-[0.85]"
                />
              </div>
            )}

            {/* Documentary Narrative Context Cards */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 space-y-3 relative shadow-xs text-stone-800">
              <span className="inline-block text-[8px] tracking-widest uppercase text-white bg-[#E85C28] px-2.5 py-1 rounded-full font-sans font-black">
                {selectedPortfolio.category || '기타'}
              </span>
              
              <div className="space-y-1">
                <h3 className="font-sans text-base font-black text-stone-950 leading-tight">
                  {selectedPortfolio.title}
                </h3>
                <div className="flex space-x-2 text-[10px] text-stone-500 font-sans font-bold">
                  <span>기록 대상: {selectedPortfolio.creatorAge ? `만 ${selectedPortfolio.creatorAge}세 청주 청년` : '청주를 살아가는 20대'}</span>
                  <span>•</span>
                  <span>등록일: {formatDate(selectedPortfolio.createdAt)}</span>
                </div>
              </div>

              <div className="w-6 h-1 bg-[#E85C28] my-3" />

              {/* Narrative body */}
              <div className="text-[11px] text-stone-700 leading-relaxed font-sans whitespace-pre-wrap text-justify font-medium">
                {selectedPortfolio.description}
              </div>
            </div>

            {/* Micro aesthetic footprint */}
            <div className="text-center font-mono text-[9px] text-stone-400 pb-4 font-bold">
              CHUNGCHUN FILM ARCHIVE UNIT • REGISTERED 2026
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Portfolio Item Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#FDFCF8] z-50 flex flex-col p-5 animate-slideUp">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4 select-none header-wrapper shrink-0">
            <h3 className="text-xs font-sans tracking-widest text-[#1A1A1A] font-extrabold uppercase">
              {editingItem ? 'EDITING FILM SHEET' : 'ADD NEW FILM SHEET'}
            </h3>
            <button
              id="close-add-portfolio-modal"
              onClick={() => {
                setShowAddModal(false);
                setEditingItem(null);
              }}
              className="text-stone-600 hover:text-[#E85C28] transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto space-y-4 pr-1 mb-2 text-stone-800 font-sans">
            {/* Title */}
            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-sans font-bold tracking-wider text-stone-600">제목/큐레이션 헤드라인</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="예: 수암골 노을에 젖은 나의 스물넷"
                className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28]"
                required
              />
            </div>

            {/* Category / Age Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-sans font-bold tracking-wider text-stone-600">파일 구분</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28]"
                >
                  <option value="인터뷰">🎙️ 인터뷰</option>
                  <option value="행사">🎉 행사</option>
                  <option value="릴스">📱 릴스</option>
                  <option value="포스터">🖼️ 포스터</option>
                  <option value="서포터즈">🤝 서포터즈</option>
                  <option value="기타">💡 기타</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-sans font-bold tracking-wider text-stone-600">주인공 만 나이</label>
                <input
                  type="number"
                  value={creatorAge}
                  onChange={e => setCreatorAge(Number(e.target.value))}
                  className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28]"
                  min="1"
                  max="120"
                />
              </div>
            </div>

            {/* Description Narrative */}
            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-sans font-bold tracking-wider text-stone-600">스토리 및 다큐 인터뷰 기록</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="어떤 사연이나 인터뷰 내용이 들어가는지 자세히 기록해주세요..."
                rows={5}
                className="w-full bg-white border border-stone-250 rounded-lg p-2.5 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28] font-sans leading-relaxed"
                required
              />
            </div>

            {/* Custom file compression triggers */}
            <div className="space-y-2.5 p-3 bg-white rounded-xl border border-stone-200">
              <label className="block text-[10px] uppercase font-sans font-bold tracking-wider text-stone-600">커버 썸네일 이미지 연동</label>
              
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  id="trigger-image-upload"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-grow flex justify-center items-center space-x-1.5 p-2 bg-stone-50 hover:bg-stone-100 border border-dashed border-stone-300 rounded-lg text-xs transition text-stone-800 cursor-pointer"
                >
                  <Camera size={14} className="text-[#E85C28]" />
                  <span>{isCompilingImage ? '업로드 중...' : '폰 갤러리/사진 업로드'}</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUploadAndCompress}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Preview block */}
              {thumbnailUrl && (
                <div className="relative mt-2 rounded bg-stone-50 p-2 border border-stone-200 flex items-center space-x-3">
                  <img
                    src={thumbnailUrl}
                    alt="Cover preview"
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 object-cover rounded border border-stone-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[8px] text-emerald-600 font-mono tracking-widest font-bold">✓ COMPRESSED JET-STREAM</p>
                    <p className="text-[9px] text-stone-500 truncate">{thumbnailUrl.slice(0, 40)}...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Link */}
            <div className="space-y-1 border-t border-stone-100 pt-3">
              <label className="block text-[10px] uppercase font-sans font-bold tracking-wider text-stone-600 flex items-center gap-1 font-mono">
                <Link size={11} className="text-[#E85C28]" />
                영상 YouTube URL (선택)
              </label>
              <input
                type="text"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="예: https://www.youtube.com/watch?v=..."
                className="w-full bg-white border border-stone-250 rounded-lg p-2 text-xs text-stone-950 focus:outline-none focus:border-[#E85C28]"
              />
            </div>

            <button
              type="submit"
              id="submit-portfolio-form"
              className="w-full bg-[#E85C28] hover:bg-stone-900 text-white font-bold p-3 rounded-xl text-xs tracking-widest uppercase transition-all duration-300 mt-6 shadow-sm cursor-pointer"
            >
              {editingItem ? '사연 필름 수정 완료' : '새로운 사연 필름 인화'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
