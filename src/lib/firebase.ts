import {
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as _signOut,
  User,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import {
  connectFirestoreEmulator,
  DocumentData,
  FirestoreDataConverter,
  initializeFirestore,
  PartialWithFieldValue,
  QueryDocumentSnapshot,
  serverTimestamp as _serverTimestamp,
  SnapshotOptions,
  Timestamp,
} from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";

import { omit } from "./utils";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
const app = initializeApp(firebaseConfig);

if (import.meta.env.VITE_EMULATORS === "true") {
  console.info("USE EMULATORS...");
  connectAuthEmulator(getAuth(), "http://127.0.0.1:9099");
  const firestore = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
  connectFirestoreEmulator(firestore, "127.0.0.1", 8080);
}

const signInGoogleWithPopup = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(getAuth(), provider);
};

const signOut = () => _signOut(getAuth());

const serverTimestamp = _serverTimestamp as unknown as () => Timestamp;

const getFcmToken = async () =>
  getToken(getMessaging(), {
    vapidKey: import.meta.env.VITE_FIREBASE_MESSAGING_VAPID_KEY,
  });

type WithId<T> = T & { id: string };
const getConverter = <T>(): FirestoreDataConverter<WithId<T>> => ({
  toFirestore: (data: PartialWithFieldValue<WithId<T>>): DocumentData => {
    return omit(data, ["id"]);
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): WithId<T> => {
    const data = snapshot.data(options) as T;
    return { id: snapshot.id, ...data };
  },
});

export type { User, WithId };
export {
  getConverter,
  getFcmToken,
  serverTimestamp,
  signInGoogleWithPopup,
  signOut,
  Timestamp,
};
