import {initializeApp } from 'firebase/app'
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'





const firebaseConfig = {
  apiKey: "AIzaSyA7pPDmhvBlbaKitaAKzrQqE53oFBvw5Fk",
  authDomain: "expoqrcode-786d4.firebaseapp.com",
  projectId: "expoqrcode-786d4",
  storageBucket: "expoqrcode-786d4.firebasestorage.app",
  messagingSenderId: "868122574613",
  appId: "1:868122574613:web:033757f80210b6bc0db31c",
  measurementId: "G-NZWCB6GKN0"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app);

export const db = getFirestore(app)

export default app