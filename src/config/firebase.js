import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat";
import "firebase/compat/auth";
import "firebase/compat/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyAavmjg0R-S-cMTwD-qJAzFUZjiBBPHH8A",
  authDomain: "vigo-a7754.firebaseapp.com",
  projectId: "vigo-a7754",
  storageBucket: "vigo-a7754.appspot.com",
  messagingSenderId: "513319776338",
  appId: "1:513319776338:web:f560962d56feadef2fef8b",
  measurementId: "G-SHSW73MTC8",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
console.log(auth);
const currentUser = auth.apiKey;
console.log("Current User:", currentUser);

if (!firebase.apps.length) {
  console.log("aaaaaaa");
  firebase.initializeApp(firebaseConfig);
}
