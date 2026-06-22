import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDuyBYgwA7910NdA8GRI0P6ujq0_Wny4vc",
  authDomain: "the-last-bite-a4807.firebaseapp.com",
  projectId: "the-last-bite-a4807",
  storageBucket: "the-last-bite-a4807.appspot.com",
  messagingSenderId: "339216300951",
  appId: "1:339216300951:web:50c27ed6c4abbdd4f062d2",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// 👇 THIS is what you're missing
export const auth = getAuth(app);

export default app;