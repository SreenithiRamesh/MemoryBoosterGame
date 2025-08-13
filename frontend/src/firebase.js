
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyBRnzmbMXMuYo0p8IopC2uBJQQ4tOd83dc",
  authDomain: "wordledaily-74f4f.firebaseapp.com",
  databaseURL: "https://wordledaily-74f4f-default-rtdb.firebaseio.com",
  projectId: "wordledaily-74f4f",
  storageBucket: "wordledaily-74f4f.firebasestorage.app",
  messagingSenderId: "242621855929",
  appId: "1:242621855929:web:920c7cde5d1c1098248368",
  measurementId: "G-4GFL6P59SZ"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);       
export const rtdb = getDatabase(app);    


