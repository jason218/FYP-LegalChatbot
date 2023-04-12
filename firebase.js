// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";  
import { getAuth } from "firebase/auth";   
import { getStorage} from "firebase/storage"; 
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBey91pb_qLa6Dw3qqmu5pGsBljDoMwQ3o",
  authDomain: "chatbot-abf77.firebaseapp.com",   
  projectId: "chatbot-abf77",
  storageBucket: "chatbot-abf77.appspot.com",
  messagingSenderId: "986972170322",
  appId: "1:986972170322:web:46d13f984e248ebfcd178b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig); 
export const auth = getAuth(); 
export const storage = getStorage();   
export const db = getFirestore()
