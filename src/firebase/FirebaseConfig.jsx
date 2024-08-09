// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlnjVIoTCxyK2YUtAgS6c4_7PguCwoIMw",
  authDomain: "abyssiniablog-4a499.firebaseapp.com",
  projectId: "abyssiniablog-4a499",
  storageBucket: "abyssiniablog-4a499.appspot.com",
  messagingSenderId: "257658607993",
  appId: "1:257658607993:web:01496d21815fe89888b7a8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
export { fireDB, auth, storage };
