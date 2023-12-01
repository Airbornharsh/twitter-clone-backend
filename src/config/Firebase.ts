// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyDW8dOe99N3mWsqU1tRYg8D3YBnH2rd_NM",
//   authDomain: "internship-task-twitter.firebaseapp.com",
//   projectId: "internship-task-twitter",
//   storageBucket: "internship-task-twitter.appspot.com",
//   messagingSenderId: "519583087038",
//   appId: "1:519583087038:web:7fd727c7a3f4192ad9e1ef",
// };

// const app = initializeApp(firebaseConfig);
// const firestoreDb = getFirestore(app);
// export { firestoreDb };

import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

const firestoreDb = admin.firestore();

export { firestoreDb };
