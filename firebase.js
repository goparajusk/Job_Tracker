// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRPar5Pnf8jOxIvpp_VS1V1T00NMK8PTo",
  authDomain: "job-details-84608.firebaseapp.com",
  projectId: "job-details-84608",
  storageBucket: "job-details-84608.appspot.com",
  messagingSenderId: "569487999433",
  appId: "1:569487999433:web:ddb787d676b5c49c4b6818",
  measurementId: "G-RM3P6NDDYL"
};

// Initialize Firebase
let analytics;
if (typeof window !== 'undefined') { // Check if in browser environment
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);
export { firestore, analytics };
const storage = getStorage(app);
export { storage };