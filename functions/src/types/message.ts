import { Timestamp } from "../lib/firebase";
import { WithId } from "./firebase";

export type MessageDocumentData = {
  createdAt: Timestamp;
  content: string;
  imagePath: string | null;
  senderId: string;
};
export type Message = WithId<MessageDocumentData>;
