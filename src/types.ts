export type CategoryType = 'video' | 'photo' | 'interview' | 'poster';

export interface Portfolio {
  id: string;
  title: string;
  category: string; // '인터뷰' | '행사' | '릴스' | '포스터' | '서포터즈' | '기타'
  description: string;
  thumbnailUrl: string;
  imageUrl?: string;
  videoUrl?: string;
  creatorAge?: number;
  createdAt: any;
  updatedAt?: any;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  isPublic: boolean;
  isPublished?: boolean;
  createdAt: any;
  updatedAt?: any;
}

export interface ProductionApplication {
  id: string;
  applicantName: string;
  age: number;
  phone: string;
  email: string;
  storyTitle: string;
  storyDetails: string;
  preferredType: CategoryType;
  status: 'received' | 'reviewed' | 'accepted' | 'declined' | 'contacted' | 'completed';
  createdAt: any;
}

export interface SupporterApplication {
  id: string;
  applicantName: string;
  age: number;
  phone: string;
  email: string;
  introduction: string;
  motive: string;
  instagramUrl?: string;
  status: 'received' | 'reviewed' | 'contacted' | 'completed' | 'accepted' | 'declined';
  region?: string;
  interests?: string;
  availableDays?: string;
  createdAt: any;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  category: string;
  message: string;
  status: 'received' | 'checking' | 'completed' | 'onhold';
  createdAt: any;
  updatedAt?: any;
}

export type ViewType = 
  | 'home' 
  | 'about' 
  | 'portfolio' 
  | 'apply_production' 
  | 'apply_supporters' 
  | 'notice' 
  | 'notice_detail'
  | 'inquiry' 
  | 'admin';
