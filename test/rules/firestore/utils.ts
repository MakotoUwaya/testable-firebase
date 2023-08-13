import {
  initializeTestEnvironment as _initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { readFileSync } from "fs";
import { CollectionReference, doc, setDoc } from "firebase/firestore";

import { getConverter, WithId } from "@/lib/firebase";

let testEnv: RulesTestEnvironment;

export const initializeTestEnvironment = async () => {
  testEnv = await _initializeTestEnvironment({
    projectId: "api-project-90393892794",
    firestore: {
      rules: readFileSync("firestore.rules", "utf8"),
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
