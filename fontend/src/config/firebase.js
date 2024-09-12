import { initializeApp } from 'firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACn-EUyssjHeZKvOmjOijLJT8YB67c0a0",
  authDomain: "chat-e2d76.firebaseapp.com",
  projectId: "chat-e2d76",
  storageBucket: "chat-e2d76.appspot.com",
  messagingSenderId: "89867004632",
  appId: "1:89867004632:web:894e1d93fe972e54f745ad",
  measurementId: "G-253J444SWN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
