import {
  DocumentReference,
  addDoc,
  collection,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore";
import { getConverter } from "@/lib/firebase";
import type { MessageDocumentData } from "@/types/message";

export const messagesRef = () =>
  collection(getFirestore(), "messages").withConverter(
    getConverter<MessageDocumentData>()
  );

export const messagesQuery = () =>
  query(messagesRef(), orderBy("createdAt", "asc"));

export const addMessage = async (
  message: MessageDocumentData
): Promise<DocumentReference<MessageDocumentData>> => {
  return addDoc(messagesRef(), message);
};
