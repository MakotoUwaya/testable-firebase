import { initializeApp } from "firebase/app";
import {
  DocumentData,
  FirestoreDataConverter,
  PartialWithFieldValue,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from "firebase/firestore";

import { omit } from "./utils";

const firebaseConfig = {
};
initializeApp(firebaseConfig);

export { Timestamp };
export type WithId<T> = T & { id: string };
export const getConverter = <T>(): FirestoreDataConverter<WithId<T>> => ({
  toFirestore: (data: PartialWithFieldValue<WithId<T>>): DocumentData => {
    return omit(data, ["id"]);
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): WithId<T> => {
    const data = snapshot.data(options) as T;
    return { id: snapshot.id, ...data };
  },
});
