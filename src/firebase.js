
// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

import "firebase/database";
import 'firebase/auth'

export const app = firebase.initializeApp({
  apiKey: "AIzaSyDsO6Wug98IpiIXnm-vsXsraxJQ_s7mUoc",
  authDomain: "fhshacks-todo.firebaseapp.com",
  projectId: "fhshacks-todo",
  storageBucket: "fhshacks-todo.appspot.com",
  messagingSenderId: "611067837827",
  appId: "1:611067837827:web:a674f15fd9af22aed74ab6",
  measurementId: "G-PTFP9C39P7"
})
export default app;
