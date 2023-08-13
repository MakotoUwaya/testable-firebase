import {
  RulesTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";

import { messageFactory } from "@/../test/factories/message";
import { userFactory } from "@/../test/factories/user";
import { getTestEnv, setCollection } from "../utils";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const user = userFactory.build({ id: "user-id" });
const other = userFactory.build({ id: "other-id" });
const users = [user, other];
const userMessage = messageFactory.build({
  id: "user-message-id",
  senderId: user.id,
});
const otherMessage = messageFactory.build({
  id: "other-message-id",
  senderId: other.id,
});
const messages = [userMessage, otherMessage];


// eslint-disable-next-line @typescript-eslint/no-empty-function
export const messagesTest = () => {
  let env: RulesTestEnvironment;
  beforeEach(async () => {
    env = getTestEnv();
    await env.withSecurityRulesDisabled(async (context) => {
      const adminDb = context.firestore();
      await setCollection(collection(adminDb, "users"), users);
      await setCollection(collection(adminDb, "messages"), messages);
    });
  });

  describe("認証済の場合", () => {
    test("一覧を読み込みできる(list)", async () => {
      const db = env.authenticatedContext(user.id).firestore();
      const collectionRef = collection(db, "messages");
      await assertSucceeds(getDocs(collectionRef));
    });
    describe("自分のデータの場合", () => {
      let db: firebase.default.firestore.Firestore;

      beforeEach(() => {
        db = env.authenticatedContext(user.id).firestore();
      });

      test("読み込みできる(get)", async () => {
        const docRef = doc(db, `messages/${userMessage.id}`);
        await assertSucceeds(getDoc(docRef));
      });
      test("作成できる", async () => {
        const newMessage = messageFactory.build({
          senderId: user.id,
        });
        db = env.authenticatedContext(user.id).firestore();
        const docRef = doc(db, `messages/${newMessage.id}`);
        await assertSucceeds(setDoc(docRef, newMessage));
      });
      test("更新できる", async () => {
        const docRef = doc(db, `messages/${userMessage.id}`);
        await assertSucceeds(updateDoc(docRef, { name: "違う内容" }));
      });
      test("削除できる", async () => {
        const docRef = doc(db, `messages/${userMessage.id}`);
        await assertSucceeds(deleteDoc(docRef));
      });
    });
    describe("自分以外のデータの場合", () => {
      let db: firebase.default.firestore.Firestore;

      beforeEach(() => {
        db = env.authenticatedContext(user.id).firestore();
      });

      test("読み込みできる(get)", async () => {
        const docRef = doc(db, `messages/${otherMessage.id}`);
        await assertSucceeds(getDoc(docRef));
      });
      test("作成できない", async () => {
        const newMessage = messageFactory.build({
          senderId: other.id,
        });
        const docRef = doc(db, `messages/${newMessage.id}`);
        await assertFails(setDoc(docRef, newMessage));
      });
      test("更新できない", async () => {
        const docRef = doc(db, `messages/${otherMessage.id}`);
        await assertFails(updateDoc(docRef, { name: "違う名前" }));
      });
      test("削除できない", async () => {
        const docRef = doc(db, `messages/${otherMessage.id}`);
        await assertFails(deleteDoc(docRef));
      });
    });
  });
  describe("未認証の場合", () => {
    let db: firebase.default.firestore.Firestore;
    beforeEach(() => {
      db = env.unauthenticatedContext().firestore();
    });
    test("一覧を読み込みできない(list)", async () => {
      const collectionRef = collection(db, "messages");
      await assertFails(getDocs(collectionRef));
    });
    test("読み込みできない(get)", async () => {
      const docRef = doc(db, `messages/${otherMessage.id}`);
      await assertFails(getDoc(docRef));
    });
    test("作成できない", async () => {
      const newMessage = messageFactory.build();
      const docRef = doc(db, `messages/${newMessage.id}`);
      await assertFails(setDoc(docRef, newMessage));
    });
    test("更新できない", async () => {
      const docRef = doc(db, `messages/${otherMessage.id}`);
      await assertFails(updateDoc(docRef, { name: "違う名前" }));
    });
    test("削除できない", async () => {
      const docRef = doc(db, `messages/${otherMessage.id}`);
      await assertFails(deleteDoc(docRef));
    });
  });
};
