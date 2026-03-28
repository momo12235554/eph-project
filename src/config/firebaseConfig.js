// config/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ephh-3c24b.firebaseapp.com",
  projectId: "ephh-3c24b",
  storageBucket: "ephh-3c24b.appspot.com",  // Correction ici aussi
  messagingSenderId: "1063147327596",
  appId: "1:1063147327596:web:35ea3cba445a9a7debc849",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
{
    hosting= {
      "site": "chu-27m",
  
      "public": "public",
    
    }
  }