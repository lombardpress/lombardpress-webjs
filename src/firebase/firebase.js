import * as firebase from 'firebase';


const config = {
  apiKey: "AIzaSyDYqsSNAdVzipni4Zj6H0lTxFQz_bTE3XE",
  authDomain: "scta-65c18.firebaseapp.com",
  databaseURL: "https://scta-65c18-default-rtdb.firebaseio.com",
  projectId: "scta-65c18",
  storageBucket: "scta-65c18.appspot.com",
  messagingSenderId: "300565788198",
  appId: "1:300565788198:web:fcce3fafc05706de0718e7",
  measurementId: "G-WN007V665V"
};
firebase.initializeApp(config);
const db = firebase.database()
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

// firebase.database().ref().set({
//   name: "Jeffrey C. Witt"
// });

export {firebase, googleAuthProvider, db}