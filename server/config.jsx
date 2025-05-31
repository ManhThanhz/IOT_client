// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBSRvdrGMN-N1PusufTXr5Fr5walc4Ac4",
  authDomain: "yolohome-e1c81.firebaseapp.com",
  projectId: "yolohome-e1c81",
  storageBucket: "yolohome-e1c81.appspot.com",
  messagingSenderId: "603386736761",
  appId: "1:603386736761:web:050b02dd9227ed2519a4a8",
  measurementId: "G-5Z8VZ929H1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db, app };