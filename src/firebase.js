import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyDvIvvJSt7bz_o85l7nevo6xqQ_8jAwzP8",
  authDomain: "bibliotech-9c6ce.firebaseapp.com",
  projectId: "bibliotech-9c6ce",
  storageBucket: "bibliotech-9c6ce.appspot.com",
  messagingSenderId: "820921566320",
  appId: "1:820921566320:web:5bfed2444afa25c337e0b5",
  measurementId: "G-C951SD41N9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); 
