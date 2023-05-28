import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore, query, doc, getDoc, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";

import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDYMScEApZERrzJU6u_QptDrd5XcVwdAaI",
  authDomain: "wherefood2.firebaseapp.com",
  projectId: "wherefood2",
  storageBucket: "wherefood2.appspot.com",
  messagingSenderId: "576062235326",
  appId: "1:576062235326:web:14a22ee8fd0a31f5acf4ef",
};

export const app = initializeApp(firebaseConfig);
export const firestorage = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
