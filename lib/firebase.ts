// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  CACHE_SIZE_UNLIMITED,
  disableNetwork,
  getFirestore,
  enableMultiTabIndexedDbPersistence,
  enableNetwork,
} from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig, {
//   localCache: persistentLocalCache(/*settings*/ {}),
// });
const app = initializeApp(firebaseConfig, {});
const db = getFirestore(app);
// disableNetwork(db)
//   .then(() => {
//     console.log("Network disabled for offline persistence");
//   })
//   .catch((err) => {
//     console.error("Failed to disable network:", err);
//   });

// Enable network when you want to sync data
// enableNetwork(db)
//   .then(() => {
//     console.log("Network enabled for data sync");
//   })
//   .catch((err) => {
//     console.error("Failed to enable network:", err);
//   });
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
auth.useDeviceLanguage();

export { app, db, auth };
