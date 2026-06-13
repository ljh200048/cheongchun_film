import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBixc-qwtayr86ozUjVwnN_dGgTM4VIEdg",
  authDomain: "cheongchunfilm-mobile.firebaseapp.com",
  projectId: "cheongchunfilm-mobile",
  storageBucket: "cheongchunfilm-mobile.firebasestorage.app",
  messagingSenderId: "1095212470598",
  appId: "1:1095212470598:web:1b7e528a494fbea8d1d547",
  measurementId: "G-2HEXNX2Q8P"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Firestore operation mapping types as required by skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Global firestore error handling per skill
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Detailed Info: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Mandatory connection test
async function testConnection() {
  try {
    // Tests connection to server per skill directive
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase Connection verified successfully.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration: The client is offline.");
    }
  }
}

testConnection();
