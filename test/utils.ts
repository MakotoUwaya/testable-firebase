import {
  initializeTestEnvironment as _initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { readFileSync } from "fs";
import { CollectionReference, doc, setDoc } from "firebase/firestore";

import { getConverter, WithId } from "@/lib/firebase";

let testEnv: RulesTestEnvironment;

export const initializeTestEnvironment = async (projectId: string) => {
  process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
  process.env.FIREBASE_STORAGE_EMULATOR_HOST = "127.0.0.1:9199";
  testEnv = await _initializeTestEnvironment({
    projectId,
    firestore: {
      rules: readFileSync("firestore.rules", "utf8"),
    },
    storage: {
      rules: readFileSync("storage.rules", "utf8"),
    },
  });
};

export const getTestEnv = () => testEnv;

export const setCollection = <T>(
  collectionRef: CollectionReference,
  instances: WithId<T>[],
) =>
  Promise.all(
    instances.map((docData) => {
      const docRef = doc(collectionRef, docData.id);
      return setDoc(docRef, getConverter<T>().toFirestore(docData));
    }),
  );
