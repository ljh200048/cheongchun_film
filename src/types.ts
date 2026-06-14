export type CategoryType = 'video' | 'photo' | 'interview' | 'poster';

export interface Portfolio {
  id: string;
  title: string;
  category: CategoryType;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  creatorAge?: number;
  createdAt: any; // Firestore Timestamp or date ISO
}

export interface Notice {
  id: string;
  title: string;
  content: string;
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
  status: 'received' | 'reviewed' | 'accepted' | 'declined';
  region?: string;
  interests?: string;
  availableDays?: string;
  createdAt: any;
}

export interface Inquiry {
  id: string;
  writerName: string;
  email: string;
  subject: string;
  message: string;
  isSecret: boolean;
  password?: string;
  reply?: string;
  status: 'pending' | 'replied';
  createdAt: any;
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
