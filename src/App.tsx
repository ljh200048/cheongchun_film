import React, { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';

import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { 
  Portfolio, 
  Notice, 
  ProductionApplication, 
  SupporterApplication, 
  Inquiry, 
  ViewType 
} from './types';

// Web views
import MobileFrame from './components/MobileFrame';
import HomeView from './components/HomeView';
import AboutView from './components/AboutView';
import PortfolioView from './components/PortfolioView';
import RequestProductionView from './components/RequestProductionView';
import SupportersView from './components/SupportersView';
import NoticeView from './components/NoticeView';
import InquiryView from './components/InquiryView';
import AdminView from './components/AdminView';

// Bottom Navigation items
import { Compass, Film, Calendar, HelpCircle, Heart, ShieldCheck, LogOut, Sparkles } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [history, setHistory] = useState<ViewType[]>([]);
  
  // Real-time collections state
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [productionApps, setProductionApps] = useState<ProductionApplication[]>([]);
  const [supporterApps, setSupporterApps] = useState<SupporterApplication[]>([]);

  // Overlays
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // Authentications
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [adminWarning, setAdminWarning] = useState<string | null>(null);

  const isAdmin = user !== null && user.email === 'lch200048@gmail.com';

  // Navigation push state
  const changeView = (next: ViewType) => {
    setHistory(prev => [...prev, currentView]);
    setCurrentView(next);
    // Dismiss overlay on tab swap
    setSelectedPortfolio(null);
    setSelectedNotice(null);
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(prevHist => prevHist.slice(0, -1));
      setCurrentView(prev);
    } else {
      setCurrentView('home');
    }
    setSelectedPortfolio(null);
    setSelectedNotice(null);
  };

  // 1. Google Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
      if (currentUser && currentUser.email !== 'lch200048@gmail.com') {
        setAdminWarning('이메일 lch200048@gmail.com 계정으로만 관리자 진입 권한이 부과됩니다.');
        setTimeout(() => setAdminWarning(null), 5000);
      } else {
        setAdminWarning(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const triggerAdminLoginOrDashboard = async () => {
    if (isAdmin) {
      // Direct jump to admin page if already authorized as admin
      changeView('admin');
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      // Enforce pop-up flow to prevent container redirect uri conflicts
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;
      if (email === 'lch200048@gmail.com') {
        setCurrentView('admin');
      }
    } catch (e) {
      console.error('Authentication Trigger Warning: ', e);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentView('home');
      setHistory([]);
    } catch (e) {
      console.error(e);
    }
  };

  // 2. Real-time active public subscriptions
  useEffect(() => {
    const qPort = query(collection(db, 'portfolios'), orderBy('createdAt', 'desc'));
    const unsubPort = onSnapshot(qPort, (snapshot) => {
      const list: Portfolio[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Portfolio);
      });
      setPortfolios(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'portfolios');
    });

    const qNotice = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    const unsubNotice = onSnapshot(qNotice, (snapshot) => {
      const list: Notice[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Notice);
      });
      setNotices(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'notices');
    });

    const qInq = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsubInq = onSnapshot(qInq, (snapshot) => {
      const list: Inquiry[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Inquiry);
      });
      setInquiries(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'inquiries');
    });

    return () => {
      unsubPort();
      unsubNotice();
      unsubInq();
    };
  }, []);

  // 3. Real-time secure admin subscriptions
  useEffect(() => {
    if (!isAdmin) {
      setProductionApps([]);
      setSupporterApps([]);
      return;
    }

    const qProd = query(collection(db, 'productionApplications'), orderBy('createdAt', 'desc'));
    const unsubProd = onSnapshot(qProd, (snapshot) => {
      const list: ProductionApplication[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as ProductionApplication);
      });
      setProductionApps(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'productionApplications');
    });

    const qSupp = query(collection(db, 'supporterApplications'), orderBy('createdAt', 'desc'));
    const unsubSupp = onSnapshot(qSupp, (snapshot) => {
      const list: SupporterApplication[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as SupporterApplication);
      });
      setSupporterApps(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'supporterApplications');
    });

    return () => {
      unsubProd();
      unsubSupp();
    };
  }, [user]);

  // Seeder helper to set default high sensory portfolios if the database is initially empty
  const triggerDatabaseSeed = async () => {
    if (!isAdmin) {
      alert('데이터베이스를 초기화하시려면 관리자 권한 로그인 완료 상태여야 합니다.');
      return;
    }

    const batch = writeBatch(db);

    const demoItems = [
      {
        id: 'demo-p-1',
        title: '무심천 자전거길에서 부유하는 스물하나',
        category: 'video',
        description: '청주 무심천의 시원한 바람을 자전거로 가르며 흐릿한 미래를 두고 고뇌하는 스물하나 진솔 씨의 첫 다큐멘터리 티저필름입니다. "다들 앞으로 나아가는데 나만 이 무심천 한가운데 멈춘 듯한 감각이 들 때가 있어요. 하지만 노을 지는 억새들을 보면 위로가 돼요." 흔들리던 계절의 한 조각 가사들을 무심천 미장센에 소담히 담아냈습니다.',
        imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        creatorAge: 21,
        createdAt: new Date()
      },
      {
        id: 'demo-p-2',
        title: '수암골의 가을 노을과 우리들의 주황 공터',
        category: 'photo',
        description: '청수 수암골 오래된 달동네 계단에 옹기종기 모여 앉아 서로의 고향과 어린 시절 이야기를 풀어 낸 청춘들의 포토 스냅집입니다. 수동의 나지막한 골목 속 주황빛 석양을 보정 그레인 필름에 담아내며, 함께 입을 모아 불렀던 소박한 노래 대화들을 수록한 따스한 스냅 아카이빙입니다.',
        imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600',
        creatorAge: 25,
        createdAt: new Date(Date.now() - 3600000)
      },
      {
        id: 'demo-p-3',
        title: '대성동 적벽돌 사이, 소박한 수제맥주 일기',
        category: 'interview',
        description: '충북도청 뒤편 무거운 적벽돌 사이에서 묵묵히 자신만의 소박한 가죽 공방을 채워나가는 스물일곱 살 우람 씨를 만나 포토인문학 형태의 대담집을 꾸몄습니다. "처음엔 청주를 떠나고 싶었어요. 하지만 대성동의 오래된 벽들이 내 손을 닮아가면서, 이곳 골목길에 가을 아지트를 일궈가기 시작했습니다."',
        imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=600',
        creatorAge: 27,
        createdAt: new Date(Date.now() - 7200000)
      },
      {
        id: 'demo-p-4',
        title: '우암산 순환로, 자욱한 기억들의 사운드스케이프',
        category: 'poster',
        description: '우암산의 자욱한 안개 속에서 고독을 삼키며 새로운 글을 적어내는 스물네 살 시인 가현 양의 이야기를 영화 포스터 프레임에 담았습니다. "누구나 20대엔 숲길 속에 갇힌 듯 막막합니다. 하지만 이 우암산의 자락처럼, 결국은 청주 시내가 내려다보이는 확 트인 전망대를 마주하게 되죠."',
        imageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=600',
        creatorAge: 24,
        createdAt: new Date(Date.now() - 1080000)
      }
    ];

    try {
      demoItems.forEach((item) => {
        const docRef = doc(db, 'portfolios', item.id);
        batch.set(docRef, {
          title: item.title,
          category: item.category,
          description: item.description,
          imageUrl: item.imageUrl,
          videoUrl: item.videoUrl || null,
          creatorAge: item.creatorAge,
          createdAt: serverTimestamp()
        });
      });

      // Notices template
      const noticeRef = doc(db, 'notices', 'demo-n-1');
      batch.set(noticeRef, {
        title: '청춘필름 2026 가을 시즌 「기록되지 않은 것들의 무게」 참자가 대모집',
        content: '안녕하세요. 청주 20대의 삶을 영화 포스터와 3분 인터뷰 필름으로 인화하는 청춘필름입니다!\n\n이번 2026 가을 시즌을 맞이하여 대성동 야외 적벽돌 골목, 무심천 언덕 등을 무대로 삼을 시네마틱 참가 희망자를 추가 정기 초청합니다.\n\n특별한 장비가 없어도, 기록용 사연이 평범해도 전혀 걱정 마세요. 전문 크리에이터들이 당신을 영화 속 중심인물처럼 따뜻하고 차분하게 사전 이끌어 드립니다.\n\n• 초청 대상: 청주 지역 거주 20대 남녀 누구나\n• 참가 혜택: 오프라인 수제 다큐멘터리 제작 지원 및 개인 한정판 소장용 Poster 제작\n• 신청 방법: 상단 "기록 신청" 클릭해 간편 사연 작성(로그인 무관)',
        category: '모집',
        isPublic: true,
        createdAt: serverTimestamp()
      });

      await batch.commit();
      alert('데모 샘플 시네마틱 아카이브가 완벽히 포팅되었습니다!');
    } catch (err) {
      console.error(err);
      alert('초기화 데이터 입력 실패: ' + String(err));
    }
  };

  // Helper to strip undefined values so Firestore client library does not throw errors
  const cleanUndefined = <T extends Record<string, any>>(obj: T): T => {
    const clean: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined && value !== null) {
        clean[key] = value;
      } else {
        // Explicitly set optional string fields to empty string, and omit other types of undefined fields
        const stringFields = ['instagramUrl', 'instagramId', 'region', 'interests', 'availableDays', 'videoUrl', 'reply', 'password'];
        if (stringFields.includes(key)) {
          clean[key] = "";
        }
      }
    }
    return clean;
  };

  // 4. Firestore Mutation actions as required by rules
  const handleAddPortfolio = async (data: Omit<Portfolio, 'id' | 'createdAt'>) => {
    const colPath = 'portfolios';
    const id = `portfolio-${Date.now()}`;
    try {
      await setDoc(doc(db, colPath, id), {
        ...cleanUndefined(data),
        createdAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, colPath);
    }
  };

  const handleEditPortfolio = async (id: string, data: Partial<Portfolio>) => {
    const colPath = 'portfolios';
    try {
      await updateDoc(doc(db, colPath, id), cleanUndefined(data));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `${colPath}/${id}`);
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    const colPath = 'portfolios';
    try {
      await deleteDoc(doc(db, colPath, id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `${colPath}/${id}`);
    }
  };

  const handleAddNotice = async (data: Omit<Notice, 'id' | 'createdAt'>) => {
    const colPath = 'notices';
    const id = `notice-${Date.now()}`;
    try {
      await setDoc(doc(db, colPath, id), {
        ...cleanUndefined(data),
        createdAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, colPath);
    }
  };

  const handleEditNotice = async (id: string, data: Partial<Notice>) => {
    const colPath = 'notices';
    try {
      await updateDoc(doc(db, colPath, id), {
        ...cleanUndefined(data),
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `${colPath}/${id}`);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    const colPath = 'notices';
    try {
      await deleteDoc(doc(db, colPath, id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `${colPath}/${id}`);
    }
  };

  const handleAddProductionApp = async (data: Omit<ProductionApplication, 'id' | 'status' | 'createdAt'>) => {
    const colPath = 'productionApplications';
    const id = `prod-app-${Date.now()}`;
    try {
      await setDoc(doc(db, colPath, id), {
        ...cleanUndefined(data),
        status: 'received',
        createdAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, colPath);
    }
  };

  const handleUpdateProductionStatus = async (id: string, status: any) => {
    const colPath = 'productionApplications';
    try {
      await updateDoc(doc(db, colPath, id), { status });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `${colPath}/${id}`);
    }
  };

  const handleDeleteProduction = async (id: string) => {
    const colPath = 'productionApplications';
    try {
      await deleteDoc(doc(db, colPath, id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `${colPath}/${id}`);
    }
  };

  const handleAddSupporterApp = async (data: Omit<SupporterApplication, 'id' | 'status' | 'createdAt'>) => {
    const colPath = 'supporterApplications';
    const id = `supp-app-${Date.now()}`;
    try {
      await setDoc(doc(db, colPath, id), {
        ...cleanUndefined(data),
        status: 'received',
        createdAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, colPath);
    }
  };

  const handleUpdateSupporterStatus = async (id: string, status: any) => {
    const colPath = 'supporterApplications';
    try {
      await updateDoc(doc(db, colPath, id), { status });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `${colPath}/${id}`);
    }
  };

  const handleDeleteSupporter = async (id: string) => {
    const colPath = 'supporterApplications';
    try {
      await deleteDoc(doc(db, colPath, id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `${colPath}/${id}`);
    }
  };

  const handleAddInquiry = async (data: Omit<Inquiry, 'id' | 'status' | 'createdAt'>) => {
    const colPath = 'inquiries';
    const id = `inquiry-${Date.now()}`;
    try {
      await setDoc(doc(db, colPath, id), {
        ...cleanUndefined(data),
        status: 'pending',
        createdAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, colPath);
    }
  };

  const handleAnswerInquiry = async (id: string, reply: string) => {
    const colPath = 'inquiries';
    try {
      await updateDoc(doc(db, colPath, id), {
        reply,
        status: 'replied'
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `${colPath}/${id}`);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    const colPath = 'inquiries';
    try {
      await deleteDoc(doc(db, colPath, id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `${colPath}/${id}`);
    }
  };

  // Helper title builder
  const getViewTitle = () => {
    switch (currentView) {
      case 'home': return '청춘필름';
      case 'about': return '청춘필름 소개';
      case 'portfolio': return '청춘 아카이브 필름책';
      case 'apply_production': return '내 청춘 기록 신청하기';
      case 'apply_supporters': return '로컬 크루 서포터즈 모집';
      case 'notice': return '공지사항 아카이브';
      case 'inquiry': return '1:1 익명 질문방';
      case 'admin': return '독립 관리제어 콘솔';
      default: return '청춘필름';
    }
  };

  return (
    <MobileFrame
      currentViewTitle={getViewTitle()}
      onBack={currentView !== 'home' ? handleBack : undefined}
      isAdminMode={isAdmin}
      onAdminToggle={triggerAdminLoginOrDashboard}
      productionApps={productionApps}
      supporterApps={supporterApps}
      inquiries={inquiries}
      bottomNav={
        currentView !== 'admin' ? (
          <div className="bg-white border-t border-stone-200 shadow-[0_-4px_12px_rgba(0,0,0,0.04)] h-16 grid grid-cols-5 items-center select-none text-[10px] shrink-0 z-40 navbar-container">
            {/* Tab 1 */}
            <button 
              id="tab-btn-home"
              onClick={() => {
                setCurrentView('home');
                setHistory([]);
              }} 
              className={`flex flex-col items-center justify-center h-full transition-all duration-300 cursor-pointer ${
                currentView === 'home' ? 'text-[#E85C28]' : 'text-stone-400 hover:text-stone-900'
              }`}
            >
              <Compass size={18} />
              <span className="scale-90 font-sans mt-1">홈</span>
            </button>

            {/* Tab 2 */}
            <button 
              id="tab-btn-about"
              onClick={() => changeView('about')} 
              className={`flex flex-col items-center justify-center h-full transition-all duration-300 cursor-pointer ${
                currentView === 'about' ? 'text-[#E85C28]' : 'text-stone-400 hover:text-stone-900'
              }`}
            >
              <Sparkles size={18} />
              <span className="scale-90 font-sans mt-1">소개</span>
            </button>

            {/* Tab 3 */}
            <button 
              id="tab-btn-portfolio"
              onClick={() => changeView('portfolio')} 
              className={`flex flex-col items-center justify-center h-full transition-all duration-300 cursor-pointer ${
                currentView === 'portfolio' ? 'text-[#E85C28]' : 'text-stone-400 hover:text-stone-900'
              }`}
            >
              <Film size={18} />
              <span className="scale-90 font-sans mt-1">필름책</span>
            </button>

            {/* Tab 4 */}
            <button 
              id="tab-btn-notice"
              onClick={() => changeView('notice')} 
              className={`flex flex-col items-center justify-center h-full transition-all duration-300 cursor-pointer ${
                currentView === 'notice' ? 'text-[#E85C28]' : 'text-stone-400 hover:text-stone-900'
              }`}
            >
              <Calendar size={18} />
              <span className="scale-90 font-sans mt-1">공지방</span>
            </button>

            {/* Tab 5 */}
            <button 
              id="tab-btn-inquiry"
              onClick={() => changeView('inquiry')} 
              className={`flex flex-col items-center justify-center h-full transition-all duration-300 cursor-pointer ${
                currentView === 'inquiry' ? 'text-[#E85C28]' : 'text-stone-400 hover:text-stone-900'
              }`}
            >
              <HelpCircle size={18} />
              <span className="scale-90 font-sans mt-1">문의방</span>
            </button>
          </div>
        ) : undefined
      }
    >
      {/* Absolute floating warning for authentication bounds */}
      {adminWarning && (
        <div className="absolute top-2 left-4 right-4 bg-vintage-accent border border-vintage-cream/20 text-vintage-cream text-[10.5px] p-2.5 rounded-xl font-sans text-center z-50 shadow-md animate-slideDown">
          {adminWarning}
        </div>
      )}

      {/* Primary view render router block */}
      <div className="flex-1 flex flex-col min-h-0 pb-10">
        {currentView === 'home' && (
          <HomeView
            onNavigate={(v) => changeView(v)}
            featuredPortfolios={portfolios}
            onSelectPortfolio={(item) => {
              setSelectedPortfolio(item);
              setCurrentView('portfolio');
            }}
          />
        )}

        {currentView === 'about' && <AboutView />}

        {currentView === 'portfolio' && (
          <PortfolioView
            portfolios={portfolios}
            isAdmin={isAdmin}
            onAdd={handleAddPortfolio}
            onEdit={handleEditPortfolio}
            onDelete={handleDeletePortfolio}
            selectedPortfolio={selectedPortfolio}
            setSelectedPortfolio={setSelectedPortfolio}
          />
        )}

        {currentView === 'apply_production' && (
          <RequestProductionView onSubmit={handleAddProductionApp} />
        )}

        {currentView === 'apply_supporters' && (
          <SupportersView onSubmit={handleAddSupporterApp} />
        )}

        {currentView === 'notice' && (
          <NoticeView
            notices={notices}
            isAdmin={isAdmin}
            onAdd={handleAddNotice}
            onEdit={handleEditNotice}
            onDelete={handleDeleteNotice}
            selectedNotice={selectedNotice}
            setSelectedNotice={setSelectedNotice}
          />
        )}

        {currentView === 'inquiry' && (
          <InquiryView
            inquiries={inquiries}
            isAdmin={isAdmin}
            onAdd={handleAddInquiry}
          />
        )}

        {currentView === 'admin' && (
          isAdmin ? (
            <div className="flex-1 flex flex-col justify-between">
              <div className="px-4 py-2 bg-stone-900 border-b border-vintage-paper/5 flex justify-between items-center z-10 select-none shrink-0">
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <ShieldCheck size={12} />
                  AUTH LEVEL : SYSTEM OWNER
                </span>
                
                <div className="flex items-center space-x-2">
                  <button
                    id="trigger-seeder-db"
                    onClick={triggerDatabaseSeed}
                    className="bg-[#C5A880] text-vintage-coal hover:bg-neutral-800 hover:text-[#C5A880] text-[9px] font-bold px-2.5 py-1 rounded"
                    title="초기 세팅"
                  >
                    샘플 로딩
                  </button>

                  <button
                    id="admin-logout-trigger"
                    onClick={handleLogout}
                    className="p-1 rounded bg-stone-800 hover:bg-stone-750 text-vintage-accent"
                    title="로그아웃"
                  >
                    <LogOut size={13} />
                  </button>
                </div>
              </div>

              <AdminView
                productionApps={productionApps}
                supporterApps={supporterApps}
                inquiries={inquiries}
                onUpdateProductionStatus={handleUpdateProductionStatus}
                onDeleteProduction={handleDeleteProduction}
                onUpdateSupporterStatus={handleUpdateSupporterStatus}
                onDeleteSupporter={handleDeleteSupporter}
                onAnswerInquiry={handleAnswerInquiry}
                onDeleteInquiry={handleDeleteInquiry}
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-stone-300">
              <div className="w-14 h-14 rounded-full bg-vintage-coal text-vintage-accent border border-vintage-accent/20 flex items-center justify-center mb-4">
                <ShieldCheck size={28} />
              </div>
              <p className="font-serif text-[13px] font-bold text-vintage-cream">권한이 필요합니다</p>
              <p className="text-[10px] text-vintage-paper/50 leading-relaxed mt-2.5 max-w-[240px]">
                이곳은 청춘필름 아카이브의 공식 대표 이메일<b>(lch200048@gmail.com)</b> 계정 전용 독립 콘솔입니다. 권한을 연동하시려면 우측 상단 '관리인증'을 클릭해 승인해 주십시오.
              </p>
            </div>
          )
        )}
      </div>
    </MobileFrame>
  );
}
