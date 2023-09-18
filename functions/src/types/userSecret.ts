import { Timestamp } from "../lib/firebase";
import { WithId } from "./firebase";

export type UserSecretDocumentData = {
  createdAt: Timestamp;
  fcmToken: string;
};

export type UserSecret = WithId<UserSecretDocumentData>;
