import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBixc-qwtayr86ozUjVwnN_dGgTM4VIEdg",
  authDomain: "cheongchunfilm-mobile.firebaseapp.com",
  projectId: "cheongchunfilm-mobile",
  storageBucket: "cheongchunfilm-mobile.firebasestorage.app",
  messagingSenderId: "1095212470598",
  appId: "1:1095212470598:web:1b7e528a494fbea8d1d547",
  measurementId: "G-2HEXNX2Q8P"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
