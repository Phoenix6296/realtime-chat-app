import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyCH5b85g8aiI0NT0GYQykLPNXsfE9I7REs",
  authDomain: "whatsapp-text.firebaseapp.com",
  projectId: "whatsapp-text",
  storageBucket: "whatsapp-text.appspot.com",
  messagingSenderId: "868325437074",
  appId: "1:868325437074:web:344a69e7e5a7281a2d004b",
  measurementId: "G-29ZZ465HZ0",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();
export { db, auth, provider };
