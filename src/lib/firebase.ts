import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDrGBMqLImaLUnNBmI8iVWOlpszL1whuiI",
    authDomain: "trivoxa-1d55c.firebaseapp.com",
    projectId: "trivoxa-1d55c",
    storageBucket: "trivoxa-1d55c.firebasestorage.app",
    messagingSenderId: "171793133962",
    appId: "1:171793133962:web:ce5569bf3bd343ce1a9873",
    measurementId: "G-3GVSXHJSNT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics (only in browser)
export const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

export default app;
